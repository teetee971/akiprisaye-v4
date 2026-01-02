/**
 * Insurance Comparison Service - Comparateur citoyen d'assurances
 * Version: 1.8.0
 * 
 * Conformité:
 * - Lecture seule - Données observées uniquement
 * - Aucune recommandation - Classement objectif par coût
 * - Aucun conseil - Aucun scoring propriétaire
 * - Multi-territoires - Historique temporel
 * - Sources traçables
 * 
 * Types d'assurances:
 * - Auto (véhicules)
 * - Habitation (logement)
 * - Santé (complémentaire santé)
 */

import { ServiceComparisonCore } from '../ServiceComparisonCore.js';
import {
  ServiceOffer,
  ServiceFilters,
  Territory,
  DataSource,
} from '../types.js';

/**
 * Type d'assurance
 */
export enum InsuranceType {
  AUTO = 'auto',
  HOME = 'home',
  HEALTH = 'health',
}

/**
 * Niveau de couverture (descriptif uniquement)
 */
export enum CoverageLevel {
  BASIC = 'basic',           // Tiers / Base
  INTERMEDIATE = 'intermediate', // Tiers étendu / Intermédiaire
  COMPREHENSIVE = 'comprehensive', // Tous risques / Complète
}

/**
 * Spécifications communes aux assurances
 */
export interface BaseInsuranceSpecifications {
  /** Type d'assurance */
  insuranceType: InsuranceType;
  /** Niveau de couverture descriptif */
  coverageLevel: CoverageLevel;
  /** Prix annuel TTC observé en € */
  annualPriceTTC: number;
  /** Franchise observée en € (si applicable) */
  deductible?: number;
  /** Garanties principales (liste descriptive) */
  mainCoverages: string[];
  /** Exclusions observées (liste descriptive) */
  exclusions?: string[];
}

/**
 * Spécifications assurance auto
 */
export interface AutoInsuranceSpecifications extends BaseInsuranceSpecifications {
  insuranceType: InsuranceType.AUTO;
  /** Type de véhicule */
  vehicleType?: 'car' | 'motorcycle' | 'utility';
  /** Âge du conducteur (tranche) */
  driverAgeRange?: string; // Ex: "18-25", "26-65", "65+"
  /** Bonus/malus observé */
  bonusMalus?: number;
}

/**
 * Spécifications assurance habitation
 */
export interface HomeInsuranceSpecifications extends BaseInsuranceSpecifications {
  insuranceType: InsuranceType.HOME;
  /** Type de logement */
  housingType?: 'apartment' | 'house';
  /** Surface en m² */
  surfaceM2?: number;
  /** Statut occupant */
  occupantStatus?: 'owner' | 'tenant';
}

/**
 * Spécifications assurance santé
 */
export interface HealthInsuranceSpecifications extends BaseInsuranceSpecifications {
  insuranceType: InsuranceType.HEALTH;
  /** Type de contrat */
  contractType?: 'individual' | 'family';
  /** Nombre de bénéficiaires */
  beneficiariesCount?: number;
  /** Remboursements principaux (% ou montants observés) */
  mainReimbursements?: Record<string, string>;
}

/**
 * Union type pour toutes les spécifications d'assurance
 */
export type InsuranceSpecifications =
  | AutoInsuranceSpecifications
  | HomeInsuranceSpecifications
  | HealthInsuranceSpecifications;

/**
 * Filtres spécifiques pour les assurances
 */
export interface InsuranceFilters extends Omit<ServiceFilters, 'specificFilters'> {
  /** Type d'assurance */
  insuranceType?: InsuranceType;
  /** Niveau de couverture */
  coverageLevel?: CoverageLevel;
  /** Prix annuel maximum */
  maxAnnualPrice?: number;
}

/**
 * Service de comparaison d'assurances
 */
export class InsuranceComparisonService extends ServiceComparisonCore {
  private static instance: InsuranceComparisonService;
  private mockData: ServiceOffer[] = [];

  private constructor() {
    super('insurance');
  }

  /**
   * Singleton pattern
   */
  public static getInstance(): InsuranceComparisonService {
    if (!InsuranceComparisonService.instance) {
      InsuranceComparisonService.instance = new InsuranceComparisonService();
    }
    return InsuranceComparisonService.instance;
  }

  /**
   * Configure les données mockées (pour développement/test)
   */
  public setMockData(offers: ServiceOffer[]): void {
    this.mockData = offers;
  }

  /**
   * Récupère les offres depuis la source de données
   */
  protected async fetchOffers(filters: ServiceFilters): Promise<ServiceOffer[]> {
    let offers = [...this.mockData];

    // Filtrage par territoire
    if (filters.territories && filters.territories.length > 0) {
      offers = offers.filter((o) => filters.territories!.includes(o.territory));
    }

    // Filtrage par prix
    if (filters.minPrice !== undefined) {
      offers = offers.filter((o) => o.priceIncludingTax >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      offers = offers.filter((o) => o.priceIncludingTax <= filters.maxPrice!);
    }

    // Filtrage par date
    if (filters.startDate) {
      offers = offers.filter((o) => o.validFrom >= filters.startDate!);
    }
    if (filters.endDate) {
      offers = offers.filter(
        (o) => !o.validUntil || o.validUntil <= filters.endDate!,
      );
    }

    // Filtres spécifiques aux assurances
    if (filters.specificFilters) {
      const insuranceFilters = filters.specificFilters as Partial<InsuranceFilters>;

      if (insuranceFilters.insuranceType) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as InsuranceSpecifications;
          return specs.insuranceType === insuranceFilters.insuranceType;
        });
      }

      if (insuranceFilters.coverageLevel) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as InsuranceSpecifications;
          return specs.coverageLevel === insuranceFilters.coverageLevel;
        });
      }

      if (insuranceFilters.maxAnnualPrice !== undefined) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as InsuranceSpecifications;
          return specs.annualPriceTTC <= insuranceFilters.maxAnnualPrice!;
        });
      }
    }

    // Validation des offres
    offers = offers.filter((o) => this.validateOffer(o));

    return offers;
  }
}

/**
 * Helpers pour créer des offres d'assurance
 */
export function createAutoInsuranceOffer(
  id: string,
  providerName: string,
  offerName: string,
  territory: Territory,
  specifications: AutoInsuranceSpecifications,
  source: DataSource,
  validFrom: Date = new Date(),
): ServiceOffer {
  return {
    id,
    providerName,
    offerName,
    priceIncludingTax: specifications.annualPriceTTC,
    territory,
    specifications: specifications as unknown as Record<string, string | number | boolean>,
    source,
    validFrom,
  };
}

export function createHomeInsuranceOffer(
  id: string,
  providerName: string,
  offerName: string,
  territory: Territory,
  specifications: HomeInsuranceSpecifications,
  source: DataSource,
  validFrom: Date = new Date(),
): ServiceOffer {
  return {
    id,
    providerName,
    offerName,
    priceIncludingTax: specifications.annualPriceTTC,
    territory,
    specifications: specifications as unknown as Record<string, string | number | boolean>,
    source,
    validFrom,
  };
}

export function createHealthInsuranceOffer(
  id: string,
  providerName: string,
  offerName: string,
  territory: Territory,
  specifications: HealthInsuranceSpecifications,
  source: DataSource,
  validFrom: Date = new Date(),
): ServiceOffer {
  return {
    id,
    providerName,
    offerName,
    priceIncludingTax: specifications.annualPriceTTC,
    territory,
    specifications: specifications as unknown as Record<string, string | number | boolean>,
    source,
    validFrom,
  };
}
