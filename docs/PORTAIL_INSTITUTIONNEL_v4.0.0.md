# Portail Institutionnel v4.0.0

## Vue d'ensemble

Le **Portail Institutionnel** est une interface technique (non publique) donnant accès aux données agrégées de l'observatoire du coût de la vie. Il est destiné aux :

- **Collectivités territoriales** et institutions publiques
- **Chercheurs** et laboratoires de recherche
- **Journalistes** et médias
- **Organismes institutionnels** (INSEE, Eurostat, etc.)

## Principes fondamentaux

### 1. Lecture seule
- Aucune modification des données sources
- Accès en consultation uniquement
- Pas d'écriture dans les bases de données

### 2. Données observées
- Toutes les données proviennent de sources vérifiables
- Traçabilité complète de chaque mesure
- Aucune donnée synthétique ou estimée sans mention explicite

### 3. Méthodologie explicite
- Chaque indicateur accompagné de sa méthodologie
- Versionnage des méthodes de calcul
- Documentation publique et permanente

### 4. Zéro recommandation
- Pas de conseils ou de préconisations
- Présentation factuelle des données
- Interprétation laissée aux utilisateurs institutionnels

### 5. Zéro scoring propriétaire
- Pas de notation subjective
- Indices basés sur des formules publiques
- Pondérations transparentes et justifiées

### 6. Interopérabilité statistique
- Compatibilité avec les standards INSEE et Eurostat
- Formats d'export normalisés (JSON, CSV, XML, XLSX)
- API RESTful documentée

## Architecture technique

### Structure
```
src/portal/
  └── institutionalPortalService.ts   # Service principal
src/types/
  └── institutionalPortal.ts          # Types TypeScript
```

### Types principaux

#### InstitutionalUser
```typescript
interface InstitutionalUser {
  id: string;
  type: 'institution' | 'research' | 'press';
  organization: string;
  contactEmail: string;
  accessLevel: 'basic' | 'standard' | 'advanced';
  createdAt: string;
  lastAccess?: string;
}
```

#### AccessScope
```typescript
interface AccessScope {
  userId: string;
  allowedTerritories: TerritoryCode[] | 'all';
  allowedDatasets: string[] | 'all';
  allowedExports: ExportFormat[];
  rateLimit: {
    requestsPerHour: number;
    requestsPerDay: number;
  };
  validUntil?: string;
}
```

#### DatasetDescriptor
```typescript
interface DatasetDescriptor {
  id: string;
  name: string;
  description: string;
  version: string;
  methodology: string; // URL vers la méthodologie
  lastUpdate: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  coverage: {
    territories: TerritoryCode[];
    startDate: string;
    endDate?: string;
  };
  fields: DatasetField[];
  sourceReferences: string[];
  license: string;
  permanentUrl: string; // URL pérenne pour citation
}
```

## Fonctionnalités

### 1. Accès aux indices globaux

**Fonction :** `getGlobalIndices(userId, territory?)`

Retourne les indices agrégés du coût de la vie :
- IEVR (Indice d'Équivalence de Vie Réelle)
- Décomposition par composantes (alimentation, transport, logement, autres)
- Pondérations explicites
- Méthodologie de calcul

**Exemple :**
```typescript
const indices = await getGlobalIndices('user-123', 'MTQ');
// Retourne l'IEVR pour la Martinique avec ses composantes
```

### 2. Accès multi-territoires

**Fonction :** `getMultiTerritoryComparison(userId, refTerritory, comparisonTerritories, indicator)`

Compare un indicateur entre plusieurs territoires :
- Territoire de référence (généralement France métropolitaine)
- Territoires de comparaison (DOM, ROM, etc.)
- Écart en pourcentage
- Classement optionnel (sans jugement de valeur)

**Exemple :**
```typescript
const comparison = await getMultiTerritoryComparison(
  'user-123',
  'FRA',
  ['GLP', 'MTQ', 'GUF', 'REU'],
  'cost-of-living-index'
);
```

### 3. Accès historique long

**Fonction :** `getHistoricalData(userId, request)`

Accès aux séries temporelles longues :
- Données depuis le début de l'observation (2024+)
- Agrégation configurable (jour, semaine, mois, trimestre, année)
- Métadonnées de qualité (vérifié, estimé, provisoire)
- Méthodologie de calcul des séries

**Exemple :**
```typescript
const historical = await getHistoricalData('user-123', {
  datasetId: 'cost-of-living-index',
  territory: 'MTQ',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2026-01-01T00:00:00Z',
  aggregation: 'monthly'
});
```

### 4. Accès métadonnées complètes

**Fonction :** `getMetadata(userId)`

Retourne l'ensemble des métadonnées :
- Liste des datasets disponibles
- Description des indices
- Territoires couverts (population, superficie, devise)
- Références méthodologiques
- Dernière mise à jour

**Exemple :**
```typescript
const metadata = await getMetadata('user-123');
// Retourne datasets[], indices[], territories[], methodologies[]
```

## Profils d'accès

### Institution
- Collectivités territoriales
- Administrations publiques
- Établissements publics

**Accès :**
- Tous les territoires
- Tous les datasets agrégés
- Exports illimités
- Rate limit : 1000 req/h, 10000 req/jour

### Recherche
- Universités et laboratoires
- Centres de recherche
- Chercheurs individuels

**Accès :**
- Tous les territoires
- Tous les datasets (y compris données brutes anonymisées)
- Exports illimités
- Rate limit : 500 req/h, 5000 req/jour

### Presse
- Journalistes professionnels
- Médias accrédités
- Agences de presse

**Accès :**
- Tous les territoires
- Datasets agrégés uniquement
- Exports limités
- Rate limit : 200 req/h, 2000 req/jour

## Formats d'export

### JSON
Format par défaut pour les APIs
- Structure hiérarchique
- Métadonnées intégrées
- Compatible avec tous les langages

### CSV
Format universel pour analyse
- Encodage UTF-8
- Séparateur : point-virgule (;)
- En-têtes explicites

### XLSX
Format Excel pour les non-techniciens
- Feuilles multiples par dataset
- Métadonnées en première feuille
- Formatage pour lisibilité

### XML
Format structuré pour interopérabilité
- Schéma XSD fourni
- Compatible INSEE/Eurostat
- Validation stricte

## Sécurité et traçabilité

### Authentification
- Authentification par clé API
- Rotation des clés tous les 6 mois
- Révocation instantanée en cas d'abus

### Audit
- Log de tous les accès
- Conservation 2 ans minimum
- Accessible aux autorités de contrôle

### Rate limiting
- Limites par heure et par jour
- Compteurs en temps réel
- Notification à 80% de la limite

### Conformité RGPD
- Aucune donnée personnelle dans les exports
- Anonymisation des contributions citoyennes
- Droit d'accès et de rectification

## Citations et références

### Format de citation recommandé

**Dataset :**
```
Observatoire du Coût de la Vie (2026). 
Indice du Coût de la Vie - Martinique. 
Dataset v4.0.0. 
URL: https://akiprisaye.fr/datasets/cost-of-living-index
Consulté le [date]
```

**Méthodologie :**
```
Observatoire du Coût de la Vie (2026).
Méthodologie IEVR v4.0.
URL: https://akiprisaye.fr/docs/methodologie-ievr-v4
```

### URLs pérennes
Toutes les URLs de datasets et méthodologies sont permanentes :
- Archivage garanti 10 ans minimum
- Versionnage explicite
- Redirections maintenues en cas de migration

## Limitations

### Ce que le portail ne fait PAS
- ❌ Interface graphique publique (données brutes uniquement)
- ❌ Tableaux de bord interactifs (à construire côté utilisateur)
- ❌ Prédictions ou projections
- ❌ Recommandations ou conseils
- ❌ Scoring ou notation des territoires
- ❌ Éditorialisation des données

### Ce que le portail FAIT
- ✅ Fourniture de données brutes et agrégées
- ✅ Méthodologie explicite et documentée
- ✅ Exports dans formats standards
- ✅ API RESTful documentée
- ✅ Historiques longs et fiables
- ✅ Traçabilité complète

## Activation

Le portail institutionnel est contrôlé par le feature flag :

```env
VITE_FEATURE_INSTITUTIONAL_PORTAL=false
```

**Important :** Ce flag doit rester à `false` en production jusqu'à validation complète du système et mise en place des mécanismes de sécurité.

## Contact et support

Pour demander un accès institutionnel :
- Email : institutional@akiprisaye.fr
- Formulaire : https://akiprisaye.fr/institutional-access
- Documentation API : https://akiprisaye.fr/api-docs

## Roadmap

### v4.0.0 (actuel)
- ✅ Accès institutionnel de base
- ✅ Exports JSON/CSV/XLSX
- ✅ Méthodologie documentée

### v4.1.0 (prévu)
- 🔜 Comparaisons internationales
- 🔜 Ajustement PPA (Purchasing Power Parity)

### v4.2.0 (prévu)
- 🔜 Interopérabilité Eurostat live
- 🔜 Synchronisation INSEE

### v4.3.0 (prévu)
- 🔜 Observatoire public officiel
- 🔜 Datasets citables avec DOI

## Références

- [Charte de Transparence](./CHARTE_TRANSPARENCE.md)
- [Architecture v4.0](../docs/ARCHITECTURE.md)
- Documentation INSEE : https://www.insee.fr
- Documentation Eurostat : https://ec.europa.eu/eurostat
