/**
 * FactualStoreComparison - Module 2
 * Statistical comparison table - NOT quality ranking.
 */
import React from 'react';
export interface ComparisonStats {
  totalObserved: number; minObserved: number; maxObserved: number;
  median: number; variability: number; maxDiffPercent: number; minDiffPercent: number;
}
export interface FactualStoreComparisonProps {
  basket: string; territory: string; period: string; stats: ComparisonStats;
}
export const FactualStoreComparison: React.FC<FactualStoreComparisonProps> = ({
  basket, territory, period, stats,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Écart observé sur {basket}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Territoire : {territory}</p><p>Période : {period}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Écart maximum observé</p>
          <p className="text-2xl font-bold text-gray-900">+{stats.maxDiffPercent}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Médiane territoriale</p>
          <p className="text-2xl font-bold text-gray-900">{stats.median.toFixed(2)} €</p>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
          <p className="font-medium mb-1">⚠️ Ce n'est PAS un classement de qualité</p>
          <p>Tableau comparatif chiffré basé sur des observations.</p>
        </div>
      </div>
    </div>
  );
};
export default FactualStoreComparison;
