/**
 * Unit tests for Territory Ranking Computation - Module F Step 1
 */

import { describe, it, expect } from 'vitest';
import {
  computeTerritoryRanking,
  isEligibleForRanking,
  getExclusionReason,
  getExcludedTerritories,
  getMethodologyText,
  getEligibilityCriteriaText,
  validateTerritoryStatsInput,
  validateAllInputs,
} from './computeTerritoryRanking';
import {
  TerritoryStatsInput,
  TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS,
} from './territoryRanking.types';

describe('TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS', () => {
  it('should have correct minimum thresholds', () => {
    expect(TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_OBSERVATIONS).toBe(30);
    expect(TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_STORES).toBe(10);
    expect(TERRITORY_RANKING_ELIGIBILITY_THRESHOLDS.MIN_PRODUCTS).toBe(5);
  });
});

describe('isEligibleForRanking', () => {
  const validTerritory: TerritoryStatsInput = {
    territoryCode: 'GP',
    territoryLabel: 'Guadeloupe',
    medianPrice: 100.0,
    observationCount: 50,
    storeCount: 15,
    productCount: 10,
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
  };

  it('should return true for territory meeting all thresholds', () => {
    expect(isEligibleForRanking(validTerritory)).toBe(true);
  });

  it('should return false when observations below threshold', () => {
    const territory = { ...validTerritory, observationCount: 29 };
    expect(isEligibleForRanking(territory)).toBe(false);
  });

  it('should return false when stores below threshold', () => {
    const territory = { ...validTerritory, storeCount: 9 };
    expect(isEligibleForRanking(territory)).toBe(false);
  });

  it('should return false when products below threshold', () => {
    const territory = { ...validTerritory, productCount: 4 };
    expect(isEligibleForRanking(territory)).toBe(false);
  });

  it('should return false when multiple thresholds not met', () => {
    const territory = {
      ...validTerritory,
      observationCount: 20,
      storeCount: 5,
      productCount: 2,
    };
    expect(isEligibleForRanking(territory)).toBe(false);
  });

  it('should return true at exact threshold values', () => {
    const territory = {
      ...validTerritory,
      observationCount: 30,
      storeCount: 10,
      productCount: 5,
    };
    expect(isEligibleForRanking(territory)).toBe(true);
  });
});

describe('getExclusionReason', () => {
  const validTerritory: TerritoryStatsInput = {
    territoryCode: 'GP',
    territoryLabel: 'Guadeloupe',
    medianPrice: 100.0,
    observationCount: 50,
    storeCount: 15,
    productCount: 10,
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
  };

  it('should return null for eligible territory', () => {
    expect(getExclusionReason(validTerritory)).toBeNull();
  });

  it('should return reason for insufficient observations', () => {
    const territory = { ...validTerritory, observationCount: 25 };
    const reason = getExclusionReason(territory);
    expect(reason).toContain('observations insuffisantes');
    expect(reason).toContain('25/30');
  });

  it('should return reason for insufficient stores', () => {
    const territory = { ...validTerritory, storeCount: 8 };
    const reason = getExclusionReason(territory);
    expect(reason).toContain('magasins insuffisants');
    expect(reason).toContain('8/10');
  });

  it('should return reason for insufficient products', () => {
    const territory = { ...validTerritory, productCount: 3 };
    const reason = getExclusionReason(territory);
    expect(reason).toContain('produits insuffisants');
    expect(reason).toContain('3/5');
  });

  it('should return combined reasons for multiple violations', () => {
    const territory = {
      ...validTerritory,
      observationCount: 20,
      storeCount: 5,
    };
    const reason = getExclusionReason(territory);
    expect(reason).toContain('observations insuffisantes');
    expect(reason).toContain('magasins insuffisants');
  });
});

describe('getExcludedTerritories', () => {
  it('should return empty array when all territories are eligible', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0,
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const excluded = getExcludedTerritories(input);
    expect(excluded).toHaveLength(0);
  });

  it('should return excluded territories with reasons', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0,
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
      {
        territoryCode: 'MQ',
        territoryLabel: 'Martinique',
        medianPrice: 105.0,
        observationCount: 20, // Below threshold
        storeCount: 8, // Below threshold
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const excluded = getExcludedTerritories(input);
    expect(excluded).toHaveLength(1);
    expect(excluded[0].territoryCode).toBe('MQ');
    expect(excluded[0].territoryLabel).toBe('Martinique');
    expect(excluded[0].reason).toContain('observations insuffisantes');
    expect(excluded[0].reason).toContain('magasins insuffisants');
    expect(excluded[0].currentValues.observationCount).toBe(20);
    expect(excluded[0].currentValues.storeCount).toBe(8);
  });
});

describe('computeTerritoryRanking', () => {
  it('should rank territories by median price ascending', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'MQ',
        territoryLabel: 'Martinique',
        medianPrice: 110.0, // 3rd
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0, // 1st
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
      {
        territoryCode: 'RE',
        territoryLabel: 'La Réunion',
        medianPrice: 105.0, // 2nd
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const result = computeTerritoryRanking(input);

    expect(result).toHaveLength(3);
    expect(result[0].territoryCode).toBe('GP');
    expect(result[0].ordinalRank).toBe(1);
    expect(result[1].territoryCode).toBe('RE');
    expect(result[1].ordinalRank).toBe(2);
    expect(result[2].territoryCode).toBe('MQ');
    expect(result[2].ordinalRank).toBe(3);
  });

  it('should exclude territories below thresholds', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0,
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
      {
        territoryCode: 'MQ',
        territoryLabel: 'Martinique',
        medianPrice: 95.0, // Would be first if eligible
        observationCount: 20, // Below threshold
        storeCount: 8, // Below threshold
        productCount: 3, // Below threshold
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const result = computeTerritoryRanking(input);

    expect(result).toHaveLength(1);
    expect(result[0].territoryCode).toBe('GP');
    expect(result[0].ordinalRank).toBe(1);
  });

  it('should use alphabetical order for equal median prices', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'MQ',
        territoryLabel: 'Martinique',
        medianPrice: 100.0, // Same price
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0, // Same price
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const result = computeTerritoryRanking(input);

    expect(result).toHaveLength(2);
    // Guadeloupe should come before Martinique alphabetically
    expect(result[0].territoryLabel).toBe('Guadeloupe');
    expect(result[0].ordinalRank).toBe(1);
    expect(result[1].territoryLabel).toBe('Martinique');
    expect(result[1].ordinalRank).toBe(2);
  });

  it('should not mutate input array', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'MQ',
        territoryLabel: 'Martinique',
        medianPrice: 110.0,
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0,
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const originalFirst = input[0].territoryCode;
    computeTerritoryRanking(input);
    expect(input[0].territoryCode).toBe(originalFirst);
  });

  it('should return empty array when no territories are eligible', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0,
        observationCount: 10, // Below threshold
        storeCount: 5, // Below threshold
        productCount: 2, // Below threshold
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const result = computeTerritoryRanking(input);
    expect(result).toHaveLength(0);
  });

  it('should handle single eligible territory', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0,
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const result = computeTerritoryRanking(input);
    expect(result).toHaveLength(1);
    expect(result[0].ordinalRank).toBe(1);
  });
});

describe('getMethodologyText', () => {
  it('should return complete methodology text', () => {
    const text = getMethodologyText();
    expect(text).toContain('Classement ordinal');
    expect(text).toContain('prix médian observé');
    expect(text).toContain('Aucune recommandation');
    expect(text).toContain('volume suffisant');
  });
});

describe('getEligibilityCriteriaText', () => {
  it('should return criteria with correct thresholds', () => {
    const text = getEligibilityCriteriaText();
    expect(text).toContain('30 observations');
    expect(text).toContain('10 magasins');
    expect(text).toContain('5 produits');
  });
});

describe('validateTerritoryStatsInput', () => {
  const validInput: TerritoryStatsInput = {
    territoryCode: 'GP',
    territoryLabel: 'Guadeloupe',
    medianPrice: 100.0,
    observationCount: 50,
    storeCount: 15,
    productCount: 10,
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
  };

  it('should return no errors for valid input', () => {
    const errors = validateTerritoryStatsInput(validInput);
    expect(errors).toHaveLength(0);
  });

  it('should return error for missing territory code', () => {
    const input = { ...validInput, territoryCode: '' };
    const errors = validateTerritoryStatsInput(input);
    expect(errors).toContain('Code territoire manquant');
  });

  it('should return error for missing territory label', () => {
    const input = { ...validInput, territoryLabel: '' };
    const errors = validateTerritoryStatsInput(input);
    expect(errors).toContain('Libellé territoire manquant');
  });

  it('should return error for negative median price', () => {
    const input = { ...validInput, medianPrice: -10 };
    const errors = validateTerritoryStatsInput(input);
    expect(errors.some(e => e.includes('Prix médian invalide'))).toBe(true);
  });

  it('should return error for negative observation count', () => {
    const input = { ...validInput, observationCount: -5 };
    const errors = validateTerritoryStatsInput(input);
    expect(errors.some(e => e.includes('Nombre d\'observations invalide'))).toBe(true);
  });

  it('should return error for invalid date range', () => {
    const input = { ...validInput, periodStart: '2026-02-01', periodEnd: '2026-01-01' };
    const errors = validateTerritoryStatsInput(input);
    expect(errors.some(e => e.includes('Date de début postérieure'))).toBe(true);
  });

  it('should return multiple errors for multiple violations', () => {
    const input = {
      ...validInput,
      territoryCode: '',
      medianPrice: -10,
      observationCount: -5,
    };
    const errors = validateTerritoryStatsInput(input);
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe('validateAllInputs', () => {
  it('should return valid for all valid inputs', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        medianPrice: 100.0,
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const validation = validateAllInputs(input);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should return invalid with error details for invalid inputs', () => {
    const input: TerritoryStatsInput[] = [
      {
        territoryCode: '',
        territoryLabel: 'Guadeloupe',
        medianPrice: -10,
        observationCount: 50,
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const validation = validateAllInputs(input);
    expect(validation.valid).toBe(false);
    expect(validation.errors).toHaveLength(1);
    expect(validation.errors[0].errors.length).toBeGreaterThan(0);
  });
});
