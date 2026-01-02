/**
 * Tests unitaires pour le comparateur d'assurances
 * Version: 1.8.0
 */

import {
  InsuranceComparisonService,
  InsuranceType,
  CoverageLevel,
  AutoInsuranceSpecifications,
  HomeInsuranceSpecifications,
  HealthInsuranceSpecifications,
  createAutoInsuranceOffer,
  createHomeInsuranceOffer,
  createHealthInsuranceOffer,
} from '../insuranceComparisonService.js';
import { Territory, DataSource } from '../../types.js';

const mockSource: DataSource = {
  origin: 'test-data',
  observationDate: new Date('2026-01-01'),
  sampleSize: 1,
  confidenceLevel: 1.0,
};

describe('InsuranceComparisonService', () => {
  let service: InsuranceComparisonService;

  beforeEach(() => {
    service = InsuranceComparisonService.getInstance();
    service.setMockData([]);
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = InsuranceComparisonService.getInstance();
    const instance2 = InsuranceComparisonService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait comparer des assurances auto', async () => {
    const specs1: AutoInsuranceSpecifications = {
      insuranceType: InsuranceType.AUTO,
      coverageLevel: CoverageLevel.BASIC,
      annualPriceTTC: 450,
      deductible: 500,
      mainCoverages: ['Responsabilité civile', 'Défense pénale'],
    };

    const specs2: AutoInsuranceSpecifications = {
      insuranceType: InsuranceType.AUTO,
      coverageLevel: CoverageLevel.COMPREHENSIVE,
      annualPriceTTC: 850,
      deductible: 300,
      mainCoverages: ['Tous risques', 'Vol', 'Incendie', 'Bris de glace'],
    };

    const offers = [
      createAutoInsuranceOffer('1', 'Assureur A', 'Auto Tiers', Territory.MARTINIQUE, specs1, mockSource),
      createAutoInsuranceOffer('2', 'Assureur B', 'Auto Tous Risques', Territory.MARTINIQUE, specs2, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE);

    expect(result.serviceType).toBe('insurance');
    expect(result.rankedOffers).toHaveLength(2);
    expect(result.rankedOffers[0].priceIncludingTax).toBe(450);
    expect(result.rankedOffers[1].priceIncludingTax).toBe(850);
  });

  test('devrait comparer des assurances habitation', async () => {
    const specs1: HomeInsuranceSpecifications = {
      insuranceType: InsuranceType.HOME,
      coverageLevel: CoverageLevel.BASIC,
      annualPriceTTC: 180,
      mainCoverages: ['Responsabilité civile', 'Dégâts des eaux', 'Incendie'],
      housingType: 'apartment',
      surfaceM2: 50,
    };

    const specs2: HomeInsuranceSpecifications = {
      insuranceType: InsuranceType.HOME,
      coverageLevel: CoverageLevel.COMPREHENSIVE,
      annualPriceTTC: 350,
      mainCoverages: ['Tous risques', 'Vol', 'Bris de glace', 'Catastrophes naturelles'],
      housingType: 'house',
      surfaceM2: 120,
    };

    const offers = [
      createHomeInsuranceOffer('1', 'Assureur A', 'Habitation Base', Territory.MARTINIQUE, specs1, mockSource),
      createHomeInsuranceOffer('2', 'Assureur B', 'Habitation Premium', Territory.MARTINIQUE, specs2, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE);

    expect(result.rankedOffers).toHaveLength(2);
    expect(result.rankedOffers[0].priceIncludingTax).toBe(180);
  });

  test('devrait comparer des assurances santé', async () => {
    const specs1: HealthInsuranceSpecifications = {
      insuranceType: InsuranceType.HEALTH,
      coverageLevel: CoverageLevel.BASIC,
      annualPriceTTC: 600,
      mainCoverages: ['Hospitalisation', 'Soins courants'],
      contractType: 'individual',
      beneficiariesCount: 1,
    };

    const specs2: HealthInsuranceSpecifications = {
      insuranceType: InsuranceType.HEALTH,
      coverageLevel: CoverageLevel.COMPREHENSIVE,
      annualPriceTTC: 1200,
      mainCoverages: ['Hospitalisation', 'Soins courants', 'Dentaire', 'Optique'],
      contractType: 'family',
      beneficiariesCount: 4,
    };

    const offers = [
      createHealthInsuranceOffer('1', 'Mutuelle A', 'Santé Essentiel', Territory.MARTINIQUE, specs1, mockSource),
      createHealthInsuranceOffer('2', 'Mutuelle B', 'Santé Famille', Territory.MARTINIQUE, specs2, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE);

    expect(result.rankedOffers).toHaveLength(2);
    expect(result.rankedOffers[0].priceIncludingTax).toBe(600);
  });

  test('devrait filtrer par type d\'assurance', async () => {
    const specsAuto: AutoInsuranceSpecifications = {
      insuranceType: InsuranceType.AUTO,
      coverageLevel: CoverageLevel.BASIC,
      annualPriceTTC: 450,
      mainCoverages: ['RC'],
    };

    const specsHome: HomeInsuranceSpecifications = {
      insuranceType: InsuranceType.HOME,
      coverageLevel: CoverageLevel.BASIC,
      annualPriceTTC: 180,
      mainCoverages: ['RC'],
    };

    const offers = [
      createAutoInsuranceOffer('1', 'Provider', 'Auto', Territory.MARTINIQUE, specsAuto, mockSource),
      createHomeInsuranceOffer('2', 'Provider', 'Home', Territory.MARTINIQUE, specsHome, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE, {
      specificFilters: { insuranceType: InsuranceType.AUTO },
    });

    expect(result.rankedOffers).toHaveLength(1);
    expect(result.rankedOffers[0].priceIncludingTax).toBe(450);
  });

  test('devrait filtrer par niveau de couverture', async () => {
    const specsBasic: AutoInsuranceSpecifications = {
      insuranceType: InsuranceType.AUTO,
      coverageLevel: CoverageLevel.BASIC,
      annualPriceTTC: 450,
      mainCoverages: ['RC'],
    };

    const specsComprehensive: AutoInsuranceSpecifications = {
      insuranceType: InsuranceType.AUTO,
      coverageLevel: CoverageLevel.COMPREHENSIVE,
      annualPriceTTC: 850,
      mainCoverages: ['Tous risques'],
    };

    const offers = [
      createAutoInsuranceOffer('1', 'Provider', 'Basic', Territory.MARTINIQUE, specsBasic, mockSource),
      createAutoInsuranceOffer('2', 'Provider', 'Premium', Territory.MARTINIQUE, specsComprehensive, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE, {
      specificFilters: { coverageLevel: CoverageLevel.BASIC },
    });

    expect(result.rankedOffers).toHaveLength(1);
    expect(result.rankedOffers[0].priceIncludingTax).toBe(450);
  });
});
