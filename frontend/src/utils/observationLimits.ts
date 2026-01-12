/**
 * Module D - Observation Thresholds & Intelligent Locking
 * 
 * Purpose: Prevent statistically fragile interpretations while keeping data visible
 * 
 * Principle: Not enough observations → no interpretation
 * Data remains visible, but without conclusions
 */

/**
 * Fixed observation thresholds by scope level
 * These values are:
 * - Explicit and documented
 * - Modifiable with clear rationale
 * - Visible to users
 */
export const OBSERVATION_THRESHOLDS = {
  territory: 50,
  store: 20,
  product: 5,
} as const;

/**
 * Maximum observations per store to prevent bias
 * Beyond this limit, new observations are not integrated
 */
export const MAX_OBSERVATIONS_PER_STORE = 30;

export type ObservationScope = keyof typeof OBSERVATION_THRESHOLDS;

/**
 * Check if observation count meets minimum threshold for interpretation
 * 
 * @param observations - Number of observations available
 * @param scope - Scope level (territory, store, or product)
 * @returns true if observations meet threshold, false otherwise
 */
export function meetsMinimumThreshold(
  observations: number,
  scope: ObservationScope
): boolean {
  return observations >= OBSERVATION_THRESHOLDS[scope];
}

/**
 * Check if observations exceed maximum allowed per store
 * 
 * @param observations - Number of observations for a store
 * @returns true if maximum is reached, false otherwise
 */
export function hasReachedMaximum(observations: number): boolean {
  return observations >= MAX_OBSERVATIONS_PER_STORE;
}

/**
 * Get threshold value for a specific scope
 * 
 * @param scope - Scope level
 * @returns Threshold value
 */
export function getThreshold(scope: ObservationScope): number {
  return OBSERVATION_THRESHOLDS[scope];
}

/**
 * Calculate how many more observations are needed to meet threshold
 * 
 * @param observations - Current number of observations
 * @param scope - Scope level
 * @returns Number of additional observations needed (0 if threshold met)
 */
export function getObservationsNeeded(
  observations: number,
  scope: ObservationScope
): number {
  const threshold = OBSERVATION_THRESHOLDS[scope];
  return Math.max(0, threshold - observations);
}

/**
 * Get explanatory message for insufficient observations
 * 
 * @param scope - Scope level
 * @param observations - Current number of observations
 * @returns User-friendly explanation message
 */
export function getInsufficientDataMessage(
  scope: ObservationScope,
  observations: number
): string {
  const needed = getObservationsNeeded(observations, scope);
  const threshold = OBSERVATION_THRESHOLDS[scope];
  
  return `Nombre d'observations insuffisant pour une interprétation fiable (${observations}/${threshold}). Les données sont affichées à titre informatif uniquement.`;
}

/**
 * Get message when maximum observations reached
 * 
 * @returns Message explaining maximum reached
 */
export function getMaximumReachedMessage(): string {
  return `Seuil maximal atteint pour cette enseigne (${MAX_OBSERVATIONS_PER_STORE} observations). Les nouvelles observations ne sont plus intégrées pour préserver l'équilibre statistique.`;
}

/**
 * Validate observation count and return status
 * 
 * @param observations - Number of observations
 * @param scope - Scope level
 * @returns Validation result with status and message
 */
export function validateObservations(
  observations: number,
  scope: ObservationScope
): {
  isValid: boolean;
  canInterpret: boolean;
  message: string | null;
} {
  const meetsThreshold = meetsMinimumThreshold(observations, scope);
  
  if (!meetsThreshold) {
    return {
      isValid: true, // Data is valid, just insufficient
      canInterpret: false,
      message: getInsufficientDataMessage(scope, observations),
    };
  }
  
  return {
    isValid: true,
    canInterpret: true,
    message: null,
  };
}
