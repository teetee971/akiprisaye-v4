/**
 * Enhanced Price Data Types v1.0.0
 * 
 * Implements:
 * - Product normalization with canonical IDs
 * - Reliability scoring system
 * - Source tracking and transparency
 * - Multi-confirmation support
 */

import type { TerritoryCode } from './extensions';

/**
 * Source type for price data
 */
export type PriceSourceType = 
  | 'official_api'        // Official store API
  | 'field_observation'   // Field agent observation
  | 'user_receipt'        // User-uploaded receipt
  | 'user_report'         // User manual report
  | 'historical';         // Historical data

/**
 * Reliability level
 */
export type ReliabilityLevel = 'high' | 'medium' | 'low';

/**
 * Verification source type
 */
export type VerificationSource = 
  | 'official_api' 
  | 'field_agent' 
  | 'user' 
  | 'community';

/**
 * Product format specification
 */
export interface ProductFormat {
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'L' | 'unité';
  displayText: string;  // e.g., "1L", "500g", "4x125g"
}

/**
 * Price source information
 */
export interface PriceSource {
  type: PriceSourceType;
  description: string;
}

/**
 * Price reliability information
 */
export interface PriceReliability {
  score: number;                      // 0-100
  level: ReliabilityLevel;
  confirmations: number;              // Number of confirmations
  verifiedBy: VerificationSource[];   // Who verified this price
  lastVerified: string;               // ISO 8601 timestamp
}

/**
 * Individual price observation
 */
export interface PriceObservationEnhanced {
  priceId: string;
  territory: TerritoryCode | 'YT' | 'PM' | 'BL' | 'MF' | 'WF' | 'PF' | 'NC' | 'TF';
  storeChain: string;
  storeName: string;
  storeId: string;
  price: number;
  observedAt: string;               // ISO 8601 timestamp
  source: PriceSource;
  reliability: PriceReliability;
}

/**
 * Canonical product with normalization
 */
export interface CanonicalProduct {
  canonicalId: string;               // Unique canonical ID
  ean: string;                       // EAN barcode
  name: string;                      // Display name
  normalizedName: string;            // Normalized for search
  brand: string;                     // Brand name
  normalizedBrand: string;           // Normalized brand
  category: string;                  // Product category
  format: ProductFormat;             // Quantity and unit
  synonyms: string[];                // Search synonyms
  prices: PriceObservationEnhanced[];
}

/**
 * Enhanced price data structure
 */
export interface EnhancedPriceData {
  metadata: {
    version: string;
    lastUpdate: string;
    description: string;
    territories: string[];
  };
  products: CanonicalProduct[];
}

/**
 * Search result with relevance score
 */
export interface ProductSearchResult {
  product: CanonicalProduct;
  relevanceScore: number;
  matchedFields: string[];           // Which fields matched the search
}

/**
 * Price comparison with reliability
 */
export interface EnhancedPriceComparison {
  product: {
    canonicalId: string;
    name: string;
    brand: string;
    format: ProductFormat;
    ean: string;
  };
  territory: string;
  prices: Array<{
    storeName: string;
    storeChain: string;
    price: number;
    observedAt: string;
    source: PriceSource;
    reliability: PriceReliability;
    rank: number;
    differenceFromCheapest: {
      absolute: number;
      percentage: number;
    };
  }>;
  statistics: {
    cheapestPrice: number;
    mostExpensivePrice: number;
    averagePrice: number;
    priceRange: number;
    priceRangePercentage: number;
  };
  metadata: {
    totalStores: number;
    mostRecentUpdate: string;
    oldestUpdate: string;
    averageReliability: number;
  };
}

/**
 * Search filters
 */
export interface EnhancedSearchFilters {
  query?: string;
  territory?: string;
  category?: string;
  brand?: string;
  minReliability?: number;
  maxPriceAge?: number;              // Max age in days
  sortBy?: 'price' | 'reliability' | 'date' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Empty state type
 */
export type EmptyStateReason =
  | 'no_query'
  | 'no_results'
  | 'no_data_territory'
  | 'loading'
  | 'error';

/**
 * User feedback message
 */
export interface UserFeedback {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  actionLabel?: string;
  actionUrl?: string;
}
