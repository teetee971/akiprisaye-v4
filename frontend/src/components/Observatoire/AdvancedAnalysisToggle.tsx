/**
 * Advanced Analysis Toggle Component - Module F Step 2
 * 
 * Provides explicit user activation for territory ranking display.
 * NO auto-activation, NO incentive, NO commercial wording.
 * 
 * PRINCIPLES:
 * - Ranking ONLY visible after voluntary user action
 * - Methodological warning displayed before activation
 * - Clear explanation of what will be shown
 * - NO marketing language
 */

import React from 'react';

export interface AdvancedAnalysisToggleProps {
  /** Whether advanced analysis mode is enabled */
  enabled: boolean;
  
  /** Callback when user enables advanced analysis */
  onEnable: () => void;
  
  /** Custom CSS class name */
  className?: string;
}

/**
 * Toggle component for Advanced Analysis mode
 * 
 * Displays explanatory text and activation button when disabled.
 * Must be shown before any ranking is displayed.
 */
export function AdvancedAnalysisToggle({
  enabled,
  onEnable,
  className = '',
}: AdvancedAnalysisToggleProps) {
  return (
    <div className={`analysis-toggle ${className}`}>
      <h3 className="analysis-toggle-title">Analyse avancée (optionnelle)</h3>

      {!enabled && (
        <>
          <p className="analysis-toggle-description">
            Cette analyse présente un classement ordinal des territoires basé
            exclusivement sur des données statistiques factuelles.
          </p>
          <p className="analysis-toggle-disclaimer">
            Aucun conseil, recommandation ou interprétation commerciale n'est
            fourni.
          </p>

          <button
            className="analysis-toggle-button"
            onClick={onEnable}
            aria-label="Activer l'analyse avancée"
          >
            Activer l'analyse avancée
          </button>
        </>
      )}

      {enabled && (
        <p className="analysis-toggle-active">
          Mode analyse avancée activé
        </p>
      )}

      <style>{`
        .analysis-toggle {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(203, 213, 225, 0.5);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .analysis-toggle-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .analysis-toggle-description,
        .analysis-toggle-disclaimer {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #475569;
          margin: 0 0 1rem 0;
        }

        .analysis-toggle-button {
          background: #475569;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .analysis-toggle-button:hover {
          background: #334155;
        }

        .analysis-toggle-button:focus {
          outline: 2px solid #475569;
          outline-offset: 2px;
        }

        .analysis-toggle-active {
          font-size: 0.95rem;
          color: #475569;
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .analysis-toggle {
            padding: 1rem;
          }

          .analysis-toggle-title {
            font-size: 1rem;
          }

          .analysis-toggle-description,
          .analysis-toggle-disclaimer {
            font-size: 0.9rem;
          }

          .analysis-toggle-button {
            width: 100%;
            padding: 0.875rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AdvancedAnalysisToggle;
