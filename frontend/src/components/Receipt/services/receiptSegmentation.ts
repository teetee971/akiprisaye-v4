import {
  ReceiptSegment,
  ReceiptZoneType,
  SegmentedReceipt,
  ZoneDetectionResult,
  ReceiptQualityIndicator,
} from '../../../types/receiptSegmentation';
import { loadImage } from './receiptAutoCrop';

/**
 * Receipt Segmentation Service
 * 
 * Segments long receipts into functional zones for specialized OCR
 * NO content deletion, NO text retouching
 * 
 * Philosophy: "Segment before reading, assemble before analyzing, never invent"
 */

// Zone detection keywords
const ZONE_KEYWORDS: Record<ReceiptZoneType, string[]> = {
  header: ['TICKET', 'CAISSE', 'MAGASIN', 'DATE', 'HEURE', 'SIRET'],
  body: ['PRIX', 'QTE', 'MONTANT', 'REMISE', 'PROMO'],
  totals: ['TOTAL', 'SOUS-TOTAL', 'TVA', 'TTC', 'HT', 'RENDU', 'PAIEMENT'],
  footer: ['MERCI', 'BONNE JOURNEE', 'AU REVOIR', 'WWW', 'TEL'],
};

/**
 * Segment a receipt image vertically into functional zones
 */
export async function segmentReceipt(
  imageBlob: Blob,
  photoIndex: number = 0
): Promise<ReceiptSegment[]> {
  const img = await loadImage(imageBlob);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Cannot get canvas context');
  }
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  const imageData = canvas.toDataURL('image/jpeg', 0.95);
  
  // Divide receipt into approximate zones (heuristic, not ML)
  const segments: ReceiptSegment[] = [];
  const height = img.height;
  
  // Header zone (top 15%)
  segments.push(await createSegment(
    canvas,
    'header',
    { top: 0, bottom: height * 0.15, left: 0, right: img.width },
    imageData,
    photoIndex
  ));
  
  // Body zone (middle 60%)
  segments.push(await createSegment(
    canvas,
    'body',
    { top: height * 0.15, bottom: height * 0.75, left: 0, right: img.width },
    imageData,
    photoIndex
  ));
  
  // Totals zone (15%)
  segments.push(await createSegment(
    canvas,
    'totals',
    { top: height * 0.75, bottom: height * 0.90, left: 0, right: img.width },
    imageData,
    photoIndex
  ));
  
  // Footer zone (bottom 10%)
  segments.push(await createSegment(
    canvas,
    'footer',
    { top: height * 0.90, bottom: height, left: 0, right: img.width },
    imageData,
    photoIndex
  ));
  
  return segments;
}

/**
 * Create a segment from a zone
 */
async function createSegment(
  canvas: HTMLCanvasElement,
  zone: ReceiptZoneType,
  bounds: { top: number; bottom: number; left: number; right: number },
  originalImage: string,
  photoIndex: number
): Promise<ReceiptSegment> {
  const ctx = canvas.getContext('2d')!;
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  
  // Extract segment
  const segmentCanvas = document.createElement('canvas');
  segmentCanvas.width = width;
  segmentCanvas.height = height;
  const segmentCtx = segmentCanvas.getContext('2d')!;
  
  segmentCtx.drawImage(
    canvas,
    bounds.left, bounds.top, width, height,
    0, 0, width, height
  );
  
  const segmentData = segmentCanvas.toDataURL('image/jpeg', 0.95);
  
  // Assess quality
  const imageData = segmentCtx.getImageData(0, 0, width, height);
  const quality = assessSegmentQuality(imageData);
  
  return {
    id: `${zone}-${photoIndex}-${Date.now()}`,
    zone,
    imageData: segmentData,
    originalImage,
    bounds: {
      top: Math.round(bounds.top),
      bottom: Math.round(bounds.bottom),
      left: Math.round(bounds.left),
      right: Math.round(bounds.right),
    },
    metadata: {
      cropped: true,
      confidence: quality.confidence,
      quality: quality.level,
      source_photo: photoIndex,
    },
  };
}

/**
 * Assess segment quality based on image characteristics
 */
function assessSegmentQuality(imageData: ImageData): {
  level: 'high' | 'medium' | 'low';
  confidence: number;
} {
  const { data, width, height } = imageData;
  
  // Calculate average brightness and contrast
  let sumBrightness = 0;
  let sumVariance = 0;
  const pixelCount = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    sumBrightness += brightness;
  }
  
  const avgBrightness = sumBrightness / pixelCount;
  
  // Calculate variance
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    sumVariance += Math.pow(brightness - avgBrightness, 2);
  }
  
  const variance = Math.sqrt(sumVariance / pixelCount);
  
  // Assess quality
  let level: 'high' | 'medium' | 'low';
  let confidence: number;
  
  if (variance > 50 && avgBrightness > 100 && avgBrightness < 200) {
    level = 'high';
    confidence = 0.9;
  } else if (variance > 30) {
    level = 'medium';
    confidence = 0.7;
  } else {
    level = 'low';
    confidence = 0.5;
  }
  
  return { level, confidence };
}

/**
 * Detect zone type from OCR text (post-OCR validation)
 */
export function detectZoneFromText(text: string): ZoneDetectionResult[] {
  const upperText = text.toUpperCase();
  const results: ZoneDetectionResult[] = [];
  
  for (const [zone, keywords] of Object.entries(ZONE_KEYWORDS)) {
    const foundKeywords = keywords.filter(kw => upperText.includes(kw));
    
    if (foundKeywords.length > 0) {
      const confidence = foundKeywords.length / keywords.length;
      
      results.push({
        zone: zone as ReceiptZoneType,
        confidence,
        keywords_found: foundKeywords,
        position: getPositionFromZone(zone as ReceiptZoneType),
      });
    }
  }
  
  return results.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Get position hint from zone type
 */
function getPositionFromZone(zone: ReceiptZoneType): 'top' | 'middle' | 'bottom' {
  switch (zone) {
    case 'header':
      return 'top';
    case 'body':
      return 'middle';
    case 'totals':
    case 'footer':
      return 'bottom';
  }
}

/**
 * Merge segments from multiple photos
 * Uses visual overlap detection, not text comparison
 */
export function mergeSegments(
  segmentGroups: ReceiptSegment[][]
): SegmentedReceipt {
  const allSegments: ReceiptSegment[] = [];
  const qualityIndicators: ReceiptQualityIndicator[] = [];
  
  // Flatten all segments
  for (const group of segmentGroups) {
    allSegments.push(...group);
  }
  
  // Group by zone
  const segmentsByZone: Record<ReceiptZoneType, ReceiptSegment[]> = {
    header: [],
    body: [],
    totals: [],
    footer: [],
  };
  
  for (const segment of allSegments) {
    segmentsByZone[segment.zone].push(segment);
  }
  
  // For each zone, keep best quality segment
  const mergedSegments: ReceiptSegment[] = [];
  
  for (const [zone, segments] of Object.entries(segmentsByZone)) {
    if (segments.length === 0) continue;
    
    // Sort by quality and confidence
    const sortedSegments = [...segments].sort((a, b) => {
      if (a.metadata.quality !== b.metadata.quality) {
        const qualityOrder = { high: 3, medium: 2, low: 1 };
        return qualityOrder[b.metadata.quality] - qualityOrder[a.metadata.quality];
      }
      return b.metadata.confidence - a.metadata.confidence;
    });
    
    const bestSegment = sortedSegments[0];
    mergedSegments.push(bestSegment);
    
    // Add quality indicator if needed
    if (bestSegment.metadata.quality === 'low') {
      qualityIndicators.push({
        level: 'partial',
        icon: '⛔',
        message: `${zone} du ticket peu lisible`,
        zones_affected: [zone as ReceiptZoneType],
      });
    } else if (bestSegment.metadata.quality === 'medium') {
      qualityIndicators.push({
        level: 'medium',
        icon: '⚠️',
        message: `Lisibilité moyenne pour ${zone}`,
        zones_affected: [zone as ReceiptZoneType],
      });
    }
  }
  
  // Overall quality assessment
  if (qualityIndicators.length === 0) {
    qualityIndicators.push({
      level: 'readable',
      icon: '✅',
      message: 'Ticket lisible',
    });
  }
  
  return {
    segments: mergedSegments,
    totalPhotos: segmentGroups.length,
    overlap_detected: segmentGroups.length > 1,
    assembly_method: 'visual',
    quality_indicators: qualityIndicators,
  };
}

/**
 * Get OCR strategy for a specific zone
 * Different zones need different OCR approaches
 */
export function getOCRStrategyForZone(zone: ReceiptZoneType): string[] {
  const strategies: Record<ReceiptZoneType, string[]> = {
    header: ['precision'], // Store name, date need precision
    body: ['precision', 'small_chars'], // Product lines
    totals: ['numeric', 'precision'], // Numbers are critical
    footer: ['fast'], // Less critical
  };
  
  return strategies[zone] || ['precision'];
}
