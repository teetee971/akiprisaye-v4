/**
 * Territory Ranking Types - Module F Step 1
 * 
 * Defines the data structures for territory ranking based exclusively on median price.
 * NO scores, NO ratings, NO marketing labels.
 */

/**
 * Input data for a single territory
 * Contains observed statistics for ranking calculation
 */
export interface TerritoryStatsInput {
  /** Territory code (e.g., "GP", "MQ", "RE", "GF") */
  territoryCode: string;
  
  /** Territory label (e.g., "Guadeloupe", "Martinique") */
  territoryLabel: string;
  
  /** Calculated median price */
  medianPrice: number;
  
  /** Total valid observations */
  observationCount: number;
  
  /** Distinct stores count */
  storeCount: number;
  
  /** Distinct products count */
  productCount: number;
  
  /** Period start date (ISO format) */
  periodStart: string;
  
  /** Period end date (ISO format) */
  periodEnd: string;
}

/**
 * Result of territory ranking
 * Contains only factual ordinal ranking information
 */
export interface TerritoryRankingResult {
  /** Territory code */
  territoryCode: string;
  
  /** Territory label */
  territoryLabel: string;
  
  /** Ordinal rank (1, 2, 3...) based on median price */
  ordinalRank: number;
  
  /** Median price used for ranking */
  medianPrice: number;
  
  /** Number of observations */
  observationCount: number;
  
  /** Number of stores */
  storeCount: number;
  
  /** Number of products */
  productCount: number;
}

/**
 * Minimum thresholds for territory eligibility
 * Territories below these thresholds are EXCLUDED from ranking
 */
export const TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS = {
  /** Minimum observation count */
  MIN_OBSERVATIONS: 30,
  
  /** Minimum store count */
  MIN_STORES: 10,
  
  /** Minimum product count */
  MIN_PRODUCTS: 5,
} as const;

/**
 * Information about excluded territory
 */
export interface ExcludedTerritoryInfo {
  /** Territory code */
  territoryCode: string;
  
  /** Territory label */
  territoryLabel: string;
  
  /** Reason for exclusion */
  reason: string;
  
  /** Current values that failed validation */
  currentValues: {
    observationCount: number;
    storeCount: number;
    productCount: number;
  };
}
