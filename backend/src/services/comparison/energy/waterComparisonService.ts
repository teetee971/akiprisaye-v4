/**
 * WaterComparisonService - Comparateur citoyen d'eau
 * Version: 1.6.1
 * 
 * Conformité:
 * - Lecture seule - Données observées uniquement
 * - Aucune recommandation - Classement objectif
 * - Multi-territoires - Historique temporel
 * - Sources traçables
 * 
 * Données observées:
 * - Prix TTC (€/m³ ou abonnement)
 * - Type de service (eau potable, assainissement, combiné)
 * - Fournisseur
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
 * Spécifications d'une offre eau
 */
export interface WaterSpecifications {
  /** Type de service */
  serviceType: 'eau_potable' | 'assainissement' | 'combine';
  /** Prix de l'abonnement annuel TTC en € */
  subscriptionPriceAnnual: number;
  /** Prix du m³ TTC en € (eau potable) */
  pricePerCubicMeter: number;
  /** Prix du m³ assainissement TTC en € (si applicable) */
  pricePerCubicMeterSanitation?: number;
  /** Redevances et taxes incluses */
  taxesIncluded?: boolean;
  /** Type de gestion */
  managementType?: 'regie' | 'dsp' | 'affermage';
}

/**
 * Filtres spécifiques pour l'eau
 */
export interface WaterFilters extends Omit<ServiceFilters, 'specificFilters'> {
  /** Type de service */
  serviceType?: WaterSpecifications['serviceType'];
  /** Consommation annuelle estimée en m³ */
  estimatedAnnualConsumption?: number;
}

export class WaterComparisonService extends ServiceComparisonCore {
  private static instance: WaterComparisonService;
  private mockData: ServiceOffer[] = [];

  private constructor() {
    super('water');
  }

  /**
   * Singleton pattern
   */
  public static getInstance(): WaterComparisonService {
    if (!WaterComparisonService.instance) {
      WaterComparisonService.instance = new WaterComparisonService();
    }
    return WaterComparisonService.instance;
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

    // Filtres spécifiques à l'eau
    if (filters.specificFilters) {
      const waterFilters = filters.specificFilters as Partial<WaterFilters>;

      if (waterFilters.serviceType) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as WaterSpecifications;
          return specs.serviceType === waterFilters.serviceType;
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
    annualConsumptionM3: number,
  ): number {
    const specs = offer.specifications as unknown as WaterSpecifications;

    // Coût de l'abonnement annuel
    const subscriptionCost = specs.subscriptionPriceAnnual;

    // Coût de la consommation (eau potable)
    let consumptionCost = annualConsumptionM3 * specs.pricePerCubicMeter;

    // Coût de l'assainissement si applicable
    if (
      (specs.serviceType === 'assainissement' || specs.serviceType === 'combine') &&
      specs.pricePerCubicMeterSanitation
    ) {
      consumptionCost += annualConsumptionM3 * specs.pricePerCubicMeterSanitation;
    }

    return Math.round((subscriptionCost + consumptionCost) * 100) / 100;
  }

  /**
   * Compare les offres avec un coût annuel estimé
   */
  public async compareWithEstimatedCost(
    territory: Territory,
    annualConsumptionM3: number,
    filters?: WaterFilters,
  ) {
    const result = await this.compareOffers(territory, filters);

    const rankedWithEstimatedCost = result.rankedOffers.map((offer) => ({
      ...offer,
      estimatedAnnualCost: this.calculateAnnualCost(offer, annualConsumptionM3),
    }));

    return {
      ...result,
      rankedOffers: rankedWithEstimatedCost,
      metadata: {
        ...result.metadata,
        estimatedAnnualConsumption: annualConsumptionM3,
      },
    };
  }
}

/**
 * Helper pour créer une offre eau
 */
export function createWaterOffer(
  id: string,
  providerName: string,
  offerName: string,
  territory: Territory,
  specifications: WaterSpecifications,
  source: DataSource,
  validFrom: Date = new Date(),
): ServiceOffer {
  // Le prix affiché est le coût annuel moyen pour un usage standard
  // (abonnement + consommation de 120 m³/an pour une famille)
  const estimatedAnnualCost =
    specifications.subscriptionPriceAnnual +
    120 * specifications.pricePerCubicMeter +
    (specifications.pricePerCubicMeterSanitation
      ? 120 * specifications.pricePerCubicMeterSanitation
      : 0);

  return {
    id,
    providerName,
    offerName,
    priceIncludingTax: Math.round(estimatedAnnualCost * 100) / 100,
    territory,
    specifications: specifications as unknown as Record<string, string | number | boolean>,
    source,
    validFrom,
  };
}
