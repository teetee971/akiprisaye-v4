/**
 * Freight Comparison Service v1.0.0
 * 
 * Service de comparaison fret maritime & colis
 * Transparence totale sur formation des prix
 */

import type {
  FreightRoute,
  PackageDetails,
  UrgencyLevel,
  FreightQuote,
  FreightQuoteRanking,
  FreightComparisonResult,
  RouteAggregation,
  FreightPricing,
  OCTROI_DE_MER_RATES,
} from '../types/freightComparison';
import type { Territory } from '../types/priceAlerts';

/**
 * Taux d'octroi de mer par territoire
 */
const OCTROI_RATES: Record<Territory, number> = {
  GP: 0.025,  // 2.5%
  MQ: 0.025,
  GF: 0.05,   // 5.0%
  RE: 0.025,
  YT: 0.03,
  MF: 0.02,
  BL: 0.02,
  PM: 0.02,
  WF: 0.025,
  PF: 0.03,
  NC: 0.025,
  TF: 0.0,
};

/**
 * Calcule l'octroi de mer pour un territoire
 */
export function calculateOctroiDeMer(
  basePrice: number,
  territory: Territory
): number {
  const rate = OCTROI_RATES[territory] || 0;
  return basePrice * rate;
}

/**
 * Calcule le coût total d'un envoi
 */
export function calculateTotalCost(
  basePrice: number,
  packageDetails: PackageDetails,
  territory: Territory,
  urgency: UrgencyLevel = 'standard'
): FreightPricing {
  // Frais de manutention (5% du prix de base)
  const handlingFee = basePrice * 0.05;
  
  // Assurance (si valeur déclarée, 2% de la valeur)
  const insurance = packageDetails.declaredValue 
    ? packageDetails.declaredValue * 0.02 
    : 0;
  
  // Octroi de mer
  const octroi = calculateOctroiDeMer(basePrice, territory);
  
  // Supplément urgence
  let urgencySurcharge = 0;
  if (urgency === 'express') {
    urgencySurcharge = basePrice * 0.3; // +30%
  } else if (urgency === 'urgent') {
    urgencySurcharge = basePrice * 0.5; // +50%
  }
  
  // Total TTC
  const totalTTC = basePrice + handlingFee + insurance + octroi + urgencySurcharge;
  
  return {
    basePrice,
    handlingFee,
    insurance: insurance > 0 ? insurance : undefined,
    octroi,
    totalTTC,
    breakdown: [
      { name: 'Prix de base', amount: basePrice },
      { name: 'Frais de manutention', amount: handlingFee },
      ...(insurance > 0 ? [{ name: 'Assurance', amount: insurance }] : []),
      { name: 'Octroi de mer', amount: octroi },
      ...(urgencySurcharge > 0 ? [{ name: 'Supplément urgence', amount: urgencySurcharge }] : []),
    ],
  };
}

/**
 * Simule un devis de fret
 */
export async function simulateFreightQuote(
  route: FreightRoute,
  packageDetails: PackageDetails,
  urgency: UrgencyLevel = 'standard'
): Promise<FreightComparisonResult | null> {
  try {
    // Charger les données des transporteurs
    const quotes = await getCarrierQuotes(route, packageDetails, urgency);
    
    if (quotes.length === 0) {
      return null;
    }
    
    // Classer les devis
    const rankedQuotes = rankQuotes(quotes);
    
    // Calculer l'agrégation
    const aggregation = calculateRouteAggregation(route, quotes);
    
    return {
      route,
      package: packageDetails,
      urgency,
      quotes: rankedQuotes,
      aggregation,
      comparisonDate: new Date().toISOString(),
      metadata: {
        totalCarriers: quotes.length,
        contributionsCount: 0, // TODO: Compter les contributions réelles
        dataSource: 'Données officielles transporteurs + contributions citoyennes',
        methodology: 'v1.0.0',
        disclaimer: 'Observer, pas vendre. Aucun lien d\'affiliation. Données transparentes.',
      },
    };
  } catch (error) {
    console.error('Error simulating freight quote:', error);
    return null;
  }
}

/**
 * Récupère les devis des transporteurs
 */
export async function getCarrierQuotes(
  route: FreightRoute,
  packageDetails: PackageDetails,
  urgency: UrgencyLevel = 'standard'
): Promise<FreightQuote[]> {
  try {
    // Charger les données depuis le fichier JSON
    const response = await fetch('/data/freight-prices.json');
    if (!response.ok) {
      throw new Error('Impossible de charger les données des transporteurs');
    }
    
    const data = await response.json();
    const carriers = data.carriers || [];
    const routes = data.routes || [];
    
    // Trouver la route correspondante
    const matchingRoute = routes.find(
      (r: any) =>
        r.origin === route.origin &&
        r.destination === route.destination
    );
    
    if (!matchingRoute || !matchingRoute.quotes) {
      return [];
    }
    
    // Construire les devis
    const quotes: FreightQuote[] = matchingRoute.quotes.map((quoteData: any) => {
      const carrier = carriers.find((c: any) => c.code === quoteData.carrier);
      
      // Calculer le prix en fonction du poids et de l'urgence
      const basePrice = calculateBasePriceForWeight(
        quoteData.basePrice,
        quoteData.packageWeight || 5,
        packageDetails.weight
      );
      
      const pricing = calculateTotalCost(
        basePrice,
        packageDetails,
        route.destination,
        urgency
      );
      
      return {
        id: `${quoteData.carrier}-${Date.now()}`,
        carrier: carrier?.name || quoteData.carrier,
        carrierCode: quoteData.carrier,
        route,
        package: packageDetails,
        urgency,
        pricing,
        timing: {
          announcedDays: quoteData.announcedDays || 7,
          realDaysAverage: quoteData.realDaysAverage,
        },
        reliability: {
          score: quoteData.reliability || 3.5,
          basedOnContributions: quoteData.contributionsCount || 0,
          onTimeRate: quoteData.onTimeRate || 0.75,
          issuesReported: quoteData.issuesReported || 0,
        },
        source: {
          type: 'official_site',
          observedAt: quoteData.lastUpdated || new Date().toISOString(),
          verificationMethod: 'automated',
          reliability: 'medium',
        },
        lastUpdated: quoteData.lastUpdated || new Date().toISOString(),
        trackingAvailable: true,
        insuranceIncluded: packageDetails.declaredValue ? true : false,
        pickupAvailable: carrier?.pickupAvailable || false,
        website: carrier?.website,
      };
    });
    
    return quotes;
  } catch (error) {
    console.error('Error loading carrier quotes:', error);
    return [];
  }
}

/**
 * Calcule le prix de base en fonction du poids
 */
function calculateBasePriceForWeight(
  referencePrice: number,
  referenceWeight: number,
  actualWeight: number
): number {
  // Prix proportionnel au poids
  return (referencePrice / referenceWeight) * actualWeight;
}

/**
 * Classe les devis par prix
 */
export function rankQuotes(quotes: FreightQuote[]): FreightQuoteRanking[] {
  if (quotes.length === 0) return [];
  
  // Trier par prix
  const sorted = [...quotes].sort((a, b) => a.pricing.totalTTC - b.pricing.totalTTC);
  
  // Calculer la moyenne
  const averagePrice = sorted.reduce((sum, q) => sum + q.pricing.totalTTC, 0) / sorted.length;
  const cheapestPrice = sorted[0].pricing.totalTTC;
  
  // Classer
  return sorted.map((quote, index) => {
    const rank = index + 1;
    const savingsVsCheapest = quote.pricing.totalTTC - cheapestPrice;
    const savingsVsAverage = quote.pricing.totalTTC - averagePrice;
    
    let priceCategory: FreightQuoteRanking['priceCategory'];
    if (rank === 1) {
      priceCategory = 'cheapest';
    } else if (quote.pricing.totalTTC < averagePrice) {
      priceCategory = 'below_average';
    } else if (quote.pricing.totalTTC === averagePrice) {
      priceCategory = 'average';
    } else if (rank === sorted.length) {
      priceCategory = 'most_expensive';
    } else {
      priceCategory = 'above_average';
    }
    
    // Badge "Meilleur rapport qualité/prix"
    const isBestValue =
      priceCategory === 'cheapest' ||
      (priceCategory === 'below_average' && quote.reliability.score >= 4.0);
    
    return {
      rank,
      quote,
      savingsVsCheapest,
      savingsVsAverage,
      priceCategory,
      isBestValue,
    };
  });
}

/**
 * Calcule l'agrégation pour une route
 */
export function calculateRouteAggregation(
  route: FreightRoute,
  quotes: FreightQuote[]
): RouteAggregation {
  const prices = quotes.map((q) => q.pricing.totalTTC);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  
  // Médiane
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const medianPrice =
    sortedPrices.length % 2 === 0
      ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
      : sortedPrices[Math.floor(sortedPrices.length / 2)];
  
  const priceRange = maxPrice - minPrice;
  const priceRangePercentage = (priceRange / minPrice) * 100;
  
  return {
    route,
    carrierCount: quotes.length,
    minPrice,
    maxPrice,
    averagePrice,
    medianPrice,
    priceRange,
    priceRangePercentage,
    observationPeriod: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
    },
    totalObservations: quotes.reduce((sum, q) => sum + q.reliability.basedOnContributions, 0),
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Filtre les devis selon les critères
 */
export function filterQuotes(
  quotes: FreightQuote[],
  filters: {
    maxPrice?: number;
    minRating?: number;
    carrier?: string;
  }
): FreightQuote[] {
  return quotes.filter((quote) => {
    if (filters.maxPrice && quote.pricing.totalTTC > filters.maxPrice) {
      return false;
    }
    if (filters.minRating && quote.reliability.score < filters.minRating) {
      return false;
    }
    if (filters.carrier && quote.carrierCode !== filters.carrier) {
      return false;
    }
    return true;
  });
}
