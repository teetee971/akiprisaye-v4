/**
 * Geolocation Utility Service
 * 
 * Provides geolocation functionality for store distance calculation
 * and GPS-based filtering in comparison pages.
 */

export interface GeoPosition {
  lat: number;
  lon: number;
}

export interface StoreWithDistance {
  storeId: string;
  storeName: string;
  distance: number; // in km
  address: string;
  lat: number;
  lon: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get user's current position using browser geolocation API
 * @returns Promise with user's position or null if denied/unavailable
 */
export async function getUserPosition(): Promise<GeoPosition | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not available');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null);
      },
      {
        timeout: 10000,
        maximumAge: 300000, // Cache position for 5 minutes
        enableHighAccuracy: false, // Faster, less battery drain
      }
    );
  });
}

/**
 * Check if geolocation is available in the browser
 */
export function isGeolocationAvailable(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted string like "2.5 km" or "350 m"
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}
