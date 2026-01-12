/**
 * Examples for FramedInterpretation Component (Module F)
 */

import React from 'react';
import FramedInterpretation, {
  calculateBasicStats,
  type InterpretationData,
} from './FramedInterpretation';

/**
 * Example 1: Stable prices with low dispersion
 */
export function Example1_StablePrices() {
  const data: InterpretationData = {
    trend: 'stable',
    dispersion: 'faible',
    variability: 'stable',
    observations: 42,
    period: 'Janvier 2026',
    hasAnomaly: false,
  };
  
  return (
    <FramedInterpretation
      data={data}
      scope="le périmètre sélectionné"
    />
  );
}

/**
 * Example 2: Rising prices with moderate dispersion
 */
export function Example2_RisingPrices() {
  const data: InterpretationData = {
    trend: 'hausse',
    dispersion: 'modérée',
    variability: 'variable',
    observations: 67,
    period: 'Décembre 2025 - Janvier 2026',
    hasAnomaly: false,
  };
  
  return (
    <FramedInterpretation
      data={data}
      scope="Guadeloupe - Produits essentiels"
    />
  );
}

/**
 * Example 3: Falling prices with anomaly detected
 */
export function Example3_FallingWithAnomaly() {
  const data: InterpretationData = {
    trend: 'baisse',
    dispersion: 'forte',
    variability: 'très variable',
    observations: 89,
    period: 'Dernier trimestre 2025',
    hasAnomaly: true,
  };
  
  return (
    <FramedInterpretation
      data={data}
      scope="Martinique - Riz 1kg"
    />
  );
}

/**
 * Example 4: Hide methodology section
 */
export function Example4_NoMethodology() {
  const data: InterpretationData = {
    trend: 'stable',
    dispersion: 'modérée',
    variability: 'stable',
    observations: 54,
    period: 'Janvier 2026',
    hasAnomaly: false,
  };
  
  return (
    <FramedInterpretation
      data={data}
      scope="le périmètre sélectionné"
      showMethodology={false}
    />
  );
}

/**
 * Example 5: Using calculateBasicStats helper
 */
export function Example5_AutoCalculated() {
  // Sample price data
  const prices = [1.89, 1.92, 1.95, 1.98, 2.05, 2.12, 2.15];
  
  // Calculate statistics automatically
  const stats = calculateBasicStats(prices);
  
  const data: InterpretationData = {
    ...stats,
    observations: prices.length,
    period: 'Semaine du 6 au 12 janvier 2026',
  };
  
  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm">
        <p className="font-medium">Sample prices:</p>
        <p className="text-gray-600 mt-1">
          {prices.map((p) => `€${p.toFixed(2)}`).join(', ')}
        </p>
      </div>
      
      <FramedInterpretation
        data={data}
        scope="Guadeloupe - Carrefour - Riz 1kg"
      />
    </div>
  );
}

/**
 * Example 6: High variability scenario
 */
export function Example6_HighVariability() {
  const data: InterpretationData = {
    trend: 'stable',
    dispersion: 'forte',
    variability: 'très variable',
    observations: 125,
    period: 'Dernier semestre 2025',
    hasAnomaly: true,
  };
  
  return (
    <FramedInterpretation
      data={data}
      scope="Réunion - Tous produits"
    />
  );
}

/**
 * Example 7: Comparison of different scenarios
 */
export function Example7_MultipleScenarios() {
  const scenarios: Array<{
    title: string;
    data: InterpretationData;
    scope: string;
  }> = [
    {
      title: 'Scenario 1: Stable Market',
      data: {
        trend: 'stable',
        dispersion: 'faible',
        variability: 'stable',
        observations: 45,
        period: 'Janvier 2026',
        hasAnomaly: false,
      },
      scope: 'Guadeloupe',
    },
    {
      title: 'Scenario 2: Volatile Market',
      data: {
        trend: 'hausse',
        dispersion: 'forte',
        variability: 'très variable',
        observations: 78,
        period: 'Janvier 2026',
        hasAnomaly: true,
      },
      scope: 'Martinique',
    },
  ];
  
  return (
    <div className="space-y-6">
      {scenarios.map((scenario, index) => (
        <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
          <h3 className="text-base font-medium text-gray-900 mb-3">
            {scenario.title}
          </h3>
          <FramedInterpretation
            data={scenario.data}
            scope={scenario.scope}
            showMethodology={index === 0} // Only show methodology once
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Example 8: Integration with other components
 */
export function Example8_IntegratedView() {
  const prices = [1.85, 1.88, 1.92, 1.89, 1.95, 2.01];
  const stats = calculateBasicStats(prices);
  
  const data: InterpretationData = {
    ...stats,
    observations: prices.length,
    period: 'Dernière semaine',
  };
  
  return (
    <div className="space-y-4">
      {/* Raw data display */}
      <div className="p-4 bg-white border border-gray-200 rounded">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Données brutes
        </h3>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-gray-600">Prix minimum :</dt>
            <dd className="font-medium">€{Math.min(...prices).toFixed(2)}</dd>
          </div>
          <div>
            <dt className="text-gray-600">Prix maximum :</dt>
            <dd className="font-medium">€{Math.max(...prices).toFixed(2)}</dd>
          </div>
        </dl>
      </div>
      
      {/* Interpretation */}
      <FramedInterpretation
        data={data}
        scope="le périmètre sélectionné"
      />
    </div>
  );
}
