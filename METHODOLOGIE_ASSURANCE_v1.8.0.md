# Méthodologie Comparateur Assurances v1.8.0

**A KI PRI SA YÉ - Comparateur Citoyen d'Assurances**

Version 1.8.0 - Janvier 2026

---

## Principe Fondamental

Le **comparateur citoyen d'assurances** est un outil de **lecture et d'analyse** des offres d'assurance observées.

### Caractéristiques Strictes

✅ **Lecture seule** - Données observées uniquement  
✅ **Aucune recommandation** - Classement objectif par coût annuel  
✅ **Aucun conseil** - Aucune suggestion personnalisée  
✅ **Aucun scoring propriétaire** - Pas de notation d'assureur  
✅ **Description factuelle** - Garanties et exclusions listées  
✅ **Multi-territoires** - Comparaison par zone géographique  
✅ **Sources traçables** - Date, volume, origine obligatoires  

### Ce que le Comparateur N'EST PAS

❌ **Pas un conseiller** - Aucune recommandation d'assurance  
❌ **Pas un courtier** - Aucune souscription possible  
❌ **Pas un évaluateur** - Aucun avis sur la qualité des assureurs  
❌ **Pas un simulateur personnalisé** - Calculs basés sur données observées  

---

## Types d'Assurances Couverts

### 1. Assurance Auto

**Données observées :**
- Prix annuel TTC
- Niveau de couverture (Tiers / Tiers étendu / Tous risques)
- Franchise observée
- Garanties principales listées
- Exclusions observées

**Informations complémentaires (non-obligatoires) :**
- Type de véhicule
- Tranche d'âge conducteur
- Bonus/malus

**Classement :** Du moins cher au plus cher (coût annuel TTC)

### 2. Assurance Habitation

**Données observées :**
- Prix annuel TTC
- Niveau de couverture (Base / Intermédiaire / Complète)
- Franchise observée
- Garanties principales listées
- Exclusions observées

**Informations complémentaires (non-obligatoires) :**
- Type de logement (appartement/maison)
- Surface en m²
- Statut occupant (propriétaire/locataire)

**Classement :** Du moins cher au plus cher (coût annuel TTC)

### 3. Assurance Santé (Complémentaire)

**Données observées :**
- Prix annuel TTC
- Niveau de couverture (Base / Intermédiaire / Complète)
- Garanties principales listées
- Remboursements principaux observés (en % ou montants)

**Informations complémentaires (non-obligatoires) :**
- Type de contrat (individuel/famille)
- Nombre de bénéficiaires

**Classement :** Du moins cher au plus cher (coût annuel TTC)

---

## Méthodologie de Comparaison

### 1. Collecte des Offres

Les offres sont collectées depuis des sources **observées** :
- Sites web des assureurs
- Documents commerciaux publics
- Open data réglementaire (si disponible)

**Chaque offre contient :**
```typescript
{
  id: string;
  providerName: string;      // Nom de l'assureur
  offerName: string;         // Nom du contrat
  priceIncludingTax: number; // Prix annuel TTC en €
  territory: Territory;      // Territoire de disponibilité
  
  specifications: {
    insuranceType: 'auto' | 'home' | 'health';
    coverageLevel: 'basic' | 'intermediate' | 'comprehensive';
    annualPriceTTC: number;
    deductible?: number;              // Franchise en €
    mainCoverages: string[];          // Liste des garanties
    exclusions?: string[];            // Liste des exclusions
    // + spécifiques selon le type
  };
  
  source: {
    origin: string;           // Origine de la donnée
    observationDate: Date;    // Date d'observation
    sampleSize: number;       // Volume d'observations
    confidenceLevel?: number; // Niveau de confiance (0-1)
  };
  
  validFrom: Date;
  validUntil?: Date;
}
```

### 2. Niveaux de Couverture (Descriptifs)

Les niveaux sont **descriptifs uniquement**, pas normatifs :

**Basic (Base)**
- Couverture minimale légale ou contractuelle
- Exemples : Tiers (auto), RC (habitation), Hospitalisation (santé)

**Intermediate (Intermédiaire)**
- Couverture étendue au-delà du minimum
- Exemples : Tiers étendu (auto), RC + Dégâts (habitation), Soins courants (santé)

**Comprehensive (Complète)**
- Couverture maximale proposée
- Exemples : Tous risques (auto), Multirisque (habitation), Tous soins (santé)

**Important :** Ces niveaux sont **indicatifs**. Les garanties réelles sont toujours listées explicitement.

### 3. Classement Objectif

Les offres sont **classées du moins cher au plus cher** selon leur prix annuel TTC.

**Aucun autre critère** n'est utilisé :
- Pas de qualité de service
- Pas de réputation d'assureur
- Pas de satisfaction client
- Pas de rapidité de traitement des sinistres

### 4. Filtrage

Filtres disponibles :
- **Territoire** (obligatoire) - Zone géographique
- **Type d'assurance** - Auto, Habitation, Santé
- **Niveau de couverture** - Basic, Intermediate, Comprehensive
- **Prix maximum** - Fourchette de prix annuel
- **Dates** - Période d'observation

---

## Exemple de Comparaison

### Assurance Auto - Martinique (MQ)

```
Comparaison : Assurance Auto (Tiers)
Territoire : Martinique
Date : 2026-01-15
Offres comparées : 5

Rang 1: Assureur A - Offre Tiers Classique
  Prix annuel TTC: 450 €
  Franchise: 500 €
  Garanties: 
    - Responsabilité civile
    - Défense pénale et recours
    - Protection juridique
  Écart/moins cher: 0 € (0%)
  Écart/moyenne: -120 € (-21%)
  Catégorie: cheapest

Rang 2: Assureur B - Formule Essentielle
  Prix annuel TTC: 520 €
  Franchise: 450 €
  Garanties:
    - Responsabilité civile
    - Défense pénale
    - Assistance 24/7
  Écart/moins cher: 70 € (+15.5%)
  Écart/moyenne: -50 € (-8.7%)
  Catégorie: below_average

[...]

Statistiques:
  Prix moyen: 570 €
  Médiane: 550 €
  Écart-type: 95 €
  Échantillon: 5 offres
  
Source:
  Origine: Observation directe - sites assureurs
  Date: 2026-01-15
  Volume: 5 observations
  Confiance: 0.95
```

---

## Conformité et Garanties

### Respect du Socle v1.6.0

✅ **Héritage strict** de `ServiceComparisonCore`  
✅ **Méthodologie identique** (agrégation, classement, historique)  
✅ **Types compatibles** avec le système de base  
✅ **Tests unitaires** complets (6 tests passing)  

### Spécificités Assurances

✅ **Garanties descriptives** - Liste explicite sans interprétation  
✅ **Exclusions observées** - Mentionnées si disponibles  
✅ **Franchises affichées** - Montants observés  
✅ **Aucun conseil** - Pas de recommandation selon profil  

### Limites Assumées

❗ **Pas de conseil personnalisé** - Comparaison sur prix uniquement  
❗ **Pas d'analyse de garanties** - Liste factuelle sans évaluation  
❗ **Pas de simulation précise** - Estimations basées sur données types  
❗ **Pas d'évaluation qualitative** - Aucun avis sur les assureurs  
❗ **Pas de prise en compte du profil** - Calculs génériques  

---

## Feature Flag

Feature flag **indépendant** :

```typescript
{
  "insurance_comparison_enabled": boolean  // OFF par défaut
}
```

**Activation/désactivation sans impact** sur les autres services.

---

## Tests Unitaires

**6 tests passing** couvrant :
- Comparaisons auto, habitation, santé
- Filtres par type et niveau de couverture
- Classements objectifs
- Validation de données

**Commande :**
```bash
npm test -- insuranceService.test.ts
```

---

## Utilisation

```typescript
import { InsuranceComparisonService, InsuranceType, CoverageLevel } from './services/comparison/insurance';

const service = InsuranceComparisonService.getInstance();

// Comparaison assurance auto
const result = await service.compareOffers(Territory.MARTINIQUE, {
  specificFilters: {
    insuranceType: InsuranceType.AUTO,
    coverageLevel: CoverageLevel.BASIC
  }
});
```

---

## Contact et Support

**Documentation technique :** `backend/src/services/comparison/insurance/`  
**Tests unitaires :** `backend/src/services/comparison/insurance/__tests__/`  
**Méthodologie générale :** `METHODOLOGIE_SERVICES_v1.6.0.md`  

**Licence :** Licence Ouverte / Open Licence v2.0  

---

*Document généré pour la version 1.8.0 - Janvier 2026*
