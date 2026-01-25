import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import admin from 'firebase-admin';

// ===============================
// INIT APP & FIREBASE
// ===============================
const app = express();
app.use(cors());

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// ===============================
// UPLOAD CONFIG (mémoire)
// ===============================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  }
});

// ===============================
// POST /api/upload-ticket
// ===============================
/**
 * Réception d’un ticket citoyen (photo)
 * - Stockage fichier : Firebase Storage
 * - Métadonnées : Firestore
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

      // ===============================
      // 1️⃣ STOCKAGE DU FICHIER
      // ===============================
      const safeTerritory = territory || 'unknown';
      const timestamp = Date.now();

      const filePath = `tickets/${safeTerritory}/${timestamp}_${file.originalname}`;
      const storageFile = bucket.file(filePath);

      await storageFile.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false
      });

      const [downloadUrl] = await storageFile.getSignedUrl({
        action: 'read',
        expires: '03-01-2030'
      });

      // ===============================
      // 2️⃣ MÉTADONNÉES FIRESTORE
      // ===============================
      const ticketDoc = {
        territory: safeTerritory,
        store: store || null,
        date: date || null,

        file: {
          path: filePath,
          url: downloadUrl,
          name: file.originalname,
          mimeType: file.mimetype,
          size: file.size
        },

        status: 'received',          // received | processed | verified
        source: 'citizen',
        verified: false,

        linkedPrices: [],             // futur OCR / validation
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        processedAt: null
      };

      const docRef = await db.collection('tickets').add(ticketDoc);

      // ===============================
      // 3️⃣ RÉPONSE API
      // ===============================
      return res.json({
        success: true,
        message: 'Ticket reçu et stocké avec succès',
        ticketId: docRef.id,
        fileUrl: downloadUrl
      });

    } catch (error) {
      console.error('Erreur upload-ticket:', error);
      return res.status(500).json({
        error: 'Erreur serveur lors de l’upload du ticket'
      });
    }
  }
);

export default app;