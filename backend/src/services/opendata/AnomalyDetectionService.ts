/**
 * Service de détection d'anomalies de prix
 * 
 * Détecte les anomalies dans les variations de prix:
 * - Temporelles (variations rapides)
 * - Spatiales (écarts importants entre territoires)
 */

import { PrismaClient, Territory } from '@prisma/client';

const prisma = new PrismaClient();

export interface PriceAnomaly {
  productId: string;
  productLabel: string;
  territory: Territory;
  type: 'TEMPORAL' | 'SPATIAL' | 'OUTLIER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  detectedAt: string;
}

export class AnomalyDetectionService {
  /**
   * Détecte les anomalies temporelles (variations rapides sur 7 jours)
   */
  static async detectTemporalAnomalies(
    territory?: Territory,
  ): Promise<PriceAnomaly[]> {
    const anomalies: PriceAnomaly[] = [];
    
    // Date il y a 7 jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Récupérer les produits avec leurs prix sur les 7 derniers jours
    const where: {
      isActive: boolean;
      prices: {
        some: {
          effectiveDate: { gte: Date };
          store?: { territory: Territory; isActive: boolean };
        };
      };
    } = {
      isActive: true,
      prices: {
        some: {
          effectiveDate: {
            gte: sevenDaysAgo,
          },
        },
      },
    };

    if (territory) {
      where.prices.some.store = {
        territory,
        isActive: true,
      };
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        prices: {
          where: {
            effectiveDate: {
              gte: sevenDaysAgo,
            },
            store: territory
              ? {
                  territory,
                  isActive: true,
                }
              : {
                  isActive: true,
                },
          },
          orderBy: {
            effectiveDate: 'asc',
          },
          select: {
            price: true,
            effectiveDate: true,
            store: {
              select: {
                territory: true,
              },
            },
          },
        },
      },
    });

    // Analyser chaque produit pour détecter les anomalies
    for (const product of products) {
      if (product.prices.length < 2) continue;

      // Grouper par territoire
      const pricesByTerritory = new Map<Territory, number[]>();
      
      for (const priceEntry of product.prices) {
        const t = priceEntry.store.territory;
        if (!pricesByTerritory.has(t)) {
          pricesByTerritory.set(t, []);
        }
        const prices = pricesByTerritory.get(t);
        if (prices) {
          prices.push(Number(priceEntry.price));
        }
      }

      // Vérifier les variations pour chaque territoire
      for (const [territoryKey, prices] of pricesByTerritory.entries()) {
        if (prices.length < 2) continue;

        const oldestPrice = prices[0];
        const newestPrice = prices[prices.length - 1];
        
        if (oldestPrice === 0) continue;

        const variation = ((newestPrice - oldestPrice) / oldestPrice) * 100;
        const absVariation = Math.abs(variation);

        // Détecter anomalie si variation > 10%
        if (absVariation > 10) {
          let severity: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
          
          if (absVariation > 25) {
            severity = 'HIGH';
          } else if (absVariation > 15) {
            severity = 'MEDIUM';
          }

          anomalies.push({
            productId: product.id,
            productLabel: product.name,
            territory: territoryKey,
            type: 'TEMPORAL',
            severity,
            description: `Variation ${variation > 0 ? '+' : ''}${Math.round(variation)} % en 7 jours`,
            detectedAt: new Date().toISOString().split('T')[0],
          });
        }
      }
    }

    return anomalies;
  }

  /**
   * Détecte les anomalies spatiales (écarts importants entre territoires)
   */
  static async detectSpatialAnomalies(): Promise<PriceAnomaly[]> {
    const anomalies: PriceAnomaly[] = [];

    // Récupérer les produits actifs
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        prices: {
          where: {
            store: {
              isActive: true,
            },
          },
          orderBy: {
            effectiveDate: 'desc',
          },
          select: {
            price: true,
            store: {
              select: {
                territory: true,
              },
            },
          },
          take: 100,
        },
      },
      take: 50, // Limiter pour performance
    });

    // Analyser les écarts de prix entre territoires
    for (const product of products) {
      const pricesByTerritory = new Map<Territory, number[]>();

      for (const priceEntry of product.prices) {
        const territory = priceEntry.store.territory;
        if (!pricesByTerritory.has(territory)) {
          pricesByTerritory.set(territory, []);
        }
        const prices = pricesByTerritory.get(territory);
        if (prices) {
          prices.push(Number(priceEntry.price));
        }
      }

      // Calculer moyenne par territoire
      const avgByTerritory = new Map<Territory, number>();
      for (const [territory, prices] of pricesByTerritory.entries()) {
        const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
        avgByTerritory.set(territory, avg);
      }

      if (avgByTerritory.size < 2) continue;

      // Trouver min et max
      const prices = Array.from(avgByTerritory.values());
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === 0) continue;

      // Calculer l'écart relatif
      const gap = ((maxPrice - minPrice) / minPrice) * 100;

      // Anomalie si écart > 30%
      if (gap > 30) {
        const severity: 'LOW' | 'MEDIUM' | 'HIGH' = gap > 60 ? 'HIGH' : gap > 45 ? 'MEDIUM' : 'LOW';

        // Trouver le territoire avec le prix max
        let maxTerritory: Territory = Territory.DOM;
        for (const [territory, avgPrice] of avgByTerritory.entries()) {
          if (avgPrice === maxPrice) {
            maxTerritory = territory;
            break;
          }
        }

        anomalies.push({
          productId: product.id,
          productLabel: product.name,
          territory: maxTerritory,
          type: 'SPATIAL',
          severity,
          description: `Écart de ${Math.round(gap)} % entre territoires`,
          detectedAt: new Date().toISOString().split('T')[0],
        });
      }
    }

    return anomalies;
  }

  /**
   * Récupère toutes les anomalies détectées
   */
  static async getAllAnomalies(
    territory?: Territory,
  ): Promise<PriceAnomaly[]> {
    const [temporal, spatial] = await Promise.all([
      this.detectTemporalAnomalies(territory),
      territory ? [] : this.detectSpatialAnomalies(), // Anomalies spatiales seulement si pas de filtre territoire
    ]);

    return [...temporal, ...spatial];
  }
}
