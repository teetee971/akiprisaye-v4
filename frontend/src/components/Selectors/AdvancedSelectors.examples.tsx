/**
 * Example Usage of AdvancedSelectors Component
 * 
 * Demonstrates cascading Territory → Store → Product selection
 * with legal neutrality and no comparisons
 */

import React, { useState, useEffect } from 'react';
import AdvancedSelectors, { type Dataset, type Selection } from './AdvancedSelectors';

/**
 * Example 1: Basic Usage with Local Dataset
 */
export const ExampleBasicUsage = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [selection, setSelection] = useState<Selection>({});

  useEffect(() => {
    // Load dataset from public folder
    fetch('/data/prices-dataset.json')
      .then((res) => res.json())
      .then((data) => setDataset(data))
      .catch((err) => console.error('Error loading dataset:', err));
  }, []);

  const handleSelectionChange = (newSelection: Selection) => {
    setSelection(newSelection);
    console.log('Selection changed:', newSelection);
  };

  if (!dataset) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdvancedSelectors
        dataset={dataset}
        onSelectionChange={handleSelectionChange}
      />

      {/* Display current selection */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Selection:</h3>
        <pre className="text-sm">{JSON.stringify(selection, null, 2)}</pre>
      </div>
    </div>
  );
};

/**
 * Example 2: With Initial Selection
 */
export const ExampleWithInitialSelection = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    fetch('/data/prices-dataset.json')
      .then((res) => res.json())
      .then((data) => setDataset(data));
  }, []);

  if (!dataset) return <div>Loading...</div>;

  return (
    <AdvancedSelectors
      dataset={dataset}
      onSelectionChange={(selection) => {
        console.log('Selection:', selection);
      }}
      initialSelection={{
        territory: 'GP',
        store: 'carrefour_gp',
        product: 'riz_1kg',
      }}
    />
  );
};

/**
 * Example 3: Integration with Interpretation Generator
 */
export const ExampleWithInterpretation = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [selection, setSelection] = useState<Selection>({});
  const [interpretation, setInterpretation] = useState<string>('');

  useEffect(() => {
    fetch('/data/prices-dataset.json')
      .then((res) => res.json())
      .then((data) => setDataset(data));
  }, []);

  const handleSelectionChange = async (newSelection: Selection) => {
    setSelection(newSelection);

    // If product selected, generate interpretation
    if (newSelection.territory && newSelection.store && newSelection.product) {
      // Find selected product details
      const territory = dataset?.territories.find((t) => t.code === newSelection.territory);
      const store = territory?.stores.find((s) => s.id === newSelection.store);
      const product = store?.products.find((p) => p.id === newSelection.product);

      if (product) {
        // Calculate dispersion from price range
        const priceRange = product.price_max - product.price_min;
        const avgPrice = (product.price_max + product.price_min) / 2;
        const dispersionIndex = Math.min(100, (priceRange / avgPrice) * 100);

        // Call interpretation API (example)
        try {
          const response = await fetch('/api/v1/analysis/interpretation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              observationsUsed: product.observations,
              observationsMax: 100,
              territoriesCovered: 1,
              dispersionIndex,
              method: 'full',
            }),
          });

          const result = await response.json();
          setInterpretation(result.interpretation);
        } catch (error) {
          console.error('Error generating interpretation:', error);
        }
      }
    }
  };

  if (!dataset) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <AdvancedSelectors dataset={dataset} onSelectionChange={handleSelectionChange} />

      {interpretation && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🧠 Interprétation statistique
          </h3>
          <p className="text-sm text-gray-700">{interpretation}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Example 4: Read-Only Mode (Display Only)
 */
export const ExampleReadOnly = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    fetch('/data/prices-dataset.json')
      .then((res) => res.json())
      .then((data) => setDataset(data));
  }, []);

  if (!dataset) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-900">
          <strong>Mode lecture seule :</strong> Les sélections sont effectuées mais aucune
          action n'est déclenchée.
        </p>
      </div>

      <AdvancedSelectors
        dataset={dataset}
        onSelectionChange={(selection) => {
          // Read-only: just log, don't trigger actions
          console.log('Read-only selection:', selection);
        }}
      />
    </div>
  );
};

/**
 * Example 5: Multi-Territory Comparison (Descriptive Only)
 */
export const ExampleMultiTerritoryView = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [selections, setSelections] = useState<Selection[]>([]);

  useEffect(() => {
    fetch('/data/prices-dataset.json')
      .then((res) => res.json())
      .then((data) => setDataset(data));
  }, []);

  const addSelection = () => {
    setSelections([...selections, {}]);
  };

  const updateSelection = (index: number, newSelection: Selection) => {
    const updated = [...selections];
    updated[index] = newSelection;
    setSelections(updated);
  };

  if (!dataset) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={addSelection}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ajouter un territoire
      </button>

      {selections.map((selection, index) => (
        <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-4">Sélection {index + 1}</h3>
          <AdvancedSelectors
            dataset={dataset}
            onSelectionChange={(newSelection) => updateSelection(index, newSelection)}
            initialSelection={selection}
          />
        </div>
      ))}

      {selections.length > 1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-sm text-yellow-900">
            <strong>Note :</strong> L'affichage de plusieurs territoires permet une consultation
            parallèle. Aucune comparaison automatique n'est effectuée entre les sélections.
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Usage Instructions:
 * 
 * 1. Import the component:
 *    import AdvancedSelectors from '@/components/Selectors/AdvancedSelectors';
 * 
 * 2. Load your dataset:
 *    const dataset = await fetch('/data/prices-dataset.json').then(r => r.json());
 * 
 * 3. Use the component:
 *    <AdvancedSelectors
 *      dataset={dataset}
 *      onSelectionChange={(selection) => {
 *        console.log('Territory:', selection.territory);
 *        console.log('Store:', selection.store);
 *        console.log('Product:', selection.product);
 *      }}
 *    />
 * 
 * 4. Key Features:
 *    - Cascading selection (Territory → Store → Product)
 *    - Automatic reset on parent change
 *    - Disabled states for dependent selectors
 *    - Legal disclaimers included
 *    - No comparisons or rankings
 * 
 * 5. Integration Points:
 *    - Connect to generateNeutralInterpretation for analysis
 *    - Use with AnalyseStatistiqueNeutre for display
 *    - Link to Panier Anti-Crise for basket management
 *    - Export data for open-data/institutional use
 */
