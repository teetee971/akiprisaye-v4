/**
 * Territory Ranking Methodology - Module F
 * 
 * Displays the methodology used for territory ranking BEFORE showing results.
 * This ensures transparency and informed interpretation by users.
 * 
 * PRINCIPLES:
 * - Methodology displayed first, results second
 * - Factual description only
 * - No commercial wording
 * - Clear limitations stated
 */

import React from 'react';
import { TERRITORY_RANKING_THRESHOLDS, getThresholdDescriptions } from '../../utils/territoryRankingThresholds';

export interface TerritoryRankingMethodologyProps {
  /** Whether to show in compact mode */
  compact?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}

/**
 * Methodology component for territory ranking
 * 
 * Must be displayed BEFORE any ranking results.
 */
export const TerritoryRankingMethodology: React.FC<TerritoryRankingMethodologyProps> = ({
  compact = false,
  className = '',
}) => {
  const thresholds = getThresholdDescriptions();

  return (
    <div
      className={`territory-ranking-methodology ${className}`}
      role="region"
      aria-label="Méthodologie du classement"
    >
      <div className="methodology-header">
        <h3 className="methodology-title">
          📋 Méthodologie du Classement Territorial
        </h3>
        <p className="methodology-subtitle">
          Classement strictement factuel et ordinal basé sur des données publiques
        </p>
      </div>

      <div className="methodology-content">
        {!compact && (
          <div className="methodology-section">
            <h4 className="section-title">Principe</h4>
            <p className="section-text">
              Ce classement présente un ordre factuel des territoires basé uniquement sur le{' '}
              <strong>prix moyen observé d'un panier de produits communs</strong>.
            </p>
            <p className="section-text">
              <strong>Important :</strong> Ce classement ne constitue{' '}
              <strong>ni une recommandation</strong>, ni un jugement de valeur.
              Il s'agit d'une information factuelle destinée à la compréhension
              des écarts de prix entre territoires.
            </p>
          </div>
        )}

        <div className="methodology-section">
          <h4 className="section-title">Critères de Validité</h4>
          <ul className="criteria-list">
            <li>
              <span className="criteria-icon" aria-hidden="true">📊</span>
              <span className="criteria-text">{thresholds.observations}</span>
            </li>
            <li>
              <span className="criteria-icon" aria-hidden="true">🗺️</span>
              <span className="criteria-text">{thresholds.territories}</span>
            </li>
            <li>
              <span className="criteria-icon" aria-hidden="true">🛒</span>
              <span className="criteria-text">{thresholds.products}</span>
            </li>
            <li>
              <span className="criteria-icon" aria-hidden="true">🏪</span>
              <span className="criteria-text">{thresholds.stores}</span>
            </li>
            <li>
              <span className="criteria-icon" aria-hidden="true">📅</span>
              <span className="criteria-text">{thresholds.age}</span>
            </li>
            <li>
              <span className="criteria-icon" aria-hidden="true">🔗</span>
              <span className="criteria-text">{thresholds.overlap}</span>
            </li>
          </ul>
        </div>

        <div className="methodology-section">
          <h4 className="section-title">Méthode de Calcul</h4>
          <ol className="calculation-steps">
            <li>
              Identification du panier de produits communs à tous les territoires
            </li>
            <li>
              Calcul du prix moyen par produit pour chaque territoire
            </li>
            <li>
              Calcul du prix moyen du panier complet par territoire
            </li>
            <li>
              Classement ordinal par prix moyen croissant (du moins cher au plus cher)
            </li>
          </ol>
        </div>

        <div className="methodology-section methodology-limitations">
          <h4 className="section-title">Limites de l'Analyse</h4>
          <ul className="limitations-list">
            <li>
              Le classement ne prend <strong>pas en compte</strong> les différences
              de revenus, de coûts de la vie, ou de contextes économiques locaux
            </li>
            <li>
              Le classement se base uniquement sur un <strong>panier de produits communs</strong>,
              qui peut ne pas représenter l'ensemble du marché
            </li>
            <li>
              Les prix observés peuvent varier selon les enseignes, les promotions,
              et les périodes d'observation
            </li>
            <li>
              Ce classement est <strong>descriptif</strong>, pas prescriptif.
              Il ne recommande aucune action commerciale ou politique
            </li>
          </ul>
        </div>

        {!compact && (
          <div className="methodology-section methodology-sources">
            <h4 className="section-title">Sources de Données</h4>
            <p className="section-text">
              Données issues exclusivement de sources publiques officielles :
            </p>
            <ul className="sources-list">
              <li>Observatoire des Prix et des Marges (OPMR)</li>
              <li>Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes (DGCCRF)</li>
              <li>Institut National de la Statistique et des Études Économiques (INSEE)</li>
              <li>Observations citoyennes validées</li>
            </ul>
          </div>
        )}

        <div className="methodology-disclaimer">
          <p>
            ⚠️ <strong>Avertissement :</strong> Ce classement est fourni à titre informatif uniquement.
            Il ne constitue ni un conseil d'achat, ni une recommandation commerciale,
            ni une analyse économique complète. Pour toute décision économique ou politique,
            consulter des sources officielles et des experts qualifiés.
          </p>
        </div>
      </div>

      <style>{`
        .territory-ranking-methodology {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          color: #f1f5f9;
        }

        .methodology-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(51, 65, 85, 0.5);
        }

        .methodology-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0 0 0.5rem 0;
        }

        .methodology-subtitle {
          font-size: 0.95rem;
          color: #cbd5e1;
          margin: 0;
          font-weight: 500;
        }

        .methodology-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .methodology-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0;
        }

        .criteria-list,
        .limitations-list,
        .sources-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .criteria-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: #cbd5e1;
          padding: 0.5rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 6px;
        }

        .criteria-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .criteria-text {
          flex: 1;
        }

        .calculation-steps {
          list-style: none;
          counter-reset: step-counter;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .calculation-steps li {
          counter-increment: step-counter;
          position: relative;
          padding-left: 2.5rem;
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .calculation-steps li::before {
          content: counter(step-counter);
          position: absolute;
          left: 0;
          top: 0;
          width: 1.75rem;
          height: 1.75rem;
          background: rgba(59, 130, 246, 0.2);
          border: 2px solid rgba(59, 130, 246, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85rem;
          color: #93c5fd;
        }

        .limitations-list li,
        .sources-list li {
          font-size: 0.9rem;
          color: #cbd5e1;
          padding-left: 1.25rem;
          position: relative;
          line-height: 1.5;
        }

        .limitations-list li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #f59e0b;
        }

        .sources-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #3b82f6;
        }

        .methodology-limitations {
          background: rgba(59, 130, 246, 0.05);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .methodology-sources {
          background: rgba(16, 185, 129, 0.05);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .methodology-disclaimer {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 8px;
          padding: 1rem;
        }

        .methodology-disclaimer p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #fbbf24;
        }

        @media (max-width: 768px) {
          .territory-ranking-methodology {
            padding: 1rem;
          }

          .methodology-title {
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 0.95rem;
          }

          .section-text,
          .criteria-list li,
          .calculation-steps li,
          .limitations-list li,
          .sources-list li {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TerritoryRankingMethodology;
