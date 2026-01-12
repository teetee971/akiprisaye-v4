/**
 * Receipt Segmentation Types
 * 
 * Defines zones for specialized OCR processing of long receipts
 * Philosophy: "Segment before reading, assemble before analyzing"
 */

export type ReceiptZoneType = 'header' | 'body' | 'totals' | 'footer';

export type ReceiptSegment = {
  id: string;
  zone: ReceiptZoneType;
  imageData: string; // base64
  originalImage: string; // base64 of original
  bounds: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  metadata: {
    cropped: boolean;
    confidence: number;
    quality: 'high' | 'medium' | 'low';
    source_photo: number; // Which photo this came from
  };
};

export type SegmentedReceipt = {
  segments: ReceiptSegment[];
  totalPhotos: number;
  overlap_detected: boolean;
  assembly_method: 'visual' | 'manual';
  quality_indicators: ReceiptQualityIndicator[];
};

export type ReceiptQualityIndicator = {
  level: 'readable' | 'medium' | 'partial';
  icon: '✅' | '⚠️' | '⛔';
  message: string;
  zones_affected?: ReceiptZoneType[];
};

/**
 * Overlap Detection Result
 */
export type OverlapDetection = {
  photo1_index: number;
  photo2_index: number;
  overlap_found: boolean;
  overlap_confidence: number;
  overlap_region?: {
    height: number; // pixels
    percentage: number; // 0-100
  };
};

/**
 * Zone Detection Result
 */
export type ZoneDetectionResult = {
  zone: ReceiptZoneType;
  confidence: number;
  keywords_found: string[];
  position: 'top' | 'middle' | 'bottom';
};

/**
 * Get zone description for UI
 */
export function getZoneDescription(zone: ReceiptZoneType): string {
  const descriptions: Record<ReceiptZoneType, string> = {
    header: 'En-tête (enseigne, date, magasin)',
    body: 'Corps (lignes de produits)',
    totals: 'Totaux (sous-total, TVA, total)',
    footer: 'Pied (mentions légales)',
  };
  return descriptions[zone];
}

/**
 * Get quality indicator message
 */
export function getQualityIndicatorMessage(level: ReceiptQualityIndicator['level']): string {
  switch (level) {
    case 'readable':
      return '✅ Ticket lisible';
    case 'medium':
      return '⚠️ Lisibilité moyenne';
    case 'partial':
      return '⛔ Ticket partiel';
  }
}
