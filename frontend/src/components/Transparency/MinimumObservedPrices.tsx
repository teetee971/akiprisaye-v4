/**
 * MinimumObservedPrices - Module 3
 * Shows minimum observed prices without inciting purchase.
 */
import React from 'react';
export interface PriceObservation { price: number; count: number; }
export interface MinimumObservedPricesProps {
  productName: string; minimumPrice: number; minimumObservations: number;
  otherPrices: PriceObservation[]; territory?: string; period?: string;
}
export const MinimumObservedPrices: React.FC<MinimumObservedPricesProps> = ({
  productName, minimumPrice, minimumObservations, otherPrices, territory, period,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{productName}</h3>
      </div>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-gray-700 mb-2">Prix minimum observé</p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">{minimumPrice.toFixed(2)} €</span>
          <span className="ml-3 text-sm text-gray-600">({minimumObservations} observation{minimumObservations > 1 ? 's' : ''})</span>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Autres prix observés</h4>
        <div className="flex flex-wrap gap-2">
          {otherPrices.map((obs, index) => (
            <div key={index} className="px-3 py-2 bg-gray-100 rounded text-sm">
              <span className="font-medium text-gray-900">{obs.price.toFixed(2)} €</span>
              <span className="text-xs text-gray-600 ml-1">({obs.count})</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
          <p className="font-medium mb-1">🧠 L'utilisateur décide seul</p>
          <p>Données présentées à titre informatif. Aucune recommandation d'achat.</p>
        </div>
      </div>
    </div>
  );
};
export default MinimumObservedPrices;
