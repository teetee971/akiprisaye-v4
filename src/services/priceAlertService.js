/**
 * Price Alert Service
 * Gestion des alertes de prix côté navigateur
 */

const STORAGE_KEY = 'aki_price_alerts';

/**
 * Récupère les alertes
 */
export function getPriceAlerts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('[PriceAlertService] read error', error);
    return [];
  }
}

/**
 * Sauvegarde les alertes
 */
export function savePriceAlerts(alerts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch (error) {
    console.error('[PriceAlertService] save error', error);
  }
}

/**
 * Ajoute une alerte
 */
export function addPriceAlert(alert) {
  const alerts = getPriceAlerts();
  alerts.push({
    ...alert,
    createdAt: Date.now(),
  });
  savePriceAlerts(alerts);
}

/**
 * Supprime une alerte
 */
export function removePriceAlert(id) {
  const alerts = getPriceAlerts().filter(a => a.id !== id);
  savePriceAlerts(alerts);
}