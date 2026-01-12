/**
 * Module E - Observation Reliability Display Component
 * 
 * Purpose: Display transparent, explainable reliability scores
 * 
 * Constraints:
 * - NO store rankings or recommendations
 * - NO badges or color-coded incentives
 * - NO commercial or predictive logic
 * - Read-only factual display
 * - Full methodology transparency
 */

import React, { useState } from 'react';
import type { ReceiptData } from '../Receipt/types';
import {
  calculateReliabilityScore,
  getReliabilityLevelLabel,
  getReliabilityLevelDescription,
  getMethodologyExplanation,
  type ReliabilityScore,
} from '../../utils/observationReliability';

export interface ObservationReliabilityProps {
  observations: ReceiptData[];
  excludePromotional?: boolean;
  showMethodology?: boolean;
  className?: string;
}

/**
 * ObservationReliability Component
 * 
 * Displays reliability analysis in a strictly neutral, read-only manner
 * All calculations are transparent and auditable
 */
export const ObservationReliability: React.FC<ObservationReliabilityProps> = ({
  observations,
  excludePromotional = true,
  showMethodology = false,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  
  const score = calculateReliabilityScore(observations, excludePromotional);
  const methodology = getMethodologyExplanation();
  
  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Niveau de fiabilité des observations
        </h3>
        {showMethodology && (
          <button
            onClick={() => setShowMethodologyModal(!showMethodologyModal)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            type="button"
          >
            Méthodologie
          </button>
        )}
      </div>
      
      {/* Warning if promotional observations excluded */}
      {score.excludedPromotional && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ Les observations promotionnelles ont été exclues de l'analyse pour préserver la cohérence des prix standards.
          </p>
        </div>
      )}
      
      {/* Main Score Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">Score de fiabilité</span>
          <span className="text-2xl font-bold text-gray-900">
            {score.total}/100
          </span>
        </div>
        
        {/* Score bar (neutral gray) */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gray-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${score.total}%` }}
          />
        </div>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">{getReliabilityLevelLabel(score.level)}</span>
          {' - '}
          <span>{getReliabilityLevelDescription(score.level)}</span>
        </div>
      </div>
      
      {/* Analysis Status */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
        <p className="text-sm text-gray-700">
          {score.canUseForAnalysis ? (
            <>
              ✓ Les données atteignent le seuil minimal pour une analyse statistique
            </>
          ) : (
            <>
              ✗ Volume de données insuffisant pour une analyse statistique fiable
            </>
          )}
        </p>
      </div>
      
      {/* Component Breakdown Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-left text-sm text-gray-700 hover:text-gray-900 flex items-center justify-between py-2 border-t border-gray-200"
        type="button"
      >
        <span className="font-medium">Détail des composantes</span>
        <span>{showDetails ? '▲' : '▼'}</span>
      </button>
      
      {/* Component Details */}
      {showDetails && (
        <div className="mt-4 space-y-3">
          {/* Volume Score */}
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Volume d'observations
              </span>
              <span className="text-sm font-bold text-gray-900">
                {score.components.volumeScore}/100
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Basé sur {observations.length} observation{observations.length > 1 ? 's' : ''} disponible{observations.length > 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Source Score */}
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Crédibilité des sources
              </span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(score.components.sourceScore)}/100
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Types de sources : tickets de caisse, étiquettes rayon
            </p>
          </div>
          
          {/* Freshness Score */}
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Fraîcheur des données
              </span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(score.components.freshnessScore)}/100
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Les observations récentes ont un score plus élevé
            </p>
          </div>
          
          {/* Dispersion Score */}
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Cohérence des prix
              </span>
              <span className="text-sm font-bold text-gray-900">
                {score.components.dispersionScore > 0 
                  ? `${Math.round(score.components.dispersionScore)}/100` 
                  : 'N/A'}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {score.components.dispersionScore > 0
                ? 'Calculé à partir de la dispersion des prix observés'
                : 'Non calculé (minimum 5 observations requises)'}
            </p>
          </div>
        </div>
      )}
      
      {/* Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {methodology.title}
              </h2>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                type="button"
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-700 mb-6">
              {methodology.description}
            </p>
            
            <div className="space-y-4">
              {methodology.components.map((component, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {component.name}
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
                      Poids : {Math.round(component.weight * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {component.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Transparence totale :</strong> Cette méthodologie est publique, 
                auditable et sans logique commerciale ou prédictive. Le calcul est 
                déterministe et identique pour tous les utilisateurs.
              </p>
            </div>
            
            <button
              onClick={() => setShowMethodologyModal(false)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              type="button"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationReliability;
