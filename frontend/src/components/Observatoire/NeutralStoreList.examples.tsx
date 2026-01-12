/**
 * Examples for NeutralStoreList Component (Module E)
 */

import React from 'react';
import NeutralStoreList, { CompactStoreList } from './NeutralStoreList';

/**
 * Example 1: Basic store list
 */
export function Example1_BasicList() {
  const stores = [
    { name: 'Carrefour', observations: 12 },
    { name: 'Leader Price', observations: 9 },
    { name: 'Super U', observations: 7 },
  ];
  
  return <NeutralStoreList stores={stores} />;
}

/**
 * Example 2: Store with maximum observations reached
 */
export function Example2_MaximumReached() {
  const stores = [
    { name: 'Carrefour', observations: 30 }, // At maximum
    { name: 'Hyper U', observations: 25 },
    { name: 'Leader Price', observations: 18 },
  ];
  
  return <NeutralStoreList stores={stores} />;
}

/**
 * Example 3: Alphabetical ordering (automatic)
 */
export function Example3_AlphabeticalOrder() {
  const stores = [
    { name: 'Super U', observations: 15 },
    { name: 'Carrefour', observations: 22 },
    { name: 'Leader Price', observations: 8 },
    { name: 'Auchan', observations: 11 },
  ];
  
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Note: Stores are automatically sorted alphabetically (A-Z),
        regardless of input order or observation count.
      </p>
      <NeutralStoreList stores={stores} />
    </div>
  );
}

/**
 * Example 4: Empty store list
 */
export function Example4_EmptyList() {
  return <NeutralStoreList stores={[]} />;
}

/**
 * Example 5: Custom title
 */
export function Example5_CustomTitle() {
  const stores = [
    { name: 'Carrefour', observations: 14 },
    { name: 'Leader Price', observations: 10 },
  ];
  
  return (
    <NeutralStoreList
      stores={stores}
      title="Enseignes observées en Guadeloupe"
    />
  );
}

/**
 * Example 6: Hide maximum warning
 */
export function Example6_NoMaxWarning() {
  const stores = [
    { name: 'Carrefour', observations: 30 },
    { name: 'Leader Price', observations: 25 },
  ];
  
  return <NeutralStoreList stores={stores} showMaximumWarning={false} />;
}

/**
 * Example 7: Compact inline display
 */
export function Example7_CompactFormat() {
  const stores = [
    { name: 'Carrefour', observations: 12 },
    { name: 'Leader Price', observations: 9 },
    { name: 'Super U', observations: 7 },
  ];
  
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded">
      <p className="text-sm font-medium text-gray-900 mb-2">
        Enseignes présentes :
      </p>
      <CompactStoreList stores={stores} />
    </div>
  );
}

/**
 * Example 8: Compact with custom separator
 */
export function Example8_CustomSeparator() {
  const stores = [
    { name: 'Carrefour', observations: 12 },
    { name: 'Leader Price', observations: 9 },
    { name: 'Super U', observations: 7 },
  ];
  
  return (
    <div className="p-4 bg-white border border-gray-200 rounded">
      <p className="text-sm font-medium text-gray-900 mb-2">
        Enseignes observées :
      </p>
      <CompactStoreList stores={stores} separator=" • " />
    </div>
  );
}

/**
 * Example 9: Single vs multiple stores
 */
export function Example9_SingleStore() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Single store:</p>
        <NeutralStoreList
          stores={[{ name: 'Carrefour', observations: 15 }]}
        />
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Multiple stores:</p>
        <NeutralStoreList
          stores={[
            { name: 'Carrefour', observations: 15 },
            { name: 'Leader Price', observations: 12 },
          ]}
        />
      </div>
    </div>
  );
}
