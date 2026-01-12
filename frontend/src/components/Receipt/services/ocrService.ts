import { createWorker } from 'tesseract.js';

/**
 * Run local OCR on a single image using Tesseract.js
 * @param image - Image as Blob or base64 string
 * @param onProgress - Optional callback for progress updates
 * @returns Extracted text from the image
 */
export async function runLocalOCR(
  image: Blob | string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const worker = await createWorker('fra', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  const {
    data: { text },
  } = await worker.recognize(image);
  await worker.terminate();

  return text;
}
