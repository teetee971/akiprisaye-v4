/**
 * Store Chain OCR Profiles
 * 
 * Declarative profiles for optimizing OCR reading strategy per store chain
 * NEVER modifies OCR results - only optimizes how we read
 * 
 * Philosophy: "Adapt reading strategy, never the results"
 */

export type StoreChainProfile = {
  enseigne: string;
  aliases: string[]; // Alternative names/spellings
  police: 'thermique_compacte' | 'thermique_large' | 'jet_encre' | 'matricielle';
  taille_moyenne: 'petite' | 'moyenne' | 'grande';
  structure: 'prix_droite' | 'prix_gauche' | 'prix_centre';
  decimal: ',' | '.';
  zones_prioritaires: ('header' | 'lignes' | 'totaux' | 'footer')[];
  risques_connus: string[]; // Common OCR confusions for this chain
  preprocessing: {
    contrast_boost: number; // 0-2, 1 = normal
    binarization_threshold: number; // 0-255
    noise_reduction: 'light' | 'medium' | 'heavy';
  };
  ocr_strategies: ('fast' | 'precision' | 'small_chars' | 'numeric')[];
};

/**
 * Store chain profiles database
 * Documented, versioned, audited, and disableable
 */
export const STORE_CHAIN_PROFILES: Record<string, StoreChainProfile> = {
  'leader_price': {
    enseigne: 'Leader Price',
    aliases: ['LEADER PRICE', 'LEADERPRICE', 'LEADER'],
    police: 'thermique_compacte',
    taille_moyenne: 'petite',
    structure: 'prix_droite',
    decimal: ',',
    zones_prioritaires: ['lignes', 'totaux'],
    risques_connus: ['0/O', '5/S', '1/I'],
    preprocessing: {
      contrast_boost: 1.3,
      binarization_threshold: 135,
      noise_reduction: 'medium',
    },
    ocr_strategies: ['precision', 'small_chars', 'numeric'],
  },
  
  'carrefour': {
    enseigne: 'Carrefour',
    aliases: ['CARREFOUR', 'CARREFOUR MARKET', 'CARREFOUR EXPRESS'],
    police: 'thermique_large',
    taille_moyenne: 'moyenne',
    structure: 'prix_droite',
    decimal: ',',
    zones_prioritaires: ['header', 'lignes', 'totaux'],
    risques_connus: ['0/O'],
    preprocessing: {
      contrast_boost: 1.1,
      binarization_threshold: 140,
      noise_reduction: 'light',
    },
    ocr_strategies: ['fast', 'precision', 'numeric'],
  },
  
  'super_u': {
    enseigne: 'Super U',
    aliases: ['SUPER U', 'HYPER U', 'U EXPRESS'],
    police: 'thermique_large',
    taille_moyenne: 'moyenne',
    structure: 'prix_droite',
    decimal: ',',
    zones_prioritaires: ['lignes', 'totaux'],
    risques_connus: ['0/O', '8/B'],
    preprocessing: {
      contrast_boost: 1.2,
      binarization_threshold: 145,
      noise_reduction: 'light',
    },
    ocr_strategies: ['precision', 'numeric'],
  },
  
  'intermarche': {
    enseigne: 'Intermarché',
    aliases: ['INTERMARCHE', 'INTERMARCHÉ', 'NETTO'],
    police: 'thermique_compacte',
    taille_moyenne: 'petite',
    structure: 'prix_droite',
    decimal: ',',
    zones_prioritaires: ['lignes', 'totaux'],
    risques_connus: ['0/O', '5/S', '1/l'],
    preprocessing: {
      contrast_boost: 1.4,
      binarization_threshold: 130,
      noise_reduction: 'medium',
    },
    ocr_strategies: ['precision', 'small_chars', 'numeric'],
  },
  
  'auchan': {
    enseigne: 'Auchan',
    aliases: ['AUCHAN', 'SIMPLY MARKET'],
    police: 'thermique_large',
    taille_moyenne: 'grande',
    structure: 'prix_droite',
    decimal: ',',
    zones_prioritaires: ['header', 'lignes', 'totaux'],
    risques_connus: ['0/O'],
    preprocessing: {
      contrast_boost: 1.0,
      binarization_threshold: 145,
      noise_reduction: 'light',
    },
    ocr_strategies: ['fast', 'precision'],
  },
  
  'leclerc': {
    enseigne: 'E.Leclerc',
    aliases: ['LECLERC', 'E.LECLERC', 'E LECLERC'],
    police: 'thermique_large',
    taille_moyenne: 'moyenne',
    structure: 'prix_droite',
    decimal: ',',
    zones_prioritaires: ['lignes', 'totaux'],
    risques_connus: ['0/O'],
    preprocessing: {
      contrast_boost: 1.1,
      binarization_threshold: 142,
      noise_reduction: 'light',
    },
    ocr_strategies: ['precision', 'numeric'],
  },
  
  'casino': {
    enseigne: 'Casino',
    aliases: ['CASINO', 'PETIT CASINO', 'CASINO SHOP'],
    police: 'thermique_compacte',
    taille_moyenne: 'petite',
    structure: 'prix_droite',
    decimal: ',',
    zones_prioritaires: ['lignes', 'totaux'],
    risques_connus: ['0/O', '5/S'],
    preprocessing: {
      contrast_boost: 1.3,
      binarization_threshold: 135,
      noise_reduction: 'medium',
    },
    ocr_strategies: ['precision', 'small_chars', 'numeric'],
  },
  
  // Generic fallback profile
  'generic': {
    enseigne: 'Générique',
    aliases: [],
    police: 'thermique_large',
    taille_moyenne: 'moyenne',
    structure: 'prix_droite',
    decimal: ',',
    zones_prioritaires: ['lignes', 'totaux'],
    risques_connus: ['0/O'],
    preprocessing: {
      contrast_boost: 1.2,
      binarization_threshold: 140,
      noise_reduction: 'medium',
    },
    ocr_strategies: ['fast', 'precision', 'numeric'],
  },
};

/**
 * Get all available store profiles
 */
export function getAvailableProfiles(): StoreChainProfile[] {
  return Object.values(STORE_CHAIN_PROFILES);
}

/**
 * Get profile by key
 */
export function getProfileByKey(key: string): StoreChainProfile | null {
  return STORE_CHAIN_PROFILES[key] || null;
}

/**
 * Get generic fallback profile
 */
export function getGenericProfile(): StoreChainProfile {
  return STORE_CHAIN_PROFILES['generic'];
}

/**
 * Get profile description for UI
 */
export function getProfileDescription(profile: StoreChainProfile): string {
  return `Police : ${profile.police}, Taille : ${profile.taille_moyenne}, Structure : ${profile.structure}`;
}
