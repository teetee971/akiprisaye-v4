import { createWorker } from "tesseract.js";

export async function runOcr(
  image: File | Blob,
  onProgress?: (p: number) => void
): Promise<string> {
  const worker = await createWorker({
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  try {
    await worker.loadLanguage("fra");
    await worker.initialize("fra");

    const {
      data: { text },
    } = await worker.recognize(image);

    return text;
  } finally {
    await worker.terminate();
  }
}