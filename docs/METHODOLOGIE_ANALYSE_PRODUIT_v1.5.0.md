# Méthodologie d'Analyse Produit - v1.5.0

## 🎯 Vue d'ensemble

Le système d'analyse produit A KI PRI SA YÉ fournit des analyses automatiques approfondies de produits à partir de données observées (photos d'étiquettes, OCR, sources publiques). Le système explique, compare et met en perspective sans limitation fonctionnelle.

**Version**: 1.5.0  
**Date**: Janvier 2026  
**Statut**: Module indépendant en lecture seule

---

## 📋 Principes fondamentaux

### 1. Données observées uniquement
- Photos d'étiquettes capturées par les utilisateurs
- Extraction OCR (Optical Character Recognition)
- Sources publiques vérifiables
- Bases de données officielles (Open Food Facts, bases réglementaires)

### 2. Pas de limitation fonctionnelle
Le système fournit une information complète et factuelle :
- Explications détaillées des ingrédients
- Analyse des additifs avec statuts réglementaires
- Interprétation nutritionnelle (densités, comparaisons)
- Détection des variations territoriales
- Sources citées systématiquement

### 3. Transparence et traçabilité
Chaque information est accompagnée de :
- Sa source d'origine
- Son niveau de confiance
- La date d'extraction/vérification
- Les limitations éventuelles

---

## 🔬 Architecture du système

### Entrées acceptées

1. **Photo étiquette ingrédients** : Liste des ingrédients au dos du produit
2. **Photo tableau nutritionnel** : Valeurs nutritionnelles pour 100g/100ml
3. **Photo face avant** : Nom du produit, marque, mentions allergènes
4. **Code EAN** : Identifiant unique du produit (optionnel mais recommandé)

### Modèle de données complet

```typescript
ProductInsight {
  ean: string                           // Code-barre EAN (clé primaire)
  name?: string                         // Nom du produit
  brand?: string                        // Marque
  category?: string                     // Catégorie
  territory: TerritoryCode              // Territoire d'observation
  
  ingredients: IngredientInsight[]      // Analyse des ingrédients
  allergens: AllergenInsight[]          // Allergènes identifiés
  additives: AdditiveInsight[]          // Additifs analysés
  
  nutrition: NutritionInsight           // Analyse nutritionnelle
  formulationAnalysis: FormulationInsight // Analyse de formulation
  
  comparisons: {
    categoryAverage?: NutritionInsight  // Comparaison catégorie
    territoryVariants?: TerritoryVariant[] // Variations territoriales
  }
  
  confidence: ConfidenceMetrics         // Métriques de confiance
  sources: SourceReference[]            // Sources des données
  generatedAt: ISODate                  // Date de génération
}
```

---

## 🧪 Processus d'analyse

### Étape 1 : Extraction OCR multi-zones

**Technologie** : Tesseract.js (moteur OCR open-source)  
**Langue** : Français (fra)  
**Zones détectées** :
- Zone ingrédients
- Zone tableau nutritionnel
- Zone mentions (allergènes, origine, etc.)

**Métriques de qualité** :
- Confiance OCR : 0-1 (fournie par Tesseract)
- Détection de zones incomplètes
- Validation de cohérence

### Étape 2 : Structuration des ingrédients

**Parsing intelligent** :
```
Entrée OCR : "Farine de blé, sucre, huile de palme, sel, E330"
↓
Sortie structurée :
[
  "Farine de blé",
  "Sucre",
  "Huile de palme",
  "Sel",
  "E330"
]
```

**Gestion des cas complexes** :
- Ingrédients composés : "chocolat (pâte de cacao, sucre, beurre de cacao)"
- Pourcentages : "tomates 60%"
- Mentions d'origine : "origine France"
- Allergènes en gras : "LAIT, ŒUFS"

### Étape 3 : Analyse explicative des ingrédients

Pour chaque ingrédient identifié :

```typescript
IngredientInsight {
  name: string                          // Nom normalisé
  role: 'sweetener' | 'preservative'... // Rôle fonctionnel
  origin: 'vegetal' | 'animal'...       // Origine
  frequencyInProducts: 'rare' | 'common'... // Fréquence d'usage
  regulatoryStatus: {
    EU: 'authorized' | 'restricted'...
    notes?: string
  }
  knownEffects?: string[]               // Effets documentés
}
```

**Base de connaissances** :
- Ingrédients courants (sucre, sel, farines, etc.)
- Ingrédients spécifiques (extraits, arômes, etc.)
- Origine : végétale, animale, synthétique, minérale, mixte
- Rôle : édulcorant, conservateur, colorant, épaississant, etc.

**Exemple d'analyse** :

```
Ingrédient : "Acide citrique"
→ Rôle : Acidifiant
→ Origine : Végétale (fermentation)
→ Fréquence : Très courant
→ Statut UE : Autorisé
→ Usage : Régulation du pH, exhausteur de goût
```

### Étape 4 : Analyse des additifs

**Détection** :
- Codes E-numbers : E100 à E1999
- Noms complets : "acide citrique", "lécithine de soja"
- Validation croisée avec base réglementaire

**Information fournie** :
```typescript
AdditiveInsight {
  code: string                          // Ex: "E330"
  name?: string                         // Ex: "Acide citrique"
  function: string                      // Fonction dans le produit
  riskClassification?: string           // Classification de risque
  regulatoryNotes: string               // Notes réglementaires
  countriesStatus: Record<CountryCode, 'allowed' | 'restricted' | 'banned'>
  documentedControversies?: SourceReference[]
}
```

**Statuts réglementaires** :
- **Autorisé** : Usage sans restriction dans l'UE
- **Restreint** : Usage limité à certaines catégories/quantités
- **Interdit** : Banni dans certaines juridictions
- **En révision** : Statut en cours d'évaluation

**Sources de référence** :
- Règlement (CE) n° 1333/2008 sur les additifs alimentaires
- EFSA (European Food Safety Authority)
- ANSES (Agence nationale de sécurité sanitaire)

### Étape 5 : Analyse nutritionnelle interprétée

**Extraction des valeurs** (pour 100g/100ml) :
```typescript
NutritionPer100g {
  energyKcal: number    // Calories
  fats: number          // Lipides
  saturatedFats: number // Acides gras saturés
  sugars: number        // Sucres
  salt: number          // Sel
  proteins?: number     // Protéines
  fiber?: number        // Fibres
}
```

**Interprétation en densités** :
Le système ne produit **pas de score** mais une **lecture explicative** :

```typescript
NutritionInterpretation {
  sugarDensity: 'low' | 'moderate' | 'high' | 'very_high'
  saltDensity: 'low' | 'moderate' | 'high' | 'very_high'
  caloricDensity: 'low' | 'moderate' | 'high' | 'very_high'
}
```

**Seuils de densité** :

| Nutriment | Faible | Modéré | Élevé | Très élevé |
|-----------|--------|--------|-------|------------|
| Sucres (g/100g) | < 5 | 5-12.5 | 12.5-25 | > 25 |
| Sel (g/100g) | < 0.3 | 0.3-1.5 | 1.5-3 | > 3 |
| Calories (kcal/100g) | < 100 | 100-250 | 250-400 | > 400 |
| Lipides (g/100g) | < 3 | 3-10 | 10-20 | > 20 |

**Comparaison catégorie** (si disponible) :
```typescript
CategoryComparison {
  categoryName: string
  sugarsDeltaPct: number    // +20% vs moyenne catégorie
  saltDeltaPct: number      // -15% vs moyenne catégorie
  caloriesDeltaPct: number  // +5% vs moyenne catégorie
  sampleSize: number        // Nombre de produits comparés
}
```

### Étape 6 : Analyse de formulation

**Classification du niveau de transformation** :
- **Minimal** : < 5 ingrédients, pas d'additifs
- **Transformé** : 5-15 ingrédients, quelques additifs
- **Ultra-transformé** : > 15 ingrédients ou > 5 additifs

**Identification des catégories principales** :
- Base végétale, animale, mixte
- Type de transformation : fermentation, cuisson, etc.

### Étape 7 : Détection des variations territoriales

**Principe** :
Pour un même produit (même EAN), détecter les différences de formulation entre territoires.

**Variations détectées** :
```typescript
TerritoryVariant {
  territory: TerritoryCode
  formulationDifferences: {
    ingredientAdded?: string[]        // Ingrédients ajoutés
    ingredientRemoved?: string[]      // Ingrédients retirés
    ingredientSubstituted?: [{from, to}] // Substitutions
    nutritionalChange?: Partial<NutritionPer100g> // Changements nutritionnels
  }
  sources: SourceReference[]
}
```

**Cas d'usage** :
- Sucre plus élevé dans certains DOM
- Édulcorants différents selon les territoires
- Reformulations silencieuses
- Adaptations réglementaires locales

**Exemple** :
```
Produit : Coca-Cola (EAN: 5449000000996)
Territoire : Guadeloupe
→ Sucres : 10.6g/100ml
vs
Territoire : France métropolitaine
→ Sucres : 10.6g/100ml
→ Différence : Aucune variation détectée
```

---

## 📊 Métriques de confiance

### Scoring de confiance OCR
- **Haute (> 0.8)** : Texte clair, bien éclairé, mise au point nette
- **Moyenne (0.5-0.8)** : Texte lisible mais avec quelques incertitudes
- **Faible (< 0.5)** : Texte flou, mal éclairé, nécessite vérification

### Fiabilité des sources
- **Haute** : Données officielles, bases réglementaires, photos claires
- **Moyenne** : OCR moyen, sources publiques non officielles
- **Faible** : OCR faible, données incomplètes

### Complétude des données
Calculée en fonction de :
- Présence des ingrédients (40%)
- Présence des valeurs nutritionnelles (40%)
- Informations complémentaires (20%)

### Vérification croisée
- Comparaison avec bases de données publiques (Open Food Facts)
- Validation par multiple photos du même produit
- Confirmation utilisateurs

---

## 🔒 Limitations et avertissements

### Limitations techniques
1. **Qualité OCR dépendante de la photo**
   - Nécessite une photo nette, bien éclairée
   - Texte petit ou complexe peut être mal reconnu
   
2. **Base de connaissances en construction**
   - Tous les ingrédients ne sont pas encore documentés
   - Informations réglementaires en cours d'enrichissement
   
3. **Variations territoriales incomplètes**
   - Nécessite collecte de données multi-territoires
   - Dépend de contributions utilisateurs

### Avertissements aux utilisateurs
- ⚠️ **Ce système n'est pas un conseil médical**
- ⚠️ **Ne remplace pas la lecture de l'étiquette originale**
- ⚠️ **En cas d'allergie, toujours vérifier l'étiquette physique**
- ⚠️ **Les données peuvent contenir des erreurs OCR**

---

## 📚 Sources et références

### Bases de données utilisées
1. **Open Food Facts**
   - Base collaborative mondiale
   - API publique
   - License : ODbL
   
2. **Bases réglementaires**
   - Règlement (CE) n° 1333/2008 (Additifs)
   - Règlement (UE) n° 1169/2011 (Information des consommateurs)
   - EFSA opinions scientifiques
   
3. **Bases ingrédients**
   - USDA Food Composition Database
   - CIQUAL (Anses)

### Méthodologie scientifique
- Classification des densités basée sur recommandations OMS/ANSES
- Seuils nutritionnels alignés sur Nutri-Score (mais pas de score)
- Terminologie standardisée (ISO, Codex Alimentarius)

---

## 🚀 Évolutions futures

### v1.6.0 - Enrichissement
- Intégration Open Food Facts API complète
- Base ingrédients étendue à 5000+ items
- Support multi-langues (créole, anglais)

### v1.7.0 - Comparaisons avancées
- Comparaisons prix/qualité nutritionnelle
- Alternatives produits suggérées
- Historique de reformulations

### v2.0.0 - Observatoire DOM
- Agrégation données territoriales
- Statistiques comparatives
- API publique open-data

---

## 📞 Contact et contributions

Pour signaler une erreur ou contribuer à la base de connaissances :
- Email : contact@akiprisaye.com
- Plateforme : https://akiprisaye.com

**Licence** : Données open-source sous licence ODbL  
**Code** : Disponible sous licence MIT

---

*Document mis à jour le 2 janvier 2026*  
*Version : 1.5.0*
