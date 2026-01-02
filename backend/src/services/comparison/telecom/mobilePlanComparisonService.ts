/**
 * MobilePlanComparisonService - Comparateur citoyen forfaits mobile
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
 * - Volume data (Go)
 * - Appels/SMS
 * - Réseau (4G/5G)
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
 * Spécifications d'une offre mobile
 */
export interface MobilePlanSpecifications {
  /** Volume de données en Go */
  dataVolumeGb: number | 'unlimited';
  /** Appels inclus */
  calls: 'unlimited' | 'limited' | 'none';
  /** Minutes si limité */
  callMinutes?: number;
  /** SMS inclus */
  sms: 'unlimited' | 'limited' | 'none';
  /** Nombre de SMS si limité */
  smsCount?: number;
  /** Réseau disponible */
  network: '3g' | '4g' | '5g';
  /** Prix mensuel TTC en € */
  monthlyPrice: number;
  /** Durée d'engagement en mois */
  commitmentMonths?: number;
  /** Frais d'activation TTC en € */
  activationFee?: number;
  /** Roaming international inclus */
  internationalRoaming?: boolean;
  /** Pays inclus en roaming */
  roamingCountries?: string[];
}

/**
 * Filtres spécifiques pour mobile
 */
export interface MobilePlanFilters extends Omit<ServiceFilters, 'specificFilters'> {
  /** Volume minimum de données en Go */
  minDataVolumeGb?: number;
  /** Appels illimités requis */
  unlimitedCalls?: boolean;
  /** SMS illimités requis */
  unlimitedSms?: boolean;
  /** Réseau minimum */
  minNetwork?: MobilePlanSpecifications['network'];
}

export class MobilePlanComparisonService extends ServiceComparisonCore {
  private static instance: MobilePlanComparisonService;
  private mockData: ServiceOffer[] = [];

  private constructor() {
    super('mobile_plan');
  }

  /**
   * Singleton pattern
   */
  public static getInstance(): MobilePlanComparisonService {
    if (!MobilePlanComparisonService.instance) {
      MobilePlanComparisonService.instance = new MobilePlanComparisonService();
    }
    return MobilePlanComparisonService.instance;
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

    // Filtres spécifiques au mobile
    if (filters.specificFilters) {
      const mobileFilters = filters.specificFilters as Partial<MobilePlanFilters>;

      if (mobileFilters.minDataVolumeGb !== undefined) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as MobilePlanSpecifications;
          if (specs.dataVolumeGb === 'unlimited') return true;
          return specs.dataVolumeGb >= mobileFilters.minDataVolumeGb!;
        });
      }

      if (mobileFilters.unlimitedCalls) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as MobilePlanSpecifications;
          return specs.calls === 'unlimited';
        });
      }

      if (mobileFilters.unlimitedSms) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as MobilePlanSpecifications;
          return specs.sms === 'unlimited';
        });
      }

      if (mobileFilters.minNetwork) {
        const networkOrder = { '3g': 0, '4g': 1, '5g': 2 };
        const minLevel = networkOrder[mobileFilters.minNetwork];
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as MobilePlanSpecifications;
          return networkOrder[specs.network] >= minLevel;
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
    const specs = offer.specifications as unknown as MobilePlanSpecifications;
    
    const commitmentMonths = specs.commitmentMonths || 12;
    const monthlyTotal = specs.monthlyPrice * commitmentMonths;
    const activationFee = specs.activationFee || 0;
    
    return Math.round((monthlyTotal + activationFee) * 100) / 100;
  }
}

/**
 * Helper pour créer une offre mobile
 */
export function createMobilePlanOffer(
  id: string,
  providerName: string,
  offerName: string,
  territory: Territory,
  specifications: MobilePlanSpecifications,
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
