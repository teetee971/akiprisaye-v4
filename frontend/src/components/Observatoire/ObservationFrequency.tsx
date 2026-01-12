/**
 * ObservationFrequency - Part of Module 14
 * 
 * Displays observation frequency (data volume) without implying popularity or quality.
 * Transforms "most popular" into "most frequently observed".
 */

import React from 'react';

export interface ProductObservation {
  productName: string;
  observations: number;
}

export interface ObservationFrequencyProps {
  products: ProductObservation[];
  period: string;
  territory: string;
}

export const ObservationFrequency: React.FC<ObservationFrequencyProps> = ({
  products,
  period,
  territory,
}) => {
  // Sort by observation count (data volume, not preference)
  const sortedProducts = [...products].sort((a, b) => b.observations - a.observations);
  const maxObservations = sortedProducts[0]?.observations || 1;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">
          Produits les plus fréquemment observés
        </h4>
        <p className="text-xs text-gray-500">
          {territory} • {period}
        </p>
      </div>

      <div className="space-y-3">
        {sortedProducts.map((product) => {
          const percentage = (product.observations / maxObservations) * 100;
          
          return (
            <div key={product.productName}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-900">{product.productName}</span>
                <span className="text-xs text-gray-600">
                  {product.observations} observations
                </span>
              </div>
              {/* Progress bar showing relative data volume */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-600 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Clarification note */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          ⚠️ Ce n'est pas une indication de préférence ou de qualité, mais uniquement
          un volume de données collectées. Un produit plus observé n'est pas
          nécessairement plus acheté ou préféré.
        </p>
      </div>
    </div>
  );
};

export default ObservationFrequency;
