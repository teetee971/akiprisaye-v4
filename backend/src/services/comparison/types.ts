/**
 * Types stricts pour le système de comparaison de services citoyens
 * Version: 1.6.0
 * 
 * Conformité:
 * - Lecture seule - Données observées uniquement
 * - Aucune recommandation - Aucun scoring
 * - Multi-territoires - Historique temporel
 * - Sources traçables - Agrégation statistique
 */

/**
 * Territoire géographique pour la comparaison
 */
export enum Territory {
  DOM = 'DOM',
  COM = 'COM',
  FRANCE_HEXAGONALE = 'FRANCE_HEXAGONALE',
  GUADELOUPE = 'GUADELOUPE',
  MARTINIQUE = 'MARTINIQUE',
  GUYANE = 'GUYANE',
  LA_REUNION = 'LA_REUNION',
  MAYOTTE = 'MAYOTTE',
  SAINT_MARTIN = 'SAINT_MARTIN',
  SAINT_BARTHELEMY = 'SAINT_BARTHELEMY',
  SAINT_PIERRE_ET_MIQUELON = 'SAINT_PIERRE_ET_MIQUELON',
  WALLIS_ET_FUTUNA = 'WALLIS_ET_FUTUNA',
  POLYNESIE_FRANCAISE = 'POLYNESIE_FRANCAISE',
  NOUVELLE_CALEDONIE = 'NOUVELLE_CALEDONIE',
}

/**
 * Source de données traçable
 */
export interface DataSource {
  /** Origine de la donnée (ex: "observation directe", "open data officiel") */
  origin: string;
  /** Date d'observation */
  observationDate: Date;
  /** Volume de données observées */
  sampleSize: number;
  /** Méthode de collecte */
  collectionMethod?: string;
  /** Niveau de confiance (0-1) */
  confidenceLevel?: number;
}

/**
 * Offre de service observée
 */
export interface ServiceOffer {
  /** Identifiant unique de l'offre */
  id: string;
  /** Nom du fournisseur */
  providerName: string;
  /** Nom de l'offre */
  offerName: string;
  /** Prix TTC observé (en euros) */
  priceIncludingTax: number;
  /** Territoire où l'offre est disponible */
  territory: Territory;
  /** Caractéristiques techniques observées */
  specifications: Record<string, string | number | boolean>;
  /** Source de la donnée */
  source: DataSource;
  /** Date de validité de l'offre */
  validFrom: Date;
  /** Date de fin de validité (optionnelle) */
  validUntil?: Date;
  /** Conditions d'engagement */
  commitment?: {
    duration?: number; // en mois
    earlyTerminationFee?: number;
  };
}

/**
 * Statistiques d'agrégation
 */
export interface AggregationStats {
  /** Prix minimum observé */
  min: number;
  /** Prix maximum observé */
  max: number;
  /** Prix moyen */
  average: number;
  /** Médiane des prix */
  median: number;
  /** Écart-type */
  standardDeviation: number;
  /** Nombre d'offres dans l'échantillon */
  sampleSize: number;
  /** Date de calcul */
  calculatedAt: Date;
}

/**
 * Classement d'une offre
 */
export interface RankedOffer extends ServiceOffer {
  /** Position dans le classement (1 = moins cher) */
  rank: number;
  /** Écart avec l'offre la moins chère (en euros) */
  differenceFromCheapest: number;
  /** Écart avec l'offre la moins chère (en %) */
  percentageFromCheapest: number;
  /** Écart avec la moyenne (en euros) */
  differenceFromAverage: number;
  /** Écart avec la moyenne (en %) */
  percentageFromAverage: number;
  /** Catégorie relative */
  category: 'cheapest' | 'below_average' | 'average' | 'above_average' | 'most_expensive';
}

/**
 * Résultat de comparaison de services
 */
export interface ServiceComparisonResult {
  /** Type de service comparé */
  serviceType: string;
  /** Territoire de la comparaison */
  territory: Territory;
  /** Liste des offres classées (du moins cher au plus cher) */
  rankedOffers: RankedOffer[];
  /** Statistiques d'agrégation */
  statistics: AggregationStats;
  /** Métadonnées de la comparaison */
  metadata: {
    /** Date de la comparaison */
    comparisonDate: Date;
    /** Nombre total d'offres comparées */
    totalOffers: number;
    /** Filtres appliqués */
    appliedFilters?: Record<string, unknown>;
    /** Version de la méthodologie */
    methodologyVersion: string;
  };
}

/**
 * Point dans l'historique temporel
 */
export interface HistoryDataPoint {
  /** Date du point */
  date: Date;
  /** Prix moyen observé */
  averagePrice: number;
  /** Prix minimum observé */
  minPrice: number;
  /** Prix maximum observé */
  maxPrice: number;
  /** Nombre d'offres observées */
  offerCount: number;
  /** Source des données */
  source: DataSource;
}

/**
 * Historique temporel d'un service
 */
export interface ServiceHistory {
  /** Type de service */
  serviceType: string;
  /** Territoire */
  territory: Territory;
  /** Filtres appliqués */
  filters?: Record<string, unknown>;
  /** Série temporelle */
  timeSeries: HistoryDataPoint[];
  /** Période couverte */
  period: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Comparaison inter-territoires
 */
export interface TerritoryComparison {
  /** Type de service */
  serviceType: string;
  /** Territoires comparés */
  territories: Territory[];
  /** Résultats par territoire */
  results: Map<Territory, {
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    offerCount: number;
  }>;
  /** Date de comparaison */
  comparisonDate: Date;
}

/**
 * Filtres de recherche pour les offres
 */
export interface ServiceFilters {
  /** Territoire(s) */
  territories?: Territory[];
  /** Prix minimum */
  minPrice?: number;
  /** Prix maximum */
  maxPrice?: number;
  /** Filtres spécifiques au type de service */
  specificFilters?: Record<string, unknown>;
  /** Date de début pour l'historique */
  startDate?: Date;
  /** Date de fin pour l'historique */
  endDate?: Date;
}

/**
 * Métadonnées d'export open-data
 */
export interface OpenDataExport {
  /** Version du schéma */
  schemaVersion: string;
  /** Date de génération */
  generatedAt: Date;
  /** Licence */
  license: string;
  /** Attribution */
  attribution: string;
  /** Données exportées */
  data: ServiceComparisonResult | ServiceHistory | TerritoryComparison;
}
