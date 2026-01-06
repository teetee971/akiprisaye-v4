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
 * PHASE 2 ENHANCEMENT:
 * - Automatic online/offline detection
 * - Local OCR processing (WASM-based Tesseract)
 * - Works without network connection
 * - Graceful degradation
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
export interface OCRSections {
  ingredients?: string;
  allergens?: string;
  legalMentions?: string;
  dangerPictograms?: string[];
}

export interface OCRResult {
  success: boolean;
  rawText: string;
  confidence: number;
  processingTime: number;
  timeoutTriggered?: boolean;
  fromCache?: boolean;
  sections?: OCRSections;
}

/**
 * Check if running in offline mode
 */
function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * OCR plein texte unifié
 * - Sans whitelist chiffres
 * - Espaces inter-mots préservés
 * - Français par défaut
 * - Works offline (local WASM processing)
 * 
 * @param imageUrl - URL or path to image
 * @param language - ISO language code (defaults to 'fra')
 * @returns Extracted text
 */
export async function runOCR(
  imageUrl: string,
  language = 'fra',
): Promise<OCRResult> {
  const offline = isOffline();
  const startedAt = performance.now();
  
  // Log mode for debugging
  if (import.meta.env.DEV) {
    console.log(`OCR mode: ${offline ? 'OFFLINE (local WASM)' : 'ONLINE'}`);
  }

  const worker = await Tesseract.createWorker();

  try {
    // Tesseract.js runs entirely in the browser via WASM
    // No server calls - works offline by default
    await worker.loadLanguage(language);
    await worker.initialize(language);

    await worker.setParameters({
      preserve_interword_spaces: '1',
    });

    const {
      data: { text, confidence },
    } = await worker.recognize(imageUrl);

    return {
      success: true,
      rawText: text,
      confidence: confidence ?? 0,
      processingTime: performance.now() - startedAt,
      sections: undefined,
    };
  } catch (error) {
    console.error('OCR processing failed:', error);
    
    // Provide helpful error message
    if (offline) {
      throw new Error('Erreur OCR hors ligne. Vérifiez que l\'image est valide.');
    } else {
      throw new Error('Erreur OCR. Veuillez réessayer ou vérifier votre connexion.');
    }
  } finally {
    await worker.terminate();
  }
}

/**
 * Check if OCR is available
 * Tesseract.js should always be available in modern browsers
 */
export async function isOCRAvailable(): Promise<boolean> {
  try {
    // Check if WebAssembly is supported (required for Tesseract.js)
    return typeof WebAssembly !== 'undefined';
  } catch {
    return false;
  }
}
