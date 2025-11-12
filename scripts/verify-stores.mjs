#!/usr/bin/env node

/**
 * Verification script for stores data
 * Tests that all stores are properly loaded and accessible
 */

/* eslint-env node */
/* eslint-disable no-console */

import {
  SEED_STORES,
  getStoreById,
  getStoresByTerritory,
  searchStores,
  getStoresByChain,
  getAvailableTerritories,
  getTerritoryNameFromCode,
} from '../src/data/seedStores.js';

console.log('\n📊 STORES DATA VERIFICATION\n');
console.log('═'.repeat(60));

// 1. Total stores
console.log('\n✓ Total stores:', SEED_STORES.length);

// 2. Territories coverage
const territories = getAvailableTerritories();
console.log('\n✓ Territories covered:', territories.length);
territories.forEach(territory => {
  const stores = getStoresByTerritory(territory);
  console.log(`   - ${territory}: ${stores.length} magasin${stores.length > 1 ? 's' : ''}`);
});

// 3. Chains
const chains = [...new Set(SEED_STORES.map(s => s.chain))].sort();
console.log('\n✓ Store chains:', chains.length);
chains.forEach(chain => {
  const count = getStoresByChain(chain).length;
  console.log(`   - ${chain}: ${count} magasin${count > 1 ? 's' : ''}`);
});

// 4. Sample store details
console.log('\n✓ Sample store (Carrefour Baie-Mahault):');
const sample = getStoreById('carrefour_baie_mahault');
if (sample) {
  console.log(`   - Name: ${sample.name}`);
  console.log(`   - Chain: ${sample.chain}`);
  console.log(`   - Territory: ${sample.territory}`);
  console.log(`   - City: ${sample.city}`);
  console.log(`   - Coordinates: ${sample.coordinates.lat}, ${sample.coordinates.lon}`);
  console.log(`   - Services: ${sample.services.join(', ')}`);
}

// 5. Search functionality
const searchResults = searchStores('Super U');
console.log(`\n✓ Search for "Super U": ${searchResults.length} résultat${searchResults.length > 1 ? 's' : ''}`);

// 6. Territory code mapping
console.log('\n✓ Territory code mapping:');
['guadeloupe', 'martinique', 'reunion'].forEach(code => {
  const name = getTerritoryNameFromCode(code);
  console.log(`   - ${code} → ${name}`);
});

// 7. Data consistency check
console.log('\n✓ Data consistency:');
let hasErrors = false;

// Check for duplicate IDs
const ids = SEED_STORES.map(s => s.id);
const uniqueIds = new Set(ids);
if (ids.length !== uniqueIds.size) {
  console.log('   ✗ ERROR: Duplicate store IDs found!');
  hasErrors = true;
} else {
  console.log('   ✓ All store IDs are unique');
}

// Check for valid coordinates
SEED_STORES.forEach(store => {
  if (!store.coordinates || 
      typeof store.coordinates.lat !== 'number' || 
      typeof store.coordinates.lon !== 'number' ||
      store.coordinates.lat < -90 || store.coordinates.lat > 90 ||
      store.coordinates.lon < -180 || store.coordinates.lon > 180) {
    console.log(`   ✗ ERROR: Invalid coordinates for ${store.id}`);
    hasErrors = true;
  }
});
if (!hasErrors) {
  console.log('   ✓ All coordinates are valid');
}

// Check required fields
SEED_STORES.forEach(store => {
  const required = ['id', 'name', 'chain', 'territory', 'city', 'coordinates'];
  required.forEach(field => {
    if (!store[field]) {
      console.log(`   ✗ ERROR: Missing ${field} for store ${store.id || 'unknown'}`);
      hasErrors = true;
    }
  });
});
if (!hasErrors) {
  console.log('   ✓ All required fields are present');
}

console.log('\n═'.repeat(60));
console.log(hasErrors ? '\n❌ VALIDATION FAILED\n' : '\n✅ ALL CHECKS PASSED\n');

process.exit(hasErrors ? 1 : 0);
