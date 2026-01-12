import { ReceiptLine } from '../../types/receiptLine';

/**
 * Parse receipt OCR text into individual lines with extracted information
 * @param text - Raw OCR text from receipt
 * @returns Array of parsed receipt lines
 */
export function parseReceiptLines(text: string): ReceiptLine[] {
  return text
    .split('\n')
    .filter((l) => l.trim().length > 3)
    .map((line, i) => ({
      id: `line-${i}-${Date.now()}`,
      raw: line.trim(),
      label: extractLabel(line),
      price: extractPrice(line),
      quantity: extractQuantity(line),
      enabled: true,
    }));
}

/**
 * Extract price from a receipt line
 * Looks for patterns like: 12.34, 12,34, 1 234.56
 */
function extractPrice(line: string): number | undefined {
  // Match price patterns: 12.34 or 12,34 with optional spaces for thousands
  const patterns = [
    /(\d+[,\.]\d{2})\s*€?$/,  // Price at end of line: 12.34 or 12,34
    /€?\s*(\d+[,\.]\d{2})/,   // Price with € symbol
    /(\d{1,3}(?:\s?\d{3})*[,\.]\d{2})/, // Price with thousands separator
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      // Clean and parse: remove spaces, replace comma with dot
      const priceStr = match[1].replace(/\s/g, '').replace(',', '.');
      const price = parseFloat(priceStr);
      if (!isNaN(price) && price > 0 && price < 10000) {
        return price;
      }
    }
  }

  return undefined;
}

/**
 * Extract quantity from a receipt line
 * Looks for patterns like: 2x, x2, 2 x
 */
function extractQuantity(line: string): number | undefined {
  const patterns = [
    /(\d+)\s*x\s/i,  // 2x or 2 x
    /x\s*(\d+)/i,    // x2 or x 2
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      const qty = parseInt(match[1], 10);
      if (!isNaN(qty) && qty > 0 && qty < 100) {
        return qty;
      }
    }
  }

  return undefined;
}

/**
 * Extract product label from a receipt line
 * Removes price, quantity, and common artifacts
 */
function extractLabel(line: string): string | undefined {
  let label = line;

  // Remove price at the end
  label = label.replace(/\d+[,\.]\d{2}\s*€?\s*$/, '');
  
  // Remove quantity patterns
  label = label.replace(/^\d+\s*x\s*/i, '');
  label = label.replace(/\s*x\s*\d+\s*/i, '');

  // Remove common receipt artifacts
  label = label.replace(/^\s*[-*•]\s*/, '');
  label = label.trim();

  return label.length > 2 ? label : undefined;
}

/**
 * Filter receipt lines to keep only product lines
 * Removes header, footer, and non-product lines
 */
export function filterProductLines(lines: ReceiptLine[]): ReceiptLine[] {
  return lines.filter((line) => {
    const upper = line.raw.toUpperCase();
    
    // Skip common header/footer keywords
    const excludeKeywords = [
      'TICKET', 'CAISSE', 'MERCI', 'BONNE JOURNEE', 'TOTAL',
      'SOUS-TOTAL', 'TVA', 'CARTE', 'ESPECES', 'RENDU',
      'DATE', 'HEURE', 'MAGASIN', 'SIRET', 'TEL', 'WWW',
    ];
    
    if (excludeKeywords.some(keyword => upper.includes(keyword))) {
      return false;
    }

    // Keep lines that have a price or look like product lines
    return line.price !== undefined || line.label !== undefined;
  });
}
