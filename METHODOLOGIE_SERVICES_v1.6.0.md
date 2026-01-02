# Méthodologie des Comparateurs de Services Citoyens v1.6.0

**A KI PRI SA YÉ - Comparateurs de Services Multi-Domaines**

Version 1.6.0 - Janvier 2026

---

## Table des Matières

1. [Principe Fondamental](#principe-fondamental)
2. [Architecture Technique](#architecture-technique)
3. [Méthode de Comparaison](#méthode-de-comparaison)
4. [Agrégation Statistique](#agrégation-statistique)
5. [Classement Objectif](#classement-objectif)
6. [Multi-Territoires](#multi-territoires)
7. [Historique Temporel](#historique-temporel)
8. [Traçabilité des Sources](#traçabilité-des-sources)
9. [Conformité et Garanties](#conformité-et-garanties)

---

## Principe Fondamental

Le **comparateur de services citoyen** est un outil de **lecture et d'analyse** des données de services existantes (énergie, eau, télécoms, assurances, etc.).

### Caractéristiques Essentielles

✅ **Lecture seule** - Aucune modification des données  
✅ **Observation pure** - Données collectées sans interprétation  
✅ **Zéro recommandation** - Aucun conseil, aucune notation  
✅ **Classement objectif** - Du moins cher au plus cher uniquement  
✅ **Multi-territoires** - Comparaison par zone géographique  
✅ **Historique temporel** - Évolution des prix dans le temps  
✅ **Sources traçables** - Date, volume, origine de chaque donnée  
✅ **Agrégation statistique** - Min, max, moyenne, écart-type  

### Ce que le comparateur N'EST PAS

❌ **Pas un comparateur commercial** - Aucun lien d'affiliation  
❌ **Pas un conseiller** - Aucune recommandation personnalisée  
❌ **Pas un système de notation** - Aucun score propriétaire  
❌ **Pas un outil d'avis** - Aucune collecte d'opinions  
❌ **Pas un simulateur** - Calculs basés sur données observées uniquement  

---

## Architecture Technique

### Structure des Services

```
backend/src/services/comparison/
├── types.ts                          # Types TypeScript stricts
├── ServiceComparisonCore.ts          # Classe de base générique
├── __tests__/
│   └── ServiceComparisonCore.test.ts # Tests unitaires
└── [services spécifiques]/
    ├── electricityComparisonService.ts
    ├── gasComparisonService.ts
    ├── waterComparisonService.ts
    ├── internetComparisonService.ts
    ├── mobilePlanComparisonService.ts
    ├── [...]InsuranceComparisonService.ts
    └── multiServiceAggregationService.ts
```

### Classe de Base `ServiceComparisonCore`

Classe abstraite générique implémentant :

- **Agrégation statistique** (min, max, moyenne, médiane, écart-type)
- **Classement objectif** (du moins cher au plus cher)
- **Comparaison multi-territoires**
- **Historique temporel**
- **Export open-data**
- **Validation des données**

Chaque service spécifique hérite de cette classe et implémente :

```typescript
protected abstract fetchOffers(filters: ServiceFilters): Promise<ServiceOffer[]>;
```

---

## Méthode de Comparaison

### 1. Collecte des Offres

Les offres sont collectées depuis des sources **observées** :

- **Observation directe** - Sites web des fournisseurs
- **Open data officiel** - Données publiques réglementaires
- **Signalements citoyens** - Données vérifiées et validées

**Données collectées pour chaque offre :**

```typescript
{
  id: string;                    // Identifiant unique
  providerName: string;          // Nom du fournisseur
  offerName: string;             // Nom de l'offre
  priceIncludingTax: number;     // Prix TTC en euros
  territory: Territory;          // Territoire de disponibilité
  specifications: {...};         // Caractéristiques techniques
  source: DataSource;            // Source traçable
  validFrom: Date;               // Date de validité
  validUntil?: Date;             // Fin de validité (optionnelle)
  commitment?: {...};            // Conditions d'engagement
}
```

### 2. Filtrage des Offres

Filtrage **objectif** selon :

- **Territoire** - Une seule zone géographique par comparaison
- **Prix** - Fourchette min/max (optionnel)
- **Date** - Période d'observation (optionnel)
- **Critères techniques** - Spécifiques au type de service

**Aucun filtrage subjectif** (qualité, réputation, satisfaction).

### 3. Validation des Données

Chaque offre est validée selon des critères **stricts** :

```typescript
- Identifiant unique présent
- Nom fournisseur et offre non vides
- Prix strictement positif (> 0)
- Source complète (origine, date, volume)
- Dates cohérentes (validFrom ≤ validUntil)
```

Les offres invalides sont **exclues silencieusement** (pas d'erreur affichée).

---

## Agrégation Statistique

### Statistiques Calculées

Pour chaque ensemble d'offres comparées :

1. **Prix minimum** (`min`)
   - L'offre la moins chère observée

2. **Prix maximum** (`max`)
   - L'offre la plus chère observée

3. **Prix moyen** (`average`)
   - Moyenne arithmétique des prix observés
   - Arrondi à 2 décimales

4. **Médiane** (`median`)
   - Prix central de la distribution
   - Plus robuste que la moyenne face aux valeurs extrêmes

5. **Écart-type** (`standardDeviation`)
   - Mesure de la dispersion des prix
   - Indique l'hétérogénéité des offres

6. **Taille de l'échantillon** (`sampleSize`)
   - Nombre d'offres dans la comparaison

### Exemple de Calcul

```
Offres observées: [100€, 150€, 200€, 250€, 300€]

Résultat:
  min: 100€
  max: 300€
  average: 200€
  median: 200€
  standardDeviation: 70.71€
  sampleSize: 5
```

---

## Classement Objectif

### Principe

Les offres sont **classées du moins cher au plus cher** selon leur prix TTC.

**Aucun autre critère** n'est utilisé (pas de qualité, réputation, satisfaction).

### Informations de Classement

Pour chaque offre classée :

1. **Rang** (`rank`)
   - Position dans le classement (1 = moins cher)

2. **Écart avec le moins cher**
   - En euros : `priceIncludingTax - minPrice`
   - En pourcentage : `(différence / minPrice) × 100`

3. **Écart avec la moyenne**
   - En euros : `priceIncludingTax - average`
   - En pourcentage : `(différence / average) × 100`

4. **Catégorie relative** (`category`)
   - `cheapest` : Offre la moins chère (rang 1)
   - `below_average` : Prix < 95% de la moyenne
   - `average` : Prix entre 95% et 105% de la moyenne
   - `above_average` : Prix > 105% de la moyenne
   - `most_expensive` : Offre la plus chère (dernier rang)

### Exemple de Classement

```
Territoire: Martinique (MQ)
Service: Internet Fibre 1 Gbit/s

Rang 1: Fournisseur A - 34.99 € (le moins cher)
  Écart/moins cher: 0.00 € (0%)
  Écart/moyenne: -10.01 € (-22.2%)
  Catégorie: cheapest

Rang 2: Fournisseur B - 39.99 €
  Écart/moins cher: 5.00 € (+14.3%)
  Écart/moyenne: -5.01 € (-11.1%)
  Catégorie: below_average

Rang 3: Fournisseur C - 44.99 €
  Écart/moins cher: 10.00 € (+28.6%)
  Écart/moyenne: -0.01 € (-0.0%)
  Catégorie: average

Rang 4: Fournisseur D - 49.99 €
  Écart/moins cher: 15.00 € (+42.9%)
  Écart/moyenne: +4.99 € (+11.1%)
  Catégorie: above_average

Rang 5: Fournisseur E - 59.99 € (le plus cher)
  Écart/moins cher: 25.00 € (+71.4%)
  Écart/moyenne: +14.99 € (+33.3%)
  Catégorie: most_expensive

Statistiques:
  Prix moyen: 45.00 €
  Médiane: 44.99 €
  Écart-type: 8.66 €
  Échantillon: 5 offres
```

---

## Multi-Territoires

### Territoires Couverts

Les comparaisons sont **territoriales** :

**Départements d'Outre-Mer (DOM) :**
- Guadeloupe (GP / GUADELOUPE)
- Martinique (MQ / MARTINIQUE)
- Guyane (GF / GUYANE)
- La Réunion (RE / LA_REUNION)
- Mayotte (YT / MAYOTTE)

**Collectivités d'Outre-Mer (COM) :**
- Saint-Martin (MF / SAINT_MARTIN)
- Saint-Barthélemy (BL / SAINT_BARTHELEMY)
- Saint-Pierre-et-Miquelon (PM / SAINT_PIERRE_ET_MIQUELON)
- Wallis-et-Futuna (WF / WALLIS_ET_FUTUNA)
- Polynésie française (PF / POLYNESIE_FRANCAISE)
- Nouvelle-Calédonie (NC / NOUVELLE_CALEDONIE)

**France hexagonale :**
- FRANCE_HEXAGONALE (pour comparaisons inter-zones)

### Principe de Comparaison

> **Un comparateur ne compare que des offres d'un même territoire.**

Les comparaisons **inter-territoires** sont affichées séparément via la méthode `compareTerritories()`.

### Comparaison Inter-Territoires

Permet de comparer les **statistiques agrégées** entre territoires :

```typescript
{
  serviceType: "electricity",
  territories: [MARTINIQUE, GUADELOUPE, LA_REUNION],
  results: {
    MARTINIQUE: {
      averagePrice: 150€,
      minPrice: 120€,
      maxPrice: 180€,
      offerCount: 5
    },
    GUADELOUPE: {
      averagePrice: 145€,
      minPrice: 115€,
      maxPrice: 175€,
      offerCount: 4
    },
    LA_REUNION: {
      averagePrice: 160€,
      minPrice: 130€,
      maxPrice: 190€,
      offerCount: 6
    }
  }
}
```

---

## Historique Temporel

### Principe

Le système conserve un **historique des observations** pour permettre l'analyse temporelle.

### Structure de l'Historique

```typescript
{
  serviceType: string,
  territory: Territory,
  timeSeries: [
    {
      date: Date,           // Date d'observation
      averagePrice: number, // Prix moyen observé
      minPrice: number,     // Prix minimum observé
      maxPrice: number,     // Prix maximum observé
      offerCount: number,   // Nombre d'offres
      source: DataSource    // Source des données
    },
    ...
  ],
  period: {
    startDate: Date,
    endDate: Date
  }
}
```

### Utilisation

L'historique permet de :

- **Suivre l'évolution des prix** dans le temps
- **Identifier les tendances** (hausse, baisse, stabilité)
- **Détecter les variations saisonnières**
- **Vérifier la cohérence temporelle** des données

**Note :** L'historique est **descriptif uniquement**. Aucune prévision ou projection.

---

## Traçabilité des Sources

### Source de Données (`DataSource`)

Chaque donnée observée est accompagnée de sa **source complète** :

```typescript
{
  origin: string,              // "observation directe", "open data officiel"
  observationDate: Date,       // Date exacte d'observation
  sampleSize: number,          // Volume de données (> 0)
  collectionMethod?: string,   // Méthode de collecte
  confidenceLevel?: number     // Niveau de confiance (0-1)
}
```

### Principes de Traçabilité

1. **Transparence totale**
   - Origine de chaque donnée visible
   - Date d'observation affichée
   - Volume d'échantillon indiqué

2. **Vérifiabilité**
   - Sources citées permettent vérification
   - Méthode de collecte documentée

3. **Honnêteté**
   - Niveau de confiance affiché si connu
   - Limites des données communiquées

### Exemple

```
Offre: Internet Fibre 1 Gbit/s - 34.99 €

Source:
  Origine: Observation directe - site web fournisseur
  Date: 2026-01-15
  Volume: 1 observation
  Méthode: Extraction automatique
  Confiance: 0.95 (95%)
```

---

## Conformité et Garanties

### Conformité Légale

✅ **RGPD** - Aucune donnée personnelle collectée  
✅ **Open Data** - Licence Ouverte / Open Licence v2.0  
✅ **Loi Lurel (2012)** - Transparence des prix (outre-mer)  
✅ **Méthodologie publique** - Documentation complète accessible  

### Garanties Citoyennes

✅ **Neutralité absolue**
   - Aucun lien commercial avec les fournisseurs
   - Aucune commission, aucune affiliation
   - Aucun avantage financier

✅ **Objectivité**
   - Classement strictement basé sur les prix
   - Aucun critère subjectif
   - Aucune pondération arbitraire

✅ **Transparence**
   - Méthodologie publique et ouverte
   - Sources traçables et vérifiables
   - Code source ouvert (disponible sur demande)

✅ **Lecture seule**
   - Aucune modification de données
   - Aucun impact sur les prix affichés
   - Aucune influence sur les fournisseurs

✅ **Indépendance**
   - Service public et citoyen
   - Financé par des fonds publics ou dons
   - Aucune dépendance commerciale

### Limites Assumées

❗ **Données observées uniquement**
   - Pas de garantie d'exhaustivité
   - Dépendance de la disponibilité des sources

❗ **Pas de conseil personnalisé**
   - Aucune prise en compte de la situation individuelle
   - Aucune recommandation adaptée

❗ **Pas d'évaluation qualitative**
   - Uniquement les prix et caractéristiques techniques
   - Pas de jugement sur la qualité du service

❗ **Pas de mise à jour en temps réel**
   - Fréquence de mise à jour variable selon les sources
   - Date d'observation toujours affichée

---

## Export Open Data

### Format d'Export

Toutes les données de comparaison sont exportables au format **open-data standardisé** :

```typescript
{
  schemaVersion: "1.0.0",
  generatedAt: Date,
  license: "Licence Ouverte / Open Licence v2.0",
  attribution: "A KI PRI SA YÉ - Comparateur Citoyen de Services",
  data: {
    // ServiceComparisonResult | ServiceHistory | TerritoryComparison
  }
}
```

### Utilisation des Données

Les données exportées peuvent être :

✅ **Réutilisées librement** (avec attribution)  
✅ **Intégrées dans d'autres outils**  
✅ **Analysées par des tiers**  
✅ **Publiées par des collectivités**  
✅ **Utilisées pour la recherche**  

---

## Version et Évolutions

**Version actuelle :** 1.6.0 (Janvier 2026)

**Prochaines versions prévues :**

- **v1.6.1** - Énergie et Eau (électricité, gaz, eau)
- **v1.7.0** - Télécoms (internet fixe, mobile)
- **v1.8.0** - Assurances (auto, habitation, santé)
- **v2.0.0** - Agrégation multi-services

**Principe d'évolution :**

- Méthodologie **stable et pérenne**
- Ajout de nouveaux services **sans régression**
- Compatibilité ascendante **garantie**
- Documentation **systématiquement mise à jour**

---

## Contact et Support

**Documentation technique :** Voir `backend/src/services/comparison/`  
**Tests unitaires :** Voir `backend/src/services/comparison/__tests__/`  
**Licence :** Licence Ouverte / Open Licence v2.0  

**Projet A KI PRI SA YÉ**  
Comparateur Citoyen de Services - Transparence et Objectivité

---

*Document généré pour la version 1.6.0 - Janvier 2026*
