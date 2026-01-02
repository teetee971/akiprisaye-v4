/**
 * ElectricityComparisonService - Comparateur citoyen d'électricité
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
 * - Puissance souscrite (kVA)
 * - Option tarifaire (base, heures creuses)
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
 * Spécifications d'une offre électrique
 */
export interface ElectricitySpecifications {
  /** Puissance souscrite en kVA (3, 6, 9, 12, 15, etc.) */
  powerSubscribed: number;
  /** Option tarifaire */
  tariffOption: 'base' | 'heures_creuses' | 'tempo' | 'ejp';
  /** Prix de l'abonnement mensuel TTC en € */
  subscriptionPriceMonthly: number;
  /** Prix du kWh TTC en € (heures pleines ou base) */
  pricePerKwhPeak: number;
  /** Prix du kWh TTC en € heures creuses (si applicable) */
  pricePerKwhOffPeak?: number;
  /** Type de compteur */
  meterType?: 'classique' | 'linky';
  /** Engagement (en mois) */
  commitmentMonths?: number;
}

/**
 * Filtres spécifiques pour l'électricité
 */
export interface ElectricityFilters extends Omit<ServiceFilters, 'specificFilters'> {
  /** Puissance souscrite */
  powerSubscribed?: number;
  /** Option tarifaire */
  tariffOption?: ElectricitySpecifications['tariffOption'];
  /** Consommation annuelle estimée en kWh (pour calcul coût total) */
  estimatedAnnualConsumption?: number;
}

export class ElectricityComparisonService extends ServiceComparisonCore {
  private static instance: ElectricityComparisonService;
  private mockData: ServiceOffer[] = [];

  private constructor() {
    super('electricity');
  }

  /**
   * Singleton pattern
   */
  public static getInstance(): ElectricityComparisonService {
    if (!ElectricityComparisonService.instance) {
      ElectricityComparisonService.instance = new ElectricityComparisonService();
    }
    return ElectricityComparisonService.instance;
  }

  /**
   * Configure les données mockées (pour développement/test)
   * En production, cette méthode sera remplacée par une connexion à une vraie source de données
   */
  public setMockData(offers: ServiceOffer[]): void {
    this.mockData = offers;
  }

  /**
   * Récupère les offres depuis la source de données
   * TODO: Remplacer par une vraie source de données en production
   */
  protected async fetchOffers(filters: ServiceFilters): Promise<ServiceOffer[]> {
    // En production, cette méthode interrogera une base de données ou une API
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

    // Filtres spécifiques à l'électricité
    if (filters.specificFilters) {
      const electricityFilters = filters.specificFilters as Partial<ElectricityFilters>;

      if (electricityFilters.powerSubscribed !== undefined) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as ElectricitySpecifications;
          return specs.powerSubscribed === electricityFilters.powerSubscribed;
        });
      }

      if (electricityFilters.tariffOption) {
        offers = offers.filter((o) => {
          const specs = o.specifications as unknown as ElectricitySpecifications;
          return specs.tariffOption === electricityFilters.tariffOption;
        });
      }
    }

    // Validation des offres
    offers = offers.filter((o) => this.validateOffer(o));

    return offers;
  }

  /**
   * Calcule le coût annuel estimé d'une offre
   * Basé sur une consommation annuelle en kWh
   */
  public calculateAnnualCost(
    offer: ServiceOffer,
    annualConsumptionKwh: number,
  ): number {
    const specs = offer.specifications as unknown as ElectricitySpecifications;

    // Coût de l'abonnement annuel
    const subscriptionCost = specs.subscriptionPriceMonthly * 12;

    // Coût de la consommation
    let consumptionCost = 0;

    if (specs.tariffOption === 'heures_creuses' && specs.pricePerKwhOffPeak) {
      // Approximation: 60% heures pleines, 40% heures creuses
      consumptionCost =
        annualConsumptionKwh * 0.6 * specs.pricePerKwhPeak +
        annualConsumptionKwh * 0.4 * specs.pricePerKwhOffPeak;
    } else {
      // Base ou autres options
      consumptionCost = annualConsumptionKwh * specs.pricePerKwhPeak;
    }

    return Math.round((subscriptionCost + consumptionCost) * 100) / 100;
  }

  /**
   * Compare les offres avec un coût annuel estimé
   * Utile pour classifier selon la consommation réelle
   */
  public async compareWithEstimatedCost(
    territory: Territory,
    annualConsumptionKwh: number,
    filters?: ElectricityFilters,
  ) {
    const result = await this.compareOffers(territory, filters);

    // Ajouter le coût annuel estimé à chaque offre classée
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
 * Helper pour créer une offre électrique
 * Utile pour les tests et le développement
 */
export function createElectricityOffer(
  id: string,
  providerName: string,
  offerName: string,
  territory: Territory,
  specifications: ElectricitySpecifications,
  source: DataSource,
  validFrom: Date = new Date(),
): ServiceOffer {
  // Le prix affiché est le coût mensuel moyen pour un usage standard
  // (abonnement + consommation de 5000 kWh/an)
  const estimatedMonthlyCost =
    specifications.subscriptionPriceMonthly +
    ((5000 / 12) * specifications.pricePerKwhPeak);

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
