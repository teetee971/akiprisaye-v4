/**
 * Territory Ranking Computation - Module F Step 1
 * 
 * Pure function for computing ordinal territory ranking based exclusively on median price.
 * 
 * PRINCIPLES:
 * - Deterministic
 * - Testable
 * - Legally defensible
 * - NO weighting
 * - NO normalization
 * - NO hidden rounding
 * - NO logarithmic transformation
 */

import {
  TerritoryStatsInput,
  TerritoryRankingResult,
  ExcludedTerritoryInfo,
  TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS,
} from './territoryRanking.types';

/**
 * Check if a territory meets the minimum eligibility thresholds
 * 
 * @param territory - Territory to check
 * @returns true if territory meets all thresholds
 */
export function isEligibleForRanking(territory: TerritoryStatsInput): boolean {
  return (
    territory.observationCount >= TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_OBSERVATIONS &&
    territory.storeCount >= TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_STORES &&
    territory.productCount >= TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_PRODUCTS
  );
}

/**
 * Get the reason why a territory is excluded from ranking
 * 
 * @param territory - Territory to check
 * @returns Reason for exclusion, or null if eligible
 */
export function getExclusionReason(territory: TerritoryStatsInput): string | null {
  const reasons: string[] = [];

  if (territory.observationCount < TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_OBSERVATIONS) {
    reasons.push(
      `observations insuffisantes (${territory.observationCount}/${TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_OBSERVATIONS})`
    );
  }

  if (territory.storeCount < TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_STORES) {
    reasons.push(
      `magasins insuffisants (${territory.storeCount}/${TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_STORES})`
    );
  }

  if (territory.productCount < TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_PRODUCTS) {
    reasons.push(
      `produits insuffisants (${territory.productCount}/${TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_PRODUCTS})`
    );
  }

  return reasons.length > 0 ? reasons.join(', ') : null;
}

/**
 * Get list of excluded territories with reasons
 * 
 * @param input - Array of territory statistics
 * @returns Array of excluded territories with reasons
 */
export function getExcludedTerritories(
  input: TerritoryStatsInput[]
): ExcludedTerritoryInfo[] {
  return input
    .filter(territory => !isEligibleForRanking(territory))
    .map(territory => ({
      territoryCode: territory.territoryCode,
      territoryLabel: territory.territoryLabel,
      reason: getExclusionReason(territory) || 'Non éligible',
      currentValues: {
        observationCount: territory.observationCount,
        storeCount: territory.storeCount,
        productCount: territory.productCount,
      },
    }));
}

/**
 * Compute territory ranking based exclusively on median price
 * 
 * RANKING FORMULA:
 * 1. Filter territories that meet minimum thresholds
 * 2. Sort by median price (ascending)
 * 3. For equal prices, sort alphabetically by territory label (neutral rule)
 * 4. Assign ordinal rank (1, 2, 3...)
 * 
 * @param input - Array of territory statistics
 * @returns Array of ranked territories (only eligible ones)
 */
export function computeTerritoryRanking(
  input: TerritoryStatsInput[]
): TerritoryRankingResult[] {
  // Step 1: Filter eligible territories
  const eligible = input.filter(territory => isEligibleForRanking(territory));

  // Step 2: Sort by median price (ascending), then alphabetically for ties
  const sorted = [...eligible].sort((a, b) => {
    // Primary sort: by median price
    if (a.medianPrice !== b.medianPrice) {
      return a.medianPrice - b.medianPrice;
    }
    // Secondary sort: alphabetically by territory label (neutral tie-breaker)
    return a.territoryLabel.localeCompare(b.territoryLabel, 'fr', { sensitivity: 'base' });
  });

  // Step 3: Assign ordinal ranks
  return sorted.map((territory, index) => ({
    territoryCode: territory.territoryCode,
    territoryLabel: territory.territoryLabel,
    ordinalRank: index + 1,
    medianPrice: territory.medianPrice,
    observationCount: territory.observationCount,
    storeCount: territory.storeCount,
    productCount: territory.productCount,
  }));
}

/**
 * Get methodological text to display BEFORE results
 * 
 * This text must be shown to users before any ranking is displayed.
 */
export function getMethodologyText(): string {
  return `Classement ordinal des territoires basé exclusivement sur le prix médian observé.

Aucune recommandation, notation ou interprétation commerciale n'est produite.

Les territoires ne disposant pas d'un volume suffisant d'observations sont exclus du classement.`;
}

/**
 * Get eligibility criteria text for UI display
 */
export function getEligibilityCriteriaText(): string {
  return `Critères d'éligibilité au classement :
• ${TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_OBSERVATIONS} observations minimum
• ${TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_STORES} magasins minimum
• ${TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_PRODUCTS} produits minimum`;
}

/**
 * Validate input data
 * 
 * @param input - Territory statistics to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateTerritoryStatsInput(territory: TerritoryStatsInput): string[] {
  const errors: string[] = [];

  if (!territory.territoryCode || territory.territoryCode.trim() === '') {
    errors.push('Code territoire manquant');
  }

  if (!territory.territoryLabel || territory.territoryLabel.trim() === '') {
    errors.push('Libellé territoire manquant');
  }

  if (territory.medianPrice < 0) {
    errors.push('Prix médian invalide (négatif)');
  }

  if (territory.observationCount < 0) {
    errors.push('Nombre d\'observations invalide (négatif)');
  }

  if (territory.storeCount < 0) {
    errors.push('Nombre de magasins invalide (négatif)');
  }

  if (territory.productCount < 0) {
    errors.push('Nombre de produits invalide (négatif)');
  }

  if (!territory.periodStart || !territory.periodEnd) {
    errors.push('Période manquante');
  } else {
    try {
      const start = new Date(territory.periodStart);
      const end = new Date(territory.periodEnd);
      
      if (isNaN(start.getTime())) {
        errors.push('Date de début invalide');
      }
      
      if (isNaN(end.getTime())) {
        errors.push('Date de fin invalide');
      }
      
      if (start > end) {
        errors.push('Date de début postérieure à la date de fin');
      }
    } catch {
      errors.push('Format de date invalide');
    }
  }

  return errors;
}

/**
 * Validate all input territories
 * 
 * @param input - Array of territory statistics
 * @returns Object with validation status and error details
 */
export function validateAllInputs(input: TerritoryStatsInput[]): {
  valid: boolean;
  errors: Array<{ territoryCode: string; errors: string[] }>;
} {
  const territoryErrors = input
    .map(territory => ({
      territoryCode: territory.territoryCode,
      errors: validateTerritoryStatsInput(territory),
    }))
    .filter(result => result.errors.length > 0);

  return {
    valid: territoryErrors.length === 0,
    errors: territoryErrors,
  };
}
