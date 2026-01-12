/**
 * Module L - Receipt quality score (informative, non-prescriptive)
 * 
 * Provides a technical quality indicator for receipt data
 * NOT related to price quality or "good deals"
 * Purely for data reliability assessment
 * 
 * GUARANTEES:
 * - No color coding (red/green)
 * - No star ratings
 * - No marketing labels
 * - Strictly technical/informational
 * 
 * Score components:
 * - Valid lines: 40%
 * - OCR readability: 20%
 * - Detected prices: 20%
 * - Date detected: 10%
 * - Store detected: 10%
 */

export type TicketQualityInput = {
  lines: number;
  pricedLines: number;
  hasDate: boolean;
  hasStore: boolean;
  hasOCRConfidence?: number; // 0-1, optional
};

export type TicketQualityScore = {
  score: number; // 0-100
  breakdown: {
    linesScore: number;
    pricesScore: number;
    dateScore: number;
    storeScore: number;
  };
  level: 'insufficient' | 'limited' | 'good' | 'excellent';
  message: string;
};

/**
 * Compute receipt data quality score
 * Higher score = more reliable data for territorial analysis
 * 
 * @param input - Receipt data metrics
 * @returns Quality score with breakdown
 */
export function computeTicketQuality(input: TicketQualityInput): TicketQualityScore {
  // Lines score (max 40 points)
  // More lines = more data, capped at 10 lines for max score
  const linesScore = Math.min(input.lines, 10) * 4;

  // Prices score (max 20 points)
  // Ratio of lines with detected prices
  const priceRatio = input.lines > 0 ? input.pricedLines / input.lines : 0;
  const pricesScore = Math.min(priceRatio, 1) * 20;

  // Date score (10 points if detected)
  const dateScore = input.hasDate ? 10 : 0;

  // Store score (10 points if detected)
  const storeScore = input.hasStore ? 10 : 0;

  // Optional: OCR confidence adjustment (max +/-10%)
  let confidenceAdjustment = 0;
  if (input.hasOCRConfidence !== undefined) {
    confidenceAdjustment = (input.hasOCRConfidence - 0.5) * 20; // -10 to +10
  }

  // Total score (capped at 100)
  const rawScore = linesScore + pricesScore + dateScore + storeScore + confidenceAdjustment;
  const score = Math.max(0, Math.min(rawScore, 100));

  // Determine quality level
  let level: TicketQualityScore['level'];
  let message: string;

  if (score < 30) {
    level = 'insufficient';
    message = 'Données insuffisantes pour une analyse fiable';
  } else if (score < 60) {
    level = 'limited';
    message = 'Données limitées - analyse partielle possible';
  } else if (score < 85) {
    level = 'good';
    message = 'Données de bonne qualité pour analyse';
  } else {
    level = 'excellent';
    message = 'Données de très bonne qualité pour analyse';
  }

  return {
    score: Math.round(score),
    breakdown: {
      linesScore: Math.round(linesScore),
      pricesScore: Math.round(pricesScore),
      dateScore,
      storeScore,
    },
    level,
    message,
  };
}

/**
 * Get detailed quality breakdown description
 */
export function getQualityBreakdownDescription(score: TicketQualityScore): string[] {
  const descriptions: string[] = [];

  if (score.breakdown.linesScore > 0) {
    descriptions.push(`Lignes détectées: ${score.breakdown.linesScore}/40 points`);
  }

  if (score.breakdown.pricesScore > 0) {
    descriptions.push(`Prix détectés: ${score.breakdown.pricesScore}/20 points`);
  }

  if (score.breakdown.dateScore > 0) {
    descriptions.push(`Date détectée: ${score.breakdown.dateScore}/10 points`);
  } else {
    descriptions.push('Date non détectée: 0/10 points');
  }

  if (score.breakdown.storeScore > 0) {
    descriptions.push(`Enseigne détectée: ${score.breakdown.storeScore}/10 points`);
  } else {
    descriptions.push('Enseigne non détectée: 0/10 points');
  }

  return descriptions;
}

/**
 * Get neutral icon for quality level
 * NO red/green colors, NO stars
 */
export function getQualityIcon(level: TicketQualityScore['level']): string {
  switch (level) {
    case 'insufficient':
      return '📊'; // Chart icon
    case 'limited':
      return '📈'; // Increasing chart
    case 'good':
      return '📉'; // Chart with trend
    case 'excellent':
      return '📊'; // Chart icon
    default:
      return '📊';
  }
}

/**
 * Generate a neutral, informational summary
 * Emphasizes technical data quality, not price quality
 */
export function getQualitySummary(score: TicketQualityScore): string {
  return `${getQualityIcon(score.level)} ${score.message} (${score.score}/100)`;
}
