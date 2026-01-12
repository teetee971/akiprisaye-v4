/**
 * Example Usage of InterpretationAutomatique Component
 * 
 * Demonstrates automatic neutral interpretation generation
 * based on fixed texts per observation level
 */

import React from 'react';
import InterpretationAutomatique from './InterpretationAutomatique';
import ObservationCoverage from './ObservationCoverage';
import { computeObservationLevel } from '../../utils/observationThresholds';

/**
 * Example 1: Minimal Level
 */
export const ExampleMinimalInterpretation = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Minimal Level</h2>
      <InterpretationAutomatique
        level="minimal"
        used={8}
        max={150}
        scopeLabel="produit"
      />
    </div>
  );
};

/**
 * Example 2: Faible Level
 */
export const ExampleFaibleInterpretation = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Faible Level</h2>
      <InterpretationAutomatique
        level="faible"
        used={18}
        max={150}
        scopeLabel="magasin"
      />
    </div>
  );
};

/**
 * Example 3: Modéré Level
 */
export const ExampleModereInterpretation = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Modéré Level</h2>
      <InterpretationAutomatique
        level="modéré"
        used={42}
        max={120}
        scopeLabel="territoire"
      />
    </div>
  );
};

/**
 * Example 4: Fort Level
 */
export const ExampleFortInterpretation = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Fort Level</h2>
      <InterpretationAutomatique
        level="fort"
        used={87}
        max={150}
        scopeLabel="multi-territoires"
      />
    </div>
  );
};

/**
 * Example 5: Maximal Level
 */
export const ExampleMaximalInterpretation = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Example: Maximal Level</h2>
      <InterpretationAutomatique
        level="maximal"
        used={175}
        max={200}
        scopeLabel="ensemble des données"
      />
    </div>
  );
};

/**
 * Example 6: Integration with ObservationCoverage
 */
export const ExampleWithCoverage = () => {
  const observationData = {
    used: 42,
    max: 120,
  };

  // Compute level automatically
  const level = computeObservationLevel(observationData.used);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Example: With Observation Coverage</h2>

      {/* Show coverage first */}
      <ObservationCoverage used={observationData.used} max={observationData.max} />

      {/* Then show automatic interpretation */}
      <InterpretationAutomatique
        level={level}
        used={observationData.used}
        max={observationData.max}
        scopeLabel="produit"
      />
    </div>
  );
};

/**
 * Example 7: Complete Integration Chain
 */
export const ExampleCompleteChain = () => {
  const [selection, setSelection] = React.useState<any>({});
  const [observationData, setObservationData] = React.useState<any>(null);

  // Simulate data loading based on selection
  React.useEffect(() => {
    if (selection.product) {
      // In real app, fetch from dataset
      setObservationData({
        used: 42,
        max: 120,
        scopeLabel: 'produit',
      });
    }
  }, [selection]);

  if (!observationData) {
    return (
      <div className="bg-gray-100 p-8 rounded text-center">
        <p className="text-gray-600">Sélectionnez un produit pour voir l'interprétation</p>
      </div>
    );
  }

  const level = computeObservationLevel(observationData.used);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Example: Complete Integration</h2>

      {/* Selection Component would go here */}
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-sm text-gray-600">[AdvancedSelectors component]</p>
      </div>

      {/* Coverage Display */}
      <ObservationCoverage used={observationData.used} max={observationData.max} />

      {/* Automatic Interpretation */}
      <InterpretationAutomatique
        level={level}
        used={observationData.used}
        max={observationData.max}
        scopeLabel={observationData.scopeLabel}
      />
    </div>
  );
};

/**
 * Example 8: All Levels Comparison (for documentation)
 */
export const ExampleAllLevels = () => {
  const levels: Array<{ level: ObservationLevel; used: number; max: number }> = [
    { level: 'minimal', used: 8, max: 150 },
    { level: 'faible', used: 18, max: 150 },
    { level: 'modéré', used: 42, max: 150 },
    { level: 'fort', used: 87, max: 150 },
    { level: 'maximal', used: 175, max: 200 },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Example: All Levels Comparison</h2>
      <p className="text-sm text-gray-600">
        This example shows all 5 interpretation levels side-by-side for comparison.
        Note that each level has a fixed, pre-validated text.
      </p>

      {levels.map(({ level, used, max }) => (
        <div key={level} className="border-2 border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 capitalize">
            Niveau: {level}
          </h3>
          <InterpretationAutomatique
            level={level}
            used={used}
            max={max}
            scopeLabel="produit"
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Example 9: Dynamic Level Computation
 */
export const ExampleDynamicLevel = () => {
  const [observations, setObservations] = React.useState({ used: 25, max: 150 });

  const addObservations = (count: number) => {
    setObservations((prev) => ({
      ...prev,
      used: Math.min(prev.max, prev.used + count),
    }));
  };

  const level = computeObservationLevel(observations.used);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Example: Dynamic Level Computation</h2>

      <div className="flex space-x-2">
        <button
          onClick={() => addObservations(10)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          +10 observations
        </button>
        <button
          onClick={() => addObservations(30)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          +30 observations
        </button>
        <button
          onClick={() => setObservations({ used: 25, max: 150 })}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset
        </button>
      </div>

      <InterpretationAutomatique
        level={level}
        used={observations.used}
        max={observations.max}
        scopeLabel="produit"
      />
    </div>
  );
};

/**
 * Usage Instructions:
 * 
 * 1. Import the component:
 *    import InterpretationAutomatique from '@/components/Observatoire/InterpretationAutomatique';
 * 
 * 2. Compute observation level:
 *    import { computeObservationLevel } from '@/utils/observationThresholds';
 *    const level = computeObservationLevel(observationCount);
 * 
 * 3. Use the component:
 *    <InterpretationAutomatique
 *      level={level}
 *      used={42}
 *      max={120}
 *      scopeLabel="produit"
 *    />
 * 
 * 4. Key Features:
 *    - Fixed texts per level (no dynamic generation)
 *    - 100% deterministic
 *    - Legal disclaimer included
 *    - Audit-ready
 *    - No value judgments
 * 
 * 5. Integration Points:
 *    - Use after ObservationCoverage
 *    - Combine with AdvancedSelectors
 *    - Link to backend interpretation module
 *    - Display with AnalyseStatistiqueNeutre
 * 
 * 6. Prohibited Additions:
 *    - DO NOT add dynamic text generation
 *    - DO NOT modify fixed texts without legal review
 *    - DO NOT add value judgments
 *    - DO NOT compare stores
 *    - DO NOT make recommendations
 */
