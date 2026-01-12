/**
 * Privacy Controls - Local Data Management
 * 
 * User controls for managing local data storage
 * 100% local, no cloud, RGPD compliant
 */

export type LocalDataType = 
  | 'ocr_history'
  | 'quality_history'
  | 'recurring_products'
  | 'user_preferences'
  | 'all';

export type DataStorageInfo = {
  type: LocalDataType;
  size: number; // bytes
  itemCount: number;
  lastModified: Date | null;
  location: 'localStorage' | 'indexedDB' | 'memory';
};

/**
 * Get information about locally stored data
 */
export function getLocalDataInfo(): DataStorageInfo[] {
  const info: DataStorageInfo[] = [];

  try {
    // OCR Quality History
    const qualityHistory = localStorage.getItem('ocr_quality_history');
    if (qualityHistory) {
      info.push({
        type: 'quality_history',
        size: new Blob([qualityHistory]).size,
        itemCount: Object.keys(JSON.parse(qualityHistory)).length,
        lastModified: new Date(),
        location: 'localStorage',
      });
    }

    // Recurring Products
    const seenProducts = localStorage.getItem('seenProducts');
    if (seenProducts) {
      info.push({
        type: 'recurring_products',
        size: new Blob([seenProducts]).size,
        itemCount: Object.keys(JSON.parse(seenProducts)).length,
        lastModified: new Date(),
        location: 'localStorage',
      });
    }

    // User Preferences (if any)
    const preferences = localStorage.getItem('user_preferences');
    if (preferences) {
      info.push({
        type: 'user_preferences',
        size: new Blob([preferences]).size,
        itemCount: 1,
        lastModified: new Date(),
        location: 'localStorage',
      });
    }
  } catch (error) {
    console.error('Error getting local data info:', error);
  }

  return info;
}

/**
 * Clear specific type of local data
 */
export function clearLocalData(type: LocalDataType): boolean {
  try {
    switch (type) {
      case 'quality_history':
        localStorage.removeItem('ocr_quality_history');
        break;

      case 'recurring_products':
        localStorage.removeItem('seenProducts');
        break;

      case 'user_preferences':
        localStorage.removeItem('user_preferences');
        break;

      case 'all':
        localStorage.clear();
        // Note: IndexedDB deletion would need to be added if used
        break;

      default:
        return false;
    }

    return true;
  } catch (error) {
    console.error(`Error clearing local data (${type}):`, error);
    return false;
  }
}

/**
 * Export local data to JSON (RGPD portability)
 */
export function exportLocalData(): string {
  const data: Record<string, unknown> = {};

  try {
    // Export all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      }
    }

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting local data:', error);
    return JSON.stringify({ error: 'Export failed' });
  }
}

/**
 * Import local data from JSON
 */
export function importLocalData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);

    for (const [key, value] of Object.entries(data)) {
      if (key === 'error') continue;
      
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    }

    return true;
  } catch (error) {
    console.error('Error importing local data:', error);
    return false;
  }
}

/**
 * Get total local storage usage
 */
export function getLocalStorageUsage(): {
  used: number;
  available: number;
  percentage: number;
} {
  try {
    let used = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          used += new Blob([key + value]).size;
        }
      }
    }

    // Most browsers have ~5-10 MB localStorage limit
    const available = 5 * 1024 * 1024; // 5 MB estimate
    const percentage = (used / available) * 100;

    return {
      used,
      available,
      percentage: Math.min(100, percentage),
    };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return { used: 0, available: 0, percentage: 0 };
  }
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if running in offline mode
 */
export function isOfflineMode(): boolean {
  return !navigator.onLine;
}

/**
 * Check if OCR can run (always true for local OCR)
 */
export function canRunOCR(): boolean {
  // Local OCR is always available, no network check needed
  return true;
}

/**
 * Get privacy compliance status
 */
export function getPrivacyStatus(): {
  localOnly: boolean;
  noTracking: boolean;
  noAccount: boolean;
  offlineCapable: boolean;
  rgpdCompliant: boolean;
} {
  return {
    localOnly: true, // All processing is local
    noTracking: true, // No analytics or tracking
    noAccount: true, // No account required
    offlineCapable: true, // Works offline
    rgpdCompliant: true, // RGPD compliant by design
  };
}

/**
 * Mandatory privacy notice text
 */
export const PRIVACY_NOTICE = {
  fr: "L'analyse OCR est effectuée localement sur votre appareil. Aucune image n'est transmise.",
  en: "OCR analysis is performed locally on your device. No images are transmitted.",
};

/**
 * Get data retention policy
 */
export function getDataRetentionPolicy(): {
  images: string;
  ocrText: string;
  qualityScores: string;
  userControl: string;
} {
  return {
    images: 'Temporaire - en mémoire uniquement, supprimées après traitement',
    ocrText: 'Session - localStorage, supprimable à tout moment',
    qualityScores: 'Optionnel - localStorage, supprimable à tout moment',
    userControl: 'Total - vous pouvez supprimer toutes les données à tout moment',
  };
}
