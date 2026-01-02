/**
 * ServiceComparisonCore - Classe de base pour la comparaison de services
 * Version: 1.6.0
 * 
 * Principe fondamental:
 * - Lecture seule - Données observées uniquement
 * - Aucune recommandation - Classement objectif du moins cher au plus cher
 * - Multi-territoires - Historique temporel
 * - Agrégation statistique - Sources traçables
 * 
 * Méthodologie:
 * 1. Collecte des offres observées
 * 2. Filtrage par territoire et critères
 * 3. Agrégation statistique (min, max, moyenne, écart-type)
 * 4. Classement objectif (prix croissants)
 * 5. Traçabilité des sources
 */

import {
  ServiceOffer,
  RankedOffer,
  AggregationStats,
  ServiceComparisonResult,
  ServiceHistory,
  HistoryDataPoint,
  TerritoryComparison,
  Territory,
  ServiceFilters,
  OpenDataExport,
} from './types.js';

export abstract class ServiceComparisonCore {
  protected readonly serviceType: string;
  protected readonly methodologyVersion: string = '1.6.0';

  constructor(serviceType: string) {
    this.serviceType = serviceType;
  }

  /**
   * Méthode abstraite pour récupérer les offres depuis la source de données
   * Doit être implémentée par chaque service spécifique
   */
  protected abstract fetchOffers(
    filters: ServiceFilters,
  ): Promise<ServiceOffer[]>;

  /**
   * Compare les offres pour un territoire donné
   * Classement objectif du moins cher au plus cher
   */
  async compareOffers(
    territory: Territory,
    filters?: Omit<ServiceFilters, 'territories'>,
  ): Promise<ServiceComparisonResult> {
    // Récupération des offres
    const offers = await this.fetchOffers({
      ...filters,
      territories: [territory],
    });

    if (offers.length === 0) {
      return this.createEmptyResult(territory, filters);
    }

    // Calcul des statistiques d'agrégation
    const statistics = this.calculateAggregationStats(offers);

    // Classement des offres (du moins cher au plus cher)
    const rankedOffers = this.rankOffers(offers, statistics);

    return {
      serviceType: this.serviceType,
      territory,
      rankedOffers,
      statistics,
      metadata: {
        comparisonDate: new Date(),
        totalOffers: offers.length,
        appliedFilters: filters,
        methodologyVersion: this.methodologyVersion,
      },
    };
  }

  /**
   * Calcule les statistiques d'agrégation pour un ensemble d'offres
   */
  protected calculateAggregationStats(
    offers: ServiceOffer[],
  ): AggregationStats {
    const prices = offers.map((o) => o.priceIncludingTax).sort((a, b) => a - b);

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const sum = prices.reduce((acc, price) => acc + price, 0);
    const average = sum / prices.length;

    // Calcul de la médiane
    const median =
      prices.length % 2 === 0
        ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
        : prices[Math.floor(prices.length / 2)];

    // Calcul de l'écart-type
    const variance =
      prices.reduce((acc, price) => acc + Math.pow(price - average, 2), 0) /
      prices.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      min,
      max,
      average: Math.round(average * 100) / 100,
      median: Math.round(median * 100) / 100,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
      sampleSize: offers.length,
      calculatedAt: new Date(),
    };
  }

  /**
   * Classe les offres du moins cher au plus cher
   * Calcule les écarts par rapport au moins cher et à la moyenne
   */
  protected rankOffers(
    offers: ServiceOffer[],
    statistics: AggregationStats,
  ): RankedOffer[] {
    // Tri par prix croissant
    const sortedOffers = [...offers].sort(
      (a, b) => a.priceIncludingTax - b.priceIncludingTax,
    );

    const cheapestPrice = statistics.min;
    const averagePrice = statistics.average;

    return sortedOffers.map((offer, index) => {
      const price = offer.priceIncludingTax;
      const differenceFromCheapest = price - cheapestPrice;
      const percentageFromCheapest =
        cheapestPrice > 0 ? (differenceFromCheapest / cheapestPrice) * 100 : 0;

      const differenceFromAverage = price - averagePrice;
      const percentageFromAverage =
        averagePrice > 0 ? (differenceFromAverage / averagePrice) * 100 : 0;

      // Détermination de la catégorie
      let category: RankedOffer['category'];
      if (index === 0) {
        category = 'cheapest';
      } else if (index === sortedOffers.length - 1) {
        category = 'most_expensive';
      } else if (price < averagePrice * 0.95) {
        category = 'below_average';
      } else if (price > averagePrice * 1.05) {
        category = 'above_average';
      } else {
        category = 'average';
      }

      return {
        ...offer,
        rank: index + 1,
        differenceFromCheapest: Math.round(differenceFromCheapest * 100) / 100,
        percentageFromCheapest: Math.round(percentageFromCheapest * 100) / 100,
        differenceFromAverage: Math.round(differenceFromAverage * 100) / 100,
        percentageFromAverage: Math.round(percentageFromAverage * 100) / 100,
        category,
      };
    });
  }

  /**
   * Récupère l'historique temporel des prix
   */
  async getHistory(
    territory: Territory,
    filters?: Omit<ServiceFilters, 'territories'>,
  ): Promise<ServiceHistory> {
    const offers = await this.fetchOffers({
      ...filters,
      territories: [territory],
    });

    // Grouper par date d'observation
    const groupedByDate = this.groupOffersByDate(offers);

    // Créer les points d'historique
    const timeSeries: HistoryDataPoint[] = Array.from(
      groupedByDate.entries(),
    ).map(([date, dateOffers]) => {
      const stats = this.calculateAggregationStats(dateOffers);
      return {
        date: new Date(date),
        averagePrice: stats.average,
        minPrice: stats.min,
        maxPrice: stats.max,
        offerCount: dateOffers.length,
        source: dateOffers[0].source, // Source du premier élément (représentatif)
      };
    });

    // Trier par date
    timeSeries.sort((a, b) => a.date.getTime() - b.date.getTime());

    const startDate = timeSeries.length > 0 ? timeSeries[0].date : new Date();
    const endDate =
      timeSeries.length > 0
        ? timeSeries[timeSeries.length - 1].date
        : new Date();

    return {
      serviceType: this.serviceType,
      territory,
      filters,
      timeSeries,
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Compare les prix entre plusieurs territoires
   */
  async compareTerritories(
    territories: Territory[],
    filters?: Omit<ServiceFilters, 'territories'>,
  ): Promise<TerritoryComparison> {
    const results = new Map<
      Territory,
      {
        averagePrice: number;
        minPrice: number;
        maxPrice: number;
        offerCount: number;
      }
    >();

    for (const territory of territories) {
      const offers = await this.fetchOffers({
        ...filters,
        territories: [territory],
      });

      if (offers.length > 0) {
        const stats = this.calculateAggregationStats(offers);
        results.set(territory, {
          averagePrice: stats.average,
          minPrice: stats.min,
          maxPrice: stats.max,
          offerCount: offers.length,
        });
      }
    }

    return {
      serviceType: this.serviceType,
      territories,
      results,
      comparisonDate: new Date(),
    };
  }

  /**
   * Exporte les données au format open-data
   */
  exportToOpenData(
    data: ServiceComparisonResult | ServiceHistory | TerritoryComparison,
  ): OpenDataExport {
    return {
      schemaVersion: '1.0.0',
      generatedAt: new Date(),
      license: 'Licence Ouverte / Open Licence v2.0',
      attribution:
        'A KI PRI SA YÉ - Comparateur Citoyen de Services - https://akiprisaye.fr',
      data,
    };
  }

  /**
   * Groupe les offres par date d'observation
   */
  private groupOffersByDate(
    offers: ServiceOffer[],
  ): Map<string, ServiceOffer[]> {
    const grouped = new Map<string, ServiceOffer[]>();

    for (const offer of offers) {
      const dateKey = offer.source.observationDate.toISOString().split('T')[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(offer);
    }

    return grouped;
  }

  /**
   * Crée un résultat vide quand aucune offre n'est trouvée
   */
  private createEmptyResult(
    territory: Territory,
    filters?: Omit<ServiceFilters, 'territories'>,
  ): ServiceComparisonResult {
    return {
      serviceType: this.serviceType,
      territory,
      rankedOffers: [],
      statistics: {
        min: 0,
        max: 0,
        average: 0,
        median: 0,
        standardDeviation: 0,
        sampleSize: 0,
        calculatedAt: new Date(),
      },
      metadata: {
        comparisonDate: new Date(),
        totalOffers: 0,
        appliedFilters: filters,
        methodologyVersion: this.methodologyVersion,
      },
    };
  }

  /**
   * Valide qu'une offre respecte les critères de qualité des données
   */
  protected validateOffer(offer: ServiceOffer): boolean {
    // Vérifications de base
    if (!offer.id || !offer.providerName || !offer.offerName) {
      return false;
    }

    // Prix doit être positif
    if (offer.priceIncludingTax <= 0) {
      return false;
    }

    // Source doit être complète
    if (
      !offer.source.origin ||
      !offer.source.observationDate ||
      offer.source.sampleSize <= 0
    ) {
      return false;
    }

    // Date de validité cohérente
    if (offer.validUntil && offer.validUntil < offer.validFrom) {
      return false;
    }

    return true;
  }
}
