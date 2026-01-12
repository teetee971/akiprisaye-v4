/**
 * Module K - Local recurring product recognition
 * 
 * Identifies products that have been observed before
 * 100% local storage - no central database
 * No price storage in fingerprint
 * 
 * GUARANTEES:
 * - Local only (localStorage/IndexedDB)
 * - No price information stored
 * - No prediction or suggestion
 * - Purely informational
 */

/**
 * Normalize text for fingerprinting
 * Removes punctuation, converts to lowercase, trims
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate a fingerprint for a product label
 * Uses simple character code sum for deterministic hashing
 * 
 * @param label - Product label text
 * @returns Hexadecimal fingerprint string
 */
export function productFingerprint(label: string): string {
  const normalized = normalize(label);
  
  if (!normalized) {
    return '0';
  }

  // Simple hash: sum of character codes
  const hash = normalized
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return hash.toString(16);
}

/**
 * Record that a product has been seen locally
 * Increments the observation count in localStorage
 * 
 * @param fingerprint - Product fingerprint
 */
export function recordProductSeen(fingerprint: string): void {
  try {
    const seen = JSON.parse(localStorage.getItem('seenProducts') || '{}');
    seen[fingerprint] = (seen[fingerprint] || 0) + 1;
    localStorage.setItem('seenProducts', JSON.stringify(seen));
  } catch (error) {
    console.error('Failed to record product:', error);
  }
}

/**
 * Get the number of times a product has been seen locally
 * 
 * @param fingerprint - Product fingerprint
 * @returns Number of observations (0 if never seen)
 */
export function getProductSeenCount(fingerprint: string): number {
  try {
    const seen = JSON.parse(localStorage.getItem('seenProducts') || '{}');
    return seen[fingerprint] || 0;
  } catch (error) {
    console.error('Failed to get product count:', error);
    return 0;
  }
}

/**
 * Check if a product has been seen before locally
 * 
 * @param fingerprint - Product fingerprint
 * @returns true if seen at least once
 */
export function hasSeenProduct(fingerprint: string): boolean {
  return getProductSeenCount(fingerprint) > 0;
}

/**
 * Record multiple products from a receipt
 * 
 * @param labels - Array of product labels
 */
export function recordMultipleProducts(labels: string[]): void {
  labels.forEach((label) => {
    const fingerprint = productFingerprint(label);
    recordProductSeen(fingerprint);
  });
}

/**
 * Get statistics about locally observed products
 */
export function getLocalProductStats(): {
  totalProducts: number;
  totalObservations: number;
} {
  try {
    const seen = JSON.parse(localStorage.getItem('seenProducts') || '{}');
    const totalProducts = Object.keys(seen).length;
    const totalObservations = Object.values(seen).reduce(
      (sum: number, count) => sum + (count as number),
      0
    );

    return {
      totalProducts,
      totalObservations,
    };
  } catch (error) {
    console.error('Failed to get product stats:', error);
    return {
      totalProducts: 0,
      totalObservations: 0,
    };
  }
}

/**
 * Clear all local product history
 * Use with caution - this removes all observation data
 */
export function clearLocalProductHistory(): void {
  try {
    localStorage.removeItem('seenProducts');
  } catch (error) {
    console.error('Failed to clear product history:', error);
  }
}
