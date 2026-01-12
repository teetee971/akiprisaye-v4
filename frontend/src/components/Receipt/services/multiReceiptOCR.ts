import { runLocalOCR } from './ocrService';

/**
 * Keywords that indicate the end of a receipt
 * If detected, OCR processing will stop to avoid processing duplicate information
 */
const END_KEYWORDS = ['TOTAL', 'TVA', 'PAIEMENT'];

/**
 * Run OCR on multiple images and concatenate the results
 * Processes images sequentially and stops if end-of-receipt keywords are detected
 * 
 * @param images - Array of images as Blobs
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns Concatenated OCR text from all processed images
 */
export async function runMultiReceiptOCR(
  images: Blob[],
  onProgress?: (progress: number) => void
): Promise<string> {
  let fullText = '';
  const totalImages = images.length;

  for (let i = 0; i < totalImages; i++) {
    const image = images[i];
    
    // Update overall progress
    const imageProgress = (i / totalImages) * 100;
    if (onProgress) {
      onProgress(Math.round(imageProgress));
    }

    // Run OCR on current image
    const text = await runLocalOCR(image, (imgProgress) => {
      // Calculate progress within current image
      const overallProgress = imageProgress + (imgProgress / totalImages);
      if (onProgress) {
        onProgress(Math.round(overallProgress));
      }
    });

    // Append text with newline separator
    fullText += (fullText ? '\n' : '') + text;

    // Check for end-of-receipt keywords
    const upperText = text.toUpperCase();
    if (END_KEYWORDS.some(keyword => upperText.includes(keyword))) {
      // Found end of receipt, stop processing remaining images
      break;
    }
  }

  // Ensure final progress is 100%
  if (onProgress) {
    onProgress(100);
  }

  return fullText.trim();
}
