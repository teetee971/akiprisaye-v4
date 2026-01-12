/**
 * Territory Analysis with Anomaly Alerts - Module G Integration
 * 
 * Complete integration of:
 * - Territory ranking (Module F)
 * - Anomaly alert system (Module G)
 * 
 * TWO LEVELS OF CONTROL:
 * 1. Advanced Analysis mode (prerequisite)
 * 2. Alert mode (disabled/enabled)
 * 
 * DEFAULT: All alerts disabled
 */

import React, { useState, useEffect } from 'react';
import { TerritoryStatsInput } from '../../utils/territoryRanking.types';
import {
  AnomalyAlertMode,
  DEFAULT_ALERT_MODE,
  areAlertsAvailable,
  loadAlertModeFromStorage,
  saveAlertModeToStorage,
} from '../../utils/anomalyAlert.types';
import {
  detectTerritorialAnomalies,
  canDetectAnomalies,
} from '../../utils/territorialAnomalyDetection';
import { computeTerritoryRanking, getExcludedTerritories, getMethodologyText, getEligibilityCriteriaText } from '../../utils/computeTerritoryRanking';
import AdvancedAnalysisToggle from './AdvancedAnalysisToggle';
import AnomalyAlertSelector from './AnomalyAlertSelector';
import TerritorialAnomalyPanel from './TerritorialAnomalyPanel';
import TerritoryRankingTable from './TerritoryRankingTable';

export interface TerritoryAnalysisWithAlertsProps {
  /** Territory statistics data */
  data: TerritoryStatsInput[];
  
  /** Custom CSS class name */
  className?: string;
  
  /** Callback when analysis mode changes */
  onAnalysisModeChange?: (enabled: boolean) => void;
  
  /** Callback when alert mode changes */
  onAlertModeChange?: (mode: AnomalyAlertMode) => void;
}

/**
 * Complete territory analysis with optional anomaly alerts
 * 
 * Flow:
 * 1. User enables Advanced Analysis mode
 * 2. User chooses alert mode (disabled/enabled)
 * 3. If alerts enabled: detect and display anomalies
 * 4. Always show ranking if data valid
 */
export function TerritoryAnalysisWithAlerts({
  data,
  className = '',
  onAnalysisModeChange,
  onAlertModeChange,
}: TerritoryAnalysisWithAlertsProps) {
  const [advancedAnalysisEnabled, setAdvancedAnalysisEnabled] = useState(false);
  const [alertMode, setAlertMode] = useState<AnomalyAlertMode>(DEFAULT_ALERT_MODE);

  // Load alert mode from storage on mount
  useEffect(() => {
    const storedMode = loadAlertModeFromStorage();
    setAlertMode(storedMode);
  }, []);

  const handleEnableAnalysis = () => {
    setAdvancedAnalysisEnabled(true);
    if (onAnalysisModeChange) {
      onAnalysisModeChange(true);
    }
  };

  const handleAlertModeChange = (newMode: AnomalyAlertMode) => {
    setAlertMode(newMode);
    saveAlertModeToStorage(newMode);
    if (onAlertModeChange) {
      onAlertModeChange(newMode);
    }
  };

  // Compute ranking
  const rankedTerritories = computeTerritoryRanking(data);
  const excludedTerritories = getExcludedTerritories(data);

  // Detect anomalies ONLY if alerts enabled
  const alertsAvailable = areAlertsAvailable({
    mode: alertMode,
    advancedAnalysisEnabled,
  });
  
  const anomalies = alertsAvailable ? detectTerritorialAnomalies(data, alertMode) : [];
  const canDetect = canDetectAnomalies(data);

  return (
    <div className={`territory-analysis-with-alerts ${className}`}>
      {/* Step 1: Advanced Analysis toggle */}
      <AdvancedAnalysisToggle
        enabled={advancedAnalysisEnabled}
        onEnable={handleEnableAnalysis}
      />

      {/* Step 2-5: Content (only when Advanced Analysis enabled) */}
      {advancedAnalysisEnabled && (
        <>
          {/* Step 2: Alert mode selector */}
          <AnomalyAlertSelector
            mode={alertMode}
            onChange={handleAlertModeChange}
          />

          {/* Step 3: Methodology text */}
          <div className="methodology-section">
            <h4 className="methodology-title">Méthodologie</h4>
            <p className="methodology-text">{getMethodologyText()}</p>
            
            <div className="eligibility-criteria">
              <h5 className="criteria-title">Critères d'éligibilité</h5>
              <p className="criteria-text">{getEligibilityCriteriaText()}</p>
            </div>
          </div>

          {/* Step 4: Anomaly alerts (conditional display) */}
          {alertMode === 'enabled' ? (
            canDetect ? (
              <>
                <div className="alert-mode-notice">
                  <h5 className="notice-title">Mode activé : Alertes statistiques territoriales</h5>
                  <p className="notice-text">
                    Les informations affichées reposent exclusivement sur des seuils statistiques publics.
                    Aucune interprétation, qualification ou recommandation n'est produite.
                  </p>
                </div>
                <TerritorialAnomalyPanel anomalies={anomalies} />
              </>
            ) : (
              <div className="alert-unavailable">
                <p className="unavailable-message">
                  La détection d'anomalies nécessite au moins 2 territoires avec
                  un volume suffisant d'observations.
                </p>
              </div>
            )
          ) : (
            <div className="alert-disabled-message">
              <p>
                Les alertes statistiques sont désactivées.
                Activez-les pour analyser les écarts territoriaux.
              </p>
            </div>
          )}

          {/* Step 5: Excluded territories info (if any) */}
          {excludedTerritories.length > 0 && (
            <div className="excluded-section">
              <h5 className="excluded-title">Territoires exclus du classement</h5>
              <ul className="excluded-list">
                {excludedTerritories.map(excluded => (
                  <li key={excluded.territoryCode}>
                    <strong>{excluded.territoryLabel}</strong> : {excluded.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 6: Ranking table */}
          <TerritoryRankingTable data={rankedTerritories} />

          {/* Step 7: Footer disclaimer */}
          <div className="analysis-footer">
            <p className="footer-text">
              Ce classement est strictement factuel. Il ne constitue ni une
              recommandation ni un jugement de qualité sur un territoire.
            </p>
          </div>
        </>
      )}

      <style>{`
        .territory-analysis-with-alerts {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Methodology section */
        .methodology-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .methodology-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .methodology-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #475569;
          margin: 0 0 1.5rem 0;
          white-space: pre-line;
        }

        .eligibility-criteria {
          background: #f8fafc;
          border-radius: 6px;
          padding: 1rem;
        }

        .criteria-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.75rem 0;
        }

        .criteria-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #475569;
          margin: 0;
          white-space: pre-line;
        }

        /* Alert mode notice */
        .alert-mode-notice {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 1.25rem;
        }

        .notice-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e40af;
          margin: 0 0 0.5rem 0;
        }

        .notice-text {
          font-size: 0.9rem;
          color: #1e3a8a;
          line-height: 1.6;
          margin: 0;
        }

        /* Alert disabled message */
        .alert-disabled-message {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
        }

        .alert-disabled-message p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* Alert unavailable */
        .alert-unavailable {
          background: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 1.25rem;
          text-align: center;
        }

        .unavailable-message {
          font-size: 0.95rem;
          color: #92400e;
          line-height: 1.6;
          margin: 0;
        }

        /* Excluded territories section */
        .excluded-section {
          background: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 1.25rem;
        }

        .excluded-title {
          font-size: 1rem;
          font-weight: 600;
          color: #92400e;
          margin: 0 0 0.75rem 0;
        }

        .excluded-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .excluded-list li {
          font-size: 0.9rem;
          color: #78350f;
          padding-left: 1.25rem;
          position: relative;
        }

        .excluded-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #f59e0b;
        }

        /* Footer */
        .analysis-footer {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .footer-text {
          font-size: 0.9rem;
          color: #475569;
          margin: 0;
          font-style: italic;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .territory-analysis-with-alerts {
            gap: 1rem;
          }

          .methodology-section,
          .alert-mode-notice,
          .alert-disabled-message,
          .alert-unavailable,
          .excluded-section {
            padding: 1rem;
          }

          .methodology-title,
          .notice-title,
          .excluded-title {
            font-size: 1rem;
          }

          .methodology-text,
          .criteria-text,
          .notice-text,
          .alert-disabled-message p,
          .unavailable-message,
          .excluded-list li,
          .footer-text {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}

export default TerritoryAnalysisWithAlerts;
