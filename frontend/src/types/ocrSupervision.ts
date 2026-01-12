/**
 * OCR Supervision Dashboard Types
 * 
 * Public, aggregated, auditable OCR quality metrics
 * NO individual tracking, NO citizen scoring
 * 
 * Philosophy: "Public transparency, zero surveillance"
 */

export type OCRQualityMetric = {
  metric_name: string;
  value: number;
  unit: string;
  period: string; // e.g., "2026-01"
  methodology: string;
  threshold?: number;
  status: 'good' | 'warning' | 'poor';
};

export type StoreChainQualityReport = {
  store_chain: string;
  territory?: string;
  period: string;
  
  metrics: {
    clear_ocr_rate: number; // Percentage
    truncated_lines_rate: number;
    false_positives_rate: number;
    average_confidence: number;
  };
  
  total_receipts_analyzed: number;
  trends: {
    improving: boolean;
    change_percentage: number;
  };
  
  known_issues: string[];
};

export type TerritoryQualityReport = {
  territory_code: string;
  territory_name: string;
  period: string;
  
  average_quality: number; // 0-100
  total_receipts: number;
  stores_covered: number;
  
  comparison: {
    vs_national: number; // Percentage difference
    vs_previous_period: number;
  };
  
  density_observations: number; // Receipts per 1000 inhabitants
};

export type ProductRecognitionReport = {
  category: string;
  well_recognized: string[]; // Product types
  problematic: string[]; // Product types with OCR issues
  common_errors: Array<{
    error_type: string;
    frequency: number;
    example: string;
  }>;
};

export type SupervisionDashboard = {
  generated_at: Date;
  period: string;
  
  overall_metrics: {
    total_receipts_analyzed: number;
    average_ocr_quality: number;
    stores_tracked: number;
    territories_covered: number;
  };
  
  store_reports: StoreChainQualityReport[];
  territory_reports: TerritoryQualityReport[];
  product_recognition: ProductRecognitionReport[];
  
  methodology: {
    version: string;
    description: string;
    rules_url: string;
    thresholds_url: string;
    limitations: string[];
  };
  
  data_licensing: {
    license: string; // e.g., "Open Data Commons Open Database License (ODbL)"
    attribution: string;
    terms_url: string;
  };
};

/**
 * Transparency metadata for each indicator
 */
export type IndicatorMetadata = {
  name: string;
  description: string;
  calculation_method: string;
  rules_applied: string[];
  thresholds: Record<string, number>;
  known_limitations: string[];
  data_sources: string[];
  update_frequency: string;
};

/**
 * Get indicator metadata (full transparency)
 */
export function getIndicatorMetadata(indicatorName: string): IndicatorMetadata {
  const metadata: Record<string, IndicatorMetadata> = {
    'clear_ocr_rate': {
      name: 'Taux de lignes lisibles',
      description: 'Pourcentage de lignes de ticket correctement lues par l\'OCR',
      calculation_method: 'Nombre de lignes avec confiance > 70% / Total lignes',
      rules_applied: [
        'Confiance OCR minimale: 70%',
        'Exclusion des lignes vides',
        'Exclusion des faux positifs détectés',
      ],
      thresholds: {
        good: 80,
        warning: 60,
        poor: 0,
      },
      known_limitations: [
        'Dépend de la qualité du papier thermique',
        'Varie selon la taille du texte',
        'Influencé par les conditions de prise de photo',
      ],
      data_sources: ['OCR Tesseract.js', 'Validation utilisateur'],
      update_frequency: 'Mensuel',
    },
    
    'truncated_lines_rate': {
      name: 'Taux de lignes tronquées',
      description: 'Pourcentage de lignes incomplètes détectées',
      calculation_method: 'Lignes sans prix ou texte < 3 caractères / Total lignes',
      rules_applied: [
        'Détection absence de prix',
        'Détection texte très court',
        'Détection caractères spéciaux excessifs',
      ],
      thresholds: {
        good: 0,
        warning: 5,
        poor: 10,
      },
      known_limitations: [
        'Certaines lignes légitimes peuvent être courtes',
        'Dépend du format du ticket',
      ],
      data_sources: ['OCR Tesseract.js', 'Heuristiques locales'],
      update_frequency: 'Mensuel',
    },
    
    'false_positives_rate': {
      name: 'Taux de faux positifs',
      description: 'Pourcentage de lignes non-produits détectées',
      calculation_method: 'Lignes filtrées (CB, dates, etc.) / Total lignes OCR',
      rules_applied: [
        'Détection patterns "TICKET", "CB", "MERCI"',
        'Détection dates (DD/MM/YYYY)',
        'Détection heures (HH:MM:SS)',
        'Détection références internes',
      ],
      thresholds: {
        good: 0,
        warning: 3,
        poor: 8,
      },
      known_limitations: [
        'Nouveaux formats de ticket non détectés',
        'Variations régionales',
      ],
      data_sources: ['Module AI local', 'Patterns définis'],
      update_frequency: 'Mensuel',
    },
  };
  
  return metadata[indicatorName] || {
    name: indicatorName,
    description: 'Métadonnées non disponibles',
    calculation_method: 'Non spécifié',
    rules_applied: [],
    thresholds: {},
    known_limitations: [],
    data_sources: [],
    update_frequency: 'Inconnu',
  };
}

/**
 * Public access levels
 */
export type AccessLevel = 'public' | 'authority' | 'researcher';

/**
 * Get available dashboard features by access level
 */
export function getDashboardFeatures(accessLevel: AccessLevel): {
  view_overall: boolean;
  view_by_store: boolean;
  view_by_territory: boolean;
  view_by_product: boolean;
  export_data: boolean;
  historical_data: boolean;
} {
  return {
    view_overall: true, // Everyone can view overall stats
    view_by_store: true, // Everyone can view store stats
    view_by_territory: true, // Everyone can view territory stats
    view_by_product: accessLevel !== 'public', // Only authority/researcher
    export_data: accessLevel !== 'public', // Only authority/researcher
    historical_data: accessLevel === 'researcher', // Only researchers
  };
}

/**
 * Dashboard warnings and disclaimers
 */
export const DASHBOARD_DISCLAIMERS = {
  privacy: 'Ce tableau de bord ne contient aucune donnée individuelle. Toutes les métriques sont agrégées.',
  methodology: 'La méthodologie complète est disponible publiquement et auditable.',
  no_scoring: 'Ces indicateurs mesurent la qualité documentaire, pas la politique commerciale des enseignes.',
  limitations: 'Les limites connues de chaque indicateur sont documentées et accessibles.',
  open_data: 'Les données agrégées sont disponibles sous licence open data.',
};
