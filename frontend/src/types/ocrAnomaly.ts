/**
 * Module M - OCR Anomaly Types
 * 
 * Defines types of inconsistencies that can be detected in OCR results
 * IMPORTANT: Detection only, never automatic correction
 * 
 * Philosophy: "The system observes and signals, but never decides for the human."
 */

export type OCRAnomalyType =
  | 'PRICE_OUTLIER'           // Unusually high/low price by format
  | 'NEGATIVE_VALUE'          // Negative price or quantity
  | 'TOTAL_MISMATCH'          // VAT calculation error or sum mismatch
  | 'SUSPICIOUS_QUANTITY'     // Unusually high quantity (x100, x999)
  | 'LOW_TEXT_CONFIDENCE'     // Degraded OCR text quality
  | 'POTENTIAL_DUPLICATE';    // Similar but not identical duplicate lines

export type OCRAnomalySeverity = 'info' | 'warning';

export interface OCRAnomaly {
  type: OCRAnomalyType;
  lineIndex?: number;
  message: string;
  severity: OCRAnomalySeverity;
  details?: string;
}

export interface OCRTotals {
  ht?: number;  // Hors taxes (before tax)
  ttc?: number; // Toutes taxes comprises (including tax)
  tva?: number; // Tax amount
}
