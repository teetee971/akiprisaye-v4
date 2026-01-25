import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
app.use(cors());

// stockage temporaire en mémoire (simple & sûr)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/upload-ticket
 * Réception d’un ticket citoyen (photo)
 */
app.post(
  '/upload-ticket',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      const { store, date, territory } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'Aucun fichier reçu' });
      }

      // Métadonnées minimales
      const ticket = {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        store: store || null,
        date: date || null,
        territory: territory || null,
        receivedAt: new Date().toISOString(),
        status: 'received'
      };

      // ⚠️ Pour l’instant : pas de stockage permanent
      // (étape suivante : Firebase / R2)
      console.log('Ticket reçu :', ticket);

      return res.json({
        success: true,
        message: 'Ticket reçu avec succès',
        ticket
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erreur serveur lors de l’upload'
      });
    }
  }
);

export default app;