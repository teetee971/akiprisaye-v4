import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// ===============================
// INIT EXPRESS
// ===============================
const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// CONFIG
// ===============================

// ⚠️ SOURCE OFFICIELLE UNIQUE
const DATA_FILE_PATH = path.join(
  __dirname,
  '../../frontend/public/data/mega-panier-anti-crise.json'
);

// ===============================
// TYPES SIMPLES (sécurité)
// ===============================
type TerritoryCode = string;
type StoreId = string;
type ProductId = string;

// ===============================
// UTILITAIRES
// ===============================

function loadMegaDataset() {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    throw new Error('Fichier mega-panier-anti-crise.json introuvable');
  }

  const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function safeNumber(value: any, fallback = 0): number {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
}

// ===============================
// ROUTES SYSTEME
// ===============================

/**
 * GET /api/health
 */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'A KI PRI SA YÉ API',
    version: '1.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/meta
 * Métadonnées projet & dataset
 */
app.get('/meta', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data.meta);
  } catch {
    res.status(500).json({ error: 'Impossible de charger les métadonnées' });
  }
});

// ===============================
// PANIER ANTI-CRISE
// ===============================

/**
 * GET /api/panier/anti-crise
 * Dataset complet
 */
app.get('/panier/anti-crise', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Impossible de charger le panier anti-crise'
    });
  }
});

/**
 * GET /api/panier/anti-crise/recommandation
 */
app.get('/panier/anti-crise/recommandation', (_req, res) => {
  try {
    const data = loadMegaDataset();
    const basket = data.baskets?.[0];

    if (!basket?.recommendedStore) {
      return res.status(404).json({
        error: 'Aucune recommandation disponible'
      });
    }

    const store = data.stores.find(
      (s: any) => s.storeId === basket.recommendedStore.storeId
    );

    res.json({
      basketId: basket.basketId,
      recommendedStore: {
        ...basket.recommendedStore,
        storeDetails: store || null
      }
    });
  } catch {
    res.status(500).json({
      error: 'Erreur lors du calcul de la recommandation'
    });
  }
});

// ===============================
// STORES
// ===============================

/**
 * GET /api/stores
 */
app.get('/stores', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data.stores || []);
  } catch {
    res.status(500).json({ error: 'Impossible de charger les magasins' });
  }
});

/**
 * GET /api/stores/:id
 */
app.get('/stores/:id', (req, res) => {
  try {
    const data = loadMegaDataset();
    const store = data.stores.find(
      (s: any) => s.storeId === req.params.id
    );

    if (!store) {
      return res.status(404).json({ error: 'Magasin introuvable' });
    }

    res.json(store);
  } catch {
    res.status(500).json({ error: 'Erreur magasin' });
  }
});

// ===============================
// PRODUITS
// ===============================

/**
 * GET /api/products
 */
app.get('/products', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data.products || []);
  } catch {
    res.status(500).json({ error: 'Impossible de charger les produits' });
  }
});

/**
 * GET /api/products/:id
 */
app.get('/products/:id', (req, res) => {
  try {
    const data = loadMegaDataset();
    const product = data.products.find(
      (p: any) => p.productId === req.params.id
    );

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }

    res.json(product);
  } catch {
    res.status(500).json({ error: 'Erreur produit' });
  }
});

// ===============================
// PRIX & COMPARAISONS
// ===============================

/**
 * GET /api/prices/by-store/:storeId
 */
app.get('/prices/by-store/:storeId', (req, res) => {
  try {
    const data = loadMegaDataset();
    const store = data.stores.find(
      (s: any) => s.storeId === req.params.storeId
    );

    if (!store) {
      return res.status(404).json({ error: 'Magasin introuvable' });
    }

    res.json({
      storeId: store.storeId,
      prices: store.prices || {}
    });
  } catch {
    res.status(500).json({ error: 'Erreur récupération prix magasin' });
  }
});

/**
 * GET /api/prices/by-product/:productId
 */
app.get('/prices/by-product/:productId', (req, res) => {
  try {
    const data = loadMegaDataset();
    const productId: ProductId = req.params.productId;

    const prices = data.stores.map((store: any) => ({
      storeId: store.storeId,
      storeName: store.storeName,
      price: safeNumber(store.prices?.[productId], null)
    })).filter((p: any) => p.price !== null);

    res.json({
      productId,
      prices
    });
  } catch {
    res.status(500).json({ error: 'Erreur récupération prix produit' });
  }
});

// ===============================
// ANALYTICS
// ===============================

/**
 * GET /api/analytics/summary
 */
app.get('/analytics/summary', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data.analytics || {});
  } catch {
    res.status(500).json({ error: 'Impossible de charger les analytics' });
  }
});

/**
 * GET /api/analytics/range
 */
app.get('/analytics/range', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data.analytics?.priceRange || {});
  } catch {
    res.status(500).json({ error: 'Erreur analytics prix' });
  }
});

// ===============================
// EXPORT
// ===============================
export default app;