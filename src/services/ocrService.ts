/**
 * OCR Service - Unified API
 * 
 * Uses Tesseract.js for text extraction from product images
 * 
 * DESIGN DECISION (PR G - Tech Debt Zero):
 * This service provides a minimal, clean API without caching or preprocessing.
 * Previous optimizations (image resizing, caching) were removed to simplify
 * the codebase and eliminate technical debt. If performance becomes an issue,
 * these optimizations can be re-added as a separate enhancement layer.
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
 * OCR Result structure (for compatibility with existing components)
 */
export interface OCRResult {
  success: boolean;
  rawText: string;
  confidence: number;
  processingTime: number;
}

/**
 * OCR plein texte unifié
 * - Sans whitelist chiffres
 * - Espaces inter-mots préservés
 * - Français par défaut
 * 
 * @param imageUrl - URL or path to image
 * @returns Extracted text
 */
export async function runOCR(imageUrl: string): Promise<string> {
  const worker = await Tesseract.createWorker();

  try {
    await worker.loadLanguage('fra');
    await worker.initialize('fra');

    await worker.setParameters({
      preserve_interword_spaces: '1',
    });

    const {
      data: { text },
    } = await worker.recognize(imageUrl);

    return text;
  } finally {
    await worker.terminate();
  }
}


