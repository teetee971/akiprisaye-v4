/**
 * Anomaly Alert Types - Module G
 * 
 * Defines types for territorial anomaly alert system.
 * 
 * KEY PRINCIPLE:
 * System NEVER triggers alerts without explicit user action.
 * 
 * DEFAULT: Alerts disabled
 * TWO LEVELS OF CONTROL:
 * 1. Advanced Analysis mode (already required)
 * 2. Explicit choice: Alerts enabled/disabled
 */

/**
 * Anomaly alert mode
 * - "disabled": No alerts, data consultation only
 * - "enabled": Statistical alerts active
 */
export type AnomalyAlertMode = 'disabled' | 'enabled';

/**
 * Default alert mode (ALWAYS disabled by default)
 */
export const DEFAULT_ALERT_MODE: AnomalyAlertMode = 'disabled';

/**
 * Territorial anomaly data
 * Only computed when alerts are enabled
 */
export interface TerritorialAnomaly {
  /** Territory code */
  territoryCode: string;
  
  /** Territory label */
  territoryLabel: string;
  
  /** Type of statistical anomaly detected */
  anomalyType: 'high_deviation' | 'low_sample' | 'price_spike' | 'data_quality';
  
  /** Statistical threshold exceeded */
  threshold: number;
  
  /** Actual value observed */
  observedValue: number;
  
  /** Factual description (NO judgment) */
  description: string;
  
  /** Detection date */
  detectedAt: Date;
}

/**
 * Alert mode configuration
 */
export interface AlertModeConfig {
  /** Current alert mode */
  mode: AnomalyAlertMode;
  
  /** Whether Advanced Analysis is enabled (prerequisite) */
  advancedAnalysisEnabled: boolean;
}

/**
 * Check if alerts are available
 * Requires both Advanced Analysis and explicit alert activation
 */
export function areAlertsAvailable(config: AlertModeConfig): boolean {
  return config.advancedAnalysisEnabled && config.mode === 'enabled';
}

/**
 * Get localStorage key for alert mode persistence
 */
export const ALERT_MODE_STORAGE_KEY = 'anomalyAlertMode';

/**
 * Load alert mode from localStorage (if exists)
 * Returns DEFAULT_ALERT_MODE if not found
 */
export function loadAlertModeFromStorage(): AnomalyAlertMode {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_ALERT_MODE;
  }
  
  const stored = localStorage.getItem(ALERT_MODE_STORAGE_KEY);
  
  if (stored === 'enabled' || stored === 'disabled') {
    return stored;
  }
  
  return DEFAULT_ALERT_MODE;
}

/**
 * Save alert mode to localStorage
 */
export function saveAlertModeToStorage(mode: AnomalyAlertMode): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  
  localStorage.setItem(ALERT_MODE_STORAGE_KEY, mode);
}

/**
 * Clear alert mode from localStorage
 */
export function clearAlertModeFromStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  
  localStorage.removeItem(ALERT_MODE_STORAGE_KEY);
}
