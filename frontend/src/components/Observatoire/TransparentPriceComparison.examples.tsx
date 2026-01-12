/**
 * TransparentPriceComparison - Usage Examples
 * 
 * Demonstrates proper usage of Module 14 components with radical transparency principles.
 */

import React from 'react';
import TransparentPriceComparison from './TransparentPriceComparison';
import PriceStabilityIndicator from './PriceStabilityIndicator';
import ObservationFrequency from './ObservationFrequency';

// Example 1: Basic price comparison (no rankings)
export const Example1_BasicComparison = () => (
  <TransparentPriceComparison
    basket="Panier Anti-Crise"
    territory="Guadeloupe"
    period="30 jours"
    stores={[
      { name: 'Leader Price', totalPrice: 23.40, observations: 18 },
      { name: 'Carrefour', totalPrice: 27.90, observations: 12 },
      { name: 'Super U', totalPrice: 29.10, observations: 9 },
    ]}
  />
);

// Example 2: With price statistics (user draws conclusions)
export const Example2_WithStats = () => (
  <TransparentPriceComparison
    basket="Panier Alimentaire Standard"
    territory="Martinique"
    period="7 jours"
    stores={[
      { name: 'Carrefour Market', totalPrice: 45.80, observations: 24 },
      { name: 'Leader Price', totalPrice: 42.30, observations: 19 },
      { name: 'Super U', totalPrice: 48.20, observations: 15 },
      { name: 'Hyper U', totalPrice: 47.10, observations: 11 },
    ]}
    showPriceStats={true}
    showTransparencyStatement={true}
  />
);

// Example 3: Without transparency statement (when already shown elsewhere)
export const Example3_NoStatement = () => (
  <TransparentPriceComparison
    basket="Panier Hygiène"
    territory="Guyane"
    period="14 jours"
    stores={[
      { name: 'Super U', totalPrice: 31.50, observations: 8 },
      { name: 'Leader Price', totalPrice: 28.90, observations: 12 },
    ]}
    showTransparencyStatement={false}
  />
);

// Example 4: Price stability indicator (factual, no ratings)
export const Example4_StabilityIndicator = () => (
  <PriceStabilityIndicator
    stability="élevée"
    variation="±2%"
    observations={18}
    period="30 jours"
  />
);

// Example 5: Moderate stability
export const Example5_ModerateStability = () => (
  <PriceStabilityIndicator
    stability="modérée"
    variation="±8%"
    observations={12}
    period="14 jours"
  />
);

// Example 6: Low stability (descriptive, not negative)
export const Example6_LowStability = () => (
  <PriceStabilityIndicator
    stability="faible"
    variation="±15%"
    observations={9}
    period="7 jours"
  />
);

// Example 7: Observation frequency (data volume, not popularity)
export const Example7_ObservationFrequency = () => (
  <ObservationFrequency
    period="30 jours"
    territory="Guadeloupe"
    products={[
      { productName: 'Riz long grain 1kg', observations: 42 },
      { productName: 'Huile de tournesol 1L', observations: 38 },
      { productName: 'Sucre blanc 1kg', observations: 35 },
      { productName: 'Farine T55 1kg', observations: 28 },
      { productName: 'Lait demi-écrémé 1L', observations: 24 },
    ]}
  />
);

// Example 8: Small dataset
export const Example8_SmallDataset = () => (
  <ObservationFrequency
    period="7 jours"
    territory="Martinique"
    products={[
      { productName: 'Pain de mie', observations: 15 },
      { productName: 'Beurre doux 250g', observations: 12 },
      { productName: 'Œufs x6', observations: 9 },
    ]}
  />
);

// Example 9: Complete integration (all components)
export const Example9_CompleteIntegration = () => (
  <div className="space-y-6">
    <TransparentPriceComparison
      basket="Panier Anti-Crise"
      territory="Guadeloupe"
      period="30 jours"
      stores={[
        { name: 'Leader Price', totalPrice: 23.40, observations: 18 },
        { name: 'Carrefour', totalPrice: 27.90, observations: 12 },
        { name: 'Super U', totalPrice: 29.10, observations: 9 },
      ]}
      showPriceStats={true}
      showTransparencyStatement={true}
    />

    <PriceStabilityIndicator
      stability="élevée"
      variation="±2%"
      observations={18}
      period="30 jours"
    />

    <ObservationFrequency
      period="30 jours"
      territory="Guadeloupe"
      products={[
        { productName: 'Riz long grain 1kg', observations: 42 },
        { productName: 'Huile de tournesol 1L', observations: 38 },
        { productName: 'Sucre blanc 1kg', observations: 35 },
      ]}
    />
  </div>
);

// Example 10: Multi-territory comparison
export const Example10_MultiTerritory = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <TransparentPriceComparison
      basket="Panier Anti-Crise"
      territory="Guadeloupe"
      period="30 jours"
      stores={[
        { name: 'Leader Price', totalPrice: 23.40, observations: 18 },
        { name: 'Carrefour', totalPrice: 27.90, observations: 12 },
      ]}
      showTransparencyStatement={false}
    />

    <TransparentPriceComparison
      basket="Panier Anti-Crise"
      territory="Martinique"
      period="30 jours"
      stores={[
        { name: 'Leader Price', totalPrice: 24.10, observations: 16 },
        { name: 'Carrefour', totalPrice: 28.50, observations: 14 },
      ]}
      showTransparencyStatement={false}
    />
  </div>
);

// Example 11: Integration with ObservationGuard
export const Example11_WithGuard = () => {
  const observations = 18;
  const threshold = 5;

  if (observations < threshold) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          Données insuffisantes pour afficher une comparaison fiable.
        </p>
      </div>
    );
  }

  return (
    <TransparentPriceComparison
      basket="Panier Anti-Crise"
      territory="Guadeloupe"
      period="30 jours"
      stores={[
        { name: 'Leader Price', totalPrice: 23.40, observations: 18 },
        { name: 'Carrefour', totalPrice: 27.90, observations: 12 },
      ]}
    />
  );
};

// Example 12: Mobile-optimized display
export const Example12_MobileOptimized = () => (
  <div className="max-w-sm mx-auto">
    <TransparentPriceComparison
      basket="Panier Essentiel"
      territory="Guyane"
      period="14 jours"
      stores={[
        { name: 'Leader Price', totalPrice: 18.50, observations: 9 },
        { name: 'Carrefour', totalPrice: 21.30, observations: 7 },
      ]}
      showPriceStats={true}
      showTransparencyStatement={true}
    />
  </div>
);

export default {
  Example1_BasicComparison,
  Example2_WithStats,
  Example3_NoStatement,
  Example4_StabilityIndicator,
  Example5_ModerateStability,
  Example6_LowStability,
  Example7_ObservationFrequency,
  Example8_SmallDataset,
  Example9_CompleteIntegration,
  Example10_MultiTerritory,
  Example11_WithGuard,
  Example12_MobileOptimized,
};
