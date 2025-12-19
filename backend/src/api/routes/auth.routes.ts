/**
 * Routes d'authentification
 *
 * Endpoints:
 * - POST /api/auth/login - Connexion (rate limited)
 * - POST /api/auth/refresh - Rafraîchir token
 * - POST /api/auth/logout - Déconnexion
 * - POST /api/auth/register - Inscription
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

/**
 * POST /api/auth/login
 *
 * Connexion avec email et mot de passe
 * Rate limited: 5 tentatives par 15 minutes
 */
router.post('/login', authLimiter, authController.login);

/**
 * POST /api/auth/refresh
 *
 * Rafraîchir l'access token avec un refresh token
 */
router.post('/refresh', authController.refresh);

/**
 * POST /api/auth/logout
 *
 * Déconnexion (révocation refresh token)
 */
router.post('/logout', authController.logout);

/**
 * POST /api/auth/register
 *
 * Créer un nouvel utilisateur
 *
 * Note: En production, protéger avec middleware admin
 */
router.post('/register', authController.register);

export default router;
