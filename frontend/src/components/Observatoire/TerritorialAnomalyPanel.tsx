/**
 * Territorial Anomaly Panel - Module G
 * 
 * Displays detected territorial anomalies with factual information only.
 * 
 * PRINCIPLES:
 * - Only shown when alert mode is "enabled"
 * - Factual descriptions (NO judgment)
 * - Statistical context provided
 * - NO hierarchy or ranking
 * - NO recommendations
 */

import React from 'react';
import { TerritorialAnomaly } from '../../utils/anomalyAlert.types';
import { getAnomalyTypeLabel } from '../../utils/territorialAnomalyDetection';

export interface TerritorialAnomalyPanelProps {
  /** Detected anomalies */
  anomalies: TerritorialAnomaly[];
  
  /** Custom CSS class name */
  className?: string;
}

/**
 * Territorial Anomaly Panel
 * 
 * Displays list of detected statistical anomalies in factual format.
 * Must only be rendered when alert mode is "enabled".
 */
export function TerritorialAnomalyPanel({
  anomalies,
  className = '',
}: TerritorialAnomalyPanelProps) {
  if (anomalies.length === 0) {
    return (
      <div className={`anomaly-panel anomaly-panel-empty ${className}`}>
        <p className="empty-message">
          Aucune anomalie statistique détectée avec les seuils actuels.
        </p>
        <style>{getStyles()}</style>
      </div>
    );
  }

  return (
    <div className={`anomaly-panel ${className}`}>
      <div className="panel-header">
        <h4 className="panel-title">Alertes statistiques territoriales</h4>
        <p className="panel-subtitle">
          Informations basées exclusivement sur des seuils statistiques publics.
          Aucune interprétation, qualification ou recommandation n'est produite.
        </p>
      </div>

      <div className="anomalies-list">
        {anomalies.map((anomaly, index) => (
          <div
            key={`${anomaly.territoryCode}-${anomaly.anomalyType}-${index}`}
            className="anomaly-item"
          >
            <div className="anomaly-header">
              <span className="territory-name">{anomaly.territoryLabel}</span>
              <span className="anomaly-type">{getAnomalyTypeLabel(anomaly.anomalyType)}</span>
            </div>
            
            <p className="anomaly-description">{anomaly.description}</p>
            
            <div className="anomaly-meta">
              <span className="meta-item">
                Seuil: {anomaly.threshold}
              </span>
              <span className="meta-item">
                Valeur observée: {anomaly.observedValue.toFixed(2)}
              </span>
              <span className="meta-item">
                Détecté le: {anomaly.detectedAt.toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-footer">
        <p className="footer-text">
          Ces alertes sont purement informatives et ne constituent ni un jugement
          ni une recommandation d'action.
        </p>
      </div>

      <style>{getStyles()}</style>
    </div>
  );
}

function getStyles(): string {
  return `
    /* Panel container */
    .anomaly-panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .anomaly-panel-empty {
      text-align: center;
      padding: 2rem;
    }

    .empty-message {
      font-size: 0.95rem;
      color: #64748b;
      margin: 0;
    }

    /* Panel header */
    .panel-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .panel-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .panel-subtitle {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
      font-style: italic;
    }

    /* Anomalies list */
    .anomalies-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .anomaly-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1rem;
    }

    .anomaly-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .territory-name {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .anomaly-type {
      font-size: 0.85rem;
      color: #64748b;
      padding: 0.25rem 0.75rem;
      background: #e2e8f0;
      border-radius: 4px;
    }

    .anomaly-description {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.5;
      margin: 0 0 0.75rem 0;
    }

    .anomaly-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.85rem;
      color: #64748b;
    }

    .meta-item {
      display: flex;
      align-items: center;
    }

    /* Panel footer */
    .panel-footer {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
      font-style: italic;
      text-align: center;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .anomaly-panel {
        padding: 1rem;
      }

      .panel-title {
        font-size: 1rem;
      }

      .panel-subtitle,
      .anomaly-description,
      .footer-text {
        font-size: 0.875rem;
      }

      .anomaly-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .anomaly-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `;
}

export default TerritorialAnomalyPanel;
