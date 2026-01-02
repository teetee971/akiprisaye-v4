/**
 * Tests unitaires pour les comparateurs télécoms
 * Version: 1.7.0
 */

import {
  InternetComparisonService,
  InternetSpecifications,
  createInternetOffer,
} from '../internetComparisonService.js';
import {
  MobilePlanComparisonService,
  MobilePlanSpecifications,
  createMobilePlanOffer,
} from '../mobilePlanComparisonService.js';
import { Territory, DataSource } from '../../types.js';

const mockSource: DataSource = {
  origin: 'test-data',
  observationDate: new Date('2026-01-01'),
  sampleSize: 1,
  confidenceLevel: 1.0,
};

describe('InternetComparisonService', () => {
  let service: InternetComparisonService;

  beforeEach(() => {
    service = InternetComparisonService.getInstance();
    service.setMockData([]);
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = InternetComparisonService.getInstance();
    const instance2 = InternetComparisonService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait comparer des offres Internet', async () => {
    const specs1: InternetSpecifications = {
      technology: 'fibre',
      downloadSpeedMbps: 1000,
      uploadSpeedMbps: 500,
      dataVolume: 'unlimited',
      monthlyPrice: 34.99,
    };

    const specs2: InternetSpecifications = {
      technology: 'fibre',
      downloadSpeedMbps: 1000,
      uploadSpeedMbps: 500,
      dataVolume: 'unlimited',
      monthlyPrice: 39.99,
    };

    const offers = [
      createInternetOffer('1', 'Orange', 'Fibre 1Gb', Territory.MARTINIQUE, specs1, mockSource),
      createInternetOffer('2', 'SFR', 'Fibre Pro', Territory.MARTINIQUE, specs2, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE);

    expect(result.serviceType).toBe('internet_fixed');
    expect(result.rankedOffers).toHaveLength(2);
    expect(result.rankedOffers[0].priceIncludingTax).toBe(34.99);
  });

  test('devrait filtrer par technologie', async () => {
    const specsFibre: InternetSpecifications = {
      technology: 'fibre',
      downloadSpeedMbps: 1000,
      dataVolume: 'unlimited',
      monthlyPrice: 34.99,
    };

    const specsAdsl: InternetSpecifications = {
      technology: 'adsl',
      downloadSpeedMbps: 20,
      dataVolume: 'unlimited',
      monthlyPrice: 29.99,
    };

    const offers = [
      createInternetOffer('1', 'Provider', 'Fibre', Territory.MARTINIQUE, specsFibre, mockSource),
      createInternetOffer('2', 'Provider', 'ADSL', Territory.MARTINIQUE, specsAdsl, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE, {
      specificFilters: { technology: 'fibre' },
    });

    expect(result.rankedOffers).toHaveLength(1);
    expect((result.rankedOffers[0].specifications as unknown as InternetSpecifications).technology).toBe('fibre');
  });

  test('devrait calculer le coût total', () => {
    const specs: InternetSpecifications = {
      technology: 'fibre',
      downloadSpeedMbps: 1000,
      dataVolume: 'unlimited',
      monthlyPrice: 34.99,
      commitmentMonths: 12,
      activationFee: 49,
    };

    const offer = createInternetOffer('1', 'Orange', 'Fibre', Territory.MARTINIQUE, specs, mockSource);

    const totalCost = service.calculateTotalCost(offer);
    // 34.99 * 12 + 49 = 468.88
    expect(totalCost).toBe(468.88);
  });
});

describe('MobilePlanComparisonService', () => {
  let service: MobilePlanComparisonService;

  beforeEach(() => {
    service = MobilePlanComparisonService.getInstance();
    service.setMockData([]);
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = MobilePlanComparisonService.getInstance();
    const instance2 = MobilePlanComparisonService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait comparer des forfaits mobile', async () => {
    const specs1: MobilePlanSpecifications = {
      dataVolumeGb: 100,
      calls: 'unlimited',
      sms: 'unlimited',
      network: '5g',
      monthlyPrice: 19.99,
    };

    const specs2: MobilePlanSpecifications = {
      dataVolumeGb: 50,
      calls: 'unlimited',
      sms: 'unlimited',
      network: '4g',
      monthlyPrice: 14.99,
    };

    const offers = [
      createMobilePlanOffer('1', 'Orange', '100Go 5G', Territory.MARTINIQUE, specs1, mockSource),
      createMobilePlanOffer('2', 'SFR', '50Go 4G', Territory.MARTINIQUE, specs2, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE);

    expect(result.serviceType).toBe('mobile_plan');
    expect(result.rankedOffers).toHaveLength(2);
    expect(result.rankedOffers[0].priceIncludingTax).toBe(14.99);
  });

  test('devrait filtrer par volume data minimum', async () => {
    const specs100: MobilePlanSpecifications = {
      dataVolumeGb: 100,
      calls: 'unlimited',
      sms: 'unlimited',
      network: '5g',
      monthlyPrice: 19.99,
    };

    const specs50: MobilePlanSpecifications = {
      dataVolumeGb: 50,
      calls: 'unlimited',
      sms: 'unlimited',
      network: '4g',
      monthlyPrice: 14.99,
    };

    const offers = [
      createMobilePlanOffer('1', 'Provider', '100Go', Territory.MARTINIQUE, specs100, mockSource),
      createMobilePlanOffer('2', 'Provider', '50Go', Territory.MARTINIQUE, specs50, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE, {
      specificFilters: { minDataVolumeGb: 80 },
    });

    expect(result.rankedOffers).toHaveLength(1);
    expect((result.rankedOffers[0].specifications as unknown as MobilePlanSpecifications).dataVolumeGb).toBe(100);
  });

  test('devrait filtrer par réseau minimum', async () => {
    const specs5g: MobilePlanSpecifications = {
      dataVolumeGb: 100,
      calls: 'unlimited',
      sms: 'unlimited',
      network: '5g',
      monthlyPrice: 19.99,
    };

    const specs4g: MobilePlanSpecifications = {
      dataVolumeGb: 100,
      calls: 'unlimited',
      sms: 'unlimited',
      network: '4g',
      monthlyPrice: 14.99,
    };

    const offers = [
      createMobilePlanOffer('1', 'Provider', '5G', Territory.MARTINIQUE, specs5g, mockSource),
      createMobilePlanOffer('2', 'Provider', '4G', Territory.MARTINIQUE, specs4g, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE, {
      specificFilters: { minNetwork: '5g' },
    });

    expect(result.rankedOffers).toHaveLength(1);
    expect((result.rankedOffers[0].specifications as unknown as MobilePlanSpecifications).network).toBe('5g');
  });
});
