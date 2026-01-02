/**
 * Tests unitaires pour ServiceComparisonCore
 * Version: 1.6.0
 */

import { ServiceComparisonCore } from '../ServiceComparisonCore.js';
import {
  ServiceOffer,
  Territory,
  ServiceFilters,
  DataSource,
} from '../types.js';

// Implémentation de test du ServiceComparisonCore
class TestServiceComparison extends ServiceComparisonCore {
  private mockOffers: ServiceOffer[] = [];

  constructor() {
    super('test-service');
  }

  setMockOffers(offers: ServiceOffer[]): void {
    this.mockOffers = offers;
  }

  protected async fetchOffers(filters: ServiceFilters): Promise<ServiceOffer[]> {
    let filtered = [...this.mockOffers];

    // Filtrage par territoire
    if (filters.territories && filters.territories.length > 0) {
      filtered = filtered.filter((o) =>
        filters.territories!.includes(o.territory),
      );
    }

    // Filtrage par prix
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((o) => o.priceIncludingTax >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((o) => o.priceIncludingTax <= filters.maxPrice!);
    }

    // Filtrage par date
    if (filters.startDate) {
      filtered = filtered.filter(
        (o) => o.source.observationDate >= filters.startDate!,
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (o) => o.source.observationDate <= filters.endDate!,
      );
    }

    return filtered;
  }

  // Exposer les méthodes protégées pour les tests
  public testCalculateAggregationStats(offers: ServiceOffer[]) {
    return this.calculateAggregationStats(offers);
  }

  public testRankOffers(offers: ServiceOffer[], stats: any) {
    return this.rankOffers(offers, stats);
  }

  public testValidateOffer(offer: ServiceOffer) {
    return this.validateOffer(offer);
  }
}

// Helper pour créer une offre de test
function createTestOffer(
  id: string,
  price: number,
  territory: Territory = Territory.MARTINIQUE,
  observationDate: Date = new Date('2026-01-01'),
): ServiceOffer {
  const source: DataSource = {
    origin: 'test-observation',
    observationDate,
    sampleSize: 10,
    confidenceLevel: 0.95,
  };

  return {
    id,
    providerName: `Provider ${id}`,
    offerName: `Offer ${id}`,
    priceIncludingTax: price,
    territory,
    specifications: { feature1: 'value1' },
    source,
    validFrom: new Date('2026-01-01'),
  };
}

describe('ServiceComparisonCore', () => {
  let service: TestServiceComparison;

  beforeEach(() => {
    service = new TestServiceComparison();
  });

  describe('calculateAggregationStats', () => {
    test('devrait calculer les statistiques correctement', () => {
      const offers = [
        createTestOffer('1', 10),
        createTestOffer('2', 20),
        createTestOffer('3', 30),
        createTestOffer('4', 40),
        createTestOffer('5', 50),
      ];

      const stats = service.testCalculateAggregationStats(offers);

      expect(stats.min).toBe(10);
      expect(stats.max).toBe(50);
      expect(stats.average).toBe(30);
      expect(stats.median).toBe(30);
      expect(stats.sampleSize).toBe(5);
      expect(stats.standardDeviation).toBeGreaterThan(0);
    });

    test('devrait calculer la médiane pour un nombre pair d\'offres', () => {
      const offers = [
        createTestOffer('1', 10),
        createTestOffer('2', 20),
        createTestOffer('3', 30),
        createTestOffer('4', 40),
      ];

      const stats = service.testCalculateAggregationStats(offers);

      expect(stats.median).toBe(25); // (20 + 30) / 2
    });

    test('devrait arrondir les valeurs à 2 décimales', () => {
      const offers = [
        createTestOffer('1', 10.567),
        createTestOffer('2', 20.123),
        createTestOffer('3', 30.999),
      ];

      const stats = service.testCalculateAggregationStats(offers);

      expect(stats.average).toBe(20.56);
      expect(Number.isInteger(stats.average * 100)).toBe(true);
    });
  });

  describe('rankOffers', () => {
    test('devrait classer les offres du moins cher au plus cher', () => {
      const offers = [
        createTestOffer('3', 30),
        createTestOffer('1', 10),
        createTestOffer('2', 20),
      ];

      const stats = service.testCalculateAggregationStats(offers);
      const ranked = service.testRankOffers(offers, stats);

      expect(ranked[0].rank).toBe(1);
      expect(ranked[0].priceIncludingTax).toBe(10);
      expect(ranked[1].rank).toBe(2);
      expect(ranked[1].priceIncludingTax).toBe(20);
      expect(ranked[2].rank).toBe(3);
      expect(ranked[2].priceIncludingTax).toBe(30);
    });

    test('devrait calculer les écarts avec le moins cher', () => {
      const offers = [
        createTestOffer('1', 100),
        createTestOffer('2', 150),
      ];

      const stats = service.testCalculateAggregationStats(offers);
      const ranked = service.testRankOffers(offers, stats);

      expect(ranked[0].differenceFromCheapest).toBe(0);
      expect(ranked[0].percentageFromCheapest).toBe(0);
      expect(ranked[1].differenceFromCheapest).toBe(50);
      expect(ranked[1].percentageFromCheapest).toBe(50);
    });

    test('devrait calculer les écarts avec la moyenne', () => {
      const offers = [
        createTestOffer('1', 90),
        createTestOffer('2', 100),
        createTestOffer('3', 110),
      ];

      const stats = service.testCalculateAggregationStats(offers);
      const ranked = service.testRankOffers(offers, stats);

      expect(ranked[1].differenceFromAverage).toBe(0); // Prix = moyenne
      expect(ranked[1].percentageFromAverage).toBe(0);
      expect(ranked[0].differenceFromAverage).toBe(-10);
      expect(ranked[2].differenceFromAverage).toBe(10);
    });

    test('devrait attribuer les bonnes catégories', () => {
      const offers = [
        createTestOffer('1', 80),  // cheapest
        createTestOffer('2', 90),  // below_average (< 95% de la moyenne)
        createTestOffer('3', 100), // average
        createTestOffer('4', 110), // above_average (> 105% de la moyenne)
        createTestOffer('5', 120), // most_expensive
      ];

      const stats = service.testCalculateAggregationStats(offers);
      const ranked = service.testRankOffers(offers, stats);

      expect(ranked[0].category).toBe('cheapest');
      expect(ranked[4].category).toBe('most_expensive');
    });
  });

  describe('compareOffers', () => {
    test('devrait retourner une comparaison complète', async () => {
      const offers = [
        createTestOffer('1', 100, Territory.MARTINIQUE),
        createTestOffer('2', 200, Territory.MARTINIQUE),
        createTestOffer('3', 300, Territory.MARTINIQUE),
      ];

      service.setMockOffers(offers);

      const result = await service.compareOffers(Territory.MARTINIQUE);

      expect(result.serviceType).toBe('test-service');
      expect(result.territory).toBe(Territory.MARTINIQUE);
      expect(result.rankedOffers).toHaveLength(3);
      expect(result.statistics.min).toBe(100);
      expect(result.statistics.max).toBe(300);
      expect(result.metadata.totalOffers).toBe(3);
      expect(result.metadata.methodologyVersion).toBe('1.6.0');
    });

    test('devrait filtrer par territoire', async () => {
      const offers = [
        createTestOffer('1', 100, Territory.MARTINIQUE),
        createTestOffer('2', 200, Territory.GUADELOUPE),
        createTestOffer('3', 300, Territory.MARTINIQUE),
      ];

      service.setMockOffers(offers);

      const result = await service.compareOffers(Territory.MARTINIQUE);

      expect(result.rankedOffers).toHaveLength(2);
      expect(result.rankedOffers.every(o => o.territory === Territory.MARTINIQUE)).toBe(true);
    });

    test('devrait filtrer par prix', async () => {
      const offers = [
        createTestOffer('1', 100),
        createTestOffer('2', 200),
        createTestOffer('3', 300),
      ];

      service.setMockOffers(offers);

      const result = await service.compareOffers(Territory.MARTINIQUE, {
        minPrice: 150,
        maxPrice: 250,
      });

      expect(result.rankedOffers).toHaveLength(1);
      expect(result.rankedOffers[0].priceIncludingTax).toBe(200);
    });

    test('devrait retourner un résultat vide si aucune offre', async () => {
      service.setMockOffers([]);

      const result = await service.compareOffers(Territory.MARTINIQUE);

      expect(result.rankedOffers).toHaveLength(0);
      expect(result.statistics.sampleSize).toBe(0);
      expect(result.metadata.totalOffers).toBe(0);
    });
  });

  describe('getHistory', () => {
    test('devrait retourner l\'historique temporel', async () => {
      const offers = [
        createTestOffer('1', 100, Territory.MARTINIQUE, new Date('2026-01-01')),
        createTestOffer('2', 110, Territory.MARTINIQUE, new Date('2026-01-01')),
        createTestOffer('3', 150, Territory.MARTINIQUE, new Date('2026-01-15')),
        createTestOffer('4', 160, Territory.MARTINIQUE, new Date('2026-01-15')),
      ];

      service.setMockOffers(offers);

      const history = await service.getHistory(Territory.MARTINIQUE);

      expect(history.serviceType).toBe('test-service');
      expect(history.territory).toBe(Territory.MARTINIQUE);
      expect(history.timeSeries).toHaveLength(2); // 2 dates différentes
      expect(history.timeSeries[0].offerCount).toBe(2);
      expect(history.timeSeries[1].offerCount).toBe(2);
    });

    test('devrait trier l\'historique par date', async () => {
      const offers = [
        createTestOffer('1', 100, Territory.MARTINIQUE, new Date('2026-01-15')),
        createTestOffer('2', 110, Territory.MARTINIQUE, new Date('2026-01-01')),
      ];

      service.setMockOffers(offers);

      const history = await service.getHistory(Territory.MARTINIQUE);

      expect(history.timeSeries[0].date.toISOString().split('T')[0]).toBe('2026-01-01');
      expect(history.timeSeries[1].date.toISOString().split('T')[0]).toBe('2026-01-15');
    });
  });

  describe('compareTerritories', () => {
    test('devrait comparer plusieurs territoires', async () => {
      const offers = [
        createTestOffer('1', 100, Territory.MARTINIQUE),
        createTestOffer('2', 110, Territory.MARTINIQUE),
        createTestOffer('3', 200, Territory.GUADELOUPE),
        createTestOffer('4', 220, Territory.GUADELOUPE),
      ];

      service.setMockOffers(offers);

      const comparison = await service.compareTerritories([
        Territory.MARTINIQUE,
        Territory.GUADELOUPE,
      ]);

      expect(comparison.serviceType).toBe('test-service');
      expect(comparison.territories).toHaveLength(2);
      expect(comparison.results.size).toBe(2);

      const martinique = comparison.results.get(Territory.MARTINIQUE);
      expect(martinique?.offerCount).toBe(2);
      expect(martinique?.minPrice).toBe(100);
      expect(martinique?.maxPrice).toBe(110);

      const guadeloupe = comparison.results.get(Territory.GUADELOUPE);
      expect(guadeloupe?.offerCount).toBe(2);
      expect(guadeloupe?.minPrice).toBe(200);
    });
  });

  describe('exportToOpenData', () => {
    test('devrait exporter au format open-data', async () => {
      const offers = [createTestOffer('1', 100)];
      service.setMockOffers(offers);

      const result = await service.compareOffers(Territory.MARTINIQUE);
      const exported = service.exportToOpenData(result);

      expect(exported.schemaVersion).toBe('1.0.0');
      expect(exported.license).toBe('Licence Ouverte / Open Licence v2.0');
      expect(exported.attribution).toContain('A KI PRI SA YÉ');
      expect(exported.data).toBeDefined();
      expect(exported.generatedAt).toBeInstanceOf(Date);
    });
  });

  describe('validateOffer', () => {
    test('devrait valider une offre correcte', () => {
      const offer = createTestOffer('1', 100);
      expect(service.testValidateOffer(offer)).toBe(true);
    });

    test('devrait rejeter une offre sans ID', () => {
      const offer = createTestOffer('', 100);
      expect(service.testValidateOffer(offer)).toBe(false);
    });

    test('devrait rejeter une offre avec prix négatif', () => {
      const offer = createTestOffer('1', -100);
      expect(service.testValidateOffer(offer)).toBe(false);
    });

    test('devrait rejeter une offre avec prix zéro', () => {
      const offer = createTestOffer('1', 0);
      expect(service.testValidateOffer(offer)).toBe(false);
    });

    test('devrait rejeter une offre avec source incomplète', () => {
      const offer = createTestOffer('1', 100);
      offer.source.origin = '';
      expect(service.testValidateOffer(offer)).toBe(false);
    });

    test('devrait rejeter une offre avec dates incohérentes', () => {
      const offer = createTestOffer('1', 100);
      offer.validFrom = new Date('2026-01-15');
      offer.validUntil = new Date('2026-01-01'); // Avant validFrom
      expect(service.testValidateOffer(offer)).toBe(false);
    });
  });
});
