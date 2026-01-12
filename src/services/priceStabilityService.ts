/**
 * Price Stability Service
 * 
 * Analyzes price history to determine if a store consistently offers
 * the cheapest prices or only temporarily.
 * 
 * Feature B: Price History Stability Analysis
 */

import { SEED_PRODUCTS } from '../data/seedProducts';
import { SEED_STORES } from '../data/seedStores';

/**
 * Price observation point for a single product at a store
 */
export interface PriceObservationPoint {
  storeId: string;
  storeName: string;
  price: number;
  observedAt: string;
}

/**
 * Stability statistics for a product at a specific store
 */
export interface StabilityStats {
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  territory: string;
  observations: number;
  timesCheapest: number;
  cheapestRate: number; // 0-100%
  avgPriceDelta: number; // Average difference from 2nd cheapest (in euros)
  avgPriceDeltaPercent: number; // Average difference from 2nd cheapest (in %)
  trend: 'stable' | 'volatile' | 'improving' | 'worsening';
  lastObservedAt: string;
}

/**
 * Stability badge for UI display
 */
export interface StabilityBadge {
  emoji: string;
  label: string;
  color: string;
}

/**
 * Compute price stability statistics for a product across stores in a territory
 * 
 * @param productEan - Product EAN code
 * @param territory - Territory to analyze
 * @returns Array of stability stats per store, sorted by cheapestRate descending
 */
export function computePriceStability(
  productEan: string,
  territory: string
): StabilityStats[] {
  const product = SEED_PRODUCTS.find(p => p.ean === productEan);
  if (!product) return [];

  // Filter prices for the specified territory
  const territoryPrices = product.prices.filter(p => p.territory === territory);
  if (territoryPrices.length === 0) return [];

  // Group observations by unique date (to simulate historical tracking)
  // In real implementation, this would have multiple dates per store
  const observationsByDate = new Map<string, PriceObservationPoint[]>();
  
  territoryPrices.forEach(priceEntry => {
    const dateKey = priceEntry.ts.split('T')[0]; // Group by date only
    if (!observationsByDate.has(dateKey)) {
      observationsByDate.set(dateKey, []);
    }
    observationsByDate.get(dateKey)!.push({
      storeId: priceEntry.storeId,
      storeName: priceEntry.storeName,
      price: priceEntry.price,
      observedAt: priceEntry.ts,
    });
  });

  // Count how many times each store was cheapest
  const storeCheapestCount = new Map<string, number>();
  const storePrices = new Map<string, number[]>();
  const storeNames = new Map<string, string>();
  const storeLastObserved = new Map<string, string>();

  // Initialize maps
  territoryPrices.forEach(p => {
    if (!storeCheapestCount.has(p.storeId)) {
      storeCheapestCount.set(p.storeId, 0);
      storePrices.set(p.storeId, []);
      storeNames.set(p.storeId, p.storeName);
    }
    storePrices.get(p.storeId)!.push(p.price);
    
    // Track latest observation
    const currentLast = storeLastObserved.get(p.storeId);
    if (!currentLast || p.ts > currentLast) {
      storeLastObserved.set(p.storeId, p.ts);
    }
  });

  // For each date, find the cheapest store
  const deltasPerStore = new Map<string, number[]>();
  
  observationsByDate.forEach((observations) => {
    if (observations.length === 0) return;
    
    // Sort by price to find cheapest
    const sorted = [...observations].sort((a, b) => a.price - b.price);
    const cheapest = sorted[0];
    const secondCheapest = sorted.length > 1 ? sorted[1] : null;
    
    // Increment cheapest count
    const currentCount = storeCheapestCount.get(cheapest.storeId) || 0;
    storeCheapestCount.set(cheapest.storeId, currentCount + 1);
    
    // Calculate delta from 2nd cheapest for all stores
    if (secondCheapest) {
      observations.forEach(obs => {
        if (!deltasPerStore.has(obs.storeId)) {
          deltasPerStore.set(obs.storeId, []);
        }
        // Delta is difference from second cheapest (positive if more expensive)
        const delta = obs.price - secondCheapest.price;
        deltasPerStore.get(obs.storeId)!.push(delta);
      });
    }
  });

  const totalObservations = observationsByDate.size;

  // Build statistics for each store
  const stats: StabilityStats[] = [];

  storeCheapestCount.forEach((timesCheapest, storeId) => {
    const storeName = storeNames.get(storeId) || '';
    const prices = storePrices.get(storeId) || [];
    const deltas = deltasPerStore.get(storeId) || [];
    const lastObserved = storeLastObserved.get(storeId) || '';
    
    const cheapestRate = totalObservations > 0 
      ? (timesCheapest / totalObservations) * 100 
      : 0;
    
    // Calculate average delta
    const avgDelta = deltas.length > 0
      ? deltas.reduce((sum, d) => sum + d, 0) / deltas.length
      : 0;
    
    // Calculate average delta percentage (relative to average price)
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const avgDeltaPercent = avgPrice > 0 ? (avgDelta / avgPrice) * 100 : 0;
    
    // Determine trend based on price variance and cheapest rate
    const trend = calculateTrend(prices, cheapestRate, deltas);
    
    stats.push({
      productId: productEan,
      productName: `${product.brand} ${product.name}`,
      storeId,
      storeName,
      territory,
      observations: prices.length,
      timesCheapest,
      cheapestRate: Math.round(cheapestRate),
      avgPriceDelta: Math.abs(avgDelta),
      avgPriceDeltaPercent: Math.abs(avgDeltaPercent),
      trend,
      lastObservedAt: lastObserved,
    });
  });

  // Sort by cheapestRate descending
  return stats.sort((a, b) => b.cheapestRate - a.cheapestRate);
}

/**
 * Calculate trend based on price variance and performance
 */
function calculateTrend(
  prices: number[],
  cheapestRate: number,
  deltas: number[]
): 'stable' | 'volatile' | 'improving' | 'worsening' {
  if (prices.length < 2) return 'stable';
  
  // Calculate coefficient of variation (CV)
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
  
  // High volatility
  if (cv > 15) return 'volatile';
  
  // Check if improving or worsening (if we have at least 3 observations)
  if (deltas.length >= 3) {
    const recent = deltas.slice(-3);
    const trend = recent[2] - recent[0];
    
    // If delta is decreasing (getting closer to 2nd place), it's improving
    if (trend < -0.05) return 'improving';
    // If delta is increasing (getting further from 2nd place), it's worsening
    if (trend > 0.05) return 'worsening';
  }
  
  // Stable if low variance and good cheapest rate
  if (cv < 5 && cheapestRate > 60) return 'stable';
  
  return 'stable';
}

/**
 * Get stability badge for UI display
 * 
 * @param stats - Stability statistics
 * @returns Badge with emoji, label and color
 */
export function getStabilityBadge(stats: StabilityStats): StabilityBadge {
  const { cheapestRate, trend, observations } = stats;
  
  // Not enough data
  if (observations < 3) {
    return {
      emoji: '⚪',
      label: 'Données insuffisantes',
      color: 'text-gray-400',
    };
  }
  
  // Volatile prices
  if (trend === 'volatile') {
    return {
      emoji: '🔄',
      label: 'Prix volatile',
      color: 'text-orange-400',
    };
  }
  
  // Regularly cheapest (≥70%)
  if (cheapestRate >= 70 && trend === 'stable') {
    return {
      emoji: '🟢',
      label: 'Régulièrement moins cher',
      color: 'text-green-400',
    };
  }
  
  // Sometimes cheapest (40-69%)
  if (cheapestRate >= 40) {
    return {
      emoji: '🟡',
      label: 'Parfois moins cher',
      color: 'text-yellow-400',
    };
  }
  
  // Rarely cheapest (<40%)
  return {
    emoji: '⚪',
    label: 'Rarement moins cher',
    color: 'text-gray-400',
  };
}

/**
 * Check if a product/store combination is reliably cheapest
 * Criteria: ≥70% cheapest rate AND ≥5 observations AND stable trend
 * 
 * @param stats - Stability statistics
 * @returns True if reliably cheapest
 */
export function isReliablyCheapest(stats: StabilityStats): boolean {
  return (
    stats.cheapestRate >= 70 &&
    stats.observations >= 5 &&
    stats.trend === 'stable'
  );
}

/**
 * Get all stability stats for products at a given store
 * 
 * @param storeId - Store identifier
 * @param territory - Territory to filter
 * @returns Array of stability stats for all products at this store
 */
export function getStoreStabilityStats(
  storeId: string,
  territory: string
): StabilityStats[] {
  const allStats: StabilityStats[] = [];
  
  for (const product of SEED_PRODUCTS) {
    const productStats = computePriceStability(product.ean, territory);
    const storeStats = productStats.find(s => s.storeId === storeId);
    
    if (storeStats) {
      allStats.push(storeStats);
    }
  }
  
  return allStats.sort((a, b) => b.cheapestRate - a.cheapestRate);
}
