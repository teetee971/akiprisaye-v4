/**
 * Represents a single line parsed from OCR receipt text
 */
export type ReceiptLine = {
  id: string;
  raw: string;
  label?: string;
  price?: number;
  quantity?: number;
  enabled: boolean;
};
