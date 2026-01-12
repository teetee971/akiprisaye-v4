import { createWorker, PSM } from 'tesseract.js';

/**
 * Multi-Pass OCR with different strategies
 * 
 * Runs multiple OCR passes in parallel with different configurations
 * to maximize extraction quality without modifying results
 * 
 * Philosophy: "Compare results, never choose arbitrarily"
 */

export type OCRStrategy = 'fast' | 'precision' | 'small_chars' | 'numeric';

export type OCRPass = {
  strategy: OCRStrategy;
  text: string;
  confidence: number;
  duration: number;
};

export type MultiPassResult = {
  passes: OCRPass[];
  bestPass: OCRPass;
  combinedText: string;
  averageConfidence: number;
};

/**
 * Run OCR with fast strategy (default settings)
 */
async function runFastOCR(image: Blob | string): Promise<OCRPass> {
  const startTime = Date.now();
  
  const worker = await createWorker('fra', 1);
  const { data } = await worker.recognize(image);
  await worker.terminate();
  
  return {
    strategy: 'fast',
    text: data.text,
    confidence: data.confidence,
    duration: Date.now() - startTime,
  };
}

/**
 * Run OCR with precision strategy (PSM 6 - single block of text)
 */
async function runPrecisionOCR(image: Blob | string): Promise<OCRPass> {
  const startTime = Date.now();
  
  const worker = await createWorker('fra', 1);
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  });
  
  const { data } = await worker.recognize(image);
  await worker.terminate();
  
  return {
    strategy: 'precision',
    text: data.text,
    confidence: data.confidence,
    duration: Date.now() - startTime,
  };
}

/**
 * Run OCR optimized for small characters
 */
async function runSmallCharsOCR(image: Blob | string): Promise<OCRPass> {
  const startTime = Date.now();
  
  const worker = await createWorker('fra', 1);
  await worker.setParameters({
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789€.,- ',
    tessedit_pageseg_mode: PSM.SINGLE_COLUMN,
  });
  
  const { data } = await worker.recognize(image);
  await worker.terminate();
  
  return {
    strategy: 'small_chars',
    text: data.text,
    confidence: data.confidence,
    duration: Date.now() - startTime,
  };
}

/**
 * Run OCR with numeric priority (for prices and totals)
 */
async function runNumericOCR(image: Blob | string): Promise<OCRPass> {
  const startTime = Date.now();
  
  const worker = await createWorker('fra', 1);
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789€.,- ',
    tessedit_pageseg_mode: PSM.SINGLE_COLUMN,
  });
  
  const { data } = await worker.recognize(image);
  await worker.terminate();
  
  return {
    strategy: 'numeric',
    text: data.text,
    confidence: data.confidence,
    duration: Date.now() - startTime,
  };
}

/**
 * Run multiple OCR passes in parallel
 */
export async function runMultiPassOCR(
  image: Blob | string,
  strategies: OCRStrategy[] = ['fast', 'precision'],
  onProgress?: (completed: number, total: number) => void
): Promise<MultiPassResult> {
  const strategyFunctions: Record<OCRStrategy, (img: Blob | string) => Promise<OCRPass>> = {
    fast: runFastOCR,
    precision: runPrecisionOCR,
    small_chars: runSmallCharsOCR,
    numeric: runNumericOCR,
  };

  // Run all strategies in parallel
  const passes: OCRPass[] = [];
  let completed = 0;

  for (const strategy of strategies) {
    try {
      const pass = await strategyFunctions[strategy](image);
      passes.push(pass);
      completed++;
      if (onProgress) {
        onProgress(completed, strategies.length);
      }
    } catch (error) {
      console.error(`OCR strategy ${strategy} failed:`, error);
    }
  }

  if (passes.length === 0) {
    throw new Error('All OCR strategies failed');
  }

  // Find best pass (highest confidence)
  const bestPass = passes.reduce((best, current) =>
    current.confidence > best.confidence ? current : best
  );

  // Calculate average confidence
  const averageConfidence =
    passes.reduce((sum, pass) => sum + pass.confidence, 0) / passes.length;

  // Combine texts (use best pass as primary)
  const combinedText = bestPass.text;

  return {
    passes,
    bestPass,
    combinedText,
    averageConfidence,
  };
}

/**
 * Compare two OCR results to find differences
 * Useful for highlighting uncertain areas
 */
export function compareOCRResults(text1: string, text2: string): {
  similarity: number;
  differences: { line: number; text1: string; text2: string }[];
} {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const maxLines = Math.max(lines1.length, lines2.length);

  const differences: { line: number; text1: string; text2: string }[] = [];
  let matchingLines = 0;

  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';

    if (line1.trim() !== line2.trim()) {
      differences.push({
        line: i,
        text1: line1,
        text2: line2,
      });
    } else if (line1.trim()) {
      matchingLines++;
    }
  }

  const similarity = maxLines > 0 ? matchingLines / maxLines : 0;

  return {
    similarity,
    differences,
  };
}

/**
 * Get strategy description for UI
 */
export function getStrategyDescription(strategy: OCRStrategy): string {
  const descriptions: Record<OCRStrategy, string> = {
    fast: 'OCR rapide - paramètres par défaut',
    precision: 'OCR précision - optimisé pour texte structuré',
    small_chars: 'OCR petits caractères - sensibilité augmentée',
    numeric: 'OCR numérique - optimisé pour prix et chiffres',
  };

  return descriptions[strategy];
}
