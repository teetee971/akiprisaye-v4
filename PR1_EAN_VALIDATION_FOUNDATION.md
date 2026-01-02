# PR #1 - EAN Validation Foundation

## Objectif
Sécuriser l'identification produit par code EAN avec validation stricte, traçabilité complète, et gestion des produits inconnus.

## Implémentation

### Fichiers créés

#### 1. `src/types/ean.ts`
Définit les types TypeScript pour:
- **EanStatus**: `'confirmé' | 'partiel' | 'non_référencé'`
- **Territoire**: Codes des territoires DOM-TOM
- **DataSource**: Sources de données traçables
- **ProductTraceability**: Métadonnées de traçabilité (source, date, territoire)
- **BaseProduct, Product, PartialProduct, NonReferencedProduct**: Structures de données produit

#### 2. `src/services/eanValidator.ts`
Service de validation EAN avec:
- `validateEan()`: Validation format EAN-8/EAN-13 avec checksum
- `verifyChecksum()`: Vérification algorithme modulo 10
- `calculateCheckDigit()`: Calcul du digit de contrôle
- Fonctions helper: `isEan8()`, `isEan13()`, `isValidEan()`, `normalizeEan()`

**Algorithme checksum**:
1. Partir de la droite (exclure le check digit)
2. Alterner multiplication par 3 et 1
3. Sommer tous les produits
4. Soustraire du prochain multiple de 10
5. Résultat doit égaler le check digit

#### 3. `src/services/eanProductService.ts`
Service de lookup produit avec:
- `lookupProductByEan()`: Recherche avec validation stricte
- Traçabilité obligatoire (source, date, territoire)
- Fallback automatique pour EAN valide mais inconnu
- Statuts clairs: confirmé / partiel / non_référencé
- Pas de création silencieuse de produit

#### 4. `src/services/__tests__/eanValidator.test.ts`
Tests unitaires complets:
- Validation EAN-13 et EAN-8
- Vérification checksum (valides et invalides)
- Calcul check digit
- Cas limites et erreurs
- Produits test réels (3290370050126, etc.)
- Scénarios bouteilles en verre

## Principes appliqués

### ✅ Validation stricte
- Vérification format (8 ou 13 chiffres)
- Calcul et vérification checksum obligatoire
- Rejet codes invalides avec message clair

### ✅ Pas de création silencieuse
- Tout produit doit avoir une source traçable
- Métadonnées obligatoires: source, date, territoire
- Status explicite selon complétude des données

### ✅ Traçabilité complète
```typescript
interface ProductTraceability {
  source: DataSource;           // observation_citoyenne, base_officielle, etc.
  dateObservation: string;      // ISO 8601
  territoire: Territoire;       // guadeloupe, martinique, etc.
  magasin?: string;
  utilisateurId?: string;
}
```

### ✅ Fallback structuré
EAN valide mais non référencé → Retour structure minimale:
```typescript
{
  ean: "3290370050126",
  status: "non_référencé",
  nom: "Produit non référencé",
  traceability: { ... }
}
```

### ✅ Statuts clairs
- **confirmé**: Toutes données requises présentes (nom, marque, catégorie)
- **partiel**: Produit trouvé mais données incomplètes
- **non_référencé**: EAN valide mais produit inconnu

## Usage

```typescript
import { lookupProductByEan } from './services/eanProductService';

// Lookup avec traçabilité
const result = await lookupProductByEan('3290370050126', {
  territoire: 'martinique',
  source: 'observation_citoyenne',
  magasin: 'Carrefour Fort-de-France'
});

if (result.success) {
  console.log(result.product.status); // 'confirmé' | 'partiel' | 'non_référencé'
  console.log(result.validation.checksumValid); // true
} else {
  console.error(result.error); // Message d'erreur clair
}
```

## Tests

```bash
npm test src/services/__tests__/eanValidator.test.ts
```

**Cas de test**:
- ✅ EAN-13 valide: 3290370050126
- ✅ EAN-8 valide: 96385074
- ✅ Produits français courants (Nutella, Evian, Coca-Cola, etc.)
- ✅ Checksums invalides détectés
- ✅ Longueurs invalides rejetées
- ✅ Caractères non-numériques rejetés
- ✅ Bouteilles en verre (scénario reflets)

## Conformité PR #1

### ✅ Réalisé
- [x] Validation stricte EAN-8 / EAN-13 + checksum
- [x] Statuts produit (confirmé / partiel / non référencé)
- [x] Traçabilité complète (source, date, territoire)
- [x] Fallback produit minimal si EAN inconnu
- [x] Tests unitaires checksum
- [x] Fichiers: `src/services/eanValidator.ts`, `src/types/ean.ts`

### ❌ Non inclus (respect périmètre)
- ❌ Enrichissement UX (réservé à PR #2)
- ❌ Scan caméra/OCR (réservé à PR #3)
- ❌ Interface utilisateur
- ❌ Galerie photos

## Build & Qualité

```bash
# Installation
npm install

# Build
npm run build

# Tests
npm test

# TypeScript check
npx tsc --noEmit src/types/ean.ts src/services/eanValidator.ts src/services/eanProductService.ts
```

## Prochaines étapes

Cette PR constitue la **fondation** pour:
- **PR #2**: Composant UI ProductDetails avec affichage enrichi
- **PR #3**: Scanner caméra + OCR ingrédients

**Merge séquentiel requis**: PR #1 → PR #2 → PR #3
