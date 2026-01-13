import { getStoresByTerritory as getStoresFromSeed } from '../data/seedStores.js';

/**
 * Get stores by territory for display on the map
 * Converts seedStores format to map format
 * @param {string} territory - Territory name (e.g., 'Guadeloupe', 'Martinique')
 * @returns {Array} Array of stores with lat, lon, name, category, and id
 */
export const getStoresByTerritory = (territory) => {
  const stores = getStoresFromSeed(territory);
  
  // Convert seedStores format to map format
  return stores.map(store => ({
    id: store.id,
    name: store.name,
    lat: store.coordinates.lat,
    lon: store.coordinates.lon,
    category: store.chain, // Use chain as category
    city: store.city,
    address: store.address,
    phone: store.phone,
    openingHours: store.openingHours,
    services: store.services,
  }));
};
