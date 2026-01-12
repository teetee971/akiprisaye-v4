/**
 * Territory Ranking Display - Module F Step 2
 * 
 * Controlled integration of Advanced Analysis mode with territory ranking.
 * 
 * FLOW:
 * 1. Display toggle (disabled by default)
 * 2. User clicks to enable
 * 3. Display methodology text
 * 4. Display ranking table
 * 
 * GUARANTEES:
 * - NO ranking visible without activation
 * - Methodology ALWAYS shown before results
 * - NO auto-activation
 * - NO marketing wording
 */

import React, { useState } from 'react';
import { TerritoryStatsInput } from '../../utils/territoryRanking.types';
import {
  computeTerritoryRanking,
  getExcludedTerritories,
  getMethodologyText,
  getEligibilityCriteriaText,
} from '../../utils/computeTerritoryRanking';
import AdvancedAnalysisToggle from './AdvancedAnalysisToggle';
import TerritoryRankingTable from './TerritoryRankingTable';

export interface TerritoryRankingDisplayProps {
  /** Territory statistics data */
  data: TerritoryStatsInput[];
  
  /** Custom CSS class name */
  className?: string;
  
  /** Callback when analysis mode is toggled */
  onAnalysisModeChange?: (enabled: boolean) => void;
}

/**
 * Complete territory ranking display with opt-in mechanism
 * 
 * Manages state for Advanced Analysis mode and displays:
 * - Toggle component (always visible)
 * - Methodology text (visible when enabled)
 * - Ranking table (visible when enabled and data valid)
 */
export function TerritoryRankingDisplay({
  data,
  className = '',
  onAnalysisModeChange,
}: TerritoryRankingDisplayProps) {
  const [advancedAnalysisEnabled, setAdvancedAnalysisEnabled] = useState(false);

  const handleEnableAnalysis = () => {
    setAdvancedAnalysisEnabled(true);
    if (onAnalysisModeChange) {
      onAnalysisModeChange(true);
    }
  };

  // Compute ranking
  const rankedTerritories = computeTerritoryRanking(data);
  const excludedTerritories = getExcludedTerritories(data);

  return (
    <div className={`territory-ranking-display ${className}`}>
      {/* Step 1: Toggle (always visible) */}
      <AdvancedAnalysisToggle
        enabled={advancedAnalysisEnabled}
        onEnable={handleEnableAnalysis}
      />

      {/* Step 2-3: Methodology and results (only when enabled) */}
      {advancedAnalysisEnabled && (
        <>
          {/* Methodology text (ALWAYS before results) */}
          <div className="methodology-section">
            <h4 className="methodology-title">Méthodologie</h4>
            <p className="methodology-text">{getMethodologyText()}</p>
            
            <div className="eligibility-criteria">
              <h5 className="criteria-title">Critères d'éligibilité</h5>
              <p className="criteria-text">{getEligibilityCriteriaText()}</p>
            </div>
          </div>

          {/* Excluded territories info (if any) */}
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

          {/* Ranking table */}
          <TerritoryRankingTable data={rankedTerritories} />

          {/* Footer disclaimer */}
          <div className="ranking-footer">
            <p className="footer-text">
              Ce classement est strictement factuel. Il ne constitue ni une
              recommandation ni un jugement de qualité sur un territoire.
            </p>
          </div>
        </>
      )}

      <style>{`
        .territory-ranking-display {
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
        .ranking-footer {
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
          .territory-ranking-display {
            gap: 1rem;
          }

          .methodology-section,
          .excluded-section {
            padding: 1rem;
          }

          .methodology-title,
          .excluded-title {
            font-size: 1rem;
          }

          .methodology-text,
          .criteria-text,
          .excluded-list li {
            font-size: 0.875rem;
          }

          .footer-text {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}

export default TerritoryRankingDisplay;
