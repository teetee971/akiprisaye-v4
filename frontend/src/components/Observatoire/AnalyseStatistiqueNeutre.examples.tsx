/**
 * Example Usage of AnalyseStatistiqueNeutre Component
 * 
 * This file demonstrates how to use the neutral statistical analysis component
 * in different scenarios.
 */

import React from 'react';
import { AnalyseStatistiqueNeutre } from './index';

/**
 * Example 1: Strong Signal with Multiple Stores
 */
export const ExampleStrongSignal = () => {
  return (
    <AnalyseStatistiqueNeutre
      signalLevel={85}
      interpretation="L'analyse statistique révèle un signal fort de variation de prix pour ce produit sur la période observée. Les données montrent une tendance significative, basée sur un volume d'observations suffisant pour garantir la fiabilité statistique."
      enseignesPresentes={[
        'Carrefour',
        'Leader Price',
        'Super U',
        'Hyper U',
        'Leclerc',
        'Auchan',
      ]}
      observations={{
        used: 847,
        max: 1200,
        method: 'full',
      }}
    />
  );
};

/**
 * Example 2: Moderate Signal with Stratified Sampling
 */
export const ExampleModerateSignal = () => {
  return (
    <AnalyseStatistiqueNeutre
      signalLevel={55}
      interpretation="L'analyse statistique indique un signal modéré de variation. Les observations collectées suggèrent une tendance, mais avec un niveau d'intensité moyen nécessitant une interprétation prudente."
      enseignesPresentes={['Carrefour', 'Leader Price', 'Super U', 'Casino']}
      observations={{
        used: 320,
        max: 850,
        method: 'stratified',
      }}
    />
  );
};

/**
 * Example 3: Low Signal - Minimal Data
 */
export const ExampleLowSignal = () => {
  return (
    <AnalyseStatistiqueNeutre
      signalLevel={15}
      interpretation="L'analyse statistique révèle un signal minimal. Le faible volume d'observations ou l'absence de tendance claire limite la portée de l'analyse. Ces résultats doivent être interprétés avec prudence."
      enseignesPresentes={['Carrefour', 'Leader Price']}
      observations={{
        used: 42,
        max: 150,
        method: 'full',
      }}
    />
  );
};

/**
 * Example 4: High Signal with Extensive Data
 */
export const ExampleHighSignalExtensive = () => {
  return (
    <AnalyseStatistiqueNeutre
      signalLevel={92}
      interpretation="L'analyse statistique détecte un signal très fort, caractérisé par une intensité élevée et une cohérence dans les observations. Le volume important de données collectées renforce la fiabilité de cette analyse."
      enseignesPresentes={[
        'Carrefour',
        'Leader Price',
        'Super U',
        'Hyper U',
        'Leclerc',
        'Auchan',
        'Intermarché',
        'Casino',
        'Monoprix',
      ]}
      observations={{
        used: 2347,
        max: 2500,
        method: 'stratified',
      }}
    />
  );
};

/**
 * Example 5: No Stores Listed
 */
export const ExampleNoStores = () => {
  return (
    <AnalyseStatistiqueNeutre
      signalLevel={25}
      interpretation="L'analyse n'a pas permis d'identifier de tendance significative. Le faible nombre d'enseignes représentées dans les observations limite la portée des conclusions."
      enseignesPresentes={[]}
      observations={{
        used: 15,
        max: 50,
        method: 'full',
      }}
    />
  );
};

/**
 * Usage Instructions:
 * 
 * 1. Import the component:
 *    import { AnalyseStatistiqueNeutre } from '@/components/Observatoire';
 * 
 * 2. Use with your data:
 *    <AnalyseStatistiqueNeutre
 *      signalLevel={yourSignalLevel}
 *      interpretation={yourInterpretation}
 *      enseignesPresentes={yourStoresList}
 *      observations={yourObservationsData}
 *    />
 * 
 * 3. Key Guidelines:
 *    - signalLevel: 0-100 (higher = stronger signal)
 *    - interpretation: Clear, neutral explanation in French
 *    - enseignesPresentes: Array of store names (no ranking implied)
 *    - observations.method: 'full' or 'stratified'
 * 
 * 4. Legal Compliance:
 *    - Always maintain neutral language
 *    - Never imply causation or blame
 *    - Disclaimers are automatically included
 *    - No store rankings or comparisons
 */
