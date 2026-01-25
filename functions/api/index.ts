import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import admin from 'firebase-admin';

// ===============================
// INIT EXPRESS APP
// ===============================
const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// INIT FIREBASE (SAFE)
// ===============================
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// ===============================
// UPLOAD CONFIG (MEMORY)
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
        return res.status(400).json({
          success: false,
          error: 'Aucun fichier reçu'
        });
      }

      // ===============================
      // 1️⃣ NORMALISATION DES DONNÉES
      // ===============================
      const safeTerritory = territory || 'unknown';
      const safeStore = store || null;
      const safeDate = date || null;
      const timestamp = Date.now();

      // ===============================
      // 2️⃣ STOCKAGE DU FICHIER (STORAGE)
      // ===============================
      const filePath = `tickets/${safeTerritory}/${timestamp}_${file.originalname}`;
      const storageFile = bucket.file(filePath);

      await storageFile.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
        metadata: {
          cacheControl: 'public,max-age=31536000'
        }
      });

      const [downloadUrl] = await storageFile.getSignedUrl({
        action: 'read',
        expires: '03-01-2030'
      });

      // ===============================
      // 3️⃣ MÉTADONNÉES FIRESTORE
      // ===============================
      const ticketDoc = {
        territory: safeTerritory,
        store: safeStore,
        date: safeDate,

        file: {
          path: filePath,
          url: downloadUrl,
          name: file.originalname,
          mimeType: file.mimetype,
          size: file.size
        },

        status: 'received',          // received | ocr_pending | processed | verified
        source: 'citizen',
        verified: false,

        linkedPrices: [],             // futur OCR / validation humaine
        confidenceScore: null,        // futur OCR

        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        processedAt: null,
        verifiedAt: null
      };

      const docRef = await db.collection('tickets').add(ticketDoc);

      // ===============================
      // 4️⃣ RÉPONSE API
      // ===============================
      return res.json({
        success: true,
        message: 'Ticket reçu et stocké avec succès',
        ticketId: docRef.id,
        fileUrl: downloadUrl
      });

    } catch (error) {
      console.error('❌ Erreur upload-ticket:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de l’upload du ticket'
      });
    }
  }
);

// ===============================
// EXPORT APP (Firebase Functions)
// ===============================
export default app;