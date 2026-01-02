/**
 * Temporal Price Comparison Service - Comparaison temporelle des prix
 * Version: 1.10.0
 * 
 * Conformité:
 * - Lecture seule - Données observées uniquement
 * - Aucune prédiction - Aucune recommandation
 * - Agrégation statistique uniquement
 * - Multi-territoires - Sources traçables
 */

import { Territory } from '../comparison/types.js';

/**
 * Point de prix dans le temps
 */
export interface PricePoint {
  /** Date d'observation */
  date: Date;
  /** Prix observé TTC en € */
  price: number;
  /** Source de l'observation */
  source: string;
  /** Volume d'observations agrégées */
  sampleSize: number;
}

/**
 * Série temporelle de prix
 */
export interface PriceTimeSeries {
  /** EAN du produit */
  ean: string;
  /** Nom du produit */
  productName: string;
  /** Territoire */
  territory: Territory;
  /** Points de données */
  dataPoints: PricePoint[];
  /** Période couverte */
  period: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Variation de prix
 */
export interface PriceVariation {
  /** Type de variation */
  type: 'increase' | 'decrease' | 'stable';
  /** Variation absolue en € */
  absoluteChange: number;
  /** Variation relative en % */
  percentageChange: number;
  /** Période concernée */
  period: {
    from: Date;
    to: Date;
  };
}

/**
 * Statistiques temporelles
 */
export interface TemporalStatistics {
  /** Prix minimum observé */
  minPrice: number;
  /** Date du prix minimum */
  minPriceDate: Date;
  /** Prix maximum observé */
  maxPrice: number;
  /** Date du prix maximum */
  maxPriceDate: Date;
  /** Prix moyen */
  averagePrice: number;
  /** Écart-type */
  standardDeviation: number;
  /** Variation totale */
  totalVariation: PriceVariation;
  /** Nombre de points */
  dataPointsCount: number;
}

/**
 * Alerte de hausse anormale (descriptive uniquement)
 */
export interface PriceAlert {
  /** Date de l'alerte */
  alertDate: Date;
  /** Prix avant */
  priceBefore: number;
  /** Prix après */
  priceAfter: number;
  /** Variation */
  variation: PriceVariation;
  /** Raison (si connue) */
  reason?: string;
  /** Niveau (basé sur seuil configurable) */
  level: 'info' | 'warning' | 'critical';
}

/**
 * Service de comparaison temporelle des prix
 */
export class TemporalPriceComparisonService {
  private static instance: TemporalPriceComparisonService;
  private priceHistory: Map<string, PriceTimeSeries> = new Map();
  
  // Seuils configurables pour détection de hausses
  private thresholds = {
    info: 0.05,      // 5%
    warning: 0.10,   // 10%
    critical: 0.20,  // 20%
  };

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): TemporalPriceComparisonService {
    if (!TemporalPriceComparisonService.instance) {
      TemporalPriceComparisonService.instance = new TemporalPriceComparisonService();
    }
    return TemporalPriceComparisonService.instance;
  }

  /**
   * Enregistre une série temporelle
   */
  public storePriceTimeSeries(key: string, series: PriceTimeSeries): void {
    this.priceHistory.set(key, series);
  }

  /**
   * Récupère une série temporelle
   */
  public getPriceTimeSeries(ean: string, territory: Territory): PriceTimeSeries | undefined {
    const key = `${ean}-${territory}`;
    return this.priceHistory.get(key);
  }

  /**
   * Calcule les statistiques temporelles
   */
  public calculateTemporalStatistics(series: PriceTimeSeries): TemporalStatistics {
    const prices = series.dataPoints.map(p => p.price);
    const dates = series.dataPoints.map(p => p.date);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minIndex = prices.indexOf(minPrice);
    const maxIndex = prices.indexOf(maxPrice);
    
    const sum = prices.reduce((acc, p) => acc + p, 0);
    const averagePrice = sum / prices.length;

    const variance = prices.reduce((acc, p) => acc + Math.pow(p - averagePrice, 2), 0) / prices.length;
    const standardDeviation = Math.sqrt(variance);

    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const absoluteChange = lastPrice - firstPrice;
    const percentageChange = firstPrice > 0 ? (absoluteChange / firstPrice) * 100 : 0;

    return {
      minPrice: Math.round(minPrice * 100) / 100,
      minPriceDate: dates[minIndex],
      maxPrice: Math.round(maxPrice * 100) / 100,
      maxPriceDate: dates[maxIndex],
      averagePrice: Math.round(averagePrice * 100) / 100,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
      totalVariation: {
        type: absoluteChange > 0.01 ? 'increase' : absoluteChange < -0.01 ? 'decrease' : 'stable',
        absoluteChange: Math.round(absoluteChange * 100) / 100,
        percentageChange: Math.round(percentageChange * 100) / 100,
        period: {
          from: dates[0],
          to: dates[dates.length - 1],
        },
      },
      dataPointsCount: prices.length,
    };
  }

  /**
   * Calcule la variation entre deux périodes
   */
  public calculatePeriodVariation(
    series: PriceTimeSeries,
    startDate: Date,
    endDate: Date,
  ): PriceVariation | null {
    const pointsInPeriod = series.dataPoints.filter(
      p => p.date >= startDate && p.date <= endDate,
    );

    if (pointsInPeriod.length < 2) return null;

    const firstPrice = pointsInPeriod[0].price;
    const lastPrice = pointsInPeriod[pointsInPeriod.length - 1].price;
    const absoluteChange = lastPrice - firstPrice;
    const percentageChange = firstPrice > 0 ? (absoluteChange / firstPrice) * 100 : 0;

    return {
      type: absoluteChange > 0.01 ? 'increase' : absoluteChange < -0.01 ? 'decrease' : 'stable',
      absoluteChange: Math.round(absoluteChange * 100) / 100,
      percentageChange: Math.round(percentageChange * 100) / 100,
      period: {
        from: pointsInPeriod[0].date,
        to: pointsInPeriod[pointsInPeriod.length - 1].date,
      },
    };
  }

  /**
   * Détecte les hausses anormales (descriptif uniquement)
   */
  public detectPriceAlerts(series: PriceTimeSeries): PriceAlert[] {
    const alerts: PriceAlert[] = [];

    for (let i = 1; i < series.dataPoints.length; i++) {
      const before = series.dataPoints[i - 1];
      const after = series.dataPoints[i];
      
      const absoluteChange = after.price - before.price;
      const percentageChange = before.price > 0 ? (absoluteChange / before.price) * 100 : 0;

      let level: PriceAlert['level'] | null = null;
      if (Math.abs(percentageChange) >= this.thresholds.critical) {
        level = 'critical';
      } else if (Math.abs(percentageChange) >= this.thresholds.warning) {
        level = 'warning';
      } else if (Math.abs(percentageChange) >= this.thresholds.info) {
        level = 'info';
      }

      if (level) {
        alerts.push({
          alertDate: after.date,
          priceBefore: before.price,
          priceAfter: after.price,
          variation: {
            type: absoluteChange > 0 ? 'increase' : 'decrease',
            absoluteChange: Math.round(absoluteChange * 100) / 100,
            percentageChange: Math.round(percentageChange * 100) / 100,
            period: {
              from: before.date,
              to: after.date,
            },
          },
          level,
        });
      }
    }

    return alerts;
  }

  /**
   * Configure les seuils de détection
   */
  public setAlertThresholds(thresholds: { info?: number; warning?: number; critical?: number }): void {
    if (thresholds.info !== undefined) this.thresholds.info = thresholds.info;
    if (thresholds.warning !== undefined) this.thresholds.warning = thresholds.warning;
    if (thresholds.critical !== undefined) this.thresholds.critical = thresholds.critical;
  }
}
