/**
 * Territory Ranking Display - Module F
 * 
 * Displays factual ordinal ranking of territories based on average prices.
 * 
 * CRITICAL PRINCIPLES:
 * - Factual ordinal ranking only (1st, 2nd, 3rd...)
 * - NO recommendations or value judgments
 * - NO badges or colored indicators
 * - NO commercial wording
 * - Methodology displayed BEFORE results
 * - Only activated in Advanced Analysis mode (opt-in)
 */

import React from 'react';
import { TerritoryData, validateRanking, calculateOrdinalRanking } from '../../utils/territoryRankingThresholds';
import TerritoryRankingMethodology from './TerritoryRankingMethodology';

export interface TerritoryRankingProps {
  /** Territory data to rank */
  territories: TerritoryData[];
  
  /** Opt-in flag for Advanced Analysis mode */
  advancedAnalysisEnabled: boolean;
  
  /** Whether to show methodology (default: true) */
  showMethodology?: boolean;
  
  /** Custom CSS class name */
  className?: string;
  
  /** Callback when opt-in is toggled */
  onOptInToggle?: (enabled: boolean) => void;
}

/**
 * Territory Ranking Component
 * 
 * Displays a strictly factual ordinal ranking of territories.
 * Requires explicit opt-in via Advanced Analysis mode.
 */
export const TerritoryRanking: React.FC<TerritoryRankingProps> = ({
  territories,
  advancedAnalysisEnabled,
  showMethodology = true,
  className = '',
  onOptInToggle,
}) => {
  // Validate ranking data
  const validation = validateRanking(territories);
  const canRank = validation.valid && advancedAnalysisEnabled;

  // Calculate ranking if valid
  const rankedTerritories = canRank ? calculateOrdinalRanking(territories) : [];

  // Opt-in UI if not enabled
  if (!advancedAnalysisEnabled) {
    return (
      <div className={`territory-ranking-optin ${className}`}>
        <div className="optin-content">
          <div className="optin-icon" aria-hidden="true">🔒</div>
          <h3 className="optin-title">Mode Analyse Avancée Requis</h3>
          <p className="optin-description">
            Le classement des territoires est une fonctionnalité d'analyse avancée
            disponible uniquement en mode opt-in explicite.
          </p>
          <p className="optin-info">
            Cette fonctionnalité affiche un classement strictement factuel des territoires
            basé sur les prix moyens observés. Elle ne constitue ni une recommandation,
            ni un jugement de valeur.
          </p>
          {onOptInToggle && (
            <button
              className="optin-button"
              onClick={() => onOptInToggle(true)}
              aria-label="Activer le mode Analyse Avancée"
            >
              Activer le Mode Analyse Avancée
            </button>
          )}
        </div>
        {renderStyles()}
      </div>
    );
  }

  // Show validation errors if any
  if (!validation.valid) {
    return (
      <div className={`territory-ranking-invalid ${className}`}>
        <div className="invalid-content">
          <div className="invalid-icon" aria-hidden="true">⚠️</div>
          <h3 className="invalid-title">Classement Non Disponible</h3>
          <p className="invalid-description">
            Les données actuelles ne permettent pas d'établir un classement valide.
          </p>
          
          {validation.errors.length > 0 && (
            <div className="validation-errors">
              <h4 className="errors-title">Critères non satisfaits :</h4>
              <ul className="errors-list">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.excludedTerritories.length > 0 && (
            <div className="excluded-territories">
              <h4 className="excluded-title">Territoires exclus :</h4>
              <ul className="excluded-list">
                {validation.excludedTerritories.map((item, index) => (
                  <li key={index}>
                    <strong>{item.territory} :</strong> {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="validation-warnings">
              <h4 className="warnings-title">Avertissements :</h4>
              <ul className="warnings-list">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {renderStyles()}
      </div>
    );
  }

  // Display ranking
  return (
    <div className={`territory-ranking ${className}`}>
      {/* Methodology displayed FIRST */}
      {showMethodology && <TerritoryRankingMethodology />}

      {/* Ranking results */}
      <div className="ranking-content">
        <div className="ranking-header">
          <h3 className="ranking-title">Classement Territorial</h3>
          <p className="ranking-subtitle">
            Ordre factuel basé sur le prix moyen d'un panier de {rankedTerritories[0]?.commonProducts || 0} produits communs
          </p>
        </div>

        <div className="ranking-table-container">
          <table className="ranking-table" role="table" aria-label="Classement des territoires">
            <thead>
              <tr>
                <th scope="col" className="col-rank">Position</th>
                <th scope="col" className="col-territory">Territoire</th>
                <th scope="col" className="col-price">Prix Moyen Panier</th>
                <th scope="col" className="col-observations">Observations</th>
                <th scope="col" className="col-products">Produits</th>
                <th scope="col" className="col-stores">Enseignes</th>
              </tr>
            </thead>
            <tbody>
              {rankedTerritories.map((territory) => (
                <tr key={territory.code} className="ranking-row">
                  <td className="col-rank" data-label="Position">
                    <span className="rank-number">{territory.rank}</span>
                  </td>
                  <td className="col-territory" data-label="Territoire">
                    <div className="territory-info">
                      <span className="territory-name">{territory.name}</span>
                      <span className="territory-code">({territory.code})</span>
                    </div>
                  </td>
                  <td className="col-price" data-label="Prix Moyen">
                    <span className="price-value">{territory.averagePrice.toFixed(2)} €</span>
                  </td>
                  <td className="col-observations" data-label="Observations">
                    {territory.observations}
                  </td>
                  <td className="col-products" data-label="Produits">
                    {territory.products}
                  </td>
                  <td className="col-stores" data-label="Enseignes">
                    {territory.stores}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ranking-footer">
          <p className="footer-note">
            📊 Données à jour au : {new Date().toLocaleDateString('fr-FR')}
          </p>
          <p className="footer-disclaimer">
            Ce classement est strictement factuel. Il ne constitue ni une recommandation
            ni un jugement de qualité sur un territoire.
          </p>
        </div>
      </div>

      {renderStyles()}
    </div>
  );
};

function renderStyles() {
  return (
    <style>{`
      /* Opt-in styles */
      .territory-ranking-optin {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
      }

      .optin-content {
        max-width: 600px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .optin-icon {
        font-size: 3rem;
      }

      .optin-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #f1f5f9;
        margin: 0;
      }

      .optin-description,
      .optin-info {
        font-size: 1rem;
        line-height: 1.6;
        color: #cbd5e1;
        margin: 0;
      }

      .optin-button {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: #ffffff;
        border: none;
        border-radius: 8px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 1rem;
      }

      .optin-button:hover {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }

      /* Invalid state styles */
      .territory-ranking-invalid {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(245, 158, 11, 0.3);
        border-radius: 12px;
        padding: 2rem;
      }

      .invalid-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .invalid-icon {
        font-size: 2.5rem;
        text-align: center;
      }

      .invalid-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #f1f5f9;
        margin: 0;
        text-align: center;
      }

      .invalid-description {
        font-size: 1rem;
        color: #cbd5e1;
        text-align: center;
        margin: 0;
      }

      .validation-errors,
      .excluded-territories,
      .validation-warnings {
        background: rgba(30, 41, 59, 0.5);
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
      }

      .errors-title,
      .excluded-title,
      .warnings-title {
        font-size: 1rem;
        font-weight: 600;
        color: #f1f5f9;
        margin: 0 0 0.75rem 0;
      }

      .errors-list,
      .excluded-list,
      .warnings-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .errors-list li,
      .excluded-list li,
      .warnings-list li {
        font-size: 0.9rem;
        color: #cbd5e1;
        padding-left: 1.25rem;
        position: relative;
      }

      .errors-list li::before {
        content: '✕';
        position: absolute;
        left: 0;
        color: #ef4444;
      }

      .excluded-list li::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: #f59e0b;
      }

      .warnings-list li::before {
        content: '⚠';
        position: absolute;
        left: 0;
        color: #f59e0b;
      }

      /* Ranking display styles */
      .territory-ranking {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .ranking-content {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(51, 65, 85, 0.5);
        border-radius: 12px;
        padding: 1.5rem;
      }

      .ranking-header {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(51, 65, 85, 0.5);
      }

      .ranking-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #f1f5f9;
        margin: 0 0 0.5rem 0;
      }

      .ranking-subtitle {
        font-size: 0.9rem;
        color: #cbd5e1;
        margin: 0;
      }

      .ranking-table-container {
        overflow-x: auto;
        margin-bottom: 1.5rem;
      }

      .ranking-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }

      .ranking-table th {
        text-align: left;
        padding: 0.75rem;
        background: rgba(30, 41, 59, 0.5);
        color: #e2e8f0;
        font-weight: 600;
        border-bottom: 2px solid rgba(51, 65, 85, 0.5);
      }

      .ranking-table td {
        padding: 0.75rem;
        border-bottom: 1px solid rgba(51, 65, 85, 0.3);
        color: #cbd5e1;
      }

      .ranking-row:hover {
        background: rgba(30, 41, 59, 0.3);
      }

      .col-rank {
        width: 80px;
        text-align: center;
      }

      .rank-number {
        display: inline-block;
        width: 2rem;
        height: 2rem;
        background: rgba(100, 116, 139, 0.3);
        border-radius: 50%;
        line-height: 2rem;
        text-align: center;
        font-weight: 600;
        color: #f1f5f9;
      }

      .territory-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .territory-name {
        font-weight: 600;
        color: #f1f5f9;
      }

      .territory-code {
        color: #94a3b8;
        font-size: 0.85rem;
      }

      .price-value {
        font-weight: 600;
        color: #f1f5f9;
      }

      .ranking-footer {
        padding-top: 1rem;
        border-top: 1px solid rgba(51, 65, 85, 0.5);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .footer-note,
      .footer-disclaimer {
        font-size: 0.85rem;
        color: #94a3b8;
        margin: 0;
        text-align: center;
      }

      .footer-disclaimer {
        font-style: italic;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .ranking-table {
          font-size: 0.85rem;
        }

        .ranking-table thead {
          display: none;
        }

        .ranking-table tr {
          display: block;
          margin-bottom: 1rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 8px;
          overflow: hidden;
        }

        .ranking-table td {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid rgba(51, 65, 85, 0.3);
        }

        .ranking-table td:last-child {
          border-bottom: none;
        }

        .ranking-table td::before {
          content: attr(data-label);
          font-weight: 600;
          color: #e2e8f0;
        }

        .territory-info {
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }
      }
    `}</style>
  );
}

export default TerritoryRanking;
