/**
 * Observation Thresholds Configuration
 * 
 * Fixed, auditable thresholds for observation volume assessment
 * These values are deterministic and transparent
 */

export const OBSERVATION_THRESHOLDS = {
  minimal: 10,
  faible: 25,
  modere: 50,
  fort: 100,
  maximal: 150,
} as const;

export type ObservationLevel = 'minimal' | 'faible' | 'modéré' | 'fort' | 'maximal';

/**
 * Compute observation level based on count
 * Deterministic, auditable logic with fixed thresholds
 * 
 * @param count - Number of observations
 * @returns Descriptive level (no value judgment)
 */
export function computeObservationLevel(count: number): ObservationLevel {
  if (count < OBSERVATION_THRESHOLDS.minimal) return 'minimal';
  if (count < OBSERVATION_THRESHOLDS.faible) return 'faible';
  if (count < OBSERVATION_THRESHOLDS.modere) return 'modéré';
  if (count < OBSERVATION_THRESHOLDS.fort) return 'fort';
  return 'maximal';
}

/**
 * Get observation level metadata
 * Provides display information without value judgment
 */
export function getObservationLevelInfo(level: ObservationLevel) {
  const info = {
    minimal: {
      label: 'Minimal',
      description: 'Volume très limité de données disponibles',
    },
    faible: {
      label: 'Faible',
      description: 'Volume limité de données disponibles',
    },
    modéré: {
      label: 'Modéré',
      description: 'Volume intermédiaire de données disponibles',
    },
    fort: {
      label: 'Fort',
      description: 'Volume important de données disponibles',
    },
    maximal: {
      label: 'Maximal',
      description: 'Volume très important de données disponibles',
    },
  };

  return info[level];
}
