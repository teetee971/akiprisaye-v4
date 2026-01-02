/**
 * InternetComparisonService - Comparateur citoyen Internet fixe
 * Version: 1.7.0
 * 
 * Conformité:
 * - Lecture seule - Données observées uniquement
 * - Aucune recommandation - Classement objectif
 * - Multi-territoires - Historique temporel
 * - Sources traçables
 * 
 * Données observées:
 * - Prix TTC mensuel
 * - Débit annoncé (sans promesse contractuelle)
 * - Volume data (limité/illimité)
 * - Engagement
 * - Territoire
 * - Date d'observation
 * - Source
 */

import { ServiceComparisonCore } from '../ServiceComparisonCore.js';
import {
  ServiceOffer,
  ServiceFilters,
  Territory,
  DataSource,
} from '../types.js';

/**
 * Spécifications d'une offre Internet fixe
 */
export interface InternetSpecifications {
  /** Type de technologie */
  technology: 'fibre' | 'adsl' | 'vdsl' | 'cable' | 'satellite' | '4g_box' | '5g_box';
  /** Débit descendant annoncé en Mbit/s */
  downloadSpeedMbps: number;
  /** Débit montant annoncé en Mbit/s */
  uploadSpeedMbps?: number;
  /** Volume de données */
  dataVolume: 'unlimited' | 'limited';
  /** Limite de données si applicable (en Go) */
  dataLimitGb?: number;
  /** Prix mensuel TTC en € */
  monthlyPrice: number;
  /** Durée d'engagement en mois */
  commitmentMonths?: number;
  /** Frais d'activation TTC en € */
  activationFee?: number;
  /** Services inclus */
  includedServices?: string[];
}

/**
 * Filtres spécifiques pour Internet
 */
export interface InternetFilters extends Omit<ServiceFilters, 'specificFilters'> {
  /** Technologie */
  technology?: InternetSpecifications['technology'];
  /** Débit minimum en Mbit/s */
  minDownloadSpeed?: number;
  /** Volume de données */
  dataVolume?: InternetSpecifications['dataVolume'];
}

export class InternetComparisonService extends ServiceComparisonCore {
  private static instance: InternetComparisonService;
  private mockData: ServiceOffer[] = [];

  private constructor() {
    super('internet_fixed');
  }

  /**
   * Singleton pattern
   */
  public static getInstance(): InternetComparisonService {
    if (!InternetComparisonService.instance) {
      InternetComparisonService.instance = new InternetComparisonService();
    }
    return InternetComparisonService.instance;
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

    // Filtres spécifiques à Internet
    if (filters.specificFilters) {
      const internetFilters = filters.specificFilters as Partial<InternetFilters>;

      if (internetFilters.technology) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as InternetSpecifications;
          return specs.technology === internetFilters.technology;
        });
      }

      if (internetFilters.minDownloadSpeed !== undefined) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as InternetSpecifications;
          return specs.downloadSpeedMbps >= internetFilters.minDownloadSpeed!;
        });
      }

      if (internetFilters.dataVolume) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as InternetSpecifications;
          return specs.dataVolume === internetFilters.dataVolume;
        });
      }
    }

    // Validation des offres
    offers = offers.filter((o) => this.validateOffer(o));

    return offers;
  }

  /**
   * Calcule le coût total sur la durée d'engagement
   */
  public calculateTotalCost(offer: ServiceOffer): number {
    const specs = offer.specifications as unknown as InternetSpecifications;
    
    const commitmentMonths = specs.commitmentMonths || 12;
    const monthlyTotal = specs.monthlyPrice * commitmentMonths;
    const activationFee = specs.activationFee || 0;
    
    return Math.round((monthlyTotal + activationFee) * 100) / 100;
  }
}

/**
 * Helper pour créer une offre Internet
 */
export function createInternetOffer(
  id: string,
  providerName: string,
  offerName: string,
  territory: Territory,
  specifications: InternetSpecifications,
  source: DataSource,
  validFrom: Date = new Date(),
): ServiceOffer {
  return {
    id,
    providerName,
    offerName,
    priceIncludingTax: specifications.monthlyPrice,
    territory,
    specifications: specifications as unknown as Record<string, string | number | boolean>,
    source,
    validFrom,
    commitment: specifications.commitmentMonths
      ? { duration: specifications.commitmentMonths }
      : undefined,
  };
}
