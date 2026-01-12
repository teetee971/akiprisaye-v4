/**
 * Territory Ranking Thresholds - Module F
 * 
 * Defines minimum observation thresholds for territory ranking to ensure
 * statistically valid and legally defensible comparisons.
 * 
 * PRINCIPLES:
 * - Real data only (no estimates, no predictions)
 * - Mandatory minimum thresholds for all territories
 * - Factual ordinal ranking only (no recommendations)
 * - No badges, no colors, no commercial wording
 */

/**
 * Minimum observation thresholds for territory ranking
 */
export const TERRITORY_RANKING_THRESHOLDS = {
  /**
   * Minimum observations per territory to be included in ranking
   * This ensures statistical significance and prevents ranking based on insufficient data
   */
  MIN_OBSERVATIONS_PER_TERRITORY: 100,

  /**
   * Minimum number of territories required for a valid ranking
   * Below this, ranking is not meaningful
   */
  MIN_TERRITORIES_FOR_RANKING: 3,

  /**
   * Minimum number of products required per territory for comparison
   * Ensures breadth of coverage
   */
  MIN_PRODUCTS_PER_TERRITORY: 10,

  /**
   * Minimum number of stores per territory for valid comparison
   * Ensures competitive landscape representation
   */
  MIN_STORES_PER_TERRITORY: 3,

  /**
   * Maximum age of observations in days
   * Data older than this is excluded from ranking
   */
  MAX_OBSERVATION_AGE_DAYS: 90,

  /**
   * Minimum overlap of products between territories
   * Percentage of products that must be common across compared territories
   */
  MIN_PRODUCT_OVERLAP_PERCENTAGE: 50,
} as const;

/**
 * Territory data interface for ranking
 */
export interface TerritoryData {
  /** Official territory code (e.g., "971" for Guadeloupe) */
  code: string;
  
  /** Official territory name */
  name: string;
  
  /** Number of valid observations */
  observations: number;
  
  /** Number of unique products observed */
  products: number;
  
  /** Number of stores with observations */
  stores: number;
  
  /** Average price for common products basket */
  averagePrice: number;
  
  /** Most recent observation date */
  lastObservation: Date;
  
  /** Number of products in common basket used for comparison */
  commonProducts: number;
}

/**
 * Ranking validation result
 */
export interface RankingValidation {
  /** Whether the ranking is valid */
  valid: boolean;
  
  /** Validation error messages if invalid */
  errors: string[];
  
  /** Validation warnings (non-blocking) */
  warnings: string[];
  
  /** Number of territories that passed validation */
  validTerritories: number;
  
  /** Territories excluded from ranking with reasons */
  excludedTerritories: Array<{
    territory: string;
    reason: string;
  }>;
}

/**
 * Validate territory data for ranking
 * 
 * @param territory - Territory data to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateTerritoryData(territory: TerritoryData): string[] {
  const errors: string[] = [];

  if (territory.observations < TERRITORY_RANKING_THRESHOLDS.MIN_OBSERVATIONS_PER_TERRITORY) {
    errors.push(
      `Observations insuffisantes (${territory.observations}/${TERRITORY_RANKING_THRESHOLDS.MIN_OBSERVATIONS_PER_TERRITORY})`
    );
  }

  if (territory.products < TERRITORY_RANKING_THRESHOLDS.MIN_PRODUCTS_PER_TERRITORY) {
    errors.push(
      `Produits insuffisants (${territory.products}/${TERRITORY_RANKING_THRESHOLDS.MIN_PRODUCTS_PER_TERRITORY})`
    );
  }

  if (territory.stores < TERRITORY_RANKING_THRESHOLDS.MIN_STORES_PER_TERRITORY) {
    errors.push(
      `Enseignes insuffisantes (${territory.stores}/${TERRITORY_RANKING_THRESHOLDS.MIN_STORES_PER_TERRITORY})`
    );
  }

  const daysSinceLastObservation = Math.floor(
    (Date.now() - territory.lastObservation.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceLastObservation > TERRITORY_RANKING_THRESHOLDS.MAX_OBSERVATION_AGE_DAYS) {
    errors.push(
      `Données obsolètes (${daysSinceLastObservation} jours, max: ${TERRITORY_RANKING_THRESHOLDS.MAX_OBSERVATION_AGE_DAYS})`
    );
  }

  if (territory.averagePrice <= 0) {
    errors.push('Prix moyen invalide');
  }

  return errors;
}

/**
 * Validate a set of territories for ranking
 * 
 * @param territories - Array of territory data to validate
 * @returns Validation result with valid/invalid territories and reasons
 */
export function validateRanking(territories: TerritoryData[]): RankingValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const excludedTerritories: Array<{ territory: string; reason: string }> = [];
  
  // Filter valid territories
  const validTerritories = territories.filter(territory => {
    const territoryErrors = validateTerritoryData(territory);
    
    if (territoryErrors.length > 0) {
      excludedTerritories.push({
        territory: territory.name,
        reason: territoryErrors.join(', '),
      });
      return false;
    }
    
    return true;
  });

  // Check minimum territories requirement
  if (validTerritories.length < TERRITORY_RANKING_THRESHOLDS.MIN_TERRITORIES_FOR_RANKING) {
    errors.push(
      `Nombre de territoires insuffisant pour classement (${validTerritories.length}/${TERRITORY_RANKING_THRESHOLDS.MIN_TERRITORIES_FOR_RANKING})`
    );
  }

  // Check product overlap
  if (validTerritories.length >= 2) {
    const minCommonProducts = Math.min(...validTerritories.map(t => t.commonProducts));
    const maxCommonProducts = Math.max(...validTerritories.map(t => t.commonProducts));
    
    if (maxCommonProducts > 0) {
      const overlapPercentage = (minCommonProducts / maxCommonProducts) * 100;
      
      if (overlapPercentage < TERRITORY_RANKING_THRESHOLDS.MIN_PRODUCT_OVERLAP_PERCENTAGE) {
        warnings.push(
          `Chevauchement de produits faible (${overlapPercentage.toFixed(0)}%, min recommandé: ${TERRITORY_RANKING_THRESHOLDS.MIN_PRODUCT_OVERLAP_PERCENTAGE}%)`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    validTerritories: validTerritories.length,
    excludedTerritories,
  };
}

/**
 * Calculate ordinal ranking from territory data
 * 
 * IMPORTANT: This only provides ordinal ranking (1st, 2nd, 3rd...) based on average price.
 * No interpretation, no recommendation, no judgment.
 * 
 * @param territories - Array of validated territory data
 * @returns Array of territories sorted by average price (ascending) with rank
 */
export function calculateOrdinalRanking(
  territories: TerritoryData[]
): Array<TerritoryData & { rank: number }> {
  // Sort by average price ascending (lowest price = rank 1)
  const sorted = [...territories].sort((a, b) => a.averagePrice - b.averagePrice);
  
  // Assign ordinal ranks
  return sorted.map((territory, index) => ({
    ...territory,
    rank: index + 1,
  }));
}

/**
 * Check if ranking is available for the current dataset
 * 
 * @param territories - Array of territory data
 * @returns Whether ranking can be performed
 */
export function isRankingAvailable(territories: TerritoryData[]): boolean {
  const validation = validateRanking(territories);
  return validation.valid;
}

/**
 * Get human-readable threshold descriptions for UI display
 */
export function getThresholdDescriptions(): Record<string, string> {
  return {
    observations: `${TERRITORY_RANKING_THRESHOLDS.MIN_OBSERVATIONS_PER_TERRITORY} observations minimum par territoire`,
    territories: `${TERRITORY_RANKING_THRESHOLDS.MIN_TERRITORIES_FOR_RANKING} territoires minimum requis`,
    products: `${TERRITORY_RANKING_THRESHOLDS.MIN_PRODUCTS_PER_TERRITORY} produits minimum par territoire`,
    stores: `${TERRITORY_RANKING_THRESHOLDS.MIN_STORES_PER_TERRITORY} enseignes minimum par territoire`,
    age: `Données de moins de ${TERRITORY_RANKING_THRESHOLDS.MAX_OBSERVATION_AGE_DAYS} jours`,
    overlap: `${TERRITORY_RANKING_THRESHOLDS.MIN_PRODUCT_OVERLAP_PERCENTAGE}% de produits communs minimum`,
  };
}
