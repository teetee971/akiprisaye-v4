/**
 * Territorial Anomaly Detection - Module G
 * 
 * Detects statistical anomalies in territorial data.
 * 
 * STRICT RULE:
 * NO computation if alert mode is "disabled"
 * - NO detection
 * - NO storage
 * - NO rendering
 * - NO background pre-calculation
 */

import {
  TerritorialAnomaly,
  AnomalyAlertMode,
  DEFAULT_ALERT_MODE,
} from './anomalyAlert.types';
import { TerritoryStatsInput } from './territoryRanking.types';

/**
 * Statistical thresholds for anomaly detection
 */
const ANOMALY_THRESHOLDS = {
  /** Standard deviation multiplier for price spike detection */
  PRICE_SPIKE_THRESHOLD: 2.0,
  
  /** Minimum observations required */
  MIN_OBSERVATIONS: 30,
  
  /** Minimum stores required */
  MIN_STORES: 10,
  
  /** Maximum coefficient of variation (CV) for quality check */
  MAX_CV_PERCENTAGE: 50,
} as const;

/**
 * Detect territorial anomalies
 * 
 * CRITICAL: Returns empty array if alertMode is "disabled"
 * 
 * @param territories - Array of territory statistics
 * @param alertMode - Current alert mode
 * @returns Array of detected anomalies (empty if alerts disabled)
 */
export function detectTerritorialAnomalies(
  territories: TerritoryStatsInput[],
  alertMode: AnomalyAlertMode = DEFAULT_ALERT_MODE
): TerritorialAnomaly[] {
  // STRICT RULE: No computation if alerts disabled
  if (alertMode === 'disabled') {
    return [];
  }

  const anomalies: TerritorialAnomaly[] = [];
  const now = new Date();

  // Calculate statistical baseline
  const prices = territories
    .filter(t => t.observationCount >= ANOMALY_THRESHOLDS.MIN_OBSERVATIONS)
    .map(t => t.medianPrice);

  if (prices.length < 2) {
    // Not enough data for statistical comparison
    return [];
  }

  const meanPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - meanPrice, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);

  // Check each territory for anomalies
  for (const territory of territories) {
    // Check 1: Low sample size
    if (territory.observationCount < ANOMALY_THRESHOLDS.MIN_OBSERVATIONS) {
      anomalies.push({
        territoryCode: territory.territoryCode,
        territoryLabel: territory.territoryLabel,
        anomalyType: 'low_sample',
        threshold: ANOMALY_THRESHOLDS.MIN_OBSERVATIONS,
        observedValue: territory.observationCount,
        description: `Nombre d'observations (${territory.observationCount}) inférieur au seuil statistique minimal (${ANOMALY_THRESHOLDS.MIN_OBSERVATIONS})`,
        detectedAt: now,
      });
    }

    // Check 2: Insufficient stores
    if (territory.storeCount < ANOMALY_THRESHOLDS.MIN_STORES) {
      anomalies.push({
        territoryCode: territory.territoryCode,
        territoryLabel: territory.territoryLabel,
        anomalyType: 'data_quality',
        threshold: ANOMALY_THRESHOLDS.MIN_STORES,
        observedValue: territory.storeCount,
        description: `Nombre de magasins (${territory.storeCount}) inférieur au seuil de représentativité (${ANOMALY_THRESHOLDS.MIN_STORES})`,
        detectedAt: now,
      });
    }

    // Check 3: Price spike (only if enough observations)
    if (territory.observationCount >= ANOMALY_THRESHOLDS.MIN_OBSERVATIONS && prices.length >= 2) {
      const zScore = Math.abs((territory.medianPrice - meanPrice) / stdDev);
      
      if (zScore > ANOMALY_THRESHOLDS.PRICE_SPIKE_THRESHOLD) {
        const direction = territory.medianPrice > meanPrice ? 'supérieur' : 'inférieur';
        anomalies.push({
          territoryCode: territory.territoryCode,
          territoryLabel: territory.territoryLabel,
          anomalyType: 'price_spike',
          threshold: ANOMALY_THRESHOLDS.PRICE_SPIKE_THRESHOLD,
          observedValue: zScore,
          description: `Prix médian (${territory.medianPrice.toFixed(2)} €) significativement ${direction} à la moyenne (écart-type: ${zScore.toFixed(2)})`,
          detectedAt: now,
        });
      }
    }
  }

  return anomalies;
}

/**
 * Get anomaly type label for display
 */
export function getAnomalyTypeLabel(type: TerritorialAnomaly['anomalyType']): string {
  switch (type) {
    case 'low_sample':
      return 'Échantillon insuffisant';
    case 'data_quality':
      return 'Qualité des données';
    case 'price_spike':
      return 'Écart de prix significatif';
    case 'high_deviation':
      return 'Forte variation';
    default:
      return 'Anomalie statistique';
  }
}

/**
 * Get threshold descriptions for UI display
 */
export function getAnomalyThresholdDescriptions(): Record<string, string> {
  return {
    observations: `${ANOMALY_THRESHOLDS.MIN_OBSERVATIONS} observations minimum`,
    stores: `${ANOMALY_THRESHOLDS.MIN_STORES} magasins minimum`,
    priceSpike: `Écart-type > ${ANOMALY_THRESHOLDS.PRICE_SPIKE_THRESHOLD}`,
    dataQuality: `Coefficient de variation < ${ANOMALY_THRESHOLDS.MAX_CV_PERCENTAGE}%`,
  };
}

/**
 * Check if anomaly detection is possible with current data
 */
export function canDetectAnomalies(territories: TerritoryStatsInput[]): boolean {
  const validTerritories = territories.filter(
    t => t.observationCount >= ANOMALY_THRESHOLDS.MIN_OBSERVATIONS
  );
  
  return validTerritories.length >= 2;
}
