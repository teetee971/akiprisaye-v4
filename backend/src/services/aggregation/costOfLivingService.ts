/**
 * Cost of Living Service - Agrégation multi-services et indicateurs du coût de la vie
 * Version: 2.1.0
 * 
 * Conformité:
 * - Lecture seule - Données agrégées uniquement
 * - Indicateurs descriptifs uniquement
 * - Pas d'indice normatif propriétaire
 * - Agrégation territoriale
 * - Méthodologie transparente
 */

import { Territory } from '../comparison/types.js';

/**
 * Catégorie de service
 */
export enum ServiceCategory {
  FOOD = 'food',
  ELECTRICITY = 'electricity',
  WATER = 'water',
  GAS = 'gas',
  INTERNET = 'internet',
  MOBILE = 'mobile',
  INSURANCE_AUTO = 'insurance_auto',
  INSURANCE_HOME = 'insurance_home',
  INSURANCE_HEALTH = 'insurance_health',
}

/**
 * Coût observé pour une catégorie
 */
export interface CategoryCost {
  /** Catégorie */
  category: ServiceCategory;
  /** Coût moyen mensuel TTC en € */
  averageMonthlyCost: number;
  /** Coût minimum observé */
  minCost: number;
  /** Coût maximum observé */
  maxCost: number;
  /** Nombre d'observations */
  sampleSize: number;
  /** Date des données */
  dataDate: Date;
}

/**
 * Indicateur du coût de la vie pour un territoire
 */
export interface CostOfLivingIndicator {
  /** Territoire */
  territory: Territory;
  /** Date de calcul */
  calculationDate: Date;
  /** Coûts par catégorie */
  categoryCosts: CategoryCost[];
  /** Coût total mensuel moyen */
  totalAverageMonthlyCost: number;
  /** Coût total annuel moyen */
  totalAverageAnnualCost: number;
  /** Métadonnées */
  metadata: {
    /** Catégories incluses */
    categoriesIncluded: ServiceCategory[];
    /** Couverture (0-1) */
    coverage: number;
    /** Méthodologie */
    methodology: string;
    /** Sources */
    sources: string[];
  };
}

/**
 * Comparaison inter-territoires du coût de la vie
 */
export interface TerritorialCostComparison {
  /** Date de comparaison */
  comparisonDate: Date;
  /** Territoires comparés */
  territories: Territory[];
  /** Indicateurs par territoire */
  indicators: Map<Territory, CostOfLivingIndicator>;
  /** Classement (du moins cher au plus cher) */
  ranking: Array<{
    territory: Territory;
    rank: number;
    totalCost: number;
    differenceFromCheapest: number;
    percentageFromCheapest: number;
  }>;
}

/**
 * Évolution temporelle du coût de la vie
 */
export interface CostOfLivingEvolution {
  /** Territoire */
  territory: Territory;
  /** Série temporelle */
  timeSeries: Array<{
    date: Date;
    totalCost: number;
    categoryCosts: Map<ServiceCategory, number>;
  }>;
  /** Variation totale */
  totalVariation: {
    absoluteChange: number;
    percentageChange: number;
    period: {
      from: Date;
      to: Date;
    };
  };
}

/**
 * Service d'agrégation du coût de la vie
 */
export class CostOfLivingService {
  private static instance: CostOfLivingService;
  private indicators: Map<Territory, CostOfLivingIndicator> = new Map();

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): CostOfLivingService {
    if (!CostOfLivingService.instance) {
      CostOfLivingService.instance = new CostOfLivingService();
    }
    return CostOfLivingService.instance;
  }

  /**
   * Calcule l'indicateur du coût de la vie pour un territoire
   */
  public calculateIndicator(
    territory: Territory,
    categoryCosts: CategoryCost[],
  ): CostOfLivingIndicator {
    // Calcul du coût total mensuel moyen
    const totalAverageMonthlyCost = categoryCosts.reduce(
      (sum, cat) => sum + cat.averageMonthlyCost,
      0,
    );

    const totalAverageAnnualCost = totalAverageMonthlyCost * 12;

    const indicator: CostOfLivingIndicator = {
      territory,
      calculationDate: new Date(),
      categoryCosts,
      totalAverageMonthlyCost: Math.round(totalAverageMonthlyCost * 100) / 100,
      totalAverageAnnualCost: Math.round(totalAverageAnnualCost * 100) / 100,
      metadata: {
        categoriesIncluded: categoryCosts.map(c => c.category),
        coverage: categoryCosts.length / Object.keys(ServiceCategory).length,
        methodology: 'Agrégation simple des coûts moyens observés par catégorie',
        sources: categoryCosts.map(c => `Observations ${c.category} (n=${c.sampleSize})`),
      },
    };

    this.indicators.set(territory, indicator);
    return indicator;
  }

  /**
   * Compare le coût de la vie entre plusieurs territoires
   */
  public compareTerritories(territories: Territory[]): TerritorialCostComparison {
    const indicators = new Map<Territory, CostOfLivingIndicator>();
    
    territories.forEach(territory => {
      const indicator = this.indicators.get(territory);
      if (indicator) {
        indicators.set(territory, indicator);
      }
    });

    // Classement du moins cher au plus cher
    const sorted = Array.from(indicators.entries())
      .map(([territory, indicator]) => ({
        territory,
        totalCost: indicator.totalAverageMonthlyCost,
      }))
      .sort((a, b) => a.totalCost - b.totalCost);

    const cheapest = sorted[0]?.totalCost || 0;

    const ranking = sorted.map((item, index) => ({
      territory: item.territory,
      rank: index + 1,
      totalCost: item.totalCost,
      differenceFromCheapest: Math.round((item.totalCost - cheapest) * 100) / 100,
      percentageFromCheapest: cheapest > 0
        ? Math.round(((item.totalCost - cheapest) / cheapest) * 10000) / 100
        : 0,
    }));

    return {
      comparisonDate: new Date(),
      territories,
      indicators,
      ranking,
    };
  }

  /**
   * Récupère l'indicateur d'un territoire
   */
  public getIndicator(territory: Territory): CostOfLivingIndicator | undefined {
    return this.indicators.get(territory);
  }

  /**
   * Calcule l'évolution temporelle (nécessite des données historiques)
   */
  public calculateEvolution(
    territory: Territory,
    historicalData: Array<{
      date: Date;
      categoryCosts: CategoryCost[];
    }>,
  ): CostOfLivingEvolution {
    const timeSeries = historicalData.map(snapshot => {
      const totalCost = snapshot.categoryCosts.reduce(
        (sum, cat) => sum + cat.averageMonthlyCost,
        0,
      );

      const categoryCostsMap = new Map<ServiceCategory, number>();
      snapshot.categoryCosts.forEach(cat => {
        categoryCostsMap.set(cat.category, cat.averageMonthlyCost);
      });

      return {
        date: snapshot.date,
        totalCost: Math.round(totalCost * 100) / 100,
        categoryCosts: categoryCostsMap,
      };
    });

    // Calcul de la variation totale
    const firstCost = timeSeries[0]?.totalCost || 0;
    const lastCost = timeSeries[timeSeries.length - 1]?.totalCost || 0;
    const absoluteChange = lastCost - firstCost;
    const percentageChange = firstCost > 0 ? (absoluteChange / firstCost) * 100 : 0;

    return {
      territory,
      timeSeries,
      totalVariation: {
        absoluteChange: Math.round(absoluteChange * 100) / 100,
        percentageChange: Math.round(percentageChange * 100) / 100,
        period: {
          from: timeSeries[0]?.date || new Date(),
          to: timeSeries[timeSeries.length - 1]?.date || new Date(),
        },
      },
    };
  }
}
