import { detectStoreChain, StoreDetectionResult } from './storeChainDetection';
import { StoreChainProfile } from './storeChainProfiles';
import { runMultiPassOCR, MultiPassResult } from './multiPassOCR';
import { autoCropReceiptEnhanced, loadImage, canvasToBlob } from './receiptAutoCrop';

/**
 * Adaptive OCR Result with full traceability
 */
export type AdaptiveOCRResult = {
  text: string;
  storeDetection: StoreDetectionResult;
  multiPassResult: MultiPassResult;
  metadata: {
    profileUsed: string;
    timestamp: number;
    preprocessingApplied: boolean;
    ocrEngine: string;
  };
  warnings: string[];
};

/**
 * Run adaptive OCR with store-specific optimization
 * 
 * IMPORTANT: This ONLY adapts the reading strategy, NEVER the results
 * 
 * Steps:
 * 1. Initial fast OCR for store detection
 * 2. Detect store chain
 * 3. Apply profile-specific preprocessing
 * 4. Run profile-optimized multi-pass OCR
 * 5. Return results with full traceability
 */
export async function runAdaptiveOCR(
  image: Blob,
  onProgress?: (stage: string, progress: number) => void
): Promise<AdaptiveOCRResult> {
  const warnings: string[] = [];
  
  // Stage 1: Initial OCR for store detection (10%)
  if (onProgress) onProgress('Détection de l\'enseigne...', 10);
  
  const imgElement = await loadImage(image);
  const initialCanvas = await autoCropReceiptEnhanced(imgElement);
  const initialBlob = await canvasToBlob(initialCanvas);
  
  // Quick OCR pass for detection
  const initialOCR = await runMultiPassOCR(initialBlob, ['fast'], (completed, total) => {
    if (onProgress) onProgress('OCR initial...', 10 + (completed / total) * 15);
  });
  
  // Stage 2: Detect store chain (25%)
  if (onProgress) onProgress('Analyse du format...', 25);
  
  const storeDetection = detectStoreChain(initialOCR.combinedText);
  const profile = storeDetection.profile;
  
  if (storeDetection.method === 'generic') {
    warnings.push('Enseigne non détectée - profil générique utilisé');
  }
  
  // Stage 3: Apply profile-specific preprocessing (40%)
  if (onProgress) onProgress('Optimisation de l\'image...', 40);
  
  let processedBlob: Blob;
  let preprocessingApplied = false;
  
  try {
    processedBlob = await applyProfilePreprocessing(image, profile);
    preprocessingApplied = true;
  } catch (error) {
    console.warn('Profile preprocessing failed, using standard preprocessing:', error);
    processedBlob = initialBlob;
    warnings.push('Prétraitement spécifique échoué - prétraitement standard appliqué');
  }
  
  // Stage 4: Run profile-optimized multi-pass OCR (50-90%)
  if (onProgress) onProgress('OCR multi-passes optimisé...', 50);
  
  const multiPassResult = await runMultiPassOCR(
    processedBlob,
    profile.ocr_strategies,
    (completed, total) => {
      if (onProgress) {
        const progress = 50 + (completed / total) * 40;
        onProgress(`OCR pass ${completed}/${total}...`, progress);
      }
    }
  );
  
  // Stage 5: Quality checks (95%)
  if (onProgress) onProgress('Vérifications finales...', 95);
  
  // Check for known OCR confusions based on profile
  if (profile.risques_connus.length > 0) {
    const text = multiPassResult.combinedText;
    for (const risk of profile.risques_connus) {
      const [char1, char2] = risk.split('/');
      if (text.includes(char1) || text.includes(char2)) {
        warnings.push(`Caractère ambigu détecté : ${risk}`);
      }
    }
  }
  
  // Done (100%)
  if (onProgress) onProgress('Terminé', 100);
  
  return {
    text: multiPassResult.combinedText,
    storeDetection,
    multiPassResult,
    metadata: {
      profileUsed: profile.enseigne,
      timestamp: Date.now(),
      preprocessingApplied,
      ocrEngine: 'Tesseract.js + Multi-Pass',
    },
    warnings,
  };
}

/**
 * Apply profile-specific image preprocessing
 * Optimizes image based on store chain characteristics
 */
async function applyProfilePreprocessing(
  image: Blob,
  profile: StoreChainProfile
): Promise<Blob> {
  const imgElement = await loadImage(image);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Cannot get canvas context');
  }
  
  canvas.width = imgElement.width;
  canvas.height = imgElement.height;
  ctx.drawImage(imgElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply contrast boost
  const contrastFactor = profile.preprocessing.contrast_boost;
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = Math.min(255, Math.max(0, (data[i + j] - 128) * contrastFactor + 128));
    }
  }
  
  // Apply binarization with profile threshold
  const threshold = profile.preprocessing.binarization_threshold;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const val = avg > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = val;
  }
  
  // Apply noise reduction based on profile
  if (profile.preprocessing.noise_reduction !== 'light') {
    applyNoiseReduction(imageData, profile.preprocessing.noise_reduction);
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return canvasToBlob(canvas);
}

/**
 * Apply noise reduction filter
 */
function applyNoiseReduction(imageData: ImageData, level: 'light' | 'medium' | 'heavy'): void {
  const { data, width, height } = imageData;
  const kernel = level === 'heavy' ? 2 : 1; // Kernel size
  
  // Simple median filter for noise reduction
  const tempData = new Uint8ClampedArray(data);
  
  for (let y = kernel; y < height - kernel; y++) {
    for (let x = kernel; x < width - kernel; x++) {
      const idx = (y * width + x) * 4;
      
      // Get surrounding pixels
      const values: number[] = [];
      for (let dy = -kernel; dy <= kernel; dy++) {
        for (let dx = -kernel; dx <= kernel; dx++) {
          const sampIdx = ((y + dy) * width + (x + dx)) * 4;
          values.push(tempData[sampIdx]);
        }
      }
      
      // Apply median
      values.sort((a, b) => a - b);
      const median = values[Math.floor(values.length / 2)];
      
      data[idx] = data[idx + 1] = data[idx + 2] = median;
    }
  }
}

/**
 * Get human-readable summary of adaptive OCR process
 */
export function getAdaptiveOCRSummary(result: AdaptiveOCRResult): string {
  const parts: string[] = [];
  
  parts.push(`Enseigne : ${result.storeDetection.profile.enseigne}`);
  
  if (result.storeDetection.detected_name) {
    parts.push(`Détectée : ${result.storeDetection.detected_name}`);
  }
  
  parts.push(`Confiance : ${(result.storeDetection.confidence * 100).toFixed(0)}%`);
  parts.push(`Passes OCR : ${result.multiPassResult.passes.length}`);
  parts.push(`Confiance moyenne : ${(result.multiPassResult.averageConfidence).toFixed(1)}%`);
  
  if (result.warnings.length > 0) {
    parts.push(`⚠️ ${result.warnings.length} avertissement${result.warnings.length > 1 ? 's' : ''}`);
  }
  
  return parts.join(' • ');
}
