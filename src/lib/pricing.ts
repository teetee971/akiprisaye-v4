/**
 * Access Levels System
 * Service civique numérique - Observatoire public indépendant
 * L'accès aux données essentielles est libre
 */

export type AccessLevel =
  | 'PUBLIC'
  | 'CITIZEN'
  | 'PROFESSIONAL'
  | 'INSTITUTIONAL';

export const ACCESS_LEVEL_PRICES = {
  PUBLIC: { 
    monthly: 0, 
    yearly: 0,
    description: 'Accès gratuit — Comparaisons basiques, lecture seule'
  },
  CITIZEN: { 
    monthly: 2.99, 
    yearly: 29,
    description: 'Citoyen+ — Historique, alertes, exports basiques'
  },
  PROFESSIONAL: { 
    monthly: 9.99, 
    yearly: 99,
    description: 'Pro — Agrégations avancées, multi-territoires'
  },
  INSTITUTIONAL: { 
    monthly: null, 
    yearly: null,
    description: 'Institution — API, open-data, rapports (sur devis)'
  },
} as const;

export const FEATURES = {
  // Accès Public (Gratuit pour tous)
  PRICE_COMPARISON: ['PUBLIC', 'CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  TERRITORY_VIEW: ['PUBLIC', 'CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  PRICE_SOURCES_VISIBLE: ['PUBLIC', 'CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  BASIC_HISTORY: ['PUBLIC', 'CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  READ_ONLY_ACCESS: ['PUBLIC', 'CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  NO_ADS: ['PUBLIC', 'CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  
  // Accès Citoyen
  LOCAL_ALERTS: ['CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  EXTENDED_HISTORY: ['CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  PRODUCT_TRACKING: ['CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  PUBLIC_DATA_ACCESS: ['CITIZEN', 'PROFESSIONAL', 'INSTITUTIONAL'],
  
  // Accès Professionnel
  MULTI_TERRITORY: ['PROFESSIONAL', 'INSTITUTIONAL'],
  LONG_TIME_SERIES: ['PROFESSIONAL', 'INSTITUTIONAL'],
  CSV_EXPORT: ['PROFESSIONAL', 'INSTITUTIONAL'],
  MULTI_TERRITORY_COMPARISON: ['PROFESSIONAL', 'INSTITUTIONAL'],
  
  // Licence Institutionnelle
  PUBLIC_AUDITED_DATA: ['INSTITUTIONAL'],
  NORMALIZED_EXPORTS: ['INSTITUTIONAL'],
  PUBLIC_API: ['INSTITUTIONAL'],
  OFFICIAL_METHODOLOGY: ['INSTITUTIONAL'],
} as const;

export type Feature = keyof typeof FEATURES;

/**
 * Check if an access level has a specific feature
 */
export const canUse = (level: AccessLevel, feature: Feature): boolean => {
  return FEATURES[feature].includes(level);
};

/**
 * Get pricing for an access level
 */
export const getAccessPrice = (
  level: AccessLevel, 
  billingCycle: 'monthly' | 'yearly'
): number | null => {
  return ACCESS_LEVEL_PRICES[level][billingCycle];
};

/**
 * Get feature description
 */
export const getFeatureDescription = (feature: Feature): string => {
  const descriptions: Record<Feature, string> = {
    // Accès Public
    PRICE_COMPARISON: 'Comparateur citoyen DOM · ROM · COM',
    TERRITORY_VIEW: 'Consultation par territoire',
    PRICE_SOURCES_VISIBLE: 'Prix observés, datés et sourcés',
    BASIC_HISTORY: 'Historique simple',
    READ_ONLY_ACCESS: 'Lecture seule',
    NO_ADS: 'Sans publicité',
    
    // Accès Citoyen
    LOCAL_ALERTS: 'Alertes locales personnalisées',
    EXTENDED_HISTORY: 'Historique des prix',
    PRODUCT_TRACKING: 'Consultation des comparateurs',
    PUBLIC_DATA_ACCESS: 'Accès aux données publiques',
    
    // Accès Professionnel
    MULTI_TERRITORY: 'Comparaisons multi-territoires',
    LONG_TIME_SERIES: 'Séries historiques complètes',
    CSV_EXPORT: 'Exports CSV / JSON',
    MULTI_TERRITORY_COMPARISON: 'Analyses territoriales avancées',
    
    // Licence Institutionnelle
    PUBLIC_AUDITED_DATA: 'Données publiques auditées',
    NORMALIZED_EXPORTS: 'Exports normalisés (INSEE / Eurostat)',
    PUBLIC_API: 'Accès API open-data',
    OFFICIAL_METHODOLOGY: 'Documentation méthodologique officielle',
  };
  
  return descriptions[feature];
};

export default {
  canUse,
  getAccessPrice,
  getFeatureDescription,
  ACCESS_LEVEL_PRICES,
  FEATURES,
};
