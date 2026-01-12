/**
 * Territory Ranking Examples - Module F
 * 
 * Example usage scenarios for the TerritoryRanking component
 */

import React, { useState } from 'react';
import { TerritoryRanking } from './TerritoryRanking';
import { TerritoryData } from '../../utils/territoryRankingThresholds';

/**
 * Example 1: Valid ranking with sufficient data
 */
export const ValidRankingExample: React.FC = () => {
  const [advancedMode, setAdvancedMode] = useState(false);

  const territories: TerritoryData[] = [
    {
      code: '971',
      name: 'Guadeloupe',
      observations: 150,
      products: 25,
      stores: 5,
      averagePrice: 125.50,
      lastObservation: new Date('2026-01-10'),
      commonProducts: 20,
    },
    {
      code: '972',
      name: 'Martinique',
      observations: 180,
      products: 28,
      stores: 6,
      averagePrice: 132.75,
      lastObservation: new Date('2026-01-11'),
      commonProducts: 20,
    },
    {
      code: '973',
      name: 'Guyane',
      observations: 120,
      products: 22,
      stores: 4,
      averagePrice: 142.30,
      lastObservation: new Date('2026-01-09'),
      commonProducts: 20,
    },
    {
      code: '974',
      name: 'La Réunion',
      observations: 200,
      products: 30,
      stores: 7,
      averagePrice: 118.90,
      lastObservation: new Date('2026-01-12'),
      commonProducts: 20,
    },
  ];

  return (
    <div>
      <h2>Example 1: Valid Ranking</h2>
      <p>All territories meet the minimum thresholds.</p>
      <TerritoryRanking
        territories={territories}
        advancedAnalysisEnabled={advancedMode}
        showMethodology={true}
        onOptInToggle={setAdvancedMode}
      />
    </div>
  );
};

/**
 * Example 2: Opt-in required
 */
export const OptInRequiredExample: React.FC = () => {
  const [advancedMode, setAdvancedMode] = useState(false);

  const territories: TerritoryData[] = [
    {
      code: '971',
      name: 'Guadeloupe',
      observations: 150,
      products: 25,
      stores: 5,
      averagePrice: 125.50,
      lastObservation: new Date('2026-01-10'),
      commonProducts: 20,
    },
  ];

  return (
    <div>
      <h2>Example 2: Opt-in Required</h2>
      <p>Advanced Analysis mode is disabled by default.</p>
      <TerritoryRanking
        territories={territories}
        advancedAnalysisEnabled={advancedMode}
        showMethodology={true}
        onOptInToggle={setAdvancedMode}
      />
    </div>
  );
};

/**
 * Example 3: Insufficient data
 */
export const InsufficientDataExample: React.FC = () => {
  const [advancedMode, setAdvancedMode] = useState(true);

  const territories: TerritoryData[] = [
    {
      code: '971',
      name: 'Guadeloupe',
      observations: 50, // Below threshold (100)
      products: 8, // Below threshold (10)
      stores: 2, // Below threshold (3)
      averagePrice: 125.50,
      lastObservation: new Date('2026-01-10'),
      commonProducts: 5,
    },
    {
      code: '972',
      name: 'Martinique',
      observations: 180,
      products: 28,
      stores: 6,
      averagePrice: 132.75,
      lastObservation: new Date('2026-01-11'),
      commonProducts: 5,
    },
  ];

  return (
    <div>
      <h2>Example 3: Insufficient Data</h2>
      <p>One territory does not meet minimum thresholds.</p>
      <TerritoryRanking
        territories={territories}
        advancedAnalysisEnabled={advancedMode}
        showMethodology={true}
        onOptInToggle={setAdvancedMode}
      />
    </div>
  );
};

/**
 * Example 4: Too few territories
 */
export const TooFewTerritoriesExample: React.FC = () => {
  const [advancedMode, setAdvancedMode] = useState(true);

  const territories: TerritoryData[] = [
    {
      code: '971',
      name: 'Guadeloupe',
      observations: 150,
      products: 25,
      stores: 5,
      averagePrice: 125.50,
      lastObservation: new Date('2026-01-10'),
      commonProducts: 20,
    },
  ];

  return (
    <div>
      <h2>Example 4: Too Few Territories</h2>
      <p>Only 1 territory provided (minimum 3 required).</p>
      <TerritoryRanking
        territories={territories}
        advancedAnalysisEnabled={advancedMode}
        showMethodology={true}
        onOptInToggle={setAdvancedMode}
      />
    </div>
  );
};

/**
 * Example 5: Old data
 */
export const OldDataExample: React.FC = () => {
  const [advancedMode, setAdvancedMode] = useState(true);

  const territories: TerritoryData[] = [
    {
      code: '971',
      name: 'Guadeloupe',
      observations: 150,
      products: 25,
      stores: 5,
      averagePrice: 125.50,
      lastObservation: new Date('2025-09-01'), // More than 90 days old
      commonProducts: 20,
    },
    {
      code: '972',
      name: 'Martinique',
      observations: 180,
      products: 28,
      stores: 6,
      averagePrice: 132.75,
      lastObservation: new Date('2026-01-11'),
      commonProducts: 20,
    },
    {
      code: '973',
      name: 'Guyane',
      observations: 120,
      products: 22,
      stores: 4,
      averagePrice: 142.30,
      lastObservation: new Date('2026-01-09'),
      commonProducts: 20,
    },
  ];

  return (
    <div>
      <h2>Example 5: Old Data</h2>
      <p>One territory has observations older than 90 days.</p>
      <TerritoryRanking
        territories={territories}
        advancedAnalysisEnabled={advancedMode}
        showMethodology={true}
        onOptInToggle={setAdvancedMode}
      />
    </div>
  );
};

/**
 * Example 6: Without methodology
 */
export const WithoutMethodologyExample: React.FC = () => {
  const [advancedMode, setAdvancedMode] = useState(true);

  const territories: TerritoryData[] = [
    {
      code: '971',
      name: 'Guadeloupe',
      observations: 150,
      products: 25,
      stores: 5,
      averagePrice: 125.50,
      lastObservation: new Date('2026-01-10'),
      commonProducts: 20,
    },
    {
      code: '972',
      name: 'Martinique',
      observations: 180,
      products: 28,
      stores: 6,
      averagePrice: 132.75,
      lastObservation: new Date('2026-01-11'),
      commonProducts: 20,
    },
    {
      code: '974',
      name: 'La Réunion',
      observations: 200,
      products: 30,
      stores: 7,
      averagePrice: 118.90,
      lastObservation: new Date('2026-01-12'),
      commonProducts: 20,
    },
  ];

  return (
    <div>
      <h2>Example 6: Without Methodology</h2>
      <p>Display ranking without methodology section (not recommended).</p>
      <TerritoryRanking
        territories={territories}
        advancedAnalysisEnabled={advancedMode}
        showMethodology={false}
        onOptInToggle={setAdvancedMode}
      />
    </div>
  );
};

/**
 * Example 7: Low product overlap warning
 */
export const LowOverlapExample: React.FC = () => {
  const [advancedMode, setAdvancedMode] = useState(true);

  const territories: TerritoryData[] = [
    {
      code: '971',
      name: 'Guadeloupe',
      observations: 150,
      products: 25,
      stores: 5,
      averagePrice: 125.50,
      lastObservation: new Date('2026-01-10'),
      commonProducts: 8, // Low overlap
    },
    {
      code: '972',
      name: 'Martinique',
      observations: 180,
      products: 28,
      stores: 6,
      averagePrice: 132.75,
      lastObservation: new Date('2026-01-11'),
      commonProducts: 20,
    },
    {
      code: '974',
      name: 'La Réunion',
      observations: 200,
      products: 30,
      stores: 7,
      averagePrice: 118.90,
      lastObservation: new Date('2026-01-12'),
      commonProducts: 18,
    },
  ];

  return (
    <div>
      <h2>Example 7: Low Product Overlap</h2>
      <p>Valid ranking but with warning about low product overlap.</p>
      <TerritoryRanking
        territories={territories}
        advancedAnalysisEnabled={advancedMode}
        showMethodology={true}
        onOptInToggle={setAdvancedMode}
      />
    </div>
  );
};

/**
 * All examples demo page
 */
export const AllExamplesDemo: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Territory Ranking Examples - Module F</h1>
      
      <div style={{ marginBottom: '3rem' }}>
        <ValidRankingExample />
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
        <OptInRequiredExample />
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
        <InsufficientDataExample />
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
        <TooFewTerritoriesExample />
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
        <OldDataExample />
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
        <WithoutMethodologyExample />
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
        <LowOverlapExample />
      </div>
    </div>
  );
};

export default AllExamplesDemo;
