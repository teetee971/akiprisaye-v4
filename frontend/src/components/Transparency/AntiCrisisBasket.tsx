/**
 * AntiCrisisBasket - Module 1 (Core)
 * 
 * Fixed basket comparison across stores.
 * The heart of the transparency system.
 * 
 * Core principle: Fixed, public, documented basket - identical for everyone.
 */

import React from 'react';

export interface BasketProduct {
  id: string;
  label: string;
  quantity: string;
}

export interface StoreBasketPrice {
  storeName: string;
  totalPrice: number;
  observations: number;
}

export interface AntiCrisisBasketProps {
  version: string;
  territory: string;
  period: string;
  products: BasketProduct[];
  storePrices: StoreBasketPrice[];
  showProductList?: boolean;
}

export const AntiCrisisBasket: React.FC<AntiCrisisBasketProps> = ({
  version,
  territory,
  period,
  products,
  storePrices,
  showProductList = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Panier Anti-Crise – Version {version}
        </h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Territoire : {territory}</p>
          <p>Période : {period}</p>
        </div>
      </div>

      {/* Product List (Optional) */}
      {showProductList && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Composition du panier ({products.length} produits)
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            {products.map((product) => (
              <li key={product.id} className="flex items-center">
                <span className="mr-2">•</span>
                <span>{product.label} ({product.quantity})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Store Price Comparison - NO ORDERING by "best/worst" */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Prix total observé par enseigne
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Enseigne
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Prix total observé
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Nb observations
                </th>
              </tr>
            </thead>
            <tbody>
              {storePrices.map((store, index) => (
                <tr
                  key={store.storeName}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-3 px-4 text-gray-900">{store.storeName}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {store.totalPrice.toFixed(2)} €
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {store.observations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="bg-blue-50 rounded p-3 text-xs text-gray-700">
          <p className="font-medium mb-1">�� Aucun ordre "meilleur/pire"</p>
          <p className="text-gray-600">
            Les données sont présentées sans classement de qualité.
            Aucune enseigne n'est recommandée.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
          <p className="font-medium mb-1">📦 Panier fixe et versionné</p>
          <p>
            Ce panier est identique pour tous les utilisateurs et toutes les enseignes.
            Sa composition est publique et documentée.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AntiCrisisBasket;
