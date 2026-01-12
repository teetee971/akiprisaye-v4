import { ReceiptLine } from '../../../types/receiptLine';

/**
 * Module J - Similar line fusion for multi-photo receipts
 * 
 * Merges duplicate or similar lines without modifying prices
 * Traceable and transparent - visual markers show fusion
 * 
 * GUARANTEES:
 * - No price modification
 * - No averaging
 * - Visible fusion trace
 * - Can be disabled per line
 */

/**
 * Normalize a label for comparison
 * Removes punctuation, converts to lowercase, normalizes whitespace
 */
function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity ratio between two strings (0-1)
 * Uses simple character overlap ratio
 */
function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeLabel(str1);
  const norm2 = normalizeLabel(str2);
  
  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;
  
  // Simple character overlap
  const chars1 = new Set(norm1.split(''));
  const chars2 = new Set(norm2.split(''));
  
  let common = 0;
  for (const char of chars1) {
    if (chars2.has(char)) common++;
  }
  
  const total = Math.max(chars1.size, chars2.size);
  return common / total;
}

/**
 * Fuse similar receipt lines
 * Only fuses lines with identical prices and very similar labels
 * 
 * @param lines - Array of receipt lines to process
 * @param similarityThreshold - Minimum similarity to fuse (0-1), default 0.9
 * @returns Array of fused lines with visual fusion markers
 */
export function fuseSimilarLines(
  lines: ReceiptLine[],
  similarityThreshold = 0.9
): ReceiptLine[] {
  const fused: ReceiptLine[] = [];

  for (const line of lines) {
    if (!line.enabled) {
      fused.push({ ...line });
      continue;
    }

    const norm = normalizeLabel(line.raw);

    // Find existing line with same normalized label and identical price
    const existing = fused.find((f) => {
      if (!f.enabled) return false;
      
      const normExisting = normalizeLabel(f.raw);
      const similarity = calculateSimilarity(norm, normExisting);
      
      // Strict conditions: high similarity AND identical price
      return (
        similarity >= similarityThreshold &&
        f.price === line.price &&
        f.price !== undefined
      );
    });

    if (existing) {
      // Visual fusion trace - add marker
      existing.raw += ' •';
      // Increment quantity if both have quantities
      if (existing.quantity !== undefined && line.quantity !== undefined) {
        existing.quantity += line.quantity;
      }
    } else {
      fused.push({ ...line });
    }
  }

  return fused;
}

/**
 * Count fusion occurrences in a line
 * Counts the fusion markers (•) in the raw text
 */
export function getFusionCount(line: ReceiptLine): number {
  return (line.raw.match(/•/g) || []).length;
}

/**
 * Check if a line was created by fusion
 */
export function isFusedLine(line: ReceiptLine): boolean {
  return getFusionCount(line) > 0;
}

/**
 * Get fusion statistics for a set of lines
 */
export function getFusionStats(lines: ReceiptLine[]): {
  totalLines: number;
  fusedLines: number;
  totalFusions: number;
} {
  const fusedLines = lines.filter(isFusedLine);
  const totalFusions = fusedLines.reduce((sum, line) => sum + getFusionCount(line), 0);

  return {
    totalLines: lines.length,
    fusedLines: fusedLines.length,
    totalFusions,
  };
}
