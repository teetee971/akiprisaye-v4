/**
 * Tests unitaires pour TemporalPriceComparisonService
 * Version: 1.10.0
 */

import {
  TemporalPriceComparisonService,
  PriceTimeSeries,
} from '../temporalPriceComparisonService.js';
import { Territory } from '../../comparison/types.js';

describe('TemporalPriceComparisonService', () => {
  let service: TemporalPriceComparisonService;

  beforeEach(() => {
    service = TemporalPriceComparisonService.getInstance();
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = TemporalPriceComparisonService.getInstance();
    const instance2 = TemporalPriceComparisonService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait calculer les statistiques temporelles', () => {
    const series: PriceTimeSeries = {
      ean: '3228857000906',
      productName: 'Test Product',
      territory: Territory.MARTINIQUE,
      dataPoints: [
        { date: new Date('2026-01-01'), price: 10, source: 'test', sampleSize: 1 },
        { date: new Date('2026-01-15'), price: 12, source: 'test', sampleSize: 1 },
        { date: new Date('2026-02-01'), price: 11, source: 'test', sampleSize: 1 },
      ],
      period: {
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-02-01'),
      },
    };

    const stats = service.calculateTemporalStatistics(series);

    expect(stats.minPrice).toBe(10);
    expect(stats.maxPrice).toBe(12);
    expect(stats.averagePrice).toBe(11);
    expect(stats.totalVariation.type).toBe('increase');
    expect(stats.totalVariation.absoluteChange).toBe(1);
    expect(stats.totalVariation.percentageChange).toBe(10);
  });

  test('devrait détecter les hausses anormales', () => {
    const series: PriceTimeSeries = {
      ean: '3228857000906',
      productName: 'Test Product',
      territory: Territory.MARTINIQUE,
      dataPoints: [
        { date: new Date('2026-01-01'), price: 10, source: 'test', sampleSize: 1 },
        { date: new Date('2026-01-15'), price: 13, source: 'test', sampleSize: 1 }, // +30%
        { date: new Date('2026-02-01'), price: 13.5, source: 'test', sampleSize: 1 },
      ],
      period: {
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-02-01'),
      },
    };

    const alerts = service.detectPriceAlerts(series);

    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0].level).toBe('critical'); // +30% > 20% threshold
    expect(alerts[0].variation.type).toBe('increase');
  });

  test('devrait stocker et récupérer une série temporelle', () => {
    const series: PriceTimeSeries = {
      ean: '3228857000906',
      productName: 'Test Product',
      territory: Territory.MARTINIQUE,
      dataPoints: [
        { date: new Date('2026-01-01'), price: 10, source: 'test', sampleSize: 1 },
      ],
      period: {
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-01-01'),
      },
    };

    service.storePriceTimeSeries('3228857000906-MARTINIQUE', series);
    const retrieved = service.getPriceTimeSeries('3228857000906', Territory.MARTINIQUE);

    expect(retrieved).toBeDefined();
    expect(retrieved?.productName).toBe('Test Product');
  });

  test('devrait calculer la variation entre deux périodes', () => {
    const series: PriceTimeSeries = {
      ean: '3228857000906',
      productName: 'Test Product',
      territory: Territory.MARTINIQUE,
      dataPoints: [
        { date: new Date('2026-01-01'), price: 10, source: 'test', sampleSize: 1 },
        { date: new Date('2026-01-15'), price: 11, source: 'test', sampleSize: 1 },
        { date: new Date('2026-02-01'), price: 12, source: 'test', sampleSize: 1 },
        { date: new Date('2026-02-15'), price: 11.5, source: 'test', sampleSize: 1 },
      ],
      period: {
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-02-15'),
      },
    };

    const variation = service.calculatePeriodVariation(
      series,
      new Date('2026-01-01'),
      new Date('2026-02-01'),
    );

    expect(variation).toBeDefined();
    expect(variation?.type).toBe('increase');
    expect(variation?.absoluteChange).toBe(2);
  });
});
