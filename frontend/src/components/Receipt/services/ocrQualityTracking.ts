import {
  OCRQualityMetrics,
  OCRQualityLevel,
  StoreChainQualityHistory,
  QualityCause,
  calculateOverallQuality,
  categorizeQuality,
  OCRQualityDistribution,
} from '../../../types/ocrQualityHistory';
import { AdaptiveOCRResult } from './adaptiveOCR';
import { ImageQualityResult } from './imageQualityDetection';

/**
 * OCR Quality Tracking Service
 * 
 * Tracks receipt readability by store chain and territory
 * NO price influence, NO commercial rating
 * ONLY technical document quality measurement
 */

const QUALITY_HISTORY_KEY = 'ocr_quality_history';

/**
 * Record OCR quality metrics for a receipt
 */
export function recordOCRQuality(
  enseigne: string,
  territoire: string,
  ocrResult: AdaptiveOCRResult,
  imageQuality: ImageQualityResult,
  receiptMetrics: {
    hasAllBlocks: boolean;
    lineCount: number;
    duplicatesFound: number;
  }
): void {
  try {
    const metrics = calculateMetrics(ocrResult, imageQuality, receiptMetrics);
    const qualityLevel = categorizeQuality(calculateOverallQuality(metrics));

    // Load existing history
    const history = loadQualityHistory();

    // Find or create entry for this enseigne/territoire
    const key = `${enseigne}_${territoire}`;
    if (!history[key]) {
      history[key] = initializeHistory(enseigne, territoire);
    }

    // Update metrics
    updateHistory(history[key], metrics, qualityLevel);

    // Save
    saveQualityHistory(history);
  } catch (error) {
    console.error('Failed to record OCR quality:', error);
  }
}

/**
 * Calculate OCR quality metrics from results
 */
function calculateMetrics(
  ocrResult: AdaptiveOCRResult,
  imageQuality: ImageQualityResult,
  receiptMetrics: {
    hasAllBlocks: boolean;
    lineCount: number;
    duplicatesFound: number;
  }
): OCRQualityMetrics {
  return {
    photo_sharpness: imageQuality.score,
    document_structure: receiptMetrics.hasAllBlocks ? 100 : 60,
    character_recognition: ocrResult.multiPassResult.averageConfidence,
    block_coherence: calculateBlockCoherence(ocrResult, receiptMetrics),
    duplicate_rate: calculateDuplicateRate(receiptMetrics),
  };
}

/**
 * Calculate block coherence score
 */
function calculateBlockCoherence(
  ocrResult: AdaptiveOCRResult,
  receiptMetrics: { hasAllBlocks: boolean; lineCount: number }
): number {
  let score = 100;

  // Penalize if blocks are missing
  if (!receiptMetrics.hasAllBlocks) {
    score -= 30;
  }

  // Penalize if warnings present
  score -= ocrResult.warnings.length * 10;

  // Bonus for sufficient lines
  if (receiptMetrics.lineCount > 5) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate duplicate rate (lower is better)
 */
function calculateDuplicateRate(receiptMetrics: { duplicatesFound: number; lineCount: number }): number {
  if (receiptMetrics.lineCount === 0) return 0;
  
  const rate = (receiptMetrics.duplicatesFound / receiptMetrics.lineCount) * 100;
  return Math.min(100, rate);
}

/**
 * Initialize quality history for new enseigne/territoire
 */
function initializeHistory(enseigne: string, territoire: string): StoreChainQualityHistory {
  const now = new Date();
  const quarter = `${now.getFullYear()}-Q${Math.ceil((now.getMonth() + 1) / 3)}`;

  return {
    enseigne,
    territoire,
    periode: quarter,
    tickets_analysés: 0,
    qualité_ocr: {
      excellente: 0,
      correcte: 0,
      limitée: 0,
    },
    causes_principales: [],
    metadata: {
      premier_ticket: now,
      dernier_ticket: now,
      version_système: '1.0.0',
    },
  };
}

/**
 * Update quality history with new metrics
 */
function updateHistory(
  history: StoreChainQualityHistory,
  metrics: OCRQualityMetrics,
  qualityLevel: OCRQualityLevel
): void {
  // Increment ticket count
  history.tickets_analysés++;

  // Update distribution
  const total = history.tickets_analysés;
  const counts = {
    excellente: Math.round((history.qualité_ocr.excellente * (total - 1)) / 100),
    correcte: Math.round((history.qualité_ocr.correcte * (total - 1)) / 100),
    limitée: Math.round((history.qualité_ocr.limitée * (total - 1)) / 100),
  };

  counts[qualityLevel]++;

  history.qualité_ocr = {
    excellente: Math.round((counts.excellente / total) * 100),
    correcte: Math.round((counts.correcte / total) * 100),
    limitée: Math.round((counts.limitée / total) * 100),
  };

  // Update causes
  updateCauses(history, metrics);

  // Update metadata
  history.metadata.dernier_ticket = new Date();
}

/**
 * Update quality causes based on metrics
 */
function updateCauses(history: StoreChainQualityHistory, metrics: OCRQualityMetrics): void {
  const causes: Partial<Record<QualityCause['type'], boolean>> = {};

  // Detect causes from metrics
  if (metrics.photo_sharpness < 60) {
    causes.papier_thermique_pale = true;
  }

  if (metrics.duplicate_rate > 20) {
    causes.ticket_long = true;
  }

  if (metrics.character_recognition < 70) {
    causes.impression_basse_def = true;
  }

  if (metrics.block_coherence < 70) {
    causes.format_non_standard = true;
  }

  // Update cause frequencies
  for (const [causeType, detected] of Object.entries(causes)) {
    if (!detected) continue;

    let cause = history.causes_principales.find((c) => c.type === causeType);
    
    if (!cause) {
      cause = {
        type: causeType as QualityCause['type'],
        frequency: 0,
        description: getCauseDescription(causeType as QualityCause['type']),
      };
      history.causes_principales.push(cause);
    }

    // Update frequency (moving average)
    const alpha = 0.1; // Smoothing factor
    cause.frequency = cause.frequency * (1 - alpha) + 100 * alpha;
  }

  // Sort by frequency
  history.causes_principales.sort((a, b) => b.frequency - a.frequency);

  // Keep top 5
  history.causes_principales = history.causes_principales.slice(0, 5);
}

/**
 * Get cause description
 */
function getCauseDescription(causeType: QualityCause['type']): string {
  const descriptions: Record<QualityCause['type'], string> = {
    papier_thermique_pale: 'Papier thermique avec impression pâle ou décolorée',
    ticket_long: 'Tickets de plus de 60 lignes nécessitant plusieurs photos',
    impression_basse_def: 'Qualité d\'impression inférieure à la normale',
    format_non_standard: 'Mise en page variable ou non standard',
    plies_froissures: 'Tickets pliés ou froissés',
    eclairage_faible: 'Photos prises dans des conditions d\'éclairage insuffisant',
  };
  return descriptions[causeType];
}

/**
 * Load quality history from localStorage
 */
function loadQualityHistory(): Record<string, StoreChainQualityHistory> {
  try {
    const stored = localStorage.getItem(QUALITY_HISTORY_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load quality history:', error);
    return {};
  }
}

/**
 * Save quality history to localStorage
 */
function saveQualityHistory(history: Record<string, StoreChainQualityHistory>): void {
  try {
    localStorage.setItem(QUALITY_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save quality history:', error);
  }
}

/**
 * Get quality history for a specific enseigne/territoire
 */
export function getQualityHistory(enseigne: string, territoire: string): StoreChainQualityHistory | null {
  const history = loadQualityHistory();
  const key = `${enseigne}_${territoire}`;
  return history[key] || null;
}

/**
 * Get all quality history entries
 */
export function getAllQualityHistory(): StoreChainQualityHistory[] {
  const history = loadQualityHistory();
  return Object.values(history);
}

/**
 * Get quality statistics by territory
 */
export function getQualityByTerritory(territoire: string): StoreChainQualityHistory[] {
  const allHistory = getAllQualityHistory();
  return allHistory.filter((h) => h.territoire === territoire);
}

/**
 * Calculate territory average quality
 */
export function calculateTerritoryAverageQuality(territoire: string): number {
  const histories = getQualityByTerritory(territoire);
  
  if (histories.length === 0) return 0;

  let totalScore = 0;
  let totalTickets = 0;

  for (const history of histories) {
    const score =
      history.qualité_ocr.excellente * 90 +
      history.qualité_ocr.correcte * 70 +
      history.qualité_ocr.limitée * 40;
    
    totalScore += score * history.tickets_analysés;
    totalTickets += history.tickets_analysés;
  }

  return totalTickets > 0 ? Math.round(totalScore / totalTickets) : 0;
}

/**
 * Clear quality history (admin only)
 */
export function clearQualityHistory(): void {
  try {
    localStorage.removeItem(QUALITY_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear quality history:', error);
  }
}

/**
 * Export quality history for audit
 */
export function exportQualityHistory(): string {
  const history = getAllQualityHistory();
  return JSON.stringify(history, null, 2);
}
