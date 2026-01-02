/**
 * Tests unitaires pour les comparateurs énergie et eau
 * Version: 1.6.1
 */

import {
  ElectricityComparisonService,
  ElectricitySpecifications,
  createElectricityOffer,
} from '../electricityComparisonService.js';
import {
  GasComparisonService,
  GasSpecifications,
  createGasOffer,
} from '../gasComparisonService.js';
import {
  WaterComparisonService,
  WaterSpecifications,
  createWaterOffer,
} from '../waterComparisonService.js';
import { Territory, DataSource } from '../../types.js';

const mockSource: DataSource = {
  origin: 'test-data',
  observationDate: new Date('2026-01-01'),
  sampleSize: 1,
  confidenceLevel: 1.0,
};

describe('ElectricityComparisonService', () => {
  let service: ElectricityComparisonService;

  beforeEach(() => {
    service = ElectricityComparisonService.getInstance();
    service.setMockData([]);
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = ElectricityComparisonService.getInstance();
    const instance2 = ElectricityComparisonService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait comparer des offres électriques', async () => {
    const specs1: ElectricitySpecifications = {
      powerSubscribed: 6,
      tariffOption: 'base',
      subscriptionPriceMonthly: 12,
      pricePerKwhPeak: 0.18,
    };

    const specs2: ElectricitySpecifications = {
      powerSubscribed: 6,
      tariffOption: 'base',
      subscriptionPriceMonthly: 10,
      pricePerKwhPeak: 0.20,
    };

    const offers = [
      createElectricityOffer('1', 'EDF', 'Tarif Bleu', Territory.MARTINIQUE, specs1, mockSource),
      createElectricityOffer('2', 'Alternative', 'Offre Verte', Territory.MARTINIQUE, specs2, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE);

    expect(result.serviceType).toBe('electricity');
    expect(result.rankedOffers).toHaveLength(2);
    expect(result.rankedOffers[0].rank).toBe(1);
    expect(result.statistics.sampleSize).toBe(2);
  });

  test('devrait calculer le coût annuel estimé', () => {
    const specs: ElectricitySpecifications = {
      powerSubscribed: 6,
      tariffOption: 'base',
      subscriptionPriceMonthly: 12,
      pricePerKwhPeak: 0.18,
    };

    const offer = createElectricityOffer('1', 'EDF', 'Tarif Bleu', Territory.MARTINIQUE, specs, mockSource);

    // Abonnement: 12€/mois * 12 = 144€
    // Consommation: 5000 kWh * 0.18€ = 900€
    // Total: 1044€
    const cost = service.calculateAnnualCost(offer, 5000);
    expect(cost).toBe(1044);
  });

  test('devrait calculer le coût avec heures creuses', () => {
    const specs: ElectricitySpecifications = {
      powerSubscribed: 6,
      tariffOption: 'heures_creuses',
      subscriptionPriceMonthly: 13,
      pricePerKwhPeak: 0.20,
      pricePerKwhOffPeak: 0.15,
    };

    const offer = createElectricityOffer('1', 'Provider', 'HC', Territory.MARTINIQUE, specs, mockSource);

    // Abonnement: 13€ * 12 = 156€
    // Consommation: 5000 kWh * (60% * 0.20 + 40% * 0.15) = 5000 * 0.18 = 900€
    // Total: 1056€
    const cost = service.calculateAnnualCost(offer, 5000);
    expect(cost).toBe(1056);
  });

  test('devrait filtrer par puissance souscrite', async () => {
    const specs6kva: ElectricitySpecifications = {
      powerSubscribed: 6,
      tariffOption: 'base',
      subscriptionPriceMonthly: 12,
      pricePerKwhPeak: 0.18,
    };

    const specs9kva: ElectricitySpecifications = {
      powerSubscribed: 9,
      tariffOption: 'base',
      subscriptionPriceMonthly: 15,
      pricePerKwhPeak: 0.18,
    };

    const offers = [
      createElectricityOffer('1', 'Provider', '6kVA', Territory.MARTINIQUE, specs6kva, mockSource),
      createElectricityOffer('2', 'Provider', '9kVA', Territory.MARTINIQUE, specs9kva, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE, {
      specificFilters: { powerSubscribed: 6 },
    });

    expect(result.rankedOffers).toHaveLength(1);
    expect((result.rankedOffers[0].specifications as unknown as ElectricitySpecifications).powerSubscribed).toBe(6);
  });
});

describe('GasComparisonService', () => {
  let service: GasComparisonService;

  beforeEach(() => {
    service = GasComparisonService.getInstance();
    service.setMockData([]);
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = GasComparisonService.getInstance();
    const instance2 = GasComparisonService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait comparer des offres gaz', async () => {
    const specs1: GasSpecifications = {
      consumptionClass: 'B1',
      subscriptionPriceMonthly: 15,
      pricePerKwh: 0.08,
    };

    const specs2: GasSpecifications = {
      consumptionClass: 'B1',
      subscriptionPriceMonthly: 14,
      pricePerKwh: 0.09,
    };

    const offers = [
      createGasOffer('1', 'Engie', 'Gaz Fixe', Territory.MARTINIQUE, specs1, mockSource),
      createGasOffer('2', 'Alternative', 'Gaz Vert', Territory.MARTINIQUE, specs2, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE);

    expect(result.serviceType).toBe('gas');
    expect(result.rankedOffers).toHaveLength(2);
    expect(result.statistics.sampleSize).toBe(2);
  });

  test('devrait calculer le coût annuel estimé', () => {
    const specs: GasSpecifications = {
      consumptionClass: 'B1',
      subscriptionPriceMonthly: 15,
      pricePerKwh: 0.08,
    };

    const offer = createGasOffer('1', 'Engie', 'Gaz Fixe', Territory.MARTINIQUE, specs, mockSource);

    // Abonnement: 15€ * 12 = 180€
    // Consommation: 10000 kWh * 0.08€ = 800€
    // Total: 980€
    const cost = service.calculateAnnualCost(offer, 10000);
    expect(cost).toBe(980);
  });

  test('devrait filtrer par classe de consommation', async () => {
    const specsB0: GasSpecifications = {
      consumptionClass: 'B0',
      subscriptionPriceMonthly: 10,
      pricePerKwh: 0.10,
    };

    const specsB1: GasSpecifications = {
      consumptionClass: 'B1',
      subscriptionPriceMonthly: 15,
      pricePerKwh: 0.08,
    };

    const offers = [
      createGasOffer('1', 'Provider', 'B0', Territory.MARTINIQUE, specsB0, mockSource),
      createGasOffer('2', 'Provider', 'B1', Territory.MARTINIQUE, specsB1, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE, {
      specificFilters: { consumptionClass: 'B1' },
    });

    expect(result.rankedOffers).toHaveLength(1);
    expect((result.rankedOffers[0].specifications as unknown as GasSpecifications).consumptionClass).toBe('B1');
  });
});

describe('WaterComparisonService', () => {
  let service: WaterComparisonService;

  beforeEach(() => {
    service = WaterComparisonService.getInstance();
    service.setMockData([]);
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = WaterComparisonService.getInstance();
    const instance2 = WaterComparisonService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait comparer des offres eau', async () => {
    const specs1: WaterSpecifications = {
      serviceType: 'combine',
      subscriptionPriceAnnual: 60,
      pricePerCubicMeter: 2.5,
      pricePerCubicMeterSanitation: 1.5,
    };

    const specs2: WaterSpecifications = {
      serviceType: 'combine',
      subscriptionPriceAnnual: 50,
      pricePerCubicMeter: 2.8,
      pricePerCubicMeterSanitation: 1.6,
    };

    const offers = [
      createWaterOffer('1', 'Veolia', 'Eau Totale', Territory.MARTINIQUE, specs1, mockSource),
      createWaterOffer('2', 'Suez', 'Eau Plus', Territory.MARTINIQUE, specs2, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE);

    expect(result.serviceType).toBe('water');
    expect(result.rankedOffers).toHaveLength(2);
    expect(result.statistics.sampleSize).toBe(2);
  });

  test('devrait calculer le coût annuel estimé', () => {
    const specs: WaterSpecifications = {
      serviceType: 'combine',
      subscriptionPriceAnnual: 60,
      pricePerCubicMeter: 2.5,
      pricePerCubicMeterSanitation: 1.5,
    };

    const offer = createWaterOffer('1', 'Veolia', 'Eau Totale', Territory.MARTINIQUE, specs, mockSource);

    // Abonnement: 60€
    // Eau potable: 120 m³ * 2.5€ = 300€
    // Assainissement: 120 m³ * 1.5€ = 180€
    // Total: 540€
    const cost = service.calculateAnnualCost(offer, 120);
    expect(cost).toBe(540);
  });

  test('devrait calculer le coût sans assainissement', () => {
    const specs: WaterSpecifications = {
      serviceType: 'eau_potable',
      subscriptionPriceAnnual: 40,
      pricePerCubicMeter: 2.5,
    };

    const offer = createWaterOffer('1', 'Provider', 'Eau Simple', Territory.MARTINIQUE, specs, mockSource);

    // Abonnement: 40€
    // Eau potable: 120 m³ * 2.5€ = 300€
    // Total: 340€
    const cost = service.calculateAnnualCost(offer, 120);
    expect(cost).toBe(340);
  });

  test('devrait filtrer par type de service', async () => {
    const specsEau: WaterSpecifications = {
      serviceType: 'eau_potable',
      subscriptionPriceAnnual: 40,
      pricePerCubicMeter: 2.5,
    };

    const specsCombine: WaterSpecifications = {
      serviceType: 'combine',
      subscriptionPriceAnnual: 60,
      pricePerCubicMeter: 2.5,
      pricePerCubicMeterSanitation: 1.5,
    };

    const offers = [
      createWaterOffer('1', 'Provider', 'Eau', Territory.MARTINIQUE, specsEau, mockSource),
      createWaterOffer('2', 'Provider', 'Combine', Territory.MARTINIQUE, specsCombine, mockSource),
    ];

    service.setMockData(offers);

    const result = await service.compareOffers(Territory.MARTINIQUE, {
      specificFilters: { serviceType: 'eau_potable' },
    });

    expect(result.rankedOffers).toHaveLength(1);
    expect((result.rankedOffers[0].specifications as unknown as WaterSpecifications).serviceType).toBe('eau_potable');
  });
});
