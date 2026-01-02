# PR #3 - OCR Ingredients Extension

## Objectif
Extraire du texte brut (ingrédients, allergènes, mentions légales) depuis une photo produit via OCR, sans interprétation santé.

## Implémentation

### Fichiers créés

#### 1. `src/services/ocrService.ts`
Service OCR avec Tesseract.js:

**Fonctions principales**:
- `extractTextFromImage()`: OCR principal avec preprocessing
- `detectSections()`: Détection sections (ingrédients, allergènes, mentions)
- `preprocessImage()`: Prétraitement image (contraste, grayscale)
- `formatOCRResultForDisplay()`: Ajout warning automatique

**Structures de données**:
```typescript
interface OCRResult {
  success: boolean;
  rawText: string;          // Texte brut non interprété
  confidence: number;       // 0-100
  sections?: DetectedSections;
  error?: string;
  processingTime: number;
}

interface DetectedSections {
  ingredients?: string;
  allergens?: string;
  legalMentions?: string;
  dangerPictograms?: string[];  // Mots-clés GHS
}
```

**Prétraitement image**:
- Grayscale (améliore reconnaissance)
- Contraste augmenté (factor 1.5)
- Optionnel: autoCrop, autoRotate
- Canvas manipulation (pas de lib externe)

**Détection de sections** (pattern matching simple):
- `ingrédients:` → capture jusqu'à "allergènes" ou "conservation"
- `allergènes:`/`peut contenir` → capture section
- `mentions légales:`/`conservation:` → capture
- Pictogrammes danger: recherche mots-clés (danger, toxique, corrosif, etc.)

#### 2. `src/components/OCRResultView.tsx`
Composant React d'affichage résultats:

**Sections UI**:
1. **Warning Banner** (toujours visible)
   - "Détection automatique — peut contenir des erreurs"
   - Icône orange warning
   - Message clair: vérifier emballage original

2. **Badges fiabilité**
   - Confiance >= 80%: Badge vert
   - Confiance >= 60%: Badge jaune
   - Confiance < 60%: Badge rouge
   - Temps de traitement affiché

3. **Onglets**
   - "Sections détectées": Vue structurée
   - "Texte brut": Texte complet mono

4. **Sections détectées** (cards colorées):
   - Ingrédients (vert)
   - Allergènes (orange, highlighted)
   - Mentions légales (bleu)
   - Pictogrammes danger (rouge, badges)

5. **Actions**
   - Bouton "Réessayer" (callback)
   - Bouton "Fermer" (callback)

#### 3. `src/components/CameraPermissionHandler.tsx`
Gestion explicite permissions caméra:

**États de permission**:
- `prompt`: Demande initiale
- `granted`: Accès autorisé
- `denied`: Accès refusé
- `unknown`: État indéterminé

**UI Permission Prompt**:
- Icône caméra
- Message clair: "Pour scanner les ingrédients..."
- Bouton "Autoriser la caméra"
- Bouton fallback "Importer une image"

**UI Permission Denied**:
- Banner rouge avec warning
- Bouton "Ouvrir les paramètres" (instructions OS)
- Bouton fallback "Importer une image à la place"
- **Jamais bloquant**: toujours une alternative

**Instructions OS-specific**:
- iOS: Réglages → Safari/Chrome → Caméra
- Android: Paramètres → Applications → Navigateur → Autorisations
- Bureau: Cadenas barre d'adresse → Caméra

## Principes appliqués

### ✅ OCR avec Tesseract.js uniquement
```typescript
import Tesseract from 'tesseract.js';

const result = await Tesseract.recognize(
  imageFile,
  'fra',  // French language
  { logger: (m) => console.log(m.progress) }
);
```

### ✅ Prétraitement image
```typescript
// Canvas manipulation
- Grayscale: avg = (R + G + B) / 3
- Contraste: factor * (pixel - 128) + 128
- Format JPEG à 95% quality
- Pas de lib externe
```

### ✅ Texte brut non interprété
- Aucune analyse nutritionnelle
- Aucune interprétation santé
- Aucun score/rating
- Aucune recommandation
- Simple extraction + pattern matching

### ✅ Avertissement obligatoire
```typescript
const warning = '⚠️ Détection automatique — peut contenir des erreurs\n\n';
```
- Toujours visible
- Banner orange proéminent
- Message: "Vérifiez toujours l'emballage original"

### ✅ Gestion permissions caméra
**Never blocking**:
- Permission denied? → Fallback upload image
- Pas de caméra? → Fallback upload image
- Erreur? → Fallback upload image

**Explicit guidance**:
- Instructions claires pour activer caméra
- Bouton "Ouvrir les paramètres"
- Support iOS/Android/Desktop

### ✅ UX impératif
- Mobile-first responsive
- Touch-optimized buttons
- Clear error messages
- No blocking screens
- Always provide alternatives

## Usage

```typescript
import { extractTextFromImage, preprocessImage } from './services/ocrService';
import OCRResultView from './components/OCRResultView';
import CameraPermissionHandler from './components/CameraPermissionHandler';

// Preprocess + OCR
async function scanIngredients(imageFile: File) {
  // Optional preprocessing
  const processed = await preprocessImage(imageFile, {
    enhanceContrast: true,
    grayscale: true
  });
  
  // Extract text
  const result = await extractTextFromImage(processed);
  
  // Display result
  return <OCRResultView result={result} onRetry={rescan} />;
}

// With permission handling
function IngredientScanner() {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  
  return (
    <CameraPermissionHandler
      onPermissionGranted={() => openCamera()}
      onUseFallback={() => setMode('upload')}
    >
      {mode === 'camera' ? <CameraScanner /> : <ImageUploader />}
    </CameraPermissionHandler>
  );
}
```

## Détection de sections

Pattern matching simple (pas d'IA):

```typescript
// Ingrédients
/ingrédients?\s*:?\s*([\s\S]*?)(?=allergènes?|peut contenir|traces?)/i

// Allergènes
/(?:allergènes?|peut contenir|traces? de)\s*:?\s*([\s\S]*?)/i

// Mentions légales
/(?:mentions? légales?|conditions? de conservation)\s*:?\s*([\s\S]*?)$/i

// Pictogrammes danger
Keywords: danger, attention, toxique, corrosif, inflammable, etc.
```

## Conformité PR #3

### ✅ Réalisé
- [x] OCR avec Tesseract.js
- [x] Prétraitement image (contraste, grayscale)
- [x] Extraction texte brut uniquement
- [x] Détection sections (ingrédients, allergènes, mentions)
- [x] Avertissement visible "Détection automatique — peut contenir des erreurs"
- [x] Gestion explicite permissions caméra
- [x] Bouton "Ouvrir les paramètres" si refusé
- [x] Fallback upload image obligatoire
- [x] Aucun écran bloquant
- [x] Documentation PR3_OCR_INGREDIENTS.md

### ❌ Non inclus (respect périmètre)
- ❌ Analyse nutritionnelle
- ❌ Interprétation santé
- ❌ Notation produit
- ❌ Recommandations
- ❌ Correspondance réglementaire
- ❌ Score Nutri/Yuka-like

## Tests manuels recommandés

### Cas 1: Image nette ingrédients
- Photo liste ingrédients bien éclairée
- Vérifier détection section "Ingrédients"
- Confidence >= 80%

### Cas 2: Image avec reflets
- Photo bouteille en verre avec reflets
- Preprocessing devrait améliorer
- Message clair si échec

### Cas 3: Image floue
- Photo bougée ou basse résolution
- Confidence < 60%
- Badge rouge warning

### Cas 4: Permission caméra refusée
- Refuser permission navigateur
- Vérifier affichage banner rouge
- Vérifier bouton "Ouvrir paramètres"
- Vérifier fallback "Importer image"

### Cas 5: Pas de caméra
- Tester sur desktop sans webcam
- Fallback automatique vers upload
- Pas d'erreur bloquante

## Build & Qualité

```bash
# Installation Tesseract.js (déjà dans package.json)
npm install tesseract.js

# Build
npm run build

# TypeScript check
npx tsc --noEmit src/services/ocrService.ts src/components/OCRResultView.tsx src/components/CameraPermissionHandler.tsx
```

## Intégration complète

Exemple d'intégration des 3 PRs:

```typescript
import { lookupProductByEan } from './services/eanProductService';  // PR #1
import { toProductViewModel } from './services/productViewModelService';  // PR #2
import ProductDetails from './components/products/ProductDetails';  // PR #2
import { extractTextFromImage } from './services/ocrService';  // PR #3
import OCRResultView from './components/OCRResultView';  // PR #3

function CompleteProductView({ ean, photo }: Props) {
  // PR #1: Validate & lookup
  const productResult = await lookupProductByEan(ean, {
    territoire: 'martinique',
    source: 'observation_citoyenne'
  });
  
  // PR #2: Display product details
  const viewModel = toProductViewModel(productResult.product);
  
  // PR #3: OCR ingredients (optional)
  let ocrResult;
  if (photo) {
    ocrResult = await extractTextFromImage(photo);
  }
  
  return (
    <>
      <ProductDetails product={viewModel} />
      {ocrResult && <OCRResultView result={ocrResult} />}
    </>
  );
}
```

## Merge Strategy

This PR is **part 3 of 3** and must be merged **sequentially**:
1. PR #1 (EAN Foundation) → base ✅
2. PR #2 (Product Enrichment) → base ✅
3. **PR #3 (this one)** → base (after #1 and #2)

**Independent from PR #2** - No circular dependencies

## Notes d'accessibilité

- Warning banner avec `role="alert"`
- Tous boutons avec `aria-label`
- Support navigation clavier
- Contraste WCAG AA minimum
- Touch targets >= 44px
- Screen reader friendly
- Focus visible sur tous éléments interactifs

## Performance

- Tesseract.js utilise WebWorker (non-blocking)
- Preprocessing canvas optimisé
- Temps traitement affiché (transparence)
- Pas de lib externe lourde (canvas natif)
- Images converties JPEG 95% (compression optimale)
