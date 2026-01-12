/**
 * TransparentPriceComparison - Module 14
 * 
 * Displays price comparisons with radical transparency.
 * Never suggests what to buy, only shows what is observed.
 * 
 * Core principle: "Nous n'indiquons pas quoi acheter. Nous montrons ce qui est observé."
 */

import React from 'react';

export interface StorePrice {
  name: string;
  totalPrice: number;
  observations: number;
}

export interface TransparentPriceComparisonProps {
  basket: string;
  territory: string;
  period: string;
  stores: StorePrice[];
  showTransparencyStatement?: boolean;
  showPriceStats?: boolean;
}

export const TransparentPriceComparison: React.FC<TransparentPriceComparisonProps> = ({
  basket,
  territory,
  period,
  stores,
  showTransparencyStatement = true,
  showPriceStats = true,
}) => {
  // Calculate price statistics (factual only, no judgments)
  const prices = stores.map(s => s.totalPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const medianPrice = [...prices].sort((a, b) => a - b)[Math.floor(prices.length / 2)];
  const maxDiffPercent = ((maxPrice - minPrice) / minPrice * 100).toFixed(0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header - Context only, no judgment */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {basket}
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Territoire : {territory}</p>
          <p>Période : {period}</p>
        </div>
      </div>

      {/* Store Price Table - Simple exposition, no ranking */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Enseigne — Prix total observé
        </h4>
        <div className="space-y-2">
          {stores.map((store) => (
            <div
              key={store.name}
              className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
            >
              <span className="text-gray-900">{store.name}</span>
              <div className="text-right">
                <span className="font-medium text-gray-900">
                  {store.totalPrice.toFixed(2)} €
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({store.observations} obs.)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Statistics - Factual only, user draws conclusions */}
      {showPriceStats && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Statistiques observées
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Prix minimum observé</p>
              <p className="font-semibold text-gray-900">{minPrice.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-gray-600">Prix médian</p>
              <p className="font-semibold text-gray-900">{medianPrice.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-gray-600">Écart maximum observé</p>
              <p className="font-semibold text-gray-900">+{maxDiffPercent}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Transparency Statement - Core principle */}
      {showTransparencyStatement && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-gray-50 rounded p-4 space-y-3">
            <p className="text-sm font-medium text-gray-900">
              📊 Nous n'indiquons pas quoi acheter. Nous montrons ce qui est observé.
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Aucun classement par "qualité" ou "bon plan"</p>
              <p>• Aucune enseigne ne peut payer pour être mise en avant</p>
              <p>• Les données sont issues d'observations citoyennes</p>
              <p>• L'utilisateur tire ses propres conclusions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransparentPriceComparison;
