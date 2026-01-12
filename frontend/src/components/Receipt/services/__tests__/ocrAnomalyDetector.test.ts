import { describe, it, expect } from 'vitest';
import {
  detectOCRAnomalies,
  getAnomalyTypeLabel,
  getAnomalyIcon,
  groupAnomaliesBySeverity,
} from '../ocrAnomalyDetector';
import { ReceiptLine } from '../../../../types/receiptLine';
import { OCRTotals } from '../../../../types/ocrAnomaly';

describe('Module M - OCR Anomaly Detection', () => {
  const createLine = (
    raw: string,
    price?: number,
    quantity?: number,
    enabled = true
  ): ReceiptLine => ({
    id: `${Date.now()}-${Math.random()}`,
    raw,
    price,
    quantity,
    enabled,
  });

  describe('detectOCRAnomalies', () => {
    it('should detect negative price', () => {
      const lines: ReceiptLine[] = [createLine('Pain de mie', -2.5)];

      const anomalies = detectOCRAnomalies(lines);

      expect(anomalies).toHaveLength(1);
      expect(anomalies[0].type).toBe('NEGATIVE_VALUE');
      expect(anomalies[0].severity).toBe('warning');
    });

    it('should detect unusually high price', () => {
      const lines: ReceiptLine[] = [createLine('Article', 1500)];

      const anomalies = detectOCRAnomalies(lines);

      const priceOutliers = anomalies.filter((a) => a.type === 'PRICE_OUTLIER');
      expect(priceOutliers.length).toBeGreaterThan(0);
      expect(priceOutliers[0].severity).toBe('info');
    });

    it('should detect very low price', () => {
      const lines: ReceiptLine[] = [createLine('Article', 0.005)];

      const anomalies = detectOCRAnomalies(lines);

      const priceOutliers = anomalies.filter((a) => a.type === 'PRICE_OUTLIER');
      expect(priceOutliers.length).toBeGreaterThan(0);
    });

    it('should detect suspicious quantity', () => {
      const lines: ReceiptLine[] = [createLine('Article', 2.5, 100)];

      const anomalies = detectOCRAnomalies(lines);

      const quantityAnomalies = anomalies.filter((a) => a.type === 'SUSPICIOUS_QUANTITY');
      expect(quantityAnomalies.length).toBeGreaterThan(0);
    });

    it('should detect low text quality', () => {
      const lines: ReceiptLine[] = [createLine('###$$$%%%^^^&&&***', 2.5)];

      const anomalies = detectOCRAnomalies(lines);

      const textAnomalies = anomalies.filter((a) => a.type === 'LOW_TEXT_CONFIDENCE');
      expect(textAnomalies.length).toBeGreaterThan(0);
    });

    it('should NOT flag disabled lines', () => {
      const lines: ReceiptLine[] = [createLine('Article', -50, undefined, false)];

      const anomalies = detectOCRAnomalies(lines);

      expect(anomalies).toHaveLength(0);
    });

    it('should detect TTC < HT', () => {
      const lines: ReceiptLine[] = [];
      const totals: OCRTotals = {
        ht: 100,
        ttc: 90, // Illogical: TTC should be > HT
      };

      const anomalies = detectOCRAnomalies(lines, totals);

      const totalMismatches = anomalies.filter((a) => a.type === 'TOTAL_MISMATCH');
      expect(totalMismatches.length).toBeGreaterThan(0);
      expect(totalMismatches[0].severity).toBe('warning');
    });

    it('should detect negative TVA', () => {
      const lines: ReceiptLine[] = [];
      const totals: OCRTotals = {
        ht: 100,
        ttc: 120,
        tva: -5, // Negative VAT
      };

      const anomalies = detectOCRAnomalies(lines, totals);

      const negativeValues = anomalies.filter((a) => a.type === 'NEGATIVE_VALUE');
      expect(negativeValues.length).toBeGreaterThan(0);
    });

    it('should detect significant total mismatch', () => {
      const lines: ReceiptLine[] = [
        createLine('Article 1', 10),
        createLine('Article 2', 20),
        createLine('Article 3', 15),
      ];
      const totals: OCRTotals = {
        ttc: 100, // Sum is 45, but total shows 100 (more than 10% difference)
      };

      const anomalies = detectOCRAnomalies(lines, totals);

      const totalMismatches = anomalies.filter((a) => a.type === 'TOTAL_MISMATCH');
      expect(totalMismatches.length).toBeGreaterThan(0);
    });

    it('should NOT flag small total differences', () => {
      const lines: ReceiptLine[] = [
        createLine('Article 1', 10),
        createLine('Article 2', 20),
      ];
      const totals: OCRTotals = {
        ttc: 31, // Sum is 30, difference is ~3% (acceptable)
      };

      const anomalies = detectOCRAnomalies(lines, totals);

      const totalMismatches = anomalies.filter((a) => a.type === 'TOTAL_MISMATCH');
      expect(totalMismatches).toHaveLength(0);
    });

    it('should detect potential duplicates', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie complet', 2.5),
        createLine('Pain de mie comp1et', 2.5), // Similar with OCR error
      ];

      const anomalies = detectOCRAnomalies(lines);

      const duplicates = anomalies.filter((a) => a.type === 'POTENTIAL_DUPLICATE');
      expect(duplicates.length).toBeGreaterThan(0);
    });

    it('should NOT flag completely different products as duplicates', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain', 2.5),
        createLine('Lait', 1.8),
      ];

      const anomalies = detectOCRAnomalies(lines);

      const duplicates = anomalies.filter((a) => a.type === 'POTENTIAL_DUPLICATE');
      expect(duplicates).toHaveLength(0);
    });
  });

  describe('getAnomalyTypeLabel', () => {
    it('should return correct French labels', () => {
      expect(getAnomalyTypeLabel('PRICE_OUTLIER')).toBe('Prix inhabituel');
      expect(getAnomalyTypeLabel('NEGATIVE_VALUE')).toBe('Valeur négative');
      expect(getAnomalyTypeLabel('TOTAL_MISMATCH')).toBe('Incohérence totaux');
      expect(getAnomalyTypeLabel('SUSPICIOUS_QUANTITY')).toBe('Quantité suspecte');
      expect(getAnomalyTypeLabel('LOW_TEXT_CONFIDENCE')).toBe('OCR dégradé');
      expect(getAnomalyTypeLabel('POTENTIAL_DUPLICATE')).toBe('Doublon potentiel');
    });
  });

  describe('getAnomalyIcon', () => {
    it('should return appropriate icons', () => {
      expect(getAnomalyIcon('PRICE_OUTLIER')).toBe('💰');
      expect(getAnomalyIcon('NEGATIVE_VALUE')).toBe('⚠️');
      expect(getAnomalyIcon('TOTAL_MISMATCH')).toBe('🧮');
      expect(getAnomalyIcon('SUSPICIOUS_QUANTITY')).toBe('📦');
      expect(getAnomalyIcon('LOW_TEXT_CONFIDENCE')).toBe('🔍');
      expect(getAnomalyIcon('POTENTIAL_DUPLICATE')).toBe('📋');
    });
  });

  describe('groupAnomaliesBySeverity', () => {
    it('should correctly group anomalies', () => {
      const anomalies = detectOCRAnomalies([
        createLine('Article 1', -10), // warning
        createLine('Article 2', 2000), // info
        createLine('###$$$', 5), // info
      ]);

      const grouped = groupAnomaliesBySeverity(anomalies);

      expect(grouped.warnings.length).toBeGreaterThan(0);
      expect(grouped.info.length).toBeGreaterThan(0);
      expect(grouped.warnings.every((a) => a.severity === 'warning')).toBe(true);
      expect(grouped.info.every((a) => a.severity === 'info')).toBe(true);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle a clean receipt without anomalies', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie', 2.5),
        createLine('Lait demi-écrémé', 1.8),
        createLine('Beurre', 3.2),
      ];

      const anomalies = detectOCRAnomalies(lines);

      expect(anomalies).toHaveLength(0);
    });

    it('should handle a receipt with multiple issues', () => {
      const lines: ReceiptLine[] = [
        createLine('Pain de mie', 2.5),
        createLine('###ERROR###', -5), // Multiple issues: bad text + negative price
        createLine('Fromage', 15000), // High price
      ];

      const anomalies = detectOCRAnomalies(lines);

      expect(anomalies.length).toBeGreaterThan(2);
      expect(anomalies.some((a) => a.type === 'NEGATIVE_VALUE')).toBe(true);
      expect(anomalies.some((a) => a.type === 'PRICE_OUTLIER')).toBe(true);
      expect(anomalies.some((a) => a.type === 'LOW_TEXT_CONFIDENCE')).toBe(true);
    });
  });
});
