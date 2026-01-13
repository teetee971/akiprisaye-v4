/**
 * Utility functions for exporting comparison data to various formats
 */

import type { FlightComparisonResult } from '../types/flightComparison';
import type { BoatComparisonResult } from '../types/boatComparison';

/**
 * Format price as EUR currency
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

/**
 * Escape CSV field to prevent injection and parsing errors
 */
const escapeCSV = (field: string | number | boolean): string => {
  const str = String(field);
  // If field contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Export flight comparison to CSV
 */
export const exportFlightComparisonToCSV = (result: FlightComparisonResult): void => {
  const headers = [
    'Rang',
    'Compagnie',
    'Prix (€)',
    'Frais supplémentaires (€)',
    'Prix total (€)',
    'Durée',
    'Escales',
    'Bagages inclus',
    'Remboursable',
    'Modifiable',
    'Différence vs moins cher (%)',
    'Catégorie'
  ];

  const rows = result.airlines.map(ranking => [
    escapeCSV(ranking.rank),
    escapeCSV(ranking.flightPrice.airline),
    escapeCSV(ranking.flightPrice.price.toFixed(2)),
    escapeCSV(ranking.flightPrice.additionalFees?.total.toFixed(2) || '0.00'),
    escapeCSV((ranking.flightPrice.price + (ranking.flightPrice.additionalFees?.total || 0)).toFixed(2)),
    escapeCSV(ranking.flightPrice.duration),
    escapeCSV(ranking.flightPrice.stops),
    escapeCSV(ranking.flightPrice.fareConditions.baggageIncluded ? 'Oui' : 'Non'),
    escapeCSV(ranking.flightPrice.fareConditions.refundable ? 'Oui' : 'Non'),
    escapeCSV(ranking.flightPrice.fareConditions.changeable ? 'Oui' : 'Non'),
    escapeCSV(ranking.percentageDifferenceFromCheapest.toFixed(2)),
    escapeCSV(ranking.priceCategory)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadCSV(csvContent, `comparaison-vols-${Date.now()}.csv`);
};

/**
 * Export boat comparison to CSV
 */
export const exportBoatComparisonToCSV = (result: BoatComparisonResult): void => {
  const headers = [
    'Rang',
    'Opérateur',
    'Prix passager (€)',
    'Prix enfant (€)',
    'Prix voiture (€)',
    'Prix moto (€)',
    'Durée',
    'Fréquence',
    'Différence vs moins cher (%)',
    'Catégorie'
  ];

  const rows = result.operators.map(ranking => [
    escapeCSV(ranking.rank),
    escapeCSV(ranking.boatPrice.operator),
    escapeCSV(ranking.boatPrice.pricing.passengerPrice.toFixed(2)),
    escapeCSV(ranking.boatPrice.pricing.childPrice?.toFixed(2) || 'N/A'),
    escapeCSV(ranking.boatPrice.pricing.vehiclePrice?.car.toFixed(2) || 'N/A'),
    escapeCSV(ranking.boatPrice.pricing.vehiclePrice?.motorcycle?.toFixed(2) || 'N/A'),
    escapeCSV(ranking.boatPrice.schedule.duration),
    escapeCSV(ranking.boatPrice.schedule.frequency),
    escapeCSV(ranking.percentageDifferenceFromCheapest.toFixed(2)),
    escapeCSV(ranking.priceCategory)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadCSV(csvContent, `comparaison-bateaux-${Date.now()}.csv`);
};

/**
 * Export flight comparison to text summary
 */
export const exportFlightComparisonToText = (result: FlightComparisonResult): void => {
  const route = result.airlines[0]?.flightPrice.route;
  let text = `COMPARAISON DE PRIX DES VOLS\n`;
  text += `================================\n\n`;
  text += `Route: ${route.origin.city} (${route.origin.code}) → ${route.destination.city} (${route.destination.code})\n`;
  text += `Date d'export: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
  
  text += `STATISTIQUES\n`;
  text += `------------\n`;
  text += `Prix moyen: ${formatPrice(result.aggregation.averagePrice)}\n`;
  text += `Prix minimum: ${formatPrice(result.aggregation.minPrice)}\n`;
  text += `Prix maximum: ${formatPrice(result.aggregation.maxPrice)}\n`;
  text += `Écart de prix: ${result.aggregation.priceRangePercentage.toFixed(1)}%\n`;
  text += `Observations: ${result.aggregation.totalObservations}\n\n`;

  if (result.aggregation.seasonalVariation) {
    text += `VARIATION SAISONNIÈRE\n`;
    text += `---------------------\n`;
    text += `Haute saison: ${formatPrice(result.aggregation.seasonalVariation.highSeasonAverage)}\n`;
    text += `Basse saison: ${formatPrice(result.aggregation.seasonalVariation.lowSeasonAverage)}\n`;
    text += `Différence: +${result.aggregation.seasonalVariation.seasonalDifferencePercentage.toFixed(1)}% en haute saison\n\n`;
  }

  text += `COMPARAISON PAR COMPAGNIE\n`;
  text += `-------------------------\n`;
  result.airlines.forEach(ranking => {
    text += `\n#${ranking.rank} - ${ranking.flightPrice.airline}\n`;
    text += `  Prix: ${formatPrice(ranking.flightPrice.price)}\n`;
    if (ranking.flightPrice.additionalFees) {
      text += `  Frais supplémentaires: ${formatPrice(ranking.flightPrice.additionalFees.total)}\n`;
      text += `  Prix total: ${formatPrice(ranking.flightPrice.price + ranking.flightPrice.additionalFees.total)}\n`;
    }
    text += `  Durée: ${ranking.flightPrice.duration}\n`;
    text += `  Escales: ${ranking.flightPrice.stops === 0 ? 'Direct' : `${ranking.flightPrice.stops} escale(s)`}\n`;
    text += `  Différence vs moins cher: ${ranking.percentageDifferenceFromCheapest > 0 ? '+' : ''}${ranking.percentageDifferenceFromCheapest.toFixed(1)}%\n`;
  });

  if (result.purchaseTimingAnalysis?.optimalPurchaseWindow) {
    const optimalWindow = result.purchaseTimingAnalysis.optimalPurchaseWindow;
    text += `\n\nFENÊTRE D'ACHAT OPTIMALE\n`;
    text += `-------------------------\n`;
    text += `Période recommandée: ${optimalWindow.daysBeforeDeparture.min} à ${optimalWindow.daysBeforeDeparture.max} jours avant le départ\n`;
    text += `Prix moyen dans cette période: ${formatPrice(optimalWindow.averagePrice)}\n`;
    text += `Économie potentielle: ${optimalWindow.savingsPercentage.toFixed(1)}%\n`;
  }

  text += `\n\nDISCLAIMER\n`;
  text += `----------\n`;
  text += `${result.metadata.disclaimer}\n`;

  downloadText(text, `comparaison-vols-${Date.now()}.txt`);
};

/**
 * Export boat comparison to text summary
 */
export const exportBoatComparisonToText = (result: BoatComparisonResult): void => {
  const route = result.operators[0]?.boatPrice.route;
  let text = `COMPARAISON DE PRIX DES BATEAUX/FERRIES\n`;
  text += `========================================\n\n`;
  text += `Route: ${route.origin.city} → ${route.destination.city}\n`;
  text += `Date d'export: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
  
  text += `STATISTIQUES - PASSAGERS\n`;
  text += `------------------------\n`;
  text += `Prix moyen: ${formatPrice(result.aggregation.passengerPricing.averagePrice)}\n`;
  text += `Prix minimum: ${formatPrice(result.aggregation.passengerPricing.minPrice)}\n`;
  text += `Prix maximum: ${formatPrice(result.aggregation.passengerPricing.maxPrice)}\n\n`;

  if (result.aggregation.vehiclePricing) {
    text += `STATISTIQUES - VÉHICULES\n`;
    text += `-------------------------\n`;
    text += `Prix voiture moyen: ${formatPrice(result.aggregation.vehiclePricing.carAverage)}\n`;
    text += `Prix voiture minimum: ${formatPrice(result.aggregation.vehiclePricing.carMin)}\n`;
    text += `Prix voiture maximum: ${formatPrice(result.aggregation.vehiclePricing.carMax)}\n\n`;
  }

  text += `FRÉQUENCE DES SERVICES\n`;
  text += `----------------------\n`;
  if (result.aggregation.frequencyAnalysis.dailyServices > 0) {
    text += `Services quotidiens: ${result.aggregation.frequencyAnalysis.dailyServices}\n\n`;
  } else {
    text += `Fréquence moyenne: ${result.aggregation.frequencyAnalysis.averageDailyFrequency.toFixed(1)} services/jour\n\n`;
  }

  text += `COMPARAISON PAR OPÉRATEUR\n`;
  text += `-------------------------\n`;
  result.operators.forEach(ranking => {
    text += `\n#${ranking.rank} - ${ranking.boatPrice.operator}\n`;
    text += `  Prix passager adulte: ${formatPrice(ranking.boatPrice.pricing.passengerPrice)}\n`;
    if (ranking.boatPrice.pricing.childPrice) {
      text += `  Prix passager enfant: ${formatPrice(ranking.boatPrice.pricing.childPrice)}\n`;
    }
    if (ranking.boatPrice.pricing.vehiclePrice) {
      text += `  Prix voiture: ${formatPrice(ranking.boatPrice.pricing.vehiclePrice.car)}\n`;
      if (ranking.boatPrice.pricing.vehiclePrice.motorcycle) {
        text += `  Prix moto: ${formatPrice(ranking.boatPrice.pricing.vehiclePrice.motorcycle)}\n`;
      }
    }
    text += `  Durée: ${ranking.boatPrice.schedule.duration}\n`;
    text += `  Fréquence: ${ranking.boatPrice.schedule.frequency}\n`;
    text += `  Différence vs moins cher: ${ranking.percentageDifferenceFromCheapest > 0 ? '+' : ''}${ranking.percentageDifferenceFromCheapest.toFixed(1)}%\n`;
  });

  text += `\n\nDISCLAIMER\n`;
  text += `----------\n`;
  text += `${result.metadata.disclaimer}\n`;

  downloadText(text, `comparaison-bateaux-${Date.now()}.txt`);
};

/**
 * Download CSV file
 */
const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Revoke the URL to free up memory
  URL.revokeObjectURL(url);
};

/**
 * Download text file
 */
const downloadText = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Revoke the URL to free up memory
  URL.revokeObjectURL(url);
};
