/**
 * PriceStabilityIndicator - Part of Module 14
 * 
 * Displays factual price stability metrics without ratings or value judgments.
 * Replaces star ratings with objective measurements.
 */

import React from 'react';

export interface PriceStabilityIndicatorProps {
  stability: 'faible' | 'modérée' | 'élevée';
  variation: string; // e.g., "±2%"
  observations: number;
  period: string;
}

export const PriceStabilityIndicator: React.FC<PriceStabilityIndicatorProps> = ({
  stability,
  variation,
  observations,
  period,
}) => {
  // Color mapping - descriptive only, no value judgment (green=stable, not "good")
  const stabilityColors = {
    faible: 'text-gray-600 bg-gray-100',
    modérée: 'text-gray-700 bg-gray-200',
    élevée: 'text-gray-800 bg-gray-300',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Indicateurs factuels
      </h4>

      <div className="space-y-3">
        {/* Stability - Descriptive fact, not quality rating */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Stabilité du prix</span>
          <span className={`text-sm font-medium px-3 py-1 rounded ${stabilityColors[stability]}`}>
            {stability}
          </span>
        </div>

        {/* Variation - Raw measurement */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Variation sur {period}</span>
          <span className="text-sm font-medium text-gray-900">{variation}</span>
        </div>

        {/* Observations - Data volume, not popularity */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Nombre d'observations</span>
          <span className="text-sm font-medium text-gray-900">{observations}</span>
        </div>
      </div>

      {/* Methodology note */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Ces indicateurs sont descriptifs et ne constituent ni une évaluation qualitative
          ni une recommandation d'achat.
        </p>
      </div>
    </div>
  );
};

export default PriceStabilityIndicator;
