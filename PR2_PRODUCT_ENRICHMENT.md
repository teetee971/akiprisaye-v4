# PR #2 - Product Enrichment (UX & Data)

## Objectif
Créer une fiche produit citoyenne enrichie et lisible, sans modifier la logique EAN de PR #1.

## Implémentation

### Fichiers créés

#### 1. `src/types/productViewModel.ts`
Types TypeScript pour l'affichage UI:
- **ProductViewModel**: Structure de données prête pour l'affichage
- **UserPhoto**: Photos utilisateurs avec consentement explicite
- **PhotoUploadConsent**: État de consentement
- **Mappings**: Labels pour territoires, sources, statuts

**Champs ProductViewModel**:
```typescript
{
  // Identité produit
  ean: string;
  nom: string;
  marque: string;
  categorie: string;
  
  // Détails
  contenance?: string;
  prix?: string;  // Formaté
  
  // Fiabilité
  status: 'confirmé' | 'partiel' | 'non_référencé';
  statusLabel: string;
  statusColor: 'green' | 'yellow' | 'gray';
  isCitizenData: boolean;
  
  // Traçabilité
  source, territoire, magasin, dateObservation
  
  // Photos
  userPhotos: UserPhoto[];
}
```

#### 2. `src/services/productViewModelService.ts`
Service de transformation ProductResult → ProductViewModel:
- **toProductViewModel()**: Transformation complète
- **getProductSubtitle()**: Format "Marque • Catégorie • Contenance"
- **getTraceabilityText()**: Format "Source • Territoire • Date"
- **hasCompleteInfo()**: Vérification complétude données
- Helper functions pour badges et accessibilité

**Consomme exclusivement**: `eanProductService` (PR #1)

#### 3. `src/components/products/ProductDetails.tsx`
Composant React mobile-first:

**Sections affichées**:
1. **Identité produit**
   - Nom (H3 title)
   - Sous-titre (marque • catégorie • contenance)
   - Code EAN (format mono)
   
2. **Badges de statut**
   - Badge statut (confirmé/partiel/non référencé)
   - Badge "Données citoyennes" si applicable
   - Couleurs sémantiques (vert/jaune/gris)

3. **Détails produit** (grid 2 colonnes)
   - Prix formaté
   - Marque
   - Catégorie
   - Contenance

4. **Galerie photos utilisateurs** (optionnelle)
   - Grid 3 colonnes
   - Thumbnails cliquables
   - Modal full-screen pour agrandissement
   - Dots de navigation si > 1 photo
   - Limite 6 photos visibles + compteur

5. **Traçabilité**
   - Source de données
   - Territoire
   - Magasin (si disponible)
   - Date d'observation formatée

6. **Signalement erreur**
   - Lien "Signaler une erreur"
   - Callback `onReportError`

**Props**:
```typescript
interface ProductDetailsProps {
  product: ProductViewModel;
  onClose?: () => void;
  onReportError?: () => void;
}
```

**Responsive design**:
- Mobile-first (single column)
- Tablet/Desktop (2 columns pour détails)
- Swipe-ready pour galerie photos
- Touch-optimized buttons

## Principes appliqués

### ✅ Consomme uniquement eanProductService
- Aucune logique de validation EAN dans UI
- Utilise `ProductResult` de PR #1
- Transformation via `productViewModelService`

### ✅ Mobile-first
- Layout responsive avec Tailwind CSS
- Touch targets >= 44px
- Swipe navigation pour photos
- Aspect ratio optimisé pour mobile (16:9)

### ✅ Badges "données citoyennes"
- Badge visuel si `source === 'observation_citoyenne'`
- Icône utilisateur
- Couleur bleue distinctive
- Accessible (aria-label)

### ✅ Galerie photos utilisateurs
```typescript
interface UserPhoto {
  id: string;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  consent: boolean;  // OBLIGATOIRE
}
```
- Consentement explicite requis
- Thumbnails optimisés
- Modal d'agrandissement
- Maximum 6 photos affichées (+ compteur)

### ✅ Statuts clairs
- **Confirmé** (vert): Données complètes validées
- **Partiel** (jaune): Données incomplètes
- **Non référencé** (gris): EAN valide mais inconnu

### ✅ Aucun scan/OCR/caméra
- Composant de présentation uniquement
- Aucun import de scanner
- Aucun accès caméra
- Aucune logique OCR

## Usage

```typescript
import ProductDetails from './components/products/ProductDetails';
import { lookupProductByEan } from './services/eanProductService';
import { toProductViewModel } from './services/productViewModelService';

// Lookup product (from PR #1)
const result = await lookupProductByEan('3290370050126', {
  territoire: 'martinique',
  source: 'observation_citoyenne'
});

if (result.success && result.product) {
  // Transform to view model
  const viewModel = toProductViewModel(result.product);
  
  // Render UI
  return (
    <ProductDetails
      product={viewModel}
      onClose={() => navigate(-1)}
      onReportError={() => openReportForm()}
    />
  );
}
```

## Design System

### Couleurs sémantiques
- **Confirmé**: `green-100/800` (light/dark)
- **Partiel**: `yellow-100/800`
- **Non référencé**: `gray-100/800`
- **Citoyen**: `blue-100/800`

### Typography
- **Nom produit**: 2xl, font-bold
- **Sous-titre**: sm, gray-600
- **Labels**: xs, uppercase, font-semibold
- **EAN**: font-mono, bg-gray-100

### Spacing
- **Sections**: space-y-6
- **Détails grid**: gap-4
- **Photos grid**: gap-2
- **Padding global**: p-6

### Accessibilité
- Tous les boutons ont aria-label
- Contraste WCAG AA minimum
- Touch targets >= 44px
- Keyboard navigation support
- Screen reader friendly

## Conformité PR #2

### ✅ Réalisé
- [x] Types ProductViewModel
- [x] Service de transformation
- [x] Composant ProductDetails mobile-first
- [x] Sections minimales (identité, statut, détails, traçabilité)
- [x] Badges "données citoyennes"
- [x] Galerie photos avec consentement
- [x] Lien "signaler une erreur"
- [x] Documentation PR2_PRODUCT_ENRICHMENT.md

### ❌ Non inclus (respect périmètre)
- ❌ Scanner caméra (PR #3)
- ❌ OCR (PR #3)
- ❌ Appel caméra (PR #3)
- ❌ Logique commerciale
- ❌ Calcul de prix
- ❌ Recommandations produit

## Tests manuels recommandés

```typescript
// Cas 1: Produit confirmé complet
const productComplete = {
  ean: '3290370050126',
  status: 'confirmé',
  nom: 'Evian 1.5L',
  marque: 'Evian',
  categorie: 'Boissons',
  prix: 1.35,
  // ... traceability
};

// Cas 2: Produit partiel
const productPartiel = {
  ean: '3017620422003',
  status: 'partiel',
  nom: 'Nutella',
  // marque manquante
};

// Cas 3: Produit non référencé
const productNonRef = {
  ean: '1234567890128',
  status: 'non_référencé',
  nom: 'Produit non référencé',
  // minimal info
};

// Cas 4: Données citoyennes
const productCitizen = {
  // ...
  traceability: {
    source: 'observation_citoyenne',
    territoire: 'martinique',
    // ...
  }
};
```

## Build & Qualité

```bash
# Installation
npm install

# Build
npm run build

# TypeScript check
npx tsc --noEmit src/types/productViewModel.ts src/services/productViewModelService.ts src/components/products/ProductDetails.tsx
```

## Prochaines étapes

Cette PR complète **l'affichage produit**. La PR #3 ajoutera:
- Scanner caméra
- OCR ingrédients
- Prétraitement image
- Gestion permissions caméra

**Merge séquentiel requis**: PR #1 → **PR #2** → PR #3

## Notes d'intégration

Pour intégrer ProductDetails dans une page existante:

1. **Import du service lookup** (PR #1)
2. **Transformation en view model**
3. **Affichage du composant**
4. **Gestion des callbacks** (onClose, onReportError)

Exemple d'intégration dans une modale:

```typescript
function ProductModal({ ean }: { ean: string }) {
  const [viewModel, setViewModel] = useState<ProductViewModel | null>(null);
  
  useEffect(() => {
    lookupProductByEan(ean, {
      territoire: 'martinique',
      source: 'observation_citoyenne'
    }).then(result => {
      if (result.success && result.product) {
        setViewModel(toProductViewModel(result.product));
      }
    });
  }, [ean]);
  
  if (!viewModel) return <LoadingSkeleton />;
  
  return <ProductDetails product={viewModel} onClose={closeModal} />;
}
```
