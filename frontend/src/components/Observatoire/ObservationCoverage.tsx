import React from 'react';
import {
  computeObservationLevel,
  getObservationLevelInfo,
  type ObservationLevel,
} from '../../utils/observationThresholds';

/**
 * Props for ObservationCoverage component
 */
export type ObservationCoverageProps = {
  used: number; // Number of observations actually used
  max: number; // Maximum observations possible/available
};

/**
 * ObservationCoverage Component
 * 
 * Displays observation volume coverage in a neutral, legally-safe manner
 * - No value judgments (no "good/bad", "sufficient/insufficient")
 * - No store comparisons
 * - Descriptive terminology only
 * - Legal disclaimer included
 * 
 * @param {ObservationCoverageProps} props - Component properties
 */
const ObservationCoverage: React.FC<ObservationCoverageProps> = ({ used, max }) => {
  // Calculate coverage percentage
  const coveragePercentage = max > 0 ? (used / max) * 100 : 0;

  // Compute observation level
  const observationLevel: ObservationLevel = computeObservationLevel(used);
  const levelInfo = getObservationLevelInfo(observationLevel);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Couverture des observations
        </h3>

        {/* Observation Counts */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-baseline justify-center space-x-2">
            <span className="text-4xl font-bold text-gray-900">
              {used.toLocaleString('fr-FR')}
            </span>
            <span className="text-2xl text-gray-500">/</span>
            <span className="text-2xl font-semibold text-gray-600">
              {max.toLocaleString('fr-FR')}
            </span>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            observations disponibles
          </p>
        </div>

        {/* Observation Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Niveau de couverture
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-300">
              {levelInfo.label}
            </span>
          </div>
          <p className="text-xs text-gray-600">{levelInfo.description}</p>
        </div>

        {/* Progress Bar - Neutral Gray */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Taux de couverture</span>
            <span className="text-xs font-semibold text-gray-900">
              {coveragePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gray-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, coveragePercentage)}%` }}
            />
          </div>
        </div>

        {/* Threshold Reference */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            <strong>Seuils de référence :</strong> Minimal (&lt;10), Faible (&lt;25), 
            Modéré (&lt;50), Fort (&lt;100), Maximal (≥100)
          </p>
        </div>
      </div>

      {/* Mandatory Legal Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-2xl">⚖️</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-yellow-900 mb-2">
              Avertissement explicatif
            </p>
            <p className="text-sm text-yellow-800">
              Le niveau de couverture indique uniquement le <strong>volume de données observées
              disponibles</strong>. Il ne constitue ni une évaluation des prix, ni une comparaison
              entre enseignes, ni un jugement sur la qualité ou la représentativité des données.
              Ce niveau est descriptif et ne doit pas être interprété comme une recommandation
              ou une qualification.
            </p>
          </div>
        </div>
      </div>

      {/* Methodological Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-700">
          <strong>Note méthodologique :</strong> Les seuils utilisés (10, 25, 50, 100, 150)
          sont fixes, déterministes et auditables. Ils servent uniquement à qualifier le
          volume de données, sans aucune pondération cachée ni calcul interprétatif.
        </p>
      </div>
    </div>
  );
};

export default ObservationCoverage;
