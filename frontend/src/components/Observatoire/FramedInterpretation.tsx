/**
 * FramedInterpretation Component
 * 
 * Module F - Framed Automatic Interpretation
 * 
 * Helps users understand data without judging.
 * 
 * Authorized interpretations:
 * ✔ Trend (increase / decrease / stable)
 * ✔ Price dispersion
 * ✔ Temporal variability
 * ✔ Intra-perimeter comparison only
 * 
 * Prohibited interpretations:
 * ❌ "Best store"
 * ❌ "Cheaper than"
 * ❌ "Recommended"
 * ❌ "Good deal"
 */

import React from 'react';

export type TrendType = 'hausse' | 'baisse' | 'stable';
export type DispersionLevel = 'faible' | 'modérée' | 'forte';
export type VariabilityLevel = 'stable' | 'variable' | 'très variable';

export type InterpretationData = {
  trend: TrendType;
  dispersion: DispersionLevel;
  variability: VariabilityLevel;
  observations: number;
  period: string;
  hasAnomaly: boolean;
};

export type FramedInterpretationProps = {
  data: InterpretationData;
  scope: string; // e.g., "périmètre sélectionné", "Guadeloupe - Carrefour"
  showMethodology?: boolean;
};

/**
 * Generate neutral interpretation text based on data
 * 
 * Rules:
 * - Descriptive only
 * - No value judgments
 * - No recommendations
 * - No comparative adjectives (better/worse)
 */
function generateInterpretationText(
  data: InterpretationData,
  scope: string
): string {
  const { trend, dispersion, variability, hasAnomaly } = data;
  
  // Trend description
  const trendText = {
    hausse: 'une tendance à la hausse',
    baisse: 'une tendance à la baisse',
    stable: 'une stabilité',
  }[trend];
  
  // Dispersion description
  const dispersionText = {
    faible: 'une variation faible',
    modérée: 'une variation modérée',
    forte: 'une forte variation',
  }[dispersion];
  
  // Anomaly statement
  const anomalyText = hasAnomaly
    ? 'Une anomalie statistique a été détectée sur la période analysée.'
    : 'Aucune anomalie statistique significative n\'a été détectée sur la période analysée.';
  
  return `Sur ${scope}, les prix observés présentent ${trendText} et ${dispersionText}. ${anomalyText}`;
}

/**
 * Framed interpretation component with methodology transparency
 * 
 * Features:
 * - Neutral descriptive text
 * - Visible methodology
 * - No decision-making AI
 * - No recommendations
 * - Compatible with public observatory
 */
export default function FramedInterpretation({
  data,
  scope,
  showMethodology = true,
}: FramedInterpretationProps) {
  const interpretationText = generateInterpretationText(data, scope);
  
  return (
    <div className="space-y-4">
      {/* Main interpretation */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Analyse descriptive
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {interpretationText}
        </p>
        
        {/* Context information */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <dl className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <dt className="font-medium">Période analysée :</dt>
              <dd>{data.period}</dd>
            </div>
            <div>
              <dt className="font-medium">Observations :</dt>
              <dd>{data.observations}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Methodology transparency */}
      {showMethodology && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-xs font-medium text-gray-900 mb-2">
            Méthodologie (obligatoire)
          </h4>
          <div className="text-xs text-gray-600 space-y-2">
            <p>Analyse basée sur :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Régression linéaire simple</li>
              <li>Écart-type</li>
              <li>Nombre d'observations</li>
            </ul>
            <p className="font-medium mt-3">Limites :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Aucun modèle prédictif</li>
              <li>Aucune IA décisionnelle</li>
              <li>Interprétation descriptive uniquement</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Legal disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900">
        <p className="font-medium mb-1">Avertissement :</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Cette analyse est purement descriptive</li>
          <li>Elle ne constitue ni une recommandation ni un conseil</li>
          <li>Elle ne compare pas les enseignes entre elles</li>
          <li>Elle ne peut servir de base contractuelle</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Simple helper to calculate basic statistics
 * (for demonstration purposes - replace with actual implementation)
 */
export function calculateBasicStats(prices: number[]): {
  trend: TrendType;
  dispersion: DispersionLevel;
  variability: VariabilityLevel;
  hasAnomaly: boolean;
} {
  if (prices.length < 2) {
    return {
      trend: 'stable',
      dispersion: 'faible',
      variability: 'stable',
      hasAnomaly: false,
    };
  }
  
  // Simple trend calculation (first vs last)
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  const trend: TrendType =
    change > 5 ? 'hausse' : change < -5 ? 'baisse' : 'stable';
  
  // Simple dispersion (coefficient of variation)
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance =
    prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) /
    prices.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100;
  
  const dispersion: DispersionLevel =
    cv > 20 ? 'forte' : cv > 10 ? 'modérée' : 'faible';
  
  // Simple variability (consecutive changes)
  const changes = prices.slice(1).map((price, i) =>
    Math.abs((price - prices[i]) / prices[i])
  );
  const avgChange =
    changes.reduce((a, b) => a + b, 0) / changes.length;
  
  const variability: VariabilityLevel =
    avgChange > 0.15
      ? 'très variable'
      : avgChange > 0.05
      ? 'variable'
      : 'stable';
  
  // Simple anomaly detection (price more than 2 std devs from mean)
  const hasAnomaly = prices.some(
    (price) => Math.abs(price - mean) > 2 * stdDev
  );
  
  return { trend, dispersion, variability, hasAnomaly };
}
