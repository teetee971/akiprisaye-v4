/**
 * Open Data Export Service - Export de données ouvertes
 * Version: 1.11.0
 * 
 * Conformité:
 * - Données anonymisées et agrégées
 * - Pas de données personnelles
 * - Licence open data explicite
 * - Formats standards (CSV, JSON)
 */

import { ServiceComparisonResult, TerritoryComparison } from '../comparison/types.js';
import { PriceTimeSeries } from '../temporal/temporalPriceComparisonService.js';
import { ProductDetails } from '../product/productDetailService.js';

/**
 * Format d'export disponible
 */
export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
}

/**
 * Métadonnées d'export open-data
 */
export interface OpenDataExportMetadata {
  /** Version du schéma */
  schemaVersion: string;
  /** Date de génération */
  generatedAt: Date;
  /** Licence */
  license: string;
  /** Attribution */
  attribution: string;
  /** Description du dataset */
  description: string;
  /** Période couverte */
  period?: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Export open-data
 */
export interface OpenDataExport<T> {
  /** Métadonnées */
  metadata: OpenDataExportMetadata;
  /** Données */
  data: T;
}

/**
 * Service d'export open-data
 */
export class OpenDataExportService {
  private static instance: OpenDataExportService;
  
  private readonly defaultLicense = 'Licence Ouverte / Open Licence v2.0';
  private readonly defaultAttribution = 'A KI PRI SA YÉ - Comparateur Citoyen - https://akiprisaye.fr';

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): OpenDataExportService {
    if (!OpenDataExportService.instance) {
      OpenDataExportService.instance = new OpenDataExportService();
    }
    return OpenDataExportService.instance;
  }

  /**
   * Exporte une comparaison de services
   */
  public exportServiceComparison(
    result: ServiceComparisonResult,
    format: ExportFormat = ExportFormat.JSON,
  ): string {
    const exportData: OpenDataExport<ServiceComparisonResult> = {
      metadata: {
        schemaVersion: '1.0.0',
        generatedAt: new Date(),
        license: this.defaultLicense,
        attribution: this.defaultAttribution,
        description: `Comparaison de services - ${result.serviceType} - ${result.territory}`,
      },
      data: result,
    };

    if (format === ExportFormat.JSON) {
      return JSON.stringify(exportData, null, 2);
    } else {
      return this.convertToCSV(exportData);
    }
  }

  /**
   * Exporte un historique temporel
   */
  public exportPriceTimeSeries(
    series: PriceTimeSeries,
    format: ExportFormat = ExportFormat.JSON,
  ): string {
    const exportData: OpenDataExport<PriceTimeSeries> = {
      metadata: {
        schemaVersion: '1.0.0',
        generatedAt: new Date(),
        license: this.defaultLicense,
        attribution: this.defaultAttribution,
        description: `Historique de prix - ${series.productName} - ${series.territory}`,
        period: series.period,
      },
      data: series,
    };

    if (format === ExportFormat.JSON) {
      return JSON.stringify(exportData, null, 2);
    } else {
      return this.convertTimeSeriesToCSV(exportData);
    }
  }

  /**
   * Exporte les détails d'un produit (anonymisé)
   */
  public exportProductDetails(
    details: ProductDetails,
    format: ExportFormat = ExportFormat.JSON,
  ): string {
    // Anonymisation: retirer les URLs d'images si elles contiennent des identifiants
    const anonymizedDetails = {
      ...details,
      source: {
        ...details.source,
        imageUrl: undefined, // Retirer pour anonymisation
      },
    };

    const exportData: OpenDataExport<ProductDetails> = {
      metadata: {
        schemaVersion: '1.0.0',
        generatedAt: new Date(),
        license: this.defaultLicense,
        attribution: this.defaultAttribution,
        description: `Détails produit - ${details.productName}`,
      },
      data: anonymizedDetails,
    };

    if (format === ExportFormat.JSON) {
      return JSON.stringify(exportData, null, 2);
    } else {
      return this.convertProductToCSV(exportData);
    }
  }

  /**
   * Convertit en CSV (simplifié)
   */
  private convertToCSV(exportData: OpenDataExport<unknown>): string {
    // Conversion simplifiée - en production, utiliser une bibliothèque CSV
    let csv = '# Open Data Export\n';
    csv += `# License: ${exportData.metadata.license}\n`;
    csv += `# Attribution: ${exportData.metadata.attribution}\n`;
    csv += `# Generated: ${exportData.metadata.generatedAt.toISOString()}\n\n`;
    csv += JSON.stringify(exportData.data, null, 2);
    return csv;
  }

  /**
   * Convertit une série temporelle en CSV
   */
  private convertTimeSeriesToCSV(exportData: OpenDataExport<PriceTimeSeries>): string {
    const series = exportData.data;
    let csv = '# Price Time Series\n';
    csv += `# License: ${exportData.metadata.license}\n`;
    csv += `# Product: ${series.productName}\n`;
    csv += `# Territory: ${series.territory}\n\n`;
    csv += 'Date,Price,Source,SampleSize\n';
    
    series.dataPoints.forEach(point => {
      csv += `${point.date.toISOString()},${point.price},${point.source},${point.sampleSize}\n`;
    });
    
    return csv;
  }

  /**
   * Convertit les détails produit en CSV
   */
  private convertProductToCSV(exportData: OpenDataExport<ProductDetails>): string {
    const product = exportData.data;
    let csv = '# Product Details\n';
    csv += `# License: ${exportData.metadata.license}\n`;
    csv += `# Product: ${product.productName}\n\n`;
    csv += 'Field,Value\n';
    csv += `EAN,${product.ean || 'N/A'}\n`;
    csv += `Brand,${product.brand || 'N/A'}\n`;
    csv += `Ingredients,${product.ingredients.length}\n`;
    csv += `Allergens,${product.allergens.length}\n`;
    csv += `Additives,${product.additives.length}\n`;
    
    return csv;
  }

  /**
   * Génère un dataset agrégé multi-territoires
   */
  public exportTerritoryComparison(
    comparison: TerritoryComparison,
    format: ExportFormat = ExportFormat.JSON,
  ): string {
    const exportData: OpenDataExport<TerritoryComparison> = {
      metadata: {
        schemaVersion: '1.0.0',
        generatedAt: new Date(),
        license: this.defaultLicense,
        attribution: this.defaultAttribution,
        description: `Comparaison territoriale - ${comparison.serviceType}`,
      },
      data: comparison,
    };

    if (format === ExportFormat.JSON) {
      return JSON.stringify(exportData, null, 2);
    } else {
      return this.convertToCSV(exportData);
    }
  }
}
