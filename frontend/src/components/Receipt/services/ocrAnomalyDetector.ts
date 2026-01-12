import { OCRAnomaly, OCRAnomalyType, OCRTotals } from '../../../types/ocrAnomaly';
import { ReceiptLine } from '../../../types/receiptLine';

// Constants for anomaly detection
const PRICE_OUTLIER_THRESHOLD = 1000; // Prices above this are flagged as unusually high
const VERY_LOW_PRICE_THRESHOLD = 0.01; // Prices below this are flagged as suspiciously low
const SUSPICIOUS_QUANTITY_THRESHOLD = 50; // Quantities above this are flagged
const TEXT_QUALITY_THRESHOLD = 0.6; // Text quality score below this is flagged
const SPECIAL_CHAR_RATIO_THRESHOLD = 0.4; // Ratio of special chars above this is flagged
const TOTAL_MISMATCH_THRESHOLD_PERCENT = 10; // Percentage difference for total mismatch
const DUPLICATE_SIMILARITY_THRESHOLD = 0.7; // Similarity score for potential duplicates
const DUPLICATE_PRICE_DIFFERENCE_THRESHOLD = 0.1; // Max price difference ratio for duplicates

/**
 * Module M - OCR Anomaly Detector
 * 
 * Detects probable inconsistencies in OCR results
 * NEVER corrects automatically
 * NEVER modifies prices
 * NEVER interprets commercially
 * 
 * Purpose:
 * - Improve observation quality
 * - Alert user before validation
 * - Document data reliability
 */

/**
 * Detect all OCR anomalies in receipt lines
 * 
 * @param lines - Parsed receipt lines
 * @param totals - Optional totals from receipt footer
 * @returns Array of detected anomalies
 */
export function detectOCRAnomalies(
  lines: ReceiptLine[],
  totals?: OCRTotals
): OCRAnomaly[] {
  const anomalies: OCRAnomaly[] = [];

  lines.forEach((line, index) => {
    // Skip disabled lines
    if (!line.enabled) return;

    // Check for negative values
    if (line.price !== undefined && line.price < 0) {
      anomalies.push({
        type: 'NEGATIVE_VALUE',
        lineIndex: index,
        message: 'Prix négatif détecté',
        severity: 'warning',
        details: `Prix: ${line.price} €`,
      });
    }

    // Check for price outliers (unusually high)
    if (line.price !== undefined && line.price > PRICE_OUTLIER_THRESHOLD) {
      anomalies.push({
        type: 'PRICE_OUTLIER',
        lineIndex: index,
        message: 'Prix inhabituellement élevé',
        severity: 'info',
        details: `Prix: ${line.price} € - Vérifiez si c'est correct`,
      });
    }

    // Check for very low prices (potential OCR error)
    if (line.price !== undefined && line.price < VERY_LOW_PRICE_THRESHOLD && line.price > 0) {
      anomalies.push({
        type: 'PRICE_OUTLIER',
        lineIndex: index,
        message: 'Prix très faible détecté',
        severity: 'info',
        details: `Prix: ${line.price} € - Vérifiez si c'est correct`,
      });
    }

    // Check for suspicious quantities
    if (line.quantity !== undefined && line.quantity > SUSPICIOUS_QUANTITY_THRESHOLD) {
      anomalies.push({
        type: 'SUSPICIOUS_QUANTITY',
        lineIndex: index,
        message: 'Quantité inhabituellement élevée',
        severity: 'info',
        details: `Quantité: ${line.quantity} - Vérifiez si c'est correct`,
      });
    }

    // Check for low text confidence (degraded OCR)
    const textQuality = assessTextQuality(line.raw);
    if (textQuality < TEXT_QUALITY_THRESHOLD) {
      anomalies.push({
        type: 'LOW_TEXT_CONFIDENCE',
        lineIndex: index,
        message: 'Texte OCR peu lisible',
        severity: 'info',
        details: 'Vérifiez le texte détecté',
      });
    }
  });

  // Check for total mismatches
  if (totals) {
    const totalAnomalies = detectTotalAnomalies(lines, totals);
    anomalies.push(...totalAnomalies);
  }

  // Check for potential duplicates
  const duplicateAnomalies = detectPotentialDuplicates(lines);
  anomalies.push(...duplicateAnomalies);

  return anomalies;
}

/**
 * Assess text quality based on character composition
 * Returns a score from 0 to 1 (higher is better)
 */
function assessTextQuality(text: string): number {
  if (!text || text.length < 3) return 0;

  const alphanumericCount = (text.match(/[a-zA-Z0-9]/g) || []).length;
  const specialCharCount = text.length - alphanumericCount;
  const ratio = alphanumericCount / text.length;

  // Too many special characters = low quality
  if (specialCharCount > text.length * SPECIAL_CHAR_RATIO_THRESHOLD) {
    return SPECIAL_CHAR_RATIO_THRESHOLD;
  }

  return ratio;
}

/**
 * Detect anomalies related to receipt totals
 */
function detectTotalAnomalies(
  lines: ReceiptLine[],
  totals: OCRTotals
): OCRAnomaly[] {
  const anomalies: OCRAnomaly[] = [];

  // Check if TTC < HT (illogical)
  if (totals.ht !== undefined && totals.ttc !== undefined) {
    if (totals.ttc < totals.ht) {
      anomalies.push({
        type: 'TOTAL_MISMATCH',
        message: 'Total TTC inférieur au HT',
        severity: 'warning',
        details: `HT: ${totals.ht} €, TTC: ${totals.ttc} €`,
      });
    }
  }

  // Check if TVA is negative
  if (totals.tva !== undefined && totals.tva < 0) {
    anomalies.push({
      type: 'NEGATIVE_VALUE',
      message: 'TVA négative détectée',
      severity: 'warning',
      details: `TVA: ${totals.tva} €`,
    });
  }

  // Check if sum of lines matches total
  const enabledLines = lines.filter((l) => l.enabled && l.price !== undefined);
  if (enabledLines.length > 0 && totals.ttc !== undefined) {
    const lineSum = enabledLines.reduce((sum, line) => {
      const lineTotal = line.price! * (line.quantity || 1);
      return sum + lineTotal;
    }, 0);

    const difference = Math.abs(lineSum - totals.ttc);
    const percentDiff = (difference / totals.ttc) * 100;

    // Significant mismatch (more than threshold percent)
    if (percentDiff > TOTAL_MISMATCH_THRESHOLD_PERCENT) {
      anomalies.push({
        type: 'TOTAL_MISMATCH',
        message: 'Écart significatif entre somme des lignes et total',
        severity: 'info',
        details: `Somme lignes: ${lineSum.toFixed(2)} €, Total: ${totals.ttc.toFixed(2)} €`,
      });
    }
  }

  return anomalies;
}

/**
 * Detect potential duplicate lines that weren't caught by fusion
 */
function detectPotentialDuplicates(lines: ReceiptLine[]): OCRAnomaly[] {
  const anomalies: OCRAnomaly[] = [];
  const enabledLines = lines.filter((l) => l.enabled);

  for (let i = 0; i < enabledLines.length; i++) {
    for (let j = i + 1; j < enabledLines.length; j++) {
      const line1 = enabledLines[i];
      const line2 = enabledLines[j];

      // Similar text but not identical
      const similarity = calculateSimilarity(line1.raw, line2.raw);
      
      // Similar price (within 10%)
      const priceSimilar =
        line1.price !== undefined &&
        line2.price !== undefined &&
        Math.abs(line1.price - line2.price) / Math.max(line1.price, line2.price) < 0.1;

      // Detect potential duplicates with slight OCR differences
      if (similarity > 0.7 && similarity < 1.0 && priceSimilar) {
        const lineIndex1 = lines.indexOf(line1);
        const lineIndex2 = lines.indexOf(line2);
        
        anomalies.push({
          type: 'POTENTIAL_DUPLICATE',
          lineIndex: lineIndex1,
          message: `Ligne similaire à la ligne ${lineIndex2 + 1}`,
          severity: 'info',
          details: 'Vérifiez s\'il s\'agit d\'un doublon OCR',
        });
      }
    }
  }

  return anomalies;
}

/**
 * Calculate text similarity (0-1)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^\w]/g, '').trim();

  const norm1 = normalize(text1);
  const norm2 = normalize(text2);

  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;

  // Simple character overlap
  const chars1 = new Set(norm1.split(''));
  const chars2 = new Set(norm2.split(''));

  let common = 0;
  for (const char of chars1) {
    if (chars2.has(char)) common++;
  }

  return common / Math.max(chars1.size, chars2.size);
}

/**
 * Get anomaly type label (French)
 */
export function getAnomalyTypeLabel(type: OCRAnomalyType): string {
  const labels: Record<OCRAnomalyType, string> = {
    PRICE_OUTLIER: 'Prix inhabituel',
    NEGATIVE_VALUE: 'Valeur négative',
    TOTAL_MISMATCH: 'Incohérence totaux',
    SUSPICIOUS_QUANTITY: 'Quantité suspecte',
    LOW_TEXT_CONFIDENCE: 'OCR dégradé',
    POTENTIAL_DUPLICATE: 'Doublon potentiel',
  };

  return labels[type] || type;
}

/**
 * Get anomaly icon
 */
export function getAnomalyIcon(type: OCRAnomalyType): string {
  const icons: Record<OCRAnomalyType, string> = {
    PRICE_OUTLIER: '💰',
    NEGATIVE_VALUE: '⚠️',
    TOTAL_MISMATCH: '🧮',
    SUSPICIOUS_QUANTITY: '📦',
    LOW_TEXT_CONFIDENCE: '🔍',
    POTENTIAL_DUPLICATE: '📋',
  };

  return icons[type] || '❓';
}

/**
 * Group anomalies by severity
 */
export function groupAnomaliesBySeverity(anomalies: OCRAnomaly[]): {
  warnings: OCRAnomaly[];
  info: OCRAnomaly[];
} {
  return {
    warnings: anomalies.filter((a) => a.severity === 'warning'),
    info: anomalies.filter((a) => a.severity === 'info'),
  };
}
