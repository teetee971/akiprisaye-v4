/**
 * Unit tests for Territory Ranking Thresholds - Module F
 */

import { describe, it, expect } from 'vitest';
import {
  TERRITORY_RANKING_THRESHOLDS,
  validateTerritoryData,
  validateRanking,
  calculateOrdinalRanking,
  isRankingAvailable,
  getThresholdDescriptions,
  type TerritoryData,
} from './territoryRankingThresholds';

describe('TERRITORY_RANKING_THRESHOLDS', () => {
  it('should have all required threshold constants', () => {
    expect(TERRITORY_RANKING_THRESHOLDS.MIN_OBSERVATIONS_PER_TERRITORY).toBe(100);
    expect(TERRITORY_RANKING_THRESHOLDS.MIN_TERRITORIES_FOR_RANKING).toBe(3);
    expect(TERRITORY_RANKING_THRESHOLDS.MIN_PRODUCTS_PER_TERRITORY).toBe(10);
    expect(TERRITORY_RANKING_THRESHOLDS.MIN_STORES_PER_TERRITORY).toBe(3);
    expect(TERRITORY_RANKING_THRESHOLDS.MAX_OBSERVATION_AGE_DAYS).toBe(90);
    expect(TERRITORY_RANKING_THRESHOLDS.MIN_PRODUCT_OVERLAP_PERCENTAGE).toBe(50);
  });
});

describe('validateTerritoryData', () => {
  const validTerritory: TerritoryData = {
    code: '971',
    name: 'Guadeloupe',
    observations: 150,
    products: 25,
    stores: 5,
    averagePrice: 125.50,
    lastObservation: new Date(),
    commonProducts: 20,
  };

  it('should return no errors for valid territory data', () => {
    const errors = validateTerritoryData(validTerritory);
    expect(errors).toHaveLength(0);
  });

  it('should return error for insufficient observations', () => {
    const territory = { ...validTerritory, observations: 50 };
    const errors = validateTerritoryData(territory);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('Observations insuffisantes');
  });

  it('should return error for insufficient products', () => {
    const territory = { ...validTerritory, products: 5 };
    const errors = validateTerritoryData(territory);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('Produits insuffisants');
  });

  it('should return error for insufficient stores', () => {
    const territory = { ...validTerritory, stores: 2 };
    const errors = validateTerritoryData(territory);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('Enseignes insuffisantes');
  });

  it('should return error for old data', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 100); // 100 days ago
    const territory = { ...validTerritory, lastObservation: oldDate };
    const errors = validateTerritoryData(territory);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('Données obsolètes');
  });

  it('should return error for invalid price', () => {
    const territory = { ...validTerritory, averagePrice: 0 };
    const errors = validateTerritoryData(territory);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('Prix moyen invalide');
  });

  it('should return multiple errors for multiple violations', () => {
    const territory = {
      ...validTerritory,
      observations: 50,
      products: 5,
      stores: 1,
    };
    const errors = validateTerritoryData(territory);
    expect(errors.length).toBeGreaterThan(1);
  });
});

describe('validateRanking', () => {
  const validTerritories: TerritoryData[] = [
    {
      code: '971',
      name: 'Guadeloupe',
      observations: 150,
      products: 25,
      stores: 5,
      averagePrice: 125.50,
      lastObservation: new Date(),
      commonProducts: 20,
    },
    {
      code: '972',
      name: 'Martinique',
      observations: 180,
      products: 28,
      stores: 6,
      averagePrice: 132.75,
      lastObservation: new Date(),
      commonProducts: 20,
    },
    {
      code: '974',
      name: 'La Réunion',
      observations: 200,
      products: 30,
      stores: 7,
      averagePrice: 118.90,
      lastObservation: new Date(),
      commonProducts: 20,
    },
  ];

  it('should return valid for sufficient valid territories', () => {
    const validation = validateRanking(validTerritories);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
    expect(validation.validTerritories).toBe(3);
    expect(validation.excludedTerritories).toHaveLength(0);
  });

  it('should return invalid for insufficient territories', () => {
    const territories = [validTerritories[0]]; // Only 1 territory
    const validation = validateRanking(territories);
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
    expect(validation.errors[0]).toContain('Nombre de territoires insuffisant');
  });

  it('should exclude territories that do not meet thresholds', () => {
    const territories = [
      ...validTerritories,
      {
        code: '973',
        name: 'Guyane',
        observations: 50, // Below threshold
        products: 5, // Below threshold
        stores: 2, // Below threshold
        averagePrice: 140.0,
        lastObservation: new Date(),
        commonProducts: 20,
      },
    ];
    const validation = validateRanking(territories);
    expect(validation.valid).toBe(true); // Still valid with 3 valid territories
    expect(validation.validTerritories).toBe(3);
    expect(validation.excludedTerritories).toHaveLength(1);
    expect(validation.excludedTerritories[0].territory).toBe('Guyane');
  });

  it('should warn about low product overlap', () => {
    const territories = [
      { ...validTerritories[0], commonProducts: 8 }, // 8/20 = 40% < 50%
      { ...validTerritories[1], commonProducts: 20 },
      { ...validTerritories[2], commonProducts: 18 },
    ];
    const validation = validateRanking(territories);
    expect(validation.valid).toBe(true);
    expect(validation.warnings.length).toBeGreaterThan(0);
    expect(validation.warnings[0]).toContain('Chevauchement de produits faible');
  });
});

describe('calculateOrdinalRanking', () => {
  it('should rank territories by average price ascending', () => {
    const territories: TerritoryData[] = [
      {
        code: '971',
        name: 'Guadeloupe',
        observations: 150,
        products: 25,
        stores: 5,
        averagePrice: 125.50, // 2nd
        lastObservation: new Date(),
        commonProducts: 20,
      },
      {
        code: '972',
        name: 'Martinique',
        observations: 180,
        products: 28,
        stores: 6,
        averagePrice: 132.75, // 3rd
        lastObservation: new Date(),
        commonProducts: 20,
      },
      {
        code: '974',
        name: 'La Réunion',
        observations: 200,
        products: 30,
        stores: 7,
        averagePrice: 118.90, // 1st
        lastObservation: new Date(),
        commonProducts: 20,
      },
    ];

    const ranked = calculateOrdinalRanking(territories);

    expect(ranked).toHaveLength(3);
    expect(ranked[0].name).toBe('La Réunion');
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].name).toBe('Guadeloupe');
    expect(ranked[1].rank).toBe(2);
    expect(ranked[2].name).toBe('Martinique');
    expect(ranked[2].rank).toBe(3);
  });

  it('should not modify original array', () => {
    const territories: TerritoryData[] = [
      {
        code: '971',
        name: 'Guadeloupe',
        observations: 150,
        products: 25,
        stores: 5,
        averagePrice: 125.50,
        lastObservation: new Date(),
        commonProducts: 20,
      },
      {
        code: '972',
        name: 'Martinique',
        observations: 180,
        products: 28,
        stores: 6,
        averagePrice: 120.00,
        lastObservation: new Date(),
        commonProducts: 20,
      },
    ];

    const originalFirst = territories[0].name;
    calculateOrdinalRanking(territories);
    expect(territories[0].name).toBe(originalFirst); // Original unchanged
  });

  it('should handle single territory', () => {
    const territories: TerritoryData[] = [
      {
        code: '971',
        name: 'Guadeloupe',
        observations: 150,
        products: 25,
        stores: 5,
        averagePrice: 125.50,
        lastObservation: new Date(),
        commonProducts: 20,
      },
    ];

    const ranked = calculateOrdinalRanking(territories);
    expect(ranked).toHaveLength(1);
    expect(ranked[0].rank).toBe(1);
  });
});

describe('isRankingAvailable', () => {
  it('should return true for valid ranking data', () => {
    const territories: TerritoryData[] = [
      {
        code: '971',
        name: 'Guadeloupe',
        observations: 150,
        products: 25,
        stores: 5,
        averagePrice: 125.50,
        lastObservation: new Date(),
        commonProducts: 20,
      },
      {
        code: '972',
        name: 'Martinique',
        observations: 180,
        products: 28,
        stores: 6,
        averagePrice: 132.75,
        lastObservation: new Date(),
        commonProducts: 20,
      },
      {
        code: '974',
        name: 'La Réunion',
        observations: 200,
        products: 30,
        stores: 7,
        averagePrice: 118.90,
        lastObservation: new Date(),
        commonProducts: 20,
      },
    ];

    expect(isRankingAvailable(territories)).toBe(true);
  });

  it('should return false for insufficient territories', () => {
    const territories: TerritoryData[] = [
      {
        code: '971',
        name: 'Guadeloupe',
        observations: 150,
        products: 25,
        stores: 5,
        averagePrice: 125.50,
        lastObservation: new Date(),
        commonProducts: 20,
      },
    ];

    expect(isRankingAvailable(territories)).toBe(false);
  });
});

describe('getThresholdDescriptions', () => {
  it('should return all threshold descriptions', () => {
    const descriptions = getThresholdDescriptions();
    
    expect(descriptions).toHaveProperty('observations');
    expect(descriptions).toHaveProperty('territories');
    expect(descriptions).toHaveProperty('products');
    expect(descriptions).toHaveProperty('stores');
    expect(descriptions).toHaveProperty('age');
    expect(descriptions).toHaveProperty('overlap');
    
    expect(descriptions.observations).toContain('100');
    expect(descriptions.territories).toContain('3');
    expect(descriptions.products).toContain('10');
    expect(descriptions.stores).toContain('3');
    expect(descriptions.age).toContain('90');
    expect(descriptions.overlap).toContain('50');
  });
});
