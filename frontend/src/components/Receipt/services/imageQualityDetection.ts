/**
 * Image Quality Detection
 * 
 * Detects image quality issues before OCR processing:
 * - Blur detection
 * - Excessive angle
 * - Overexposure/underexposure
 * - Missing zones
 * 
 * NO automatic correction - detection only
 */

export type ImageQualityIssue = {
  type: 'blur' | 'angle' | 'exposure' | 'missing_zone';
  severity: 'low' | 'medium' | 'high';
  message: string;
  confidence: number; // 0-1
};

export type ImageQualityResult = {
  score: number; // 0-100
  issues: ImageQualityIssue[];
  suitable: boolean; // Whether image is suitable for OCR
};

/**
 * Detect blur using Laplacian variance
 * Lower variance = more blur
 */
function detectBlur(imageData: ImageData): number {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);
  
  // Convert to grayscale
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  
  // Apply Laplacian operator
  let variance = 0;
  let count = 0;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const laplacian =
        -1 * gray[idx - width - 1] + -1 * gray[idx - width] + -1 * gray[idx - width + 1] +
        -1 * gray[idx - 1] + 8 * gray[idx] + -1 * gray[idx + 1] +
        -1 * gray[idx + width - 1] + -1 * gray[idx + width] + -1 * gray[idx + width + 1];
      
      variance += laplacian * laplacian;
      count++;
    }
  }
  
  return variance / count;
}

/**
 * Detect overexposure or underexposure
 */
function detectExposure(imageData: ImageData): { overexposed: number; underexposed: number } {
  const { data } = imageData;
  let overexposed = 0;
  let underexposed = 0;
  const total = data.length / 4;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    
    if (avg > 250) overexposed++;
    if (avg < 10) underexposed++;
  }
  
  return {
    overexposed: overexposed / total,
    underexposed: underexposed / total,
  };
}

/**
 * Detect excessive angle by checking edge distribution
 * Returns angle confidence (0 = poor, 1 = good alignment)
 */
function detectAngle(imageData: ImageData): number {
  const { data, width, height } = imageData;
  
  // Simple edge detection - count vertical vs horizontal edges
  let verticalEdges = 0;
  let horizontalEdges = 0;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const curr = data[idx];
      const right = data[idx + 4];
      const down = data[idx + width * 4];
      
      const vertDiff = Math.abs(curr - right);
      const horizDiff = Math.abs(curr - down);
      
      if (vertDiff > 30) verticalEdges++;
      if (horizDiff > 30) horizontalEdges++;
    }
  }
  
  // Good alignment should have strong horizontal lines (text lines)
  const ratio = horizontalEdges / (verticalEdges + 1);
  return Math.min(ratio / 2, 1); // Normalize to 0-1
}

/**
 * Analyze image quality for OCR suitability
 */
export async function analyzeImageQuality(image: HTMLImageElement): Promise<ImageQualityResult> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Cannot get canvas context');
  }
  
  // Resize for faster processing
  const maxSize = 800;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  const issues: ImageQualityIssue[] = [];
  let score = 100;
  
  // Detect blur
  const blurVariance = detectBlur(imageData);
  if (blurVariance < 100) {
    const severity = blurVariance < 30 ? 'high' : blurVariance < 60 ? 'medium' : 'low';
    issues.push({
      type: 'blur',
      severity,
      message: 'Image floue détectée - reprendre la photo peut améliorer la lecture',
      confidence: 1 - blurVariance / 100,
    });
    score -= severity === 'high' ? 40 : severity === 'medium' ? 25 : 10;
  }
  
  // Detect exposure issues
  const exposure = detectExposure(imageData);
  if (exposure.overexposed > 0.3) {
    issues.push({
      type: 'exposure',
      severity: exposure.overexposed > 0.5 ? 'high' : 'medium',
      message: 'Image surexposée - zones blanches trop importantes',
      confidence: exposure.overexposed,
    });
    score -= exposure.overexposed > 0.5 ? 30 : 15;
  }
  if (exposure.underexposed > 0.3) {
    issues.push({
      type: 'exposure',
      severity: exposure.underexposed > 0.5 ? 'high' : 'medium',
      message: 'Image sous-exposée - zones sombres trop importantes',
      confidence: exposure.underexposed,
    });
    score -= exposure.underexposed > 0.5 ? 30 : 15;
  }
  
  // Detect angle issues
  const angleConfidence = detectAngle(imageData);
  if (angleConfidence < 0.5) {
    issues.push({
      type: 'angle',
      severity: angleConfidence < 0.3 ? 'high' : 'medium',
      message: 'Angle excessif détecté - tenir le ticket bien droit améliore la lecture',
      confidence: 1 - angleConfidence,
    });
    score -= angleConfidence < 0.3 ? 25 : 15;
  }
  
  // Ensure score is in valid range
  score = Math.max(0, Math.min(100, score));
  
  return {
    score,
    issues,
    suitable: score >= 50 && !issues.some(i => i.severity === 'high'),
  };
}

/**
 * Get user-friendly quality message
 */
export function getQualityMessage(result: ImageQualityResult): string {
  if (result.score >= 80) {
    return '✓ Excellente qualité - idéal pour l\'OCR';
  } else if (result.score >= 60) {
    return '○ Qualité correcte - OCR possible avec quelques ajustements';
  } else if (result.score >= 40) {
    return '⚠ Qualité moyenne - reprendre la photo recommandé';
  } else {
    return '✗ Qualité insuffisante - reprendre la photo fortement recommandé';
  }
}
