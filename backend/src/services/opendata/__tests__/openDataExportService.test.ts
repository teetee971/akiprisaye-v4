/**
 * Tests unitaires pour OpenDataExportService
 * Version: 1.11.0
 */

import { OpenDataExportService, ExportFormat } from '../openDataExportService.js';
import { Territory } from '../../comparison/types.js';

describe('OpenDataExportService', () => {
  let service: OpenDataExportService;

  beforeEach(() => {
    service = OpenDataExportService.getInstance();
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = OpenDataExportService.getInstance();
    const instance2 = OpenDataExportService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait exporter en JSON', () => {
    const mockResult: any = {
      serviceType: 'test',
      territory: Territory.MARTINIQUE,
      rankedOffers: [],
      statistics: {
        min: 10,
        max: 20,
        average: 15,
        median: 15,
        standardDeviation: 3,
        sampleSize: 5,
        calculatedAt: new Date(),
      },
      metadata: {
        comparisonDate: new Date(),
        totalOffers: 5,
        methodologyVersion: '1.0.0',
      },
    };

    const exported = service.exportServiceComparison(mockResult, ExportFormat.JSON);
    const parsed = JSON.parse(exported);

    expect(parsed.metadata).toBeDefined();
    expect(parsed.metadata.license).toContain('Licence Ouverte');
    expect(parsed.data.serviceType).toBe(mockResult.serviceType);
    expect(parsed.data.territory).toBe(mockResult.territory);
  });
});
