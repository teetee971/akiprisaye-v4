# 🔐 OCR 100% Local - Architecture & Compliance

## Vue d'ensemble

Ce système OCR est **100% local** - aucune donnée ne quitte jamais l'appareil de l'utilisateur.

### Garanties Fondamentales

| Élément | Règle | Implémentation |
|---------|-------|----------------|
| 📷 **Image** | Jamais envoyée | Blob traité en mémoire uniquement |
| 🧠 **OCR** | Exécuté localement | Tesseract.js (WebAssembly) |
| 🌐 **Réseau** | Non requis | Fonctionne 100% offline |
| 💾 **Stockage** | Temporaire/contrôlé | localStorage + IndexedDB |
| 👤 **Compte** | Non requis | Fonctionnement anonyme |

## Architecture Technique

### Stack Utilisée

**Web (PWA):**
- **Tesseract.js** - OCR WebAssembly pur JavaScript
- **Canvas API** - Traitement d'image local
- **localStorage** - Stockage local des préférences
- **IndexedDB** - Historique local optionnel
- **NO Web Workers réseau** - Tout est local

**Android (futur):**
- **Google ML Kit** - Text Recognition (on-device)
- **Tesseract OCR** - Alternative offline

### Pipeline OCR Local

```
📷 Photo(s)
   ↓
📱 Chargement en mémoire (Blob)
   ↓
✂️ Auto-recadrage local (Canvas API)
   ↓
🧠 OCR offline (Tesseract.js WebAssembly)
   ↓
🧾 Structuration lignes (JavaScript)
   ↓
🔎 Détection incohérences (Algorithmes locaux)
   ↓
📊 Score qualité (Calcul local)
   ↓
💾 Stockage local optionnel (localStorage)

❌ AUCUNE SORTIE RÉSEAU
```

## Fonctionnalités Locales

### 1. Multi-Photos pour Tickets Longs ✅

```
Photo 1 → lignes 1-35
Photo 2 → lignes 36-78
Photo 3 → total / TVA
```

**Implémentation:**
- Images stockées en Blob (mémoire)
- Fusion locale des segments
- Détection automatique des chevauchements
- Suppression des doublons OCR

**Fichiers:**
- `GuidedReceiptCapture.tsx` - Capture multi-photos
- `receiptSegmentation.ts` - Segmentation verticale
- `multiReceiptOCR.ts` - Fusion des résultats

### 2. Auto-Recadrage Intelligent ✅

**Techniques locales:**
- ✅ Détection des contours (Canvas API)
- ✅ Correction de perspective (transformation matricielle)
- ✅ Amélioration du contraste (manipulation pixels)
- ✅ Suppression de l'arrière-plan (seuillage)
- ✅ Binarisation adaptative (Otsu)

**Important:** ❌ Aucune modification du contenu textuel

**Fichiers:**
- `receiptAutoCrop.ts` - Module H
- `imageQualityDetection.ts` - Détection qualité

### 3. Détection d'Incohérences OCR ✅

**Détections locales:**
- ✅ Montants isolés sans libellé
- ✅ Caractères improbables (8.9€€)
- ✅ Lignes tronquées
- ✅ Incohérences TVA/total
- ✅ Prix négatifs
- ✅ Quantités suspectes

**Affichage:**
> "Certaines lignes peuvent être incomplètes."

**Fichier:**
- `ocrAnomalyDetector.ts` - Module M

### 4. Score de Qualité OCR ✅

| Niveau | Description | Affichage |
|--------|-------------|-----------|
| 🟢 Élevée | Ticket lisible | 80-100% |
| 🟠 Moyenne | Vérification visuelle recommandée | 60-79% |
| ⚪ Limitée | Données partielles | <60% |

**Garantie:** ⚠️ Le score n'influence aucun prix

**Fichiers:**
- `ticketQualityScore.ts` - Module L
- `ocrQualityTracking.ts` - Historique local

## Données Conservées (Localement)

| Donnée | Durée | Stockage | Suppression |
|--------|-------|----------|-------------|
| **Image brute** | Temporaire | Mémoire (Blob) | Automatique après traitement |
| **Texte OCR** | Session | localStorage | À la demande |
| **Score qualité** | Optionnel | localStorage | À la demande |
| **Hash anonymisé** | Optionnel | localStorage | À la demande |

### Contrôles Utilisateur

```typescript
// Supprimer l'historique OCR
clearOCRHistory();

// Supprimer l'historique qualité
clearQualityHistory();

// Supprimer les produits récurrents
localStorage.removeItem('seenProducts');

// Tout supprimer
localStorage.clear();
indexedDB.deleteDatabase('receipts');
```

## Conformité Réglementaire

### ✅ RGPD (Règlement Général sur la Protection des Données)

| Exigence | Implémentation |
|----------|----------------|
| **Consentement** | Traitement local = pas de consentement requis |
| **Finalité** | Usage strictement personnel sur l'appareil |
| **Minimisation** | Aucune donnée transmise = minimisation maximale |
| **Droit à l'oubli** | Suppression instantanée locale |
| **Portabilité** | Export JSON disponible |
| **Sécurité** | Pas de transmission = pas de risque d'interception |

**Article 4(2) RGPD:**
> "Le traitement de données à caractère personnel effectué à des fins purement personnelles ou domestiques n'entre pas dans le champ d'application du présent règlement."

Notre OCR local = usage personnel sur l'appareil = hors champ RGPD.

### ✅ Play Store (Google)

**Politique de confidentialité:**
- ✅ Pas de collecte de données sensibles
- ✅ Pas de transmission d'images
- ✅ Fonctionnement offline possible
- ✅ Transparent sur le stockage local

**Déclaration requise:**
```
Type de données: Aucune
Transmission: Aucune
Stockage: Local uniquement (optionnel)
Partage: Aucun
```

### ✅ Collectivités / Open Data

**Exigences:**
- ✅ Méthodologie publique et documentée
- ✅ Code source open source
- ✅ Audit possible du code
- ✅ Pas de "boîte noire"
- ✅ Traçabilité complète
- ✅ Reproductibilité

### ✅ Presse / Audit Externe

**Transparence:**
- ✅ Code inspectable
- ✅ Algorithmes documentés
- ✅ Pas de logique cachée
- ✅ Export des résultats possible
- ✅ Méthodologie vérifiable

## Mention Obligatoire

**Affichage permanent dans l'UI:**

```tsx
<div className="bg-blue-50 p-3 rounded border border-blue-200">
  <p className="text-sm text-blue-900">
    🔒 <strong>Confidentialité totale :</strong>
    L'analyse OCR est effectuée localement sur votre appareil.
    Aucune image n'est transmise.
  </p>
</div>
```

**Implémentations:**
- `ReceiptMultiCapture.tsx` - Ligne 32
- `GuidedReceiptCapture.tsx` - Footer
- `EnhancedReceiptWorkflow.tsx` - Header

## Intégration avec les Autres Modules

| Module | Rôle | Garantie Locale |
|--------|------|-----------------|
| **Anti-Crise** | Source brute fiable | ✅ Calculs locaux |
| **Détection anomalies** | Pondération confiance | ✅ Algorithmes locaux |
| **Historique OCR** | Agrégation documentaire | ✅ localStorage uniquement |
| **Transparence** | Méthodologie publique | ✅ Code open source |
| **Territoires (F)** | Analyse géographique | ✅ Comparaison locale |
| **Anomalies (G)** | Détection patterns | ✅ Traitement local |

## Sécurité

### Mesures Implémentées

1. **Isolation des données**
   - Chaque utilisateur = données isolées
   - localStorage = scoped par domaine
   - Pas de partage entre utilisateurs

2. **Pas de communication externe**
   - Tesseract.js = WebAssembly autonome
   - Aucun appel API externe
   - Aucun tracking

3. **Effacement sécurisé**
   - Suppression immédiate sur demande
   - Blobs libérés automatiquement
   - Pas de cache réseau

4. **Pas de persistance involontaire**
   - Images en Blob (mémoire)
   - Texte OCR optionnel
   - Contrôle utilisateur total

### Audit de Sécurité

**Vérifications:**
```bash
# Vérifier qu'aucun appel réseau n'est fait
grep -r "fetch\|XMLHttpRequest\|axios" src/components/Receipt/

# Vérifier l'isolation localStorage
grep -r "localStorage" src/components/Receipt/

# Vérifier Tesseract.js est local
grep -r "tesseract" package.json
```

## Tests de Conformité

### Test 1: Mode Avion

```
1. Activer le mode avion
2. Ouvrir l'application
3. Capturer un ticket
4. Lancer l'OCR
5. Vérifier: ✅ Fonctionne sans réseau
```

### Test 2: Inspection Réseau

```
1. Ouvrir DevTools > Network
2. Capturer un ticket
3. Lancer l'OCR
4. Vérifier: ✅ Aucune requête HTTP
```

### Test 3: Suppression Données

```
1. Utiliser l'OCR plusieurs fois
2. localStorage > Clear
3. Vérifier: ✅ Toutes les données supprimées
```

### Test 4: Portabilité

```
1. Utiliser l'OCR
2. Export > JSON
3. Vérifier: ✅ Données exportables
4. Importer sur autre appareil
5. Vérifier: ✅ Données restaurées
```

## Documentation Utilisateur

### FAQ - Confidentialité

**Q: Mes photos de tickets sont-elles envoyées quelque part ?**
R: Non, jamais. L'analyse OCR est effectuée 100% localement sur votre appareil.

**Q: Puis-je utiliser l'application sans connexion internet ?**
R: Oui, l'OCR fonctionne entièrement hors ligne.

**Q: Mes données sont-elles partagées ?**
R: Non, toutes les données restent sur votre appareil uniquement.

**Q: Comment supprimer mes données ?**
R: Paramètres > Confidentialité > Supprimer les données locales

**Q: L'application nécessite-t-elle un compte ?**
R: Non, aucun compte n'est nécessaire.

## Code Source

Tous les fichiers OCR sont open source et inspectables:

```
frontend/src/components/Receipt/
├── services/
│   ├── ocrService.ts              # OCR de base (Tesseract.js)
│   ├── multiReceiptOCR.ts         # Multi-images
│   ├── multiPassOCR.ts            # Stratégies multiples
│   ├── adaptiveOCR.ts             # OCR adaptatif
│   ├── receiptAutoCrop.ts         # Prétraitement
│   ├── imageQualityDetection.ts   # Détection qualité
│   ├── receiptSegmentation.ts     # Segmentation
│   ├── ocrAnomalyDetector.ts      # Détection anomalies
│   └── ocrQualityTracking.ts      # Historique qualité
```

## Licences

- **Tesseract.js**: Apache 2.0 (open source)
- **Notre code**: Open source (même licence que le projet)

## Contact / Support

Pour toute question sur la confidentialité ou la conformité:
- GitHub Issues: [lien]
- Email: [contact]
- Documentation: Ce fichier

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2026-01-12  
**Statut:** ✅ Production Ready  
**Conformité:** ✅ RGPD, Play Store, Institutionnel
