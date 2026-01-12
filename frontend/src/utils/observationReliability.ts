/**
 * Module E - Observation Reliability & Weighting
 * 
 * Purpose: Calculate transparent, explainable reliability scores for observations
 * 
 * Core Principles:
 * - NO store rankings or recommendations
 * - NO predictive logic or commercial influence
 * - NO color-coded incentives
 * - ONLY factual, auditable indicators
 * - Full methodology transparency
 */

import type { ReceiptData, ObservationSourceType } from '../components/Receipt/types';

/**
 * Reliability score components (0-100 scale)
 * All calculations are deterministic and auditable
 */
export type ReliabilityComponents = {
  volumeScore: number;      // Based on observation count
  sourceScore: number;      // Based on source type credibility
  freshnessScore: number;   // Based on observation recency
  dispersionScore: number;  // Based on price consistency (if threshold met)
};

export type ReliabilityScore = {
  total: number;            // Weighted total (0-100)
  components: ReliabilityComponents;
  level: 'très_faible' | 'faible' | 'moyen' | 'élevé' | 'très_élevé';
  canUseForAnalysis: boolean;
  excludedPromotional: boolean;
};

/**
 * Fixed, transparent weighting coefficients
 * These values are publicly documented and auditable
 */
const RELIABILITY_WEIGHTS = {
  volume: 0.40,      // 40% - Most important factor
  source: 0.25,      // 25% - Source type matters
  freshness: 0.20,   // 20% - Recent data more reliable
  dispersion: 0.15,  // 15% - Consistency check (if data sufficient)
} as const;

/**
 * Source type credibility scores
 * Receipt > Shelf label > Promotional (excluded by default)
 */
const SOURCE_TYPE_CREDIBILITY: Record<ObservationSourceType, number> = {
  ticket_caisse: 100,      // Highest - official transaction record
  etiquette_rayon: 80,     // Good - direct shelf observation
  presentoir_promo: 0,     // Excluded - promotional pricing
};

/**
 * Minimum observation count threshold for dispersion analysis
 * Below this, dispersion score is not calculated
 */
const MIN_OBSERVATIONS_FOR_DISPERSION = 5;

/**
 * Calculate volume score based on observation count
 * Non-linear curve: rapid growth at low volumes, diminishing returns at high volumes
 * 
 * @param count - Number of observations
 * @returns Score 0-100
 */
export function calculateVolumeScore(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 20;
  if (count < 5) return 40;
  if (count < 10) return 60;
  if (count < 20) return 80;
  return 100;
}

/**
 * Calculate source type credibility score
 * Based on fixed source type weights
 * 
 * @param sourceType - Type of observation source
 * @returns Score 0-100
 */
export function calculateSourceScore(sourceType: ObservationSourceType): number {
  return SOURCE_TYPE_CREDIBILITY[sourceType];
}

/**
 * Calculate freshness score based on observation age
 * Recent observations score higher
 * 
 * @param observationDate - Date of observation (ISO string)
 * @returns Score 0-100
 */
export function calculateFreshnessScore(observationDate: string): number {
  const now = new Date();
  const obsDate = new Date(observationDate);
  const daysDiff = Math.floor((now.getTime() - obsDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 7) return 100;      // Last week
  if (daysDiff <= 14) return 90;      // Last 2 weeks
  if (daysDiff <= 30) return 75;      // Last month
  if (daysDiff <= 60) return 60;      // Last 2 months
  if (daysDiff <= 90) return 40;      // Last 3 months
  return 20;                           // Older than 3 months
}

/**
 * Calculate price dispersion score
 * Lower dispersion = higher reliability
 * Only calculated when sufficient observations available
 * 
 * @param prices - Array of observed prices
 * @returns Score 0-100, or null if insufficient data
 */
export function calculateDispersionScore(prices: number[]): number | null {
  if (prices.length < MIN_OBSERVATIONS_FOR_DISPERSION) {
    return null; // Insufficient data for dispersion analysis
  }
  
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / mean) * 100;
  
  // Lower variation = higher score
  if (coefficientOfVariation <= 5) return 100;   // Very consistent
  if (coefficientOfVariation <= 10) return 80;   // Consistent
  if (coefficientOfVariation <= 20) return 60;   // Moderate variation
  if (coefficientOfVariation <= 30) return 40;   // High variation
  return 20;                                      // Very high variation
}

/**
 * Calculate overall reliability score for a set of observations
 * Excludes promotional observations by default
 * 
 * @param observations - Array of observation data
 * @param excludePromotional - Whether to exclude promotional observations (default: true)
 * @returns Reliability score with full breakdown
 */
export function calculateReliabilityScore(
  observations: ReceiptData[],
  excludePromotional: boolean = true
): ReliabilityScore {
  // Filter out promotional observations if requested
  let filteredObs = observations;
  let excludedCount = 0;
  
  if (excludePromotional) {
    const originalLength = observations.length;
    filteredObs = observations.filter(obs => 
      obs.type !== 'presentoir_promo' && !obs.source_metadata?.is_promotional
    );
    excludedCount = originalLength - filteredObs.length;
  }
  
  if (filteredObs.length === 0) {
    return {
      total: 0,
      components: {
        volumeScore: 0,
        sourceScore: 0,
        freshnessScore: 0,
        dispersionScore: 0,
      },
      level: 'très_faible',
      canUseForAnalysis: false,
      excludedPromotional: excludedCount > 0,
    };
  }
  
  // Calculate component scores
  const volumeScore = calculateVolumeScore(filteredObs.length);
  
  // Average source scores across all observations
  const sourceScores = filteredObs.map(obs => calculateSourceScore(obs.type));
  const sourceScore = sourceScores.reduce((sum, s) => sum + s, 0) / sourceScores.length;
  
  // Average freshness scores
  const freshnessScores = filteredObs.map(obs => calculateFreshnessScore(obs.date_achat));
  const freshnessScore = freshnessScores.reduce((sum, s) => sum + s, 0) / freshnessScores.length;
  
  // Calculate dispersion if sufficient data
  const prices = filteredObs.flatMap(obs => obs.produits.map(p => p.prix));
  const dispersionScore = calculateDispersionScore(prices) ?? 50; // Default to neutral if insufficient
  
  // Calculate weighted total
  const total = Math.round(
    volumeScore * RELIABILITY_WEIGHTS.volume +
    sourceScore * RELIABILITY_WEIGHTS.source +
    freshnessScore * RELIABILITY_WEIGHTS.freshness +
    dispersionScore * RELIABILITY_WEIGHTS.dispersion
  );
  
  // Determine reliability level
  let level: ReliabilityScore['level'];
  if (total >= 80) level = 'très_élevé';
  else if (total >= 60) level = 'élevé';
  else if (total >= 40) level = 'moyen';
  else if (total >= 20) level = 'faible';
  else level = 'très_faible';
  
  return {
    total,
    components: {
      volumeScore,
      sourceScore,
      freshnessScore,
      dispersionScore,
    },
    level,
    canUseForAnalysis: total >= 40, // Minimum threshold for analysis
    excludedPromotional: excludedCount > 0,
  };
}

/**
 * Get human-readable label for reliability level
 * Neutral terminology without value judgment
 */
export function getReliabilityLevelLabel(level: ReliabilityScore['level']): string {
  const labels = {
    très_faible: 'Très faible',
    faible: 'Faible',
    moyen: 'Moyen',
    élevé: 'Élevé',
    très_élevé: 'Très élevé',
  };
  return labels[level];
}

/**
 * Get description for reliability level
 * Factual description without recommendations
 */
export function getReliabilityLevelDescription(level: ReliabilityScore['level']): string {
  const descriptions = {
    très_faible: 'Volume de données très limité, fiabilité statistique insuffisante',
    faible: 'Données limitées, interprétations à considérer avec prudence',
    moyen: 'Volume de données modéré, fiabilité statistique acceptable',
    élevé: 'Bon volume de données, fiabilité statistique satisfaisante',
    très_élevé: 'Volume important de données récentes et cohérentes',
  };
  return descriptions[level];
}

/**
 * Get methodology explanation for transparency
 * Explains how the score is calculated
 */
export function getMethodologyExplanation(): {
  title: string;
  description: string;
  components: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
} {
  return {
    title: 'Méthodologie de calcul de fiabilité',
    description: 'Le score de fiabilité (0-100) est calculé à partir de 4 composantes pondérées. Aucune logique prédictive ou commerciale n\'est appliquée.',
    components: [
      {
        name: 'Volume d\'observations',
        weight: RELIABILITY_WEIGHTS.volume,
        description: 'Plus le nombre d\'observations est élevé, plus le score est fiable statistiquement',
      },
      {
        name: 'Type de source',
        weight: RELIABILITY_WEIGHTS.source,
        description: 'Les tickets de caisse ont une crédibilité maximale, suivis des étiquettes rayon',
      },
      {
        name: 'Fraîcheur des données',
        weight: RELIABILITY_WEIGHTS.freshness,
        description: 'Les observations récentes ont un score plus élevé que les observations anciennes',
      },
      {
        name: 'Cohérence des prix',
        weight: RELIABILITY_WEIGHTS.dispersion,
        description: 'Calculé uniquement si ≥5 observations. Une faible dispersion indique une fiabilité élevée',
      },
    ],
  };
}
