/**
 * International Comparison Service Tests - v4.1.0
 * 
 * @module internationalComparisonService.test
 */

import { describe, it, expect } from 'vitest';
import {
  getCountryCostProfile,
  getPPPAdjustment,
  normalizeToEUR,
  compareDOMToMetropole,
  compareFranceToEU,
  compareEUToInternational,
  getInternationalComparison,
  getRegionalComparison,
  validateComparison
} from '../services/internationalComparisonService';

describe('International Comparison Service', () => {
  describe('getCountryCostProfile', () => {
    it('should return country cost profile', async () => {
      const profile = await getCountryCostProfile('FRA');
      
      expect(profile).toBeDefined();
      expect(profile.country).toBe('FRA');
      expect(profile.countryName).toBeDefined();
      expect(profile.currency).toBeDefined();
      expect(profile.data).toBeDefined();
      expect(profile.lastUpdate).toBeDefined();
    });

    it('should include all cost indices', async () => {
      const profile = await getCountryCostProfile('FRA');
      
      expect(typeof profile.data.overallCostIndex).toBe('number');
      expect(typeof profile.data.foodCostIndex).toBe('number');
      expect(typeof profile.data.housingCostIndex).toBe('number');
      expect(typeof profile.data.transportCostIndex).toBe('number');
      expect(typeof profile.data.healthcareCostIndex).toBe('number');
      expect(typeof profile.data.educationCostIndex).toBe('number');
    });

    it('should include data quality metadata', async () => {
      const profile = await getCountryCostProfile('FRA');
      
      expect(profile.dataQuality).toMatch(/^(high|medium|low)$/);
      expect(typeof profile.sourcesCount).toBe('number');
      expect(profile.sourcesCount).toBeGreaterThan(0);
      expect(profile.methodology).toBeDefined();
    });
  });

  describe('getPPPAdjustment', () => {
    it('should return PPP adjustment', async () => {
      const ppp = await getPPPAdjustment('USD', 'EUR');
      
      expect(ppp).toBeDefined();
      expect(ppp.fromCurrency).toBe('USD');
      expect(ppp.toCurrency).toBe('EUR');
      expect(typeof ppp.pppRate).toBe('number');
      expect(typeof ppp.exchangeRate).toBe('number');
      expect(typeof ppp.adjustmentFactor).toBe('number');
    });

    it('should calculate adjustment factor correctly', async () => {
      const ppp = await getPPPAdjustment('USD', 'EUR');
      
      const calculatedFactor = ppp.pppRate / ppp.exchangeRate;
      expect(ppp.adjustmentFactor).toBeCloseTo(calculatedFactor, 5);
    });

    it('should include source and reference year', async () => {
      const ppp = await getPPPAdjustment('USD', 'EUR');
      
      expect(ppp.source).toMatch(/^(OECD|WorldBank|IMF|Eurostat|calculated)$/);
      expect(typeof ppp.referenceYear).toBe('number');
      expect(ppp.referenceYear).toBeGreaterThan(2020);
    });
  });

  describe('normalizeToEUR', () => {
    it('should normalize EUR to EUR without conversion', async () => {
      const normalized = await normalizeToEUR(100, 'EUR');
      
      expect(normalized.originalValue).toBe(100);
      expect(normalized.originalCurrency).toBe('EUR');
      expect(normalized.normalizedValue).toBe(100);
      expect(normalized.normalizedCurrency).toBe('EUR');
      expect(normalized.exchangeRate).toBe(1);
    });

    it('should normalize USD to EUR', async () => {
      const normalized = await normalizeToEUR(100, 'USD');
      
      expect(normalized.originalValue).toBe(100);
      expect(normalized.originalCurrency).toBe('USD');
      expect(normalized.normalizedCurrency).toBe('EUR');
      expect(typeof normalized.normalizedValue).toBe('number');
      expect(normalized.normalizedValue).not.toBe(100); // Should be different
      expect(typeof normalized.exchangeRate).toBe('number');
    });

    it('should include metadata', async () => {
      const normalized = await normalizeToEUR(100, 'USD');
      
      expect(normalized.date).toBeDefined();
      expect(normalized.source).toMatch(/^(ECB|cached|fixed)$/);
    });
  });

  describe('compareDOMToMetropole', () => {
    it('should compare DOM to metropolitan France', async () => {
      const comparison = await compareDOMToMetropole('MTQ');
      
      expect(comparison).toBeDefined();
      expect(comparison.dom).toBe('MTQ');
      expect(comparison.domName).toBeDefined();
      expect(comparison.metropole).toBe('FRA');
      expect(comparison.metropoleName).toBe('France Métropolitaine');
    });

    it('should include all comparison categories', async () => {
      const comparison = await compareDOMToMetropole('MTQ');
      
      expect(comparison.comparison.foodBasket).toBeDefined();
      expect(comparison.comparison.housing).toBeDefined();
      expect(comparison.comparison.transport).toBeDefined();
      expect(comparison.comparison.energy).toBeDefined();
      expect(comparison.comparison.overall).toBeDefined();
    });

    it('should calculate percentage differences', async () => {
      const comparison = await compareDOMToMetropole('MTQ');
      
      const foodBasket = comparison.comparison.foodBasket;
      expect(foodBasket.dom).toBeDefined();
      expect(foodBasket.metropole).toBe(100); // Base 100
      expect(foodBasket.difference).toBe(foodBasket.dom - foodBasket.metropole);
      expect(foodBasket.percentageDifference).toBeCloseTo(
        ((foodBasket.dom - foodBasket.metropole) / foodBasket.metropole) * 100,
        1
      );
    });

    it('should include DOM-specific factors', async () => {
      const comparison = await compareDOMToMetropole('MTQ');
      
      expect(typeof comparison.octroisDeMerEffect).toBe('number');
      expect(typeof comparison.shippingCostsEffect).toBe('number');
      expect(typeof comparison.localProductionRate).toBe('number');
    });

    it('should include methodology', async () => {
      const comparison = await compareDOMToMetropole('MTQ');
      
      expect(comparison.methodology).toBeDefined();
      expect(comparison.date).toBeDefined();
    });
  });

  describe('compareFranceToEU', () => {
    it('should compare France to EU', async () => {
      const comparison = await compareFranceToEU('overall-cost');
      
      expect(comparison).toBeDefined();
      expect(comparison.france).toBe('FRA');
      expect(Array.isArray(comparison.euCountries)).toBe(true);
      expect(comparison.euCountries.length).toBeGreaterThan(0);
    });

    it('should include France, EU average and median', async () => {
      const comparison = await compareFranceToEU('overall-cost');
      
      expect(comparison.results.france).toBeDefined();
      expect(comparison.results.euAverage).toBeDefined();
      expect(comparison.results.euMedian).toBeDefined();
    });

    it('should calculate France ranking in EU', async () => {
      const comparison = await compareFranceToEU('overall-cost');
      
      expect(typeof comparison.franceRankInEU).toBe('number');
      expect(comparison.franceRankInEU).toBeGreaterThanOrEqual(1);
      expect(comparison.franceRankInEU).toBeLessThanOrEqual(comparison.totalEUCountries);
    });

    it('should include methodology', async () => {
      const comparison = await compareFranceToEU('overall-cost');
      
      expect(comparison.methodology).toBeDefined();
      expect(comparison.date).toBeDefined();
    });
  });

  describe('compareEUToInternational', () => {
    it('should compare EU to international countries', async () => {
      const comparison = await compareEUToInternational(['USA', 'JPN', 'AUS'], 'overall-cost');
      
      expect(comparison).toBeDefined();
      expect(comparison.eu).toMatch(/^(EU|EU27)$/);
      expect(comparison.internationalCountries).toEqual(['USA', 'JPN', 'AUS']);
    });

    it('should include EU average', async () => {
      const comparison = await compareEUToInternational(['USA', 'JPN'], 'overall-cost');
      
      expect(comparison.results.euAverage).toBeDefined();
      expect(comparison.results.euAverage.country).toMatch(/^(EU27|EU)$/);
    });

    it('should include international country results', async () => {
      const comparison = await compareEUToInternational(['USA', 'JPN'], 'overall-cost');
      
      expect(Array.isArray(comparison.results.internationalCountries)).toBe(true);
      expect(comparison.results.internationalCountries.length).toBe(2);
    });

    it('should apply PPP adjustment to each country', async () => {
      const comparison = await compareEUToInternational(['USA'], 'overall-cost');
      const country = comparison.results.internationalCountries[0];
      
      expect(country.rawValue).toBeDefined();
      expect(country.normalizedValue).toBeDefined();
      expect(country.pppAdjustedValue).toBeDefined();
      expect(country.pppAdjustment).toBeDefined();
    });
  });

  describe('getInternationalComparison', () => {
    it('should perform general international comparison', async () => {
      const comparison = await getInternationalComparison(
        'FRA',
        ['DEU', 'ESP', 'ITA'],
        'overall-cost'
      );
      
      expect(comparison).toBeDefined();
      expect(comparison.referenceCountry).toBe('FRA');
      expect(comparison.comparedCountries.length).toBe(3);
    });

    it('should include comparison metadata', async () => {
      const comparison = await getInternationalComparison(
        'FRA',
        ['DEU'],
        'overall-cost'
      );
      
      expect(comparison.comparisonId).toBeDefined();
      expect(comparison.comparisonType).toBeDefined();
      expect(comparison.date).toBeDefined();
      expect(comparison.methodology).toBeDefined();
    });

    it('should include disclaimers', async () => {
      const comparison = await getInternationalComparison(
        'FRA',
        ['DEU'],
        'overall-cost'
      );
      
      expect(Array.isArray(comparison.disclaimers)).toBe(true);
      expect(comparison.disclaimers.length).toBeGreaterThan(0);
    });

    it('should assign rankings', async () => {
      const comparison = await getInternationalComparison(
        'FRA',
        ['DEU', 'ESP'],
        'overall-cost'
      );
      
      const rankings = comparison.comparedCountries.map(c => c.ranking);
      expect(rankings.every(r => typeof r === 'number')).toBe(true);
      expect(rankings.every(r => r! >= 1)).toBe(true);
    });

    it('should calculate differences from reference', async () => {
      const comparison = await getInternationalComparison(
        'FRA',
        ['DEU'],
        'overall-cost'
      );
      
      const result = comparison.comparedCountries[0];
      expect(typeof result.differenceFromReference).toBe('number');
      expect(typeof result.percentageDifference).toBe('number');
    });
  });

  describe('getRegionalComparison', () => {
    it('should perform regional comparison', async () => {
      const comparison = await getRegionalComparison('EU', 'overall-cost');
      
      expect(comparison).toBeDefined();
      expect(comparison.region).toBe('EU');
      expect(comparison.regionName).toBeDefined();
    });

    it('should include regional statistics', async () => {
      const comparison = await getRegionalComparison('EU', 'overall-cost');
      
      expect(typeof comparison.regionalAverage).toBe('number');
      expect(typeof comparison.regionalMedian).toBe('number');
      expect(typeof comparison.regionalMin).toBe('number');
      expect(typeof comparison.regionalMax).toBe('number');
    });

    it('should include country results', async () => {
      const comparison = await getRegionalComparison('EU', 'overall-cost');
      
      expect(Array.isArray(comparison.countryResults)).toBe(true);
      expect(comparison.countryResults.length).toBeGreaterThan(0);
      expect(comparison.countries.length).toBe(comparison.countryResults.length);
    });
  });

  describe('validateComparison', () => {
    it('should validate valid comparison', async () => {
      const validation = await validateComparison('FRA', ['DEU', 'ESP']);
      
      expect(validation).toBeDefined();
      expect(validation.isValid).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
      expect(Array.isArray(validation.errors)).toBe(true);
    });

    it('should return errors for empty comparison', async () => {
      const validation = await validateComparison('FRA', []);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should warn when reference country is in compared list', async () => {
      const validation = await validateComparison('FRA', ['FRA', 'DEU']);
      
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    it('should include data quality score', async () => {
      const validation = await validateComparison('FRA', ['DEU']);
      
      expect(typeof validation.dataQualityScore).toBe('number');
      expect(validation.dataQualityScore).toBeGreaterThanOrEqual(0);
      expect(validation.dataQualityScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Data integrity', () => {
    it('should maintain referential integrity in comparisons', async () => {
      const comparison = await getInternationalComparison(
        'FRA',
        ['DEU', 'ESP'],
        'overall-cost'
      );
      
      expect(comparison.referenceCountry).toBe('FRA');
      expect(comparison.comparedCountries.length).toBe(2);
      expect(comparison.comparedCountries.every(c => c.country !== comparison.referenceCountry)).toBe(true);
    });

    it('should ensure PPP calculations are consistent', async () => {
      const ppp = await getPPPAdjustment('USD', 'EUR');
      const normalized = await normalizeToEUR(100, 'USD');
      
      // Exchange rate should be consistent
      expect(normalized.exchangeRate).toBeGreaterThan(0);
      expect(ppp.exchangeRate).toBeGreaterThan(0);
    });
  });

  describe('No subjective ranking principle', () => {
    it('should not use terms like "best" or "worst" in results', async () => {
      const comparison = await getInternationalComparison(
        'FRA',
        ['DEU', 'ESP'],
        'overall-cost'
      );
      
      const jsonStr = JSON.stringify(comparison).toLowerCase();
      expect(jsonStr).not.toContain('best');
      expect(jsonStr).not.toContain('worst');
      expect(jsonStr).not.toContain('superior');
      expect(jsonStr).not.toContain('inferior');
    });

    it('should include disclaimer about factual nature', async () => {
      const comparison = await getInternationalComparison(
        'FRA',
        ['DEU'],
        'overall-cost'
      );
      
      expect(comparison.disclaimers.some(d => 
        d.toLowerCase().includes('factual') || 
        d.toLowerCase().includes('not represent') ||
        d.toLowerCase().includes('purely')
      )).toBe(true);
    });
  });

  describe('Transparent methodology', () => {
    it('should provide methodology URL for all comparisons', async () => {
      const domComparison = await compareDOMToMetropole('MTQ');
      const euComparison = await compareFranceToEU();
      const intlComparison = await getInternationalComparison('FRA', ['DEU'], 'overall-cost');
      
      expect(domComparison.methodology).toBeDefined();
      expect(domComparison.methodology).toContain('http');
      
      expect(euComparison.methodology).toBeDefined();
      expect(euComparison.methodology).toContain('http');
      
      expect(intlComparison.methodology).toBeDefined();
      expect(intlComparison.methodology).toContain('http');
    });
  });
});
