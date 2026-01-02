/**
 * Tests unitaires pour CostOfLivingService
 * Version: 2.1.0
 */

import {
  CostOfLivingService,
  ServiceCategory,
  CategoryCost,
} from '../costOfLivingService.js';
import { Territory } from '../../comparison/types.js';

describe('CostOfLivingService', () => {
  let service: CostOfLivingService;

  beforeEach(() => {
    service = CostOfLivingService.getInstance();
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = CostOfLivingService.getInstance();
    const instance2 = CostOfLivingService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait calculer l\'indicateur du coût de la vie', () => {
    const categoryCosts: CategoryCost[] = [
      {
        category: ServiceCategory.FOOD,
        averageMonthlyCost: 400,
        minCost: 350,
        maxCost: 450,
        sampleSize: 100,
        dataDate: new Date(),
      },
      {
        category: ServiceCategory.ELECTRICITY,
        averageMonthlyCost: 150,
        minCost: 120,
        maxCost: 180,
        sampleSize: 50,
        dataDate: new Date(),
      },
    ];

    const indicator = service.calculateIndicator(Territory.MARTINIQUE, categoryCosts);

    expect(indicator.territory).toBe(Territory.MARTINIQUE);
    expect(indicator.totalAverageMonthlyCost).toBe(550); // 400 + 150
    expect(indicator.totalAverageAnnualCost).toBe(6600); // 550 * 12
    expect(indicator.categoryCosts).toHaveLength(2);
  });

  test('devrait comparer les territoires', () => {
    const costs1: CategoryCost[] = [
      {
        category: ServiceCategory.FOOD,
        averageMonthlyCost: 400,
        minCost: 350,
        maxCost: 450,
        sampleSize: 100,
        dataDate: new Date(),
      },
    ];

    const costs2: CategoryCost[] = [
      {
        category: ServiceCategory.FOOD,
        averageMonthlyCost: 450,
        minCost: 400,
        maxCost: 500,
        sampleSize: 100,
        dataDate: new Date(),
      },
    ];

    service.calculateIndicator(Territory.MARTINIQUE, costs1);
    service.calculateIndicator(Territory.GUADELOUPE, costs2);

    const comparison = service.compareTerritories([Territory.MARTINIQUE, Territory.GUADELOUPE]);

    expect(comparison.ranking).toHaveLength(2);
    expect(comparison.ranking[0].territory).toBe(Territory.MARTINIQUE); // Moins cher
    expect(comparison.ranking[0].rank).toBe(1);
    expect(comparison.ranking[1].territory).toBe(Territory.GUADELOUPE);
  });
});
