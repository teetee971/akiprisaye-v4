# Changelog Datasets - A KI PRI SA YÉ

Toutes les modifications apportées aux datasets open data sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### En préparation
- Dataset: Indice du coût de la vie - La Réunion
- Dataset: Prix de l'énergie par territoire
- Dataset: Comparaisons internationales France vs UE

## [5.1.0] - 2026-01-02

### Ajouté
- **Open Data Compliance Pack** : infrastructure complète pour les datasets conformes
  - Catalogue DCAT pour interopérabilité avec portails open data
  - Fichier CITATION.cff pour citations académiques
  - Script d'export automatisé avec checksums SHA-256
  - Politique open data documentée
- **CI GitHub Actions** : workflow de production stable
  - Build et tests automatiques
  - Génération automatique des exports sur tags
  - Upload des artefacts vers GitHub Releases

### Documentation
- `OPEN_DATA_POLICY.md` : politique complète de publication des données
- `CI_POLICY.md` : politique CI/CD et reproductibilité
- `DATASET_CATALOG_dcat.json` : catalogue conforme DCAT-AP
- `CITATION.cff` : métadonnées de citation

## [5.0.0] - 2026-01-01 (Prévu)

### En développement
- **International Observatory Core** : infrastructure multi-pays
- **Connecteurs officiels** : Eurostat, INSEE, OCDE
- **Framework d'indices internationaux** : indices configurables et versionnés

## [4.3.0] - 2025-12-15

### Ajouté
- **Public Observatory** : observatoire public officiel
  - Publication d'indicateurs officiels
  - Séries longues avec méthodologie figée
  - Datasets citables avec URLs pérennes

## [4.2.0] - 2025-12-10

### Ajouté
- **Eurostat Interoperability** : connexion en lecture seule
  - Mapping vers modèle interne
  - Cache local horodaté
  - Fallback automatique en cas d'indisponibilité

## [4.1.0] - 2025-12-05

### Ajouté
- **Comparaisons internationales**
  - Normalisation monétaire (EUR)
  - Ajustement PPA (Purchasing Power Parity)
  - Comparaisons DOM vs Métropole
  - Comparaisons France vs UE
  - Comparaisons UE vs International
- Dataset: Profils de coût par pays
- Documentation: Méthodologie des comparaisons internationales v4.1.0

### Méthodologie
- Formules de calcul PPA documentées
- Transparence sur les sources (OCDE, Eurostat, Banque Mondiale)
- Disclaimers sur les limitations des comparaisons

## [4.0.0] - 2025-12-01

### Ajouté
- **Portail Institutionnel** : accès technique pour institutions
  - Profils d'accès (institution, recherche, presse)
  - API read-only pour données agrégées
  - Exports CSV/JSON/XLSX
  - Rate limiting configurable
- Dataset: Indices globaux par territoire
- Dataset: Métadonnées complètes
- Documentation: Charte de transparence
- Documentation: Portail institutionnel v4.0.0

### Principes établis
- Lecture seule stricte
- Données observées uniquement
- Méthodologie explicite
- Zéro recommandation
- Zéro scoring propriétaire
- Interopérabilité statistique

## [2.5.0] - 2024-11-01

### Ajouté
- Dataset: Observatoire du panier alimentaire
  - Panier type par territoire
  - Prix moyens par catégorie de produits

## [2.4.0] - 2024-10-15

### Ajouté
- Dataset: Observatoire logement et loyers
  - Prix des loyers par type de logement
  - Charges locatives moyennes

## [2.3.0] - 2024-10-01

### Ajouté
- Dataset: Prix de la mobilité terrestre
  - Prix des carburants par territoire
  - Coûts de transport en commun

## [2.2.0] - 2024-09-15

### Ajouté
- Dataset: Prix des transports aériens et maritimes
  - Évolution des prix de billets
  - Comparaisons inter-territoires

## [2.1.0] - 2024-09-01

### Ajouté
- Dataset: Indice IEVR (Indice d'Équivalence de Vie Réelle)
  - Calcul par territoire
  - Décomposition par catégories

## [2.0.0] - 2024-08-01

### Changements majeurs
- Refonte de l'architecture de données
- Normalisation des formats d'export
- Introduction du versionnage sémantique

## [1.x.x] - 2024-01 à 2024-07

### Phase pilote
- Collecte initiale des données
- Tests des méthodologies
- Validation des sources

---

## Format du Changelog

### Catégories de changements
- **Ajouté** : nouvelles fonctionnalités, nouveaux datasets
- **Modifié** : changements dans les datasets existants
- **Déprécié** : fonctionnalités qui seront retirées
- **Retiré** : fonctionnalités retirées (datasets jamais supprimés, seulement obsolètes)
- **Corrigé** : corrections de bugs ou d'erreurs de données
- **Sécurité** : corrections de vulnérabilités

### Numérotation des versions
Suivant [Semantic Versioning](https://semver.org/) :
- **MAJOR** (X.0.0) : changements incompatibles
- **MINOR** (0.X.0) : ajout de fonctionnalités rétrocompatibles
- **PATCH** (0.0.X) : corrections rétrocompatibles

### Politique de rétention
- **Datasets** : conservation permanente (minimum 10 ans)
- **Métadonnées** : archivage de toutes les versions
- **Documentation** : historique complet maintenu

---

## Contact

Pour toute question sur le changelog ou les datasets :
- Email : opendata@akiprisaye.fr
- Issues : https://github.com/teetee971/akiprisaye-web/issues
