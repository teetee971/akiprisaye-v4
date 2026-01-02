# Open Data Policy v5.1.0

## Principes généraux

L'Observatoire du Coût de la Vie **A KI PRI SA YÉ** s'engage à publier ses données en **Open Data** conformément aux standards internationaux et aux exigences de transparence.

## Licences par type de dataset

### 1. Données observées (relevés terrain)
**Licence :** Open Database License (ODbL) v1.0

**Raison :** Les données collectées sur le terrain par l'observatoire et les contributeurs sont des **bases de données** nécessitant une licence copyleft forte.

**URL :** https://opendatacommons.org/licenses/odbl/1.0/

**Obligations :**
- Attribution de la source
- Partage à l'identique (share-alike)
- Ouverture des données dérivées

**Fichiers concernés :**
- Prix relevés en magasins
- Contributions citoyennes vérifiées
- Observations terrain

### 2. Méthodologies et documentation
**Licence :** Creative Commons Attribution 4.0 International (CC BY 4.0)

**Raison :** Les documents méthodologiques sont des **œuvres de l'esprit** nécessitant une licence documentaire standard.

**URL :** https://creativecommons.org/licenses/by/4.0/

**Obligations :**
- Attribution de la source

**Fichiers concernés :**
- Méthodologies de calcul
- Documentation technique
- Guides utilisateur

### 3. Données agrégées et indices
**Licence :** Licence Ouverte / Open License v2.0 (Etalab)

**Raison :** Les indices calculés sont des **données publiques françaises** relevant de la licence Etalab, compatible avec les standards européens.

**URL :** https://www.etalab.gouv.fr/licence-ouverte-open-licence/

**Obligations :**
- Mention de la source
- Date de dernière mise à jour

**Fichiers concernés :**
- IEVR (Indice d'Équivalence de Vie Réelle)
- Indices sectoriels
- Agrégations territoriales

### 4. Données internationales (réutilisées)
**Licence :** Licence de la source originale

**Raison :** Les données provenant d'Eurostat, INSEE, OCDE conservent leur licence d'origine.

**Obligations :**
- Citation complète de la source
- Respect de la licence originale
- Traçabilité de la provenance

**Sources et licences :**
- **Eurostat :** CC BY 4.0
- **INSEE :** Licence Ouverte v2.0
- **OCDE :** CC BY 4.0
- **Open Food Facts :** ODbL v1.0

## Métadonnées obligatoires

Chaque dataset publié DOIT inclure :

### Métadonnées DCAT (Dublin Core Application Profile)

```json
{
  "dcat:Dataset": {
    "dct:title": "Titre du dataset",
    "dct:description": "Description complète",
    "dct:issued": "2026-01-01",
    "dct:modified": "2026-01-02",
    "dct:license": "https://opendatacommons.org/licenses/odbl/1.0/",
    "dct:publisher": {
      "foaf:name": "Observatoire du Coût de la Vie"
    },
    "dcat:contactPoint": {
      "vcard:fn": "Open Data Team",
      "vcard:hasEmail": "opendata@akiprisaye.fr"
    },
    "dcat:keyword": ["prix", "coût de la vie", "DOM"],
    "dcat:theme": "http://publications.europa.eu/resource/authority/data-theme/ECON",
    "dct:spatial": "http://publications.europa.eu/resource/authority/country/FRA",
    "dct:temporal": "2024-01-01/2026-12-31",
    "dcat:distribution": []
  }
}
```

### Métadonnées Data Package (Frictionless)

```json
{
  "name": "cost-of-living-martinique",
  "title": "Cost of Living - Martinique",
  "version": "5.1.0",
  "licenses": [{
    "name": "ODbL-1.0",
    "path": "https://opendatacommons.org/licenses/odbl/1.0/"
  }],
  "resources": [{
    "name": "prices",
    "path": "data/prices.csv",
    "schema": {
      "fields": []
    }
  }]
}
```

## Citation académique (CITATION.cff)

Format **Citation File Format** pour les citations académiques :

```yaml
cff-version: 1.2.0
message: "If you use this dataset, please cite it as below."
type: dataset
title: "Observatoire du Coût de la Vie - Données Ouvertes"
version: 5.1.0
date-released: 2026-01-01
authors:
  - family-names: "Observatoire"
    given-names: "A KI PRI SA YÉ"
url: "https://akiprisaye.fr"
repository-code: "https://github.com/teetee971/akiprisaye-web"
license: ODbL-1.0
keywords:
  - cost of living
  - prices
  - overseas territories
  - open data
```

## Snapshots et versionnage

### Principe
Chaque publication de données fait l'objet d'un **snapshot daté et figé**.

### Nomenclature
```
datasets/
  ├── cost-of-living/
  │   ├── v5.1.0-2026-01-15/
  │   │   ├── data.csv
  │   │   ├── metadata.json
  │   │   ├── checksum.sha256
  │   │   └── README.md
  │   └── latest -> v5.1.0-2026-01-15
```

### Checksum
Chaque fichier est accompagné d'un checksum SHA-256 :

```bash
sha256sum data.csv > checksum.sha256
```

### CHANGELOG_DATASETS.md
Toutes les modifications sont tracées :

```markdown
# Changelog Datasets

## [5.1.0] - 2026-01-15
### Added
- New dataset: housing-costs-reunion

### Changed
- cost-of-living-martinique: updated methodology v5.1.0

### Fixed
- cost-of-living-guadeloupe: corrected outlier prices
```

## Formats d'export

### CSV (prioritaire)
- Encodage : UTF-8 avec BOM
- Séparateur : point-virgule (;)
- Décimale : virgule (,) pour conformité européenne
- En-têtes : obligatoires, explicites

### JSON
- Format : JSON Lines (.jsonl) pour gros volumes
- Schéma : JSON Schema fourni

### Parquet
- Format binaire optimisé pour analyses
- Compatible Apache Arrow

## Conformité RGPD

### Anonymisation
- Aucune donnée personnelle dans les exports
- Agrégation minimale : commune (pas de quartier précis)
- Contributions citoyennes : pseudonymisées

### Droit d'accès
- Email : rgpd@akiprisaye.fr
- Délai de réponse : 30 jours

## Catalogue de données

### Publication
Le catalogue complet est disponible :
- Format DCAT : https://akiprisaye.fr/catalog/dcat.json
- Format Data Package : https://akiprisaye.fr/catalog/datapackage.json
- Interface web : https://akiprisaye.fr/catalog

### Moissonnage (Harvesting)
Le catalogue est compatible avec les protocoles :
- OAI-PMH (pour portails open data)
- CKAN API (pour data.gouv.fr)
- DCAT-AP (pour portails européens)

## Procédure de publication

### 1. Préparation
- Vérification qualité données
- Génération métadonnées
- Calcul checksum

### 2. Validation
- Conformité schéma
- Vérification licence
- Test intégrité

### 3. Publication
- Création snapshot
- Mise à jour catalogue
- Notification abonnés

### 4. Archivage
- Conservation 10 ans minimum
- Snapshots accessibles en permanence

## Politique de retrait

### Principe
Les datasets publiés ne sont **jamais supprimés**, seulement marqués comme **obsolètes**.

### Procédure
1. Ajout d'un avertissement dans les métadonnées
2. Mise à jour du changelog
3. Redirection vers nouvelle version
4. Conservation de l'ancien snapshot

## Contact et support

### Questions techniques
- Email : opendata@akiprisaye.fr
- Issues GitHub : https://github.com/teetee971/akiprisaye-web/issues

### Demandes de datasets
- Formulaire : https://akiprisaye.fr/dataset-request
- Délai de réponse : 15 jours

### Signalement d'erreur
- Email : erreurs@akiprisaye.fr
- Traitement prioritaire sous 48h

## Références

### Standards
- DCAT-AP : https://joinup.ec.europa.eu/collection/semantic-interoperability-community-semic/solution/dcat-application-profile-data-portals-europe
- Frictionless Data : https://frictionlessdata.io/
- Citation File Format : https://citation-file-format.github.io/

### Licences
- ODbL : https://opendatacommons.org/licenses/odbl/
- CC BY 4.0 : https://creativecommons.org/licenses/by/4.0/
- Licence Ouverte v2.0 : https://www.etalab.gouv.fr/licence-ouverte-open-licence/

---

**Version :** 5.1.0  
**Date de publication :** 1er janvier 2026  
**Prochaine révision :** 1er janvier 2027
