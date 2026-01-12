/**
 * Anomaly Alert Selector Component - Module G
 * 
 * Provides explicit user choice for territorial anomaly alerts.
 * 
 * KEY PRINCIPLES:
 * - Alerts disabled by default
 * - Clear radio button choice
 * - Factual explanation text
 * - NO forcing or nudging
 * - NO intrusive UX
 */

import React from 'react';
import { AnomalyAlertMode } from '../../utils/anomalyAlert.types';

export interface AnomalyAlertSelectorProps {
  /** Current alert mode */
  mode: AnomalyAlertMode;
  
  /** Callback when mode changes */
  onChange: (mode: AnomalyAlertMode) => void;
  
  /** Whether the selector is disabled (e.g., Advanced Analysis not enabled) */
  disabled?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}

/**
 * Anomaly Alert Selector
 * 
 * Radio button selector for enabling/disabling territorial anomaly alerts.
 * Must be used within Advanced Analysis mode context.
 */
export function AnomalyAlertSelector({
  mode,
  onChange,
  disabled = false,
  className = '',
}: AnomalyAlertSelectorProps) {
  return (
    <fieldset className={`anomaly-alert-selector ${className}`} disabled={disabled}>
      <legend className="selector-legend">Alertes statistiques territoriales</legend>

      <div className="selector-options">
        <label className="selector-option">
          <input
            type="radio"
            name="anomaly-alert-mode"
            value="disabled"
            checked={mode === 'disabled'}
            onChange={() => onChange('disabled')}
            disabled={disabled}
            aria-label="Sans alertes - consultation des données uniquement"
          />
          <span className="option-label">
            Sans alertes (consultation des données uniquement)
          </span>
        </label>

        <label className="selector-option">
          <input
            type="radio"
            name="anomaly-alert-mode"
            value="enabled"
            checked={mode === 'enabled'}
            onChange={() => onChange('enabled')}
            disabled={disabled}
            aria-label="Avec alertes statistiques - mode analyse avancée"
          />
          <span className="option-label">
            Avec alertes statistiques (mode analyse avancée)
          </span>
        </label>
      </div>

      <p className="selector-disclaimer">
        Les alertes signalent uniquement des écarts statistiques.
        Elles ne constituent ni accusation ni recommandation.
      </p>

      {disabled && (
        <p className="selector-disabled-notice">
          Les alertes statistiques nécessitent l'activation du mode Analyse avancée.
        </p>
      )}

      <style>{`
        .anomaly-alert-selector {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(203, 213, 225, 0.5);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 0;
        }

        .anomaly-alert-selector:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .selector-legend {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
          padding: 0;
        }

        .selector-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .selector-option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.75rem;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .selector-option:hover:not(:has(input:disabled)) {
          background: rgba(241, 245, 249, 0.8);
        }

        .selector-option input[type="radio"] {
          margin-top: 0.125rem;
          cursor: pointer;
          flex-shrink: 0;
          width: 1.125rem;
          height: 1.125rem;
        }

        .selector-option input[type="radio"]:disabled {
          cursor: not-allowed;
        }

        .option-label {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
        }

        .selector-disclaimer {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          padding: 0.75rem;
          background: rgba(241, 245, 249, 0.5);
          border-radius: 6px;
          font-style: italic;
        }

        .selector-disabled-notice {
          font-size: 0.9rem;
          color: #f59e0b;
          line-height: 1.6;
          margin: 0.75rem 0 0 0;
          padding: 0.75rem;
          background: rgba(254, 243, 199, 0.5);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 6px;
        }

        @media (max-width: 768px) {
          .anomaly-alert-selector {
            padding: 1rem;
          }

          .selector-legend {
            font-size: 0.95rem;
          }

          .option-label,
          .selector-disclaimer,
          .selector-disabled-notice {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </fieldset>
  );
}

export default AnomalyAlertSelector;
