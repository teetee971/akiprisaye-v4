/**
 * GasComparisonService - Comparateur citoyen de gaz
 * Version: 1.6.1
 * 
 * Conformité:
 * - Lecture seule - Données observées uniquement
 * - Aucune recommandation - Classement objectif
 * - Multi-territoires - Historique temporel
 * - Sources traçables
 * 
 * Données observées:
 * - Prix TTC (€/kWh ou abonnement mensuel)
 * - Classe de consommation
 * - Zone tarifaire
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
 * Spécifications d'une offre gaz
 */
export interface GasSpecifications {
  /** Classe de consommation (Base, B0, B1, B2i) */
  consumptionClass: 'base' | 'B0' | 'B1' | 'B2i';
  /** Zone tarifaire (1 à 6) */
  tariffZone?: number;
  /** Prix de l'abonnement mensuel TTC en € */
  subscriptionPriceMonthly: number;
  /** Prix du kWh TTC en € */
  pricePerKwh: number;
  /** Type de gaz */
  gasType?: 'naturel' | 'propane' | 'butane';
  /** Engagement (en mois) */
  commitmentMonths?: number;
}

/**
 * Filtres spécifiques pour le gaz
 */
export interface GasFilters extends Omit<ServiceFilters, 'specificFilters'> {
  /** Classe de consommation */
  consumptionClass?: GasSpecifications['consumptionClass'];
  /** Zone tarifaire */
  tariffZone?: number;
  /** Consommation annuelle estimée en kWh */
  estimatedAnnualConsumption?: number;
}

export class GasComparisonService extends ServiceComparisonCore {
  private static instance: GasComparisonService;
  private mockData: ServiceOffer[] = [];

  private constructor() {
    super('gas');
  }

  /**
   * Singleton pattern
   */
  public static getInstance(): GasComparisonService {
    if (!GasComparisonService.instance) {
      GasComparisonService.instance = new GasComparisonService();
    }
    return GasComparisonService.instance;
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

    // Filtres spécifiques au gaz
    if (filters.specificFilters) {
      const gasFilters = filters.specificFilters as Partial<GasFilters>;

      if (gasFilters.consumptionClass) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as GasSpecifications;
          return specs.consumptionClass === gasFilters.consumptionClass;
        });
      }

      if (gasFilters.tariffZone !== undefined) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as GasSpecifications;
          return specs.tariffZone === gasFilters.tariffZone;
        });
      }
    }

    // Validation des offres
    offers = offers.filter((o) => this.validateOffer(o));

    return offers;
  }

  /**
   * Calcule le coût annuel estimé d'une offre
   */
  public calculateAnnualCost(
    offer: ServiceOffer,
    annualConsumptionKwh: number,
  ): number {
    const specs = offer.specifications as unknown as GasSpecifications;

    // Coût de l'abonnement annuel
    const subscriptionCost = specs.subscriptionPriceMonthly * 12;

    // Coût de la consommation
    const consumptionCost = annualConsumptionKwh * specs.pricePerKwh;

    return Math.round((subscriptionCost + consumptionCost) * 100) / 100;
  }

  /**
   * Compare les offres avec un coût annuel estimé
   */
  public async compareWithEstimatedCost(
    territory: Territory,
    annualConsumptionKwh: number,
    filters?: GasFilters,
  ) {
    const result = await this.compareOffers(territory, filters);

    const rankedWithEstimatedCost = result.rankedOffers.map((offer) => ({
      ...offer,
      estimatedAnnualCost: this.calculateAnnualCost(offer, annualConsumptionKwh),
    }));

    return {
      ...result,
      rankedOffers: rankedWithEstimatedCost,
      metadata: {
        ...result.metadata,
        estimatedAnnualConsumption: annualConsumptionKwh,
      },
    };
  }
}

/**
 * Helper pour créer une offre gaz
 */
export function createGasOffer(
  id: string,
  providerName: string,
  offerName: string,
  territory: Territory,
  specifications: GasSpecifications,
  source: DataSource,
  validFrom: Date = new Date(),
): ServiceOffer {
  // Le prix affiché est le coût mensuel moyen pour un usage standard
  // (abonnement + consommation de 10000 kWh/an)
  const estimatedMonthlyCost =
    specifications.subscriptionPriceMonthly +
    ((10000 / 12) * specifications.pricePerKwh);

  return {
    id,
    providerName,
    offerName,
    priceIncludingTax: Math.round(estimatedMonthlyCost * 100) / 100,
    territory,
    specifications: specifications as unknown as Record<string, string | number | boolean>,
    source,
    validFrom,
  };
}
