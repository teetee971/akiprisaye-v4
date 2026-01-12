/**
 * Example Usage of ObservationCoverage Component
 * 
 * Demonstrates neutral observation volume display
 * with no value judgments or comparisons
 */

import React from 'react';
import ObservationCoverage from './ObservationCoverage';

/**
 * Example 1: Minimal Coverage
 */
export const ExampleMinimalCoverage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Minimal Coverage</h2>
      <ObservationCoverage used={8} max={150} />
    </div>
  );
};

/**
 * Example 2: Faible Coverage
 */
export const ExampleFaibleCoverage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Faible Coverage</h2>
      <ObservationCoverage used={18} max={150} />
    </div>
  );
};

/**
 * Example 3: Modéré Coverage
 */
export const ExampleModereCoverage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Modéré Coverage</h2>
      <ObservationCoverage used={42} max={120} />
    </div>
  );
};

/**
 * Example 4: Fort Coverage
 */
export const ExampleFortCoverage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Fort Coverage</h2>
      <ObservationCoverage used={87} max={200} />
    </div>
  );
};

/**
 * Example 5: Maximal Coverage
 */
export const ExampleMaximalCoverage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Maximal Coverage</h2>
      <ObservationCoverage used={175} max={200} />
    </div>
  );
};

/**
 * Example 6: Integration with AdvancedSelectors
 */
export const ExampleWithSelectors = () => {
  const [selection, setSelection] = React.useState<any>({});
  const [productData, setProductData] = React.useState<any>(null);

  // Simulate fetching product data based on selection
  React.useEffect(() => {
    if (selection.product) {
      // In real app, fetch from dataset based on selection
      setProductData({
        observations: 42,
        maxPossible: 120,
      });
    }
  }, [selection]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Example: Integration with Selectors</h2>
      
      {/* AdvancedSelectors would go here */}
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-sm text-gray-600">
          [AdvancedSelectors component would be here]
        </p>
      </div>

      {productData && (
        <ObservationCoverage
          used={productData.observations}
          max={productData.maxPossible}
        />
      )}
    </div>
  );
};

/**
 * Example 7: Integration with AnalyseStatistiqueNeutre
 */
export const ExampleWithInterpretation = () => {
  const observationData = {
    used: 87,
    max: 150,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Example: With Statistical Interpretation</h2>

      {/* Observation Coverage */}
      <ObservationCoverage used={observationData.used} max={observationData.max} />

      {/* Statistical Interpretation would follow */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note :</strong> La couverture des observations ("Fort" dans ce cas) 
          contextualize l'interprétation statistique qui suivra. Un volume fort permet
          une analyse plus détaillée, sans pour autant garantir l'exhaustivité.
        </p>
      </div>
    </div>
  );
};

/**
 * Example 8: Real-Time Data Update
 */
export const ExampleRealTimeUpdate = () => {
  const [observations, setObservations] = React.useState({ used: 25, max: 150 });

  const addObservations = (count: number) => {
    setObservations((prev) => ({
      ...prev,
      used: Math.min(prev.max, prev.used + count),
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Example: Real-Time Update</h2>

      <div className="flex space-x-2">
        <button
          onClick={() => addObservations(10)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          +10 observations
        </button>
        <button
          onClick={() => addObservations(25)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          +25 observations
        </button>
        <button
          onClick={() => setObservations({ used: 25, max: 150 })}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset
        </button>
      </div>

      <ObservationCoverage used={observations.used} max={observations.max} />
    </div>
  );
};

/**
 * Usage Instructions:
 * 
 * 1. Import the component:
 *    import ObservationCoverage from '@/components/Observatoire/ObservationCoverage';
 * 
 * 2. Use with your data:
 *    <ObservationCoverage used={42} max={120} />
 * 
 * 3. Key Features:
 *    - Neutral gray progress bar (no green/red)
 *    - Descriptive levels: Minimal/Faible/Modéré/Fort/Maximal
 *    - No value judgments ("good" vs "bad")
 *    - Legal disclaimer included automatically
 *    - Fixed, auditable thresholds
 * 
 * 4. Integration Points:
 *    - Use with AdvancedSelectors to show product observation coverage
 *    - Combine with generateNeutralInterpretation for context
 *    - Display with AnalyseStatistiqueNeutre for complete analysis
 *    - Link to backend for real-time observation counts
 * 
 * 5. Prohibited Uses:
 *    - DO NOT add color coding (green/red) based on level
 *    - DO NOT compare coverage between stores
 *    - DO NOT use as quality indicator
 *    - DO NOT make recommendations based on coverage level
 */
