/**
 * Local Product Reference Dictionary
 * 
 * Embedded reference for common DOM products
 * Used for fuzzy matching and OCR correction assistance
 * 
 * NO exhaustive catalog - just common items
 * NO prices stored
 * Updates via app (optional)
 */

export type ProductReference = {
  id: string;
  normalized_name: string;
  common_variants: string[];
  category: 'alimentaire' | 'boisson' | 'hygiene' | 'menage' | 'autre';
  common_formats: string[];
  typical_unit_price_range?: {
    min: number;
    max: number;
    unit: string;
  };
};

/**
 * Embedded product dictionary for DOM territories
 * Focus on most common items with OCR variations
 */
export const PRODUCT_REFERENCE_DICTIONARY: ProductReference[] = [
  // Dairy Products
  {
    id: 'lait-demi-ecreme',
    normalized_name: 'Lait demi-écrémé',
    common_variants: [
      'LAIT DEMI ECREME',
      'LAIT 1/2 ECREME',
      'LAIT DEMI ECRFME', // Common OCR error
      'LAIT DFMI ECREME',
      'LA1T DEMI ECREME',
    ],
    category: 'alimentaire',
    common_formats: ['1L', '1 L', '1LITRE', '500ML'],
    typical_unit_price_range: {
      min: 0.5,
      max: 3.0,
      unit: 'L',
    },
  },
  {
    id: 'lait-entier',
    normalized_name: 'Lait entier',
    common_variants: [
      'LAIT ENTIER',
      'LAIT ENT1ER', // OCR error
      'LA1T ENTIER',
      'LAIT ENTIFR',
    ],
    category: 'alimentaire',
    common_formats: ['1L', '1 L', '500ML'],
    typical_unit_price_range: {
      min: 0.5,
      max: 3.0,
      unit: 'L',
    },
  },
  
  // Rice & Pasta
  {
    id: 'riz-long',
    normalized_name: 'Riz long grain',
    common_variants: [
      'RIZ LONG',
      'RIZ LONG GRAIN',
      'R1Z LONG',
      'RlZ LONG', // OCR l/I confusion
    ],
    category: 'alimentaire',
    common_formats: ['1KG', '1 KG', '500G', '2KG'],
    typical_unit_price_range: {
      min: 1.0,
      max: 5.0,
      unit: 'KG',
    },
  },
  {
    id: 'pates',
    normalized_name: 'Pâtes',
    common_variants: [
      'PATES',
      'PÄTES',
      'PATES ALIMENTAIRES',
      'PATFS', // OCR error
    ],
    category: 'alimentaire',
    common_formats: ['500G', '1KG', '250G'],
    typical_unit_price_range: {
      min: 0.5,
      max: 3.0,
      unit: 'KG',
    },
  },

  // Beverages
  {
    id: 'eau-minerale',
    normalized_name: 'Eau minérale',
    common_variants: [
      'EAU MINERALE',
      'EAU MIN',
      'FAU MINERALE', // OCR error
      'EAU MINFRALE',
    ],
    category: 'boisson',
    common_formats: ['1.5L', '1,5L', '6X1.5L', 'PACK 6'],
    typical_unit_price_range: {
      min: 0.2,
      max: 2.0,
      unit: 'L',
    },
  },
  {
    id: 'jus-orange',
    normalized_name: 'Jus d\'orange',
    common_variants: [
      'JUS ORANGE',
      'JUS D ORANGE',
      'JUS ORANG',
      'JU5 ORANGE', // OCR error
    ],
    category: 'boisson',
    common_formats: ['1L', '2L', '200ML'],
    typical_unit_price_range: {
      min: 1.0,
      max: 5.0,
      unit: 'L',
    },
  },

  // Hygiene
  {
    id: 'papier-toilette',
    normalized_name: 'Papier toilette',
    common_variants: [
      'PAPIER TOILETTE',
      'PAPIER WC',
      'PAP TOILETTE',
      'PAPIFR TOILETTE', // OCR error
    ],
    category: 'hygiene',
    common_formats: ['6 ROULEAUX', '12 ROULEAUX', 'PACK 6'],
    typical_unit_price_range: {
      min: 2.0,
      max: 10.0,
      unit: 'pack',
    },
  },

  // Cleaning
  {
    id: 'lessive',
    normalized_name: 'Lessive',
    common_variants: [
      'LESSIVE',
      'LESSIVE LIQUIDE',
      'LFSSIVE', // OCR error
      'LESSIVE LIQ',
    ],
    category: 'menage',
    common_formats: ['1L', '2L', '3L'],
    typical_unit_price_range: {
      min: 3.0,
      max: 15.0,
      unit: 'L',
    },
  },

  // Bread & Bakery
  {
    id: 'pain',
    normalized_name: 'Pain',
    common_variants: [
      'PAIN',
      'PAIN DE MIE',
      'PA1N', // OCR error
      'PAlN',
    ],
    category: 'alimentaire',
    common_formats: ['500G', '400G', '300G'],
    typical_unit_price_range: {
      min: 0.5,
      max: 3.0,
      unit: 'unit',
    },
  },

  // Meat
  {
    id: 'poulet',
    normalized_name: 'Poulet',
    common_variants: [
      'POULET',
      'POULET ENTIER',
      'POULFT', // OCR error
      'P0ULET',
    ],
    category: 'alimentaire',
    common_formats: ['KG', '1KG', 'PIECE'],
    typical_unit_price_range: {
      min: 3.0,
      max: 12.0,
      unit: 'KG',
    },
  },

  // Fruits & Vegetables
  {
    id: 'banane',
    normalized_name: 'Banane',
    common_variants: [
      'BANANE',
      'BANANES',
      'BANANF', // OCR error
      'BANANA',
    ],
    category: 'alimentaire',
    common_formats: ['KG', '1KG'],
    typical_unit_price_range: {
      min: 1.0,
      max: 4.0,
      unit: 'KG',
    },
  },
  {
    id: 'tomate',
    normalized_name: 'Tomate',
    common_variants: [
      'TOMATE',
      'TOMATES',
      'TOMATF', // OCR error
      'T0MATE',
    ],
    category: 'alimentaire',
    common_formats: ['KG', '500G'],
    typical_unit_price_range: {
      min: 1.5,
      max: 5.0,
      unit: 'KG',
    },
  },
];

/**
 * Get product reference by ID
 */
export function getProductReference(id: string): ProductReference | null {
  return PRODUCT_REFERENCE_DICTIONARY.find(p => p.id === id) || null;
}

/**
 * Search product references by normalized name
 */
export function searchProductsByName(query: string): ProductReference[] {
  const normalizedQuery = query.toUpperCase().trim();
  return PRODUCT_REFERENCE_DICTIONARY.filter(p =>
    p.normalized_name.toUpperCase().includes(normalizedQuery) ||
    p.common_variants.some(v => v.includes(normalizedQuery))
  );
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: ProductReference['category']): ProductReference[] {
  return PRODUCT_REFERENCE_DICTIONARY.filter(p => p.category === category);
}

/**
 * Get product statistics
 */
export function getProductDictionaryStats(): {
  total: number;
  by_category: Record<string, number>;
} {
  const stats = {
    total: PRODUCT_REFERENCE_DICTIONARY.length,
    by_category: {} as Record<string, number>,
  };

  for (const product of PRODUCT_REFERENCE_DICTIONARY) {
    stats.by_category[product.category] = (stats.by_category[product.category] || 0) + 1;
  }

  return stats;
}

/**
 * Dictionary version for updates
 */
export const DICTIONARY_VERSION = '1.0.0';
export const DICTIONARY_LAST_UPDATE = '2026-01-12';
