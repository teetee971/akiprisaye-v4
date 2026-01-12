import { describe, it, expect } from 'vitest';
import {
  fuseSimilarLines,
  getFusionCount,
  isFusedLine,
  getFusionStats,
} from '../receiptLineFusion';
import { ReceiptLine } from '../../../../types/receiptLine';

describe('Module J - Receipt Line Fusion', () => {
  const createLine = (raw: string, price?: number, enabled = true): ReceiptLine => ({
    id: `${Date.now()}-${Math.random()}`,
    raw,
    price,
    enabled,
    quantity: 1,
  });

  describe('fuseSimilarLines', () => {
    it('should fuse identical lines with same price', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie', 2.5),
        createLine('Pain de mie', 2.5),
        createLine('Pain de mie', 2.5),
      ];

      const result = fuseSimilarLines(lines);

      expect(result).toHaveLength(1);
      expect(result[0].raw).toContain('•');
      expect(result[0].price).toBe(2.5);
      expect(getFusionCount(result[0])).toBe(2);
    });

    it('should NOT fuse lines with different prices', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie', 2.5),
        createLine('Pain de mie', 3.0),
      ];

      const result = fuseSimilarLines(lines);

      expect(result).toHaveLength(2);
      expect(result[0].raw).not.toContain('•');
      expect(result[1].raw).not.toContain('•');
    });

    it('should fuse similar lines with minor differences', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain-de-mie', 2.5),
        createLine('pain de mie', 2.5),
        createLine('PAIN DE MIE', 2.5),
      ];

      const result = fuseSimilarLines(lines);

      expect(result).toHaveLength(1);
      expect(getFusionCount(result[0])).toBe(2);
    });

    it('should NOT fuse disabled lines', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie', 2.5, false),
        createLine('Pain de mie', 2.5, false),
      ];

      const result = fuseSimilarLines(lines);

      expect(result).toHaveLength(2);
      expect(result[0].enabled).toBe(false);
      expect(result[1].enabled).toBe(false);
    });

    it('should combine quantities when fusing', () => {
      const lines: ReceiptLine[] = [
        { ...createLine('Pain de mie', 2.5), quantity: 2 },
        { ...createLine('Pain de mie', 2.5), quantity: 3 },
      ];

      const result = fuseSimilarLines(lines);

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(5);
    });

    it('should respect similarity threshold', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain complet', 2.5),
        createLine('Pain blanc', 2.5),
      ];

      // Low threshold should not fuse these different products
      const result = fuseSimilarLines(lines, 0.9);

      expect(result.length).toBeGreaterThan(1);
    });
  });

  describe('getFusionCount', () => {
    it('should return 0 for non-fused line', () => {
      const line = createLine('Pain de mie', 2.5);
      expect(getFusionCount(line)).toBe(0);
    });

    it('should count fusion markers', () => {
      const line = createLine('Pain de mie •••', 2.5);
      expect(getFusionCount(line)).toBe(3);
    });
  });

  describe('isFusedLine', () => {
    it('should return false for non-fused line', () => {
      const line = createLine('Pain de mie', 2.5);
      expect(isFusedLine(line)).toBe(false);
    });

    it('should return true for fused line', () => {
      const line = createLine('Pain de mie •', 2.5);
      expect(isFusedLine(line)).toBe(true);
    });
  });

  describe('getFusionStats', () => {
    it('should calculate correct statistics', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie •', 2.5),
        createLine('Lait ••', 1.8),
        createLine('Beurre', 3.2),
      ];

      const stats = getFusionStats(lines);

      expect(stats.totalLines).toBe(3);
      expect(stats.fusedLines).toBe(2);
      expect(stats.totalFusions).toBe(3);
    });

    it('should handle no fusions', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie', 2.5),
        createLine('Lait', 1.8),
      ];

      const stats = getFusionStats(lines);

      expect(stats.totalLines).toBe(2);
      expect(stats.fusedLines).toBe(0);
      expect(stats.totalFusions).toBe(0);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle multi-photo OCR duplicates', () => {
      const lines: ReceiptLine[] = [
        createLine('Tomates 1kg', 3.5),
        createLine('Tomates 1kg', 3.5), // Same line from second photo
        createLine('Salade verte', 1.2),
        createLine('Salade verte', 1.2), // Same line from second photo
        createLine('Pain baguette', 1.1),
      ];

      const result = fuseSimilarLines(lines);

      expect(result).toHaveLength(3);
      expect(result.filter(isFusedLine)).toHaveLength(2);
    });

    it('should handle OCR errors gracefully', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie', 2.5),
        createLine('Paln de mie', 2.5), // OCR error
        createLine('Lait demi-écrémé', 1.8),
      ];

      const result = fuseSimilarLines(lines);

      // Should not fuse due to low similarity
      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });
});
