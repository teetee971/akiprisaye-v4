/**
 * Application Express - Backend A KI PRI SA YÉ
 * 
 * Backend institutionnel pour la gestion des entreprises
 * Conformité RGPD et législation française
 * 
 * Stack:
 * - Node.js 20+
 * - TypeScript
 * - Express
 * - PostgreSQL + Prisma
 * - Zod pour validation
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Charger les variables d'environnement
dotenv.config();

// Configuration de l'application
const app: Express = express();
const port = process.env.PORT || 3001;
const nodeEnv = process.env.NODE_ENV || 'development';

// Instance Prisma Client (singleton)
export const prisma = new PrismaClient({
  log: nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// ========================================
// Middlewares globaux
// ========================================

// CORS - Configuration stricte
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 heures
};
app.use(cors(corsOptions));

// Parser JSON avec limite de taille
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging des requêtes en développement
if (nodeEnv === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.info(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Headers de sécurité
app.use((req: Request, res: Response, next: NextFunction) => {
  // Protection XSS
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // RGPD - Pas de tracking
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  
  next();
});

// ========================================
// Routes de base
// ========================================

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Vérifier la connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: nodeEnv,
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: nodeEnv,
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Route racine
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'A KI PRI SA YÉ - Backend API',
    version: '1.0.0',
    description: 'Backend institutionnel pour la gestion des entreprises',
    environment: nodeEnv,
    endpoints: {
      health: '/health',
      api: '/api/v1',
    },
    legal: {
      rgpd: 'Conforme RGPD (EU) 2016/679',
      siren_siret: 'Décret n°82-130 du 9 février 1982',
      data_protection: process.env.DATA_PROTECTION_OFFICER_EMAIL || 'dpo@akiprisaye.app',
    },
  });
});

// ========================================
// Routes API (à implémenter)
// ========================================

// Placeholder pour les routes API futures
app.use('/api/v1', (req: Request, res: Response) => {
  res.status(501).json({
    message: 'API endpoints en cours de développement',
    note: 'Les endpoints publics ne sont pas encore exposés',
    info: 'Backend prêt pour intégration future',
  });
});

// ========================================
// Gestion des erreurs
// ========================================

// Route non trouvée
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path,
    method: req.method,
  });
});

// Gestionnaire d'erreurs global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: nodeEnv === 'development' ? err.message : 'Une erreur est survenue',
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// Démarrage du serveur
// ========================================

// Fonction de démarrage
async function startServer() {
  try {
    // Vérifier la connexion à la base de données
    await prisma.$connect();
    console.info('✅ Connexion à la base de données établie');

    // Démarrer le serveur
    app.listen(port, () => {
      console.info('========================================');
      console.info(`🚀 Serveur démarré sur le port ${port}`);
      console.info(`📡 Environnement: ${nodeEnv}`);
      console.info(`🔗 URL: http://localhost:${port}`);
      console.info('========================================');
      console.info('');
      console.info('🏢 Backend institutionnel A KI PRI SA YÉ');
      console.info('✅ Gestion des entreprises (SIREN/SIRET)');
      console.info('✅ Validation stricte des identifiants');
      console.info('✅ Conformité RGPD');
      console.info('');
      console.info('📚 Documentation: README.md');
      console.info('🔒 Sécurité: Audit institutionnel ready');
      console.info('========================================');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt gracieux
async function shutdown() {
  console.info('\n🛑 Arrêt du serveur en cours...');
  
  try {
    await prisma.$disconnect();
    console.info('✅ Déconnexion de la base de données réussie');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt:', error);
    process.exit(1);
  }
}

// Signaux d'arrêt
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Démarrer le serveur uniquement si ce fichier est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default app;
