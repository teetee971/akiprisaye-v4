import express, { Request, Response, NextFunction } from 'express';
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

// SOURCE OFFICIELLE UNIQUE (JSON statique)
const DATA_FILE_PATH: string =
  process.env.MEGA_DATASET_PATH ||
  path.join(
    __dirname,
    '../../frontend/public/data/mega-panier-anti-crise.json'
  );

// Cache mémoire (performance + stabilité)
let CACHE: any | null = null;
let CACHE_MTIME = 0;

// ===============================
// TYPES MINIMAUX
// ===============================
type StoreId = string;
type ProductId = string;

// ===============================
// UTILITAIRES
// ===============================
function loadMegaDataset(): any {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    throw new Error('mega-panier-anti-crise.json introuvable');
  }

  const stat = fs.statSync(DATA_FILE_PATH);

  // 🔁 Recharge uniquement si le fichier a changé
  if (!CACHE || stat.mtimeMs !== CACHE_MTIME) {
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    CACHE = JSON.parse(raw);
    CACHE_MTIME = stat.mtimeMs;
  }

  return CACHE;
}

function safeNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// ===============================
// MIDDLEWARE ASYNC SAFE
// ===============================
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
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
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/meta
 */
app.get(
  '/meta',
  asyncHandler(async (_req, res) => {
    const data = loadMegaDataset();
    res.json(data.meta);
  })
);

// ===============================
// PANIER ANTI-CRISE
// ===============================

/**
 *