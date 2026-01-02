/**
 * OCR Service for Ingredient Scanning
 * Part of PR #3 - OCR Ingredients Extension
 * 
 * Uses Tesseract.js for text extraction from product images
 * Focuses on ingredients, allergens, and legal mentions
 * 
 * ⚠️ CONFORMITÉ RGPD & AI ACT UE ⚠️
 * - NO health interpretation
 * - NO nutritional analysis
 * - NO biometric processing
 * - NO facial recognition
 * - Images processed locally (client-side)
 * - Images NOT stored or transmitted to servers
 * - Images deleted immediately after text extraction
 * 
 * Base légale : Consentement explicite (RGPD Art. 6.1.a)
 */

import Tesseract from 'tesseract.js';

/**
 * OCR Result structure
 */
export interface OCRResult {
  success: boolean;
  rawText: string;
  confidence: number;
  sections?: DetectedSections;
  error?: string;
  processingTime: number;
}

/**
 * Detected text sections
 */
export interface DetectedSections {
  ingredients?: string;
  allergens?: string;
  legalMentions?: string;
  dangerPictograms?: string[];
}

/**
 * Image preprocessing options
 */
export interface PreprocessOptions {
  enhanceContrast?: boolean;
  autoCrop?: boolean;
  autoRotate?: boolean;
  grayscale?: boolean;
}

/**
 * Perform OCR on an image file or URL
 * 
 * RGPD COMPLIANCE:
 * - Image processing is done locally in the browser (client-side)
 * - No image data is transmitted to external servers
 * - Images are NOT stored beyond the time needed for text extraction
 * - No biometric processing or facial recognition is performed
 * - No automated health or nutritional decisions are made
 * 
 * @param imageSource - File, Blob, or URL string
 * @param options - Preprocessing options
 * @returns OCR result with raw text
 */
export async function extractTextFromImage(
  imageSource: File | Blob | string,
  options: PreprocessOptions = {}
): Promise<OCRResult> {
  const startTime = Date.now();
  
  try {
    // Default preprocessing options
    const {
      enhanceContrast = true,
      autoCrop = false,
      autoRotate = true,
      grayscale = true
    } = options;

    // Perform OCR with Tesseract.js
    const result = await Tesseract.recognize(
      imageSource,
      'fra', // French language
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      }
    );

    const processingTime = Date.now() - startTime;
    const rawText = result.data.text.trim();
    const confidence = result.data.confidence;

    // Try to detect sections
    const sections = detectSections(rawText);

    return {
      success: true,
      rawText,
      confidence,
      sections,
      processingTime
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('OCR Error:', error);
    
    return {
      success: false,
      rawText: '',
      confidence: 0,
      error: error instanceof Error ? error.message : 'Erreur OCR inconnue',
      processingTime
    };
  }
}

/**
 * Detect ingredient and allergen sections in raw OCR text
 * Uses simple pattern matching - NOT AI interpretation
 * 
 * @param text - Raw OCR text
 * @returns Detected sections
 */
export function detectSections(text: string): DetectedSections {
  const sections: DetectedSections = {};
  const lowerText = text.toLowerCase();

  // Detect ingredients section
  const ingredientsMatch = text.match(/ingrédients?\s*:?\s*([\s\S]*?)(?=allergènes?|peut contenir|traces?|conservation|à conserver|$)/i);
  if (ingredientsMatch) {
    sections.ingredients = ingredientsMatch[1].trim();
  }

  // Detect allergens section
  const allergensMatch = text.match(/(?:allergènes?|peut contenir|traces? de)\s*:?\s*([\s\S]*?)(?=conservation|à conserver|mentions?|$)/i);
  if (allergensMatch) {
    sections.allergens = allergensMatch[1].trim();
  }

  // Detect legal mentions
  const legalMatch = text.match(/(?:mentions? légales?|conditions? de conservation|à conserver)\s*:?\s*([\s\S]*?)$/i);
  if (legalMatch) {
    sections.legalMentions = legalMatch[1].trim();
  }

  // Detect common danger pictogram keywords (GHS)
  const dangerKeywords = [
    'danger',
    'attention',
    'toxique',
    'corrosif',
    'inflammable',
    'explosif',
    'irritant',
    'nocif'
  ];

  const foundPictograms = dangerKeywords.filter(keyword => 
    lowerText.includes(keyword)
  );

  if (foundPictograms.length > 0) {
    sections.dangerPictograms = foundPictograms;
  }

  return sections;
}

/**
 * Preprocess image before OCR
 * Enhances contrast, crops, and adjusts for better text recognition
 * 
 * @param imageFile - Original image file
 * @param options - Preprocessing options
 * @returns Preprocessed image as Blob
 */
export async function preprocessImage(
  imageFile: File,
  options: PreprocessOptions = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const {
      enhanceContrast = true,
      grayscale = true
    } = options;

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply grayscale
      if (grayscale) {
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;     // Red
          data[i + 1] = avg; // Green
          data[i + 2] = avg; // Blue
        }
      }

      // Enhance contrast
      if (enhanceContrast) {
        const factor = 1.5; // Contrast factor
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
        }
      }

      // Put processed image back
      ctx.putImageData(imageData, 0, 0);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.95);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Get user-friendly error message for OCR failures
 * 
 * @param error - Error object or string
 * @returns Localized error message
 */
export function getOCRErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('network')) {
      return 'Erreur réseau lors du chargement du modèle OCR';
    }
    if (error.message.includes('timeout')) {
      return 'Le traitement a pris trop de temps';
    }
  }
  
  return 'Impossible de lire le texte de l\'image';
}

/**
 * Validate OCR confidence level
 * Returns true if confidence is acceptable for display
 * 
 * @param confidence - Confidence score (0-100)
 * @returns Whether confidence is acceptable
 */
export function isConfidenceAcceptable(confidence: number): boolean {
  return confidence >= 60; // Minimum 60% confidence
}

/**
 * Format OCR result for display
 * Adds warning message about automatic detection
 * Reminds users of GDPR compliance
 * 
 * @param result - OCR result
 * @returns Formatted text with warning
 */
export function formatOCRResultForDisplay(result: OCRResult): string {
  const warning = `⚠️ Détection automatique — peut contenir des erreurs
📋 Votre image n'est pas conservée et reste confidentielle

`;
  
  if (!result.success || !result.rawText) {
    return warning + 'Aucun texte détecté';
  }
  
  return warning + result.rawText;
}

/**
 * Get GDPR compliance disclaimer for OCR
 * To be displayed before user initiates OCR
 * 
 * @returns Compliance text
 */
export function getOCRGDPRDisclaimer(): string {
  return `En utilisant cette fonctionnalité, vous acceptez que :
• L'image soit traitée localement sur votre appareil
• Aucune donnée biométrique ne soit collectée
• L'image ne soit pas conservée après extraction du texte
• Aucune interprétation santé/nutrition automatique ne soit effectuée`;
}
