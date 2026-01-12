/**
 * NeutralStoreList Component
 * 
 * Module E - Neutral Store Display
 * 
 * Displays observed stores without ever suggesting one is better.
 * 
 * Strict rules:
 * ✔ Alphabetical order
 * ✔ Same typography
 * ✔ Same color
 * ✔ No icons
 * ✔ No badges
 * ✔ Maximum observations per store enforced
 */

import React from 'react';
import {
  hasReachedMaximum,
  getMaximumReachedMessage,
  MAX_OBSERVATIONS_PER_STORE,
} from '../../utils/observationLimits';

export type StoreObservation = {
  name: string;
  observations: number;
};

export type NeutralStoreListProps = {
  stores: StoreObservation[];
  title?: string;
  showMaximumWarning?: boolean;
};

/**
 * Display stores in strictly neutral format
 * 
 * Features:
 * - Alphabetical sorting (no ranking)
 * - Uniform presentation
 * - Observation count visible
 * - Maximum threshold documented
 * - No comparative visuals
 */
export default function NeutralStoreList({
  stores,
  title = 'Enseignes observées sur le périmètre sélectionné',
  showMaximumWarning = true,
}: NeutralStoreListProps) {
  // Sort alphabetically (mandatory)
  const sortedStores = [...stores].sort((a, b) =>
    a.name.localeCompare(b.name, 'fr')
  );
  
  const hasAnyMaxedOut = sortedStores.some((store) =>
    hasReachedMaximum(store.observations)
  );
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-900">{title}</h3>
      
      {sortedStores.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          Aucune enseigne observée sur ce périmètre.
        </p>
      ) : (
        <ul className="space-y-2">
          {sortedStores.map((store) => {
            const isMaxed = hasReachedMaximum(store.observations);
            
            return (
              <li
                key={store.name}
                className="flex items-center justify-between py-2 px-3 bg-white border border-gray-200 rounded"
              >
                {/* Store name - same typography for all */}
                <span className="text-sm font-normal text-gray-900">
                  {store.name}
                </span>
                
                {/* Observation count - same color for all */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {store.observations} observation{store.observations > 1 ? 's' : ''}
                  </span>
                  
                  {isMaxed && showMaximumWarning && (
                    <span
                      className="text-xs text-gray-500"
                      title={getMaximumReachedMessage()}
                    >
                      (max)
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      
      {/* Maximum threshold documentation */}
      {hasAnyMaxedOut && showMaximumWarning && (
        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-600">
          <p className="font-medium mb-1">Seuil maximum d'observations :</p>
          <p>{getMaximumReachedMessage()}</p>
        </div>
      )}
      
      {/* Legal disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900">
        <p className="font-medium mb-1">Présentation neutre :</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Ordre alphabétique uniquement</li>
          <li>Aucun classement par prix ou qualité</li>
          <li>Aucune recommandation implicite</li>
          <li>Même présentation visuelle pour toutes les enseignes</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Compact version for inline display
 */
export type CompactStoreListProps = {
  stores: StoreObservation[];
  separator?: string;
};

export function CompactStoreList({
  stores,
  separator = ', ',
}: CompactStoreListProps) {
  // Sort alphabetically (mandatory)
  const sortedStores = [...stores].sort((a, b) =>
    a.name.localeCompare(b.name, 'fr')
  );
  
  if (sortedStores.length === 0) {
    return <span className="text-sm text-gray-500 italic">Aucune</span>;
  }
  
  return (
    <span className="text-sm text-gray-700">
      {sortedStores
        .map((store) => `${store.name} (${store.observations})`)
        .join(separator)}
    </span>
  );
}
