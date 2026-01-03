/**
 * territories.ts — Constantes centralisées des territoires
 * Version complète incluant TOUS les territoires français d'Outre-mer
 * 
 * Sources officielles:
 * - INSEE: Codes officiels des collectivités d'outre-mer
 * - ISO 3166-2:FR: Codes subdivision France
 */

export interface Territory {
  code: string;
  name: string;
  fullName: string;
  type: 'DROM' | 'COM' | 'Autres';
  inseeCode?: string;
  center: { lat: number; lng: number };
  zoom: number;
  flag: string;
  active: boolean; // Si les données sont disponibles
}

/**
 * Liste complète des territoires français d'Outre-mer
 * Conformité avec l'audit: TOUS les territoires doivent être présents
 */
export const TERRITORIES: Record<string, Territory> = {
  // ============ DROM (Départements et Régions d'Outre-Mer) ============
  GP: {
    code: 'GP',
    name: 'Guadeloupe',
    fullName: 'Département de la Guadeloupe',
    type: 'DROM',
    inseeCode: '971',
    center: { lat: 16.265, lng: -61.551 },
    zoom: 11,
    flag: '🇬🇵',
    active: true,
  },
  MQ: {
    code: 'MQ',
    name: 'Martinique',
    fullName: 'Département de la Martinique',
    type: 'DROM',
    inseeCode: '972',
    center: { lat: 14.6415, lng: -61.0242 },
    zoom: 11,
    flag: '🇲🇶',
    active: true,
  },
  GF: {
    code: 'GF',
    name: 'Guyane',
    fullName: 'Département de la Guyane',
    type: 'DROM',
    inseeCode: '973',
    center: { lat: 4.9224, lng: -52.3269 },
    zoom: 8,
    flag: '🇬🇫',
    active: true,
  },
  RE: {
    code: 'RE',
    name: 'La Réunion',
    fullName: 'Département de La Réunion',
    type: 'DROM',
    inseeCode: '974',
    center: { lat: -21.1151, lng: 55.5364 },
    zoom: 10,
    flag: '🇷🇪',
    active: true, // Maintenant actif
  },
  YT: {
    code: 'YT',
    name: 'Mayotte',
    fullName: 'Département de Mayotte',
    type: 'DROM',
    inseeCode: '976',
    center: { lat: -12.8275, lng: 45.1662 },
    zoom: 11,
    flag: '🇾🇹',
    active: true, // Maintenant actif
  },

  // ============ COM (Collectivités d'Outre-Mer) ============
  PF: {
    code: 'PF',
    name: 'Polynésie française',
    fullName: 'Collectivité de la Polynésie française',
    type: 'COM',
    inseeCode: '987',
    center: { lat: -17.6797, lng: -149.4068 }, // Tahiti/Papeete
    zoom: 9,
    flag: '🇵🇫',
    active: true, // Maintenant actif
  },
  NC: {
    code: 'NC',
    name: 'Nouvelle-Calédonie',
    fullName: 'Collectivité de Nouvelle-Calédonie',
    type: 'COM',
    inseeCode: '988',
    center: { lat: -21.2741, lng: 165.3018 }, // Nouméa
    zoom: 8,
    flag: '🇳🇨',
    active: true, // Maintenant actif
  },
  WF: {
    code: 'WF',
    name: 'Wallis-et-Futuna',
    fullName: 'Collectivité de Wallis-et-Futuna',
    type: 'COM',
    inseeCode: '986',
    center: { lat: -13.2765, lng: -176.1745 }, // Mata-Utu
    zoom: 11,
    flag: '🇼🇫',
    active: true, // Maintenant actif
  },
  MF: {
    code: 'MF',
    name: 'Saint-Martin',
    fullName: 'Collectivité de Saint-Martin',
    type: 'COM',
    inseeCode: '978',
    center: { lat: 18.0708, lng: -63.0501 }, // Marigot
    zoom: 12,
    flag: '🇲🇫',
    active: true, // Maintenant actif
  },
  BL: {
    code: 'BL',
    name: 'Saint-Barthélemy',
    fullName: 'Collectivité de Saint-Barthélemy',
    type: 'COM',
    inseeCode: '977',
    center: { lat: 17.9, lng: -62.8333 }, // Gustavia
    zoom: 13,
    flag: '🇧🇱',
    active: true, // Maintenant actif
  },
  PM: {
    code: 'PM',
    name: 'Saint-Pierre-et-Miquelon',
    fullName: 'Collectivité de Saint-Pierre-et-Miquelon',
    type: 'COM',
    inseeCode: '975',
    center: { lat: 46.7811, lng: -56.1764 }, // Saint-Pierre
    zoom: 11,
    flag: '🇵🇲',
    active: true,
  },

  // ============ Autres territoires ============
  TF: {
    code: 'TF',
    name: 'TAAF',
    fullName: 'Terres australes et antarctiques françaises',
    type: 'Autres',
    inseeCode: '984',
    center: { lat: -49.35, lng: 69.47 }, // Kerguelen
    zoom: 6,
    flag: '🇹🇫',
    active: false, // Pas de population permanente significative
  },
};

/**
 * Obtenir un territoire par son code
 */
export function getTerritoryByCode(code: string): Territory | undefined {
  return TERRITORIES[code.toUpperCase()];
}

/**
 * Obtenir tous les territoires actifs
 */
export function getActiveTerritories(): Territory[] {
  return Object.values(TERRITORIES).filter(t => t.active);
}

/**
 * Obtenir les territoires par type
 */
export function getTerritoriesByType(type: Territory['type']): Territory[] {
  return Object.values(TERRITORIES).filter(t => t.type === type);
}

/**
 * Obtenir un territoire ou défaut (Guadeloupe)
 */
export function getTerritoryOrDefault(code?: string): Territory {
  if (!code) return TERRITORIES.GP;
  const territory = getTerritoryByCode(code);
  return territory || TERRITORIES.GP;
}

/**
 * Liste des codes de territoires actifs
 */
export const ACTIVE_TERRITORY_CODES = Object.keys(TERRITORIES).filter(
  code => TERRITORIES[code].active
);

/**
 * Constante pour "Tous les territoires"
 */
export const ALL_TERRITORIES = 'ALL';

/**
 * Valider un code territoire
 */
export function isValidTerritoryCode(code: string): boolean {
  return code === ALL_TERRITORIES || !!getTerritoryByCode(code);
}

/**
 * Obtenir le nom d'affichage d'un territoire
 */
export function getTerritoryDisplayName(code: string): string {
  if (code === ALL_TERRITORIES) return 'Tous les territoires';
  const territory = getTerritoryByCode(code);
  return territory ? `${territory.flag} ${territory.name}` : code;
}
