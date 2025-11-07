#!/usr/bin/env node

/**
 * OpenStreetMap Partner Discovery Script
 * 
 * Queries the Overpass API to discover supermarkets and grocery stores
 * in French overseas territories (DOM-TOM).
 * 
 * Territories covered:
 * - GP (Guadeloupe)
 * - MQ (Martinique)
 * - GF (Guyane/French Guiana)
 * - RE (Réunion)
 * - YT (Mayotte)
 * 
 * Output: partners/candidates.json
 */

const fs = require('fs');
const path = require('path');

// Note: This script uses the native fetch API available in Node.js 18+
// No additional dependencies are required for HTTP requests

// Territory bounding boxes (south, west, north, east)
const TERRITORIES = {
  GP: { name: 'Guadeloupe', bbox: [15.83, -61.81, 16.51, -61.00] },
  MQ: { name: 'Martinique', bbox: [14.39, -61.23, 14.88, -60.81] },
  GF: { name: 'Guyane', bbox: [2.11, -54.61, 5.75, -51.61] },
  RE: { name: 'Réunion', bbox: [-21.39, 55.22, -20.87, 55.84] },
  YT: { name: 'Mayotte', bbox: [-13.00, 45.04, -12.64, 45.30] }
};

// Shop types to query
const SHOP_TYPES = ['supermarket', 'convenience', 'hypermarket', 'wholesale'];

// Overpass API endpoint
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

/**
 * Build Overpass QL query for a territory
 */
function buildOverpassQuery(territoryCode, bbox) {
  const [south, west, north, east] = bbox;
  const shopFilter = SHOP_TYPES.map(type => `["shop"="${type}"]`).join('');
  
  return `
    [out:json][timeout:90];
    (
      node${shopFilter}(${south},${west},${north},${east});
      way${shopFilter}(${south},${west},${north},${east});
      relation${shopFilter}(${south},${west},${north},${east});
    );
    out center tags;
  `;
}

/**
 * Query Overpass API
 */
async function queryOverpass(query) {
  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    body: query,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Transform OSM element to candidate format
 */
function transformElement(element, territoryCode) {
  const tags = element.tags || {};
  
  // Get coordinates (handle nodes vs ways/relations)
  let lat, lon;
  if (element.type === 'node') {
    lat = element.lat;
    lon = element.lon;
  } else if (element.center) {
    lat = element.center.lat;
    lon = element.center.lon;
  }

  // Generate a unique ID
  const id = `osm-${element.type}-${element.id}-${territoryCode}`;
  
  // Determine a meaningful name
  const name = tags.name || tags.brand || tags['brand:wikidata'] || `Unnamed ${tags.shop || 'shop'}`;

  return {
    id,
    osmId: element.id,
    osmType: element.type,
    name,
    brand: tags.brand || null,
    shopType: tags.shop || 'unknown',
    territory: territoryCode,
    territoryName: TERRITORIES[territoryCode].name,
    location: {
      lat,
      lon,
      address: tags['addr:full'] || tags['addr:street'] || null,
      city: tags['addr:city'] || null,
      postcode: tags['addr:postcode'] || null
    },
    contact: {
      phone: tags.phone || tags['contact:phone'] || null,
      website: tags.website || tags['contact:website'] || null,
      email: tags.email || tags['contact:email'] || null
    },
    openingHours: tags.opening_hours || null,
    discoveredAt: new Date().toISOString(),
    tags: tags
  };
}

/**
 * Discover partners in a single territory
 */
async function discoverTerritory(territoryCode) {
  console.log(`🔍 Discovering partners in ${TERRITORIES[territoryCode].name} (${territoryCode})...`);
  
  const query = buildOverpassQuery(territoryCode, TERRITORIES[territoryCode].bbox);
  
  try {
    const data = await queryOverpass(query);
    const candidates = data.elements
      .map(el => transformElement(el, territoryCode));
    
    console.log(`   ✓ Found ${candidates.length} candidates`);
    return candidates;
  } catch (error) {
    console.error(`   ✗ Error querying ${territoryCode}:`, error.message);
    return [];
  }
}

/**
 * Main discovery process
 */
async function discoverPartners() {
  console.log('🚀 Starting OSM Partner Discovery for DOM-TOM territories\n');
  
  const allCandidates = [];
  
  // Query each territory sequentially to respect API rate limits
  const territoryEntries = Object.entries(TERRITORIES);
  for (let i = 0; i < territoryEntries.length; i++) {
    const [code, _] = territoryEntries[i];
    const candidates = await discoverTerritory(code);
    allCandidates.push(...candidates);
    
    // Wait 2 seconds between requests to be respectful of the API
    if (i < territoryEntries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Generate summary statistics
  const summary = {
    totalCandidates: allCandidates.length,
    byTerritory: {},
    byShopType: {},
    generatedAt: new Date().toISOString()
  };
  
  // Calculate statistics
  allCandidates.forEach(candidate => {
    // By territory
    summary.byTerritory[candidate.territory] = 
      (summary.byTerritory[candidate.territory] || 0) + 1;
    
    // By shop type
    summary.byShopType[candidate.shopType] = 
      (summary.byShopType[candidate.shopType] || 0) + 1;
  });
  
  // Prepare output
  const output = {
    summary,
    candidates: allCandidates
  };
  
  // Write to file
  const outputPath = path.join(__dirname, '..', 'partners', 'candidates.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  
  console.log('\n✅ Discovery complete!');
  console.log(`📊 Total candidates found: ${allCandidates.length}`);
  console.log('\n📈 By territory:');
  Object.entries(summary.byTerritory).forEach(([code, count]) => {
    console.log(`   ${code}: ${count} candidates`);
  });
  console.log('\n📦 By shop type:');
  Object.entries(summary.byShopType).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} candidates`);
  });
  console.log(`\n💾 Results saved to: ${outputPath}`);
}

// Run the script
if (require.main === module) {
  discoverPartners().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { discoverPartners };
