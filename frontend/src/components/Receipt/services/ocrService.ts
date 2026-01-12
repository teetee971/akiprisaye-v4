import { createWorker } from 'tesseract.js';
import { autoCropReceiptEnhanced, loadImage, canvasToBlob } from './receiptAutoCrop';

/**
 * Run local OCR on a single image using Tesseract.js
 * @param image - Image as Blob or base64 string
 * @param onProgress - Optional callback for progress updates
 * @param enableAutoCrop - Enable auto-crop and image enhancement (default: true)
 * @returns Extracted text from the image
 */
export async function runLocalOCR(
  image: Blob | string,
  onProgress?: (progress: number) => void,
  enableAutoCrop = true
): Promise<string> {
  let processedImage: Blob | string = image;

  // Apply auto-crop enhancement if enabled and image is a Blob
  if (enableAutoCrop && image instanceof Blob) {
    try {
      const imgElement = await loadImage(image);
      const canvas = await autoCropReceiptEnhanced(imgElement);
      processedImage = await canvasToBlob(canvas);
    } catch (error) {
      console.warn('Auto-crop failed, using original image:', error);
      // Continue with original image on error
    }
  }

  const worker = await createWorker('fra', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  const {
    data: { text },
  } = await worker.recognize(processedImage);
  await worker.terminate();

  return text;
}
