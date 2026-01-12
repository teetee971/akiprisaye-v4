# Receipt Scanner Module - Module Scan d'Observations de Prix

## 📋 Vue d'ensemble

Le module **Receipt Scanner** (Module 23) permet aux citoyens de capturer des prix réels en magasin pour produire des observations de prix vérifiables, utilisables par le module Anti-Crise.

## 📷 Types d'observations supportés (Module D - Extension)

### 1. Ticket de caisse (`ticket_caisse`)
- Prix capturé depuis un ticket de caisse validé
- Date et heure précises
- Traçabilité juridique maximale
- **Recommandé** pour observations de haute qualité

### 2. Étiquette rayon (`etiquette_rayon`)
- Prix observé sur étiquette de rayon en magasin
- Capture directe du prix affiché
- Date de capture (jour uniquement)
- Enseigne visible

### 3. Présentoir promotionnel (`presentoir_promo`)
- Prix promotionnel observé
- Marqué automatiquement comme "offre temporaire"
- Stocké séparément des prix standards
- Ne participe pas aux calculs de prix médian standard

## 🎯 Objectif

- **Zéro simulation** : Aucun prix n'est généré, estimé ou extrapolé
- **100% données réelles** : Un prix = une source réelle identifiable
- **Validation manuelle obligatoire** : Aucune donnée n'est utilisée sans confirmation humaine
- **OCR local uniquement** : Aucun envoi serveur automatique

## 🔐 Contraintes de sécurité

### ✅ Autorisé
- OCR local (Tesseract.js)
- Validation humaine obligatoire
- Traçabilité complète
- localStorage uniquement

### ❌ Interdit
- Reconnaissance "intelligente" inventée
- Correction automatique de prix
- Complétion par IA
- Cloud OCR obligatoire
- Publication automatique

## 📊 Structure de données

```typescript
{
  "type": "ticket_caisse" | "etiquette_rayon" | "presentoir_promo",
  "territoire": "Martinique",
  "enseigne": "Leader Price",
  "magasin": {
    "nom": "Leader Price Fort-de-France",
    "adresse": "Rue Victor Hugo, Fort-de-France"
  },
  "date_achat": "2026-01-12",
  "heure_achat": "14:32",
  "produits": [
    {
      "libelle_ticket": "RIZ BLANC 1KG",
      "prix": 1.29,
      "quantite": 1,
      "ean": null,
      "confiance": "manuel"
    }
  ],
  "preuve": {
    "image": "data:image/jpeg;base64,...",
    "ocr_local": true
  },
  "auteur": "citoyen_anonyme",
  "niveau_confiance_global": "élevé",
  "statut": "valide",
  "source_metadata": {
    "is_promotional": true,  // Si presentoir_promo
    "capture_quality": "high",
    "geolocation": {  // Optionnel
      "latitude": 14.6037,
      "longitude": -61.0733,
      "accuracy": 10
    }
  }
}
```

## 🖥️ Flux utilisateur

### État 1: 📷 Photo
- Capture photo via caméra ou sélection fichier
- Maximum 5 MB
- Validation taille

### État 2: 🔍 OCR
- Analyse locale avec Tesseract.js
- Progression affichée (0-100%)
- Texte extrait brut

### État 3: ✍️ Validation
- **Sélection du type d'observation** (ticket/étiquette/promo)
- Saisie informations magasin
- Validation ligne par ligne
- Ajout produits manuels
- Marquage automatique si promotionnel

### État 4: ⚠️ Incertain
- Lignes non exploitables marquées
- Possibilité de correction

### État 5: ✅ Validé
- Observation enregistrée localement
- Prête pour exploitation (après seuil)

## 🧪 Qualité & Fiabilité

### Niveaux de confiance

| Observations | Badge | Statut |
|-------------|-------|--------|
| 0 | 🔴 Données insuffisantes | Non exploitable |
| 1 | 🟡 Observation isolée | Limitée |
| 2 | 🟡 Données limitées | Partielle |
| ≥3 | 🟢 Observations multiples | Exploitable |

## 📦 Composants

### 1. ReceiptScanner
Composant de capture et OCR local.

**Props:**
```typescript
type ReceiptScannerProps = {
  onScanComplete: (extractedText: string, imageData: string) => void;
  territory: string;
};
```

**Fonctionnalités:**
- Accès caméra (mode environnement)
- Sélection fichier (max 5 MB)
- OCR local (Tesseract.js)
- Progression en temps réel
- Gestion erreurs

### 2. ReceiptValidation
Composant de validation manuelle.

**Props:**
```typescript
type ReceiptValidationProps = {
  extractedText: string;
  imageData: string;
  territory: string;
  onValidate: (receiptData: ReceiptData) => void;
  onCancel: () => void;
};
```

**Fonctionnalités:**
- Saisie informations magasin
- Ajout produits ligne par ligne
- Prévisualisation ticket
- Calcul niveau de confiance
- Validation finale

### 3. ReceiptWorkflow
Composant orchestrateur complet.

**Props:**
```typescript
type ReceiptWorkflowProps = {
  territory: string;
  onSubmit: (receiptData: ReceiptData) => void;
};
```

**Fonctionnalités:**
- Gestion des 3 étapes (Scan → Validation → Terminé)
- Indicateur de progression
- Navigation entre étapes
- Récapitulatif final

## 💻 Utilisation

### Exemple basique

```tsx
import { ReceiptWorkflow } from '@/components/Receipt';

function App() {
  const handleSubmit = (receiptData: ReceiptData) => {
    // Enregistrer dans localStorage
    const observations = JSON.parse(localStorage.getItem('observations') || '[]');
    observations.push(receiptData);
    localStorage.setItem('observations', JSON.stringify(observations));
    
    console.log('Observation enregistrée:', receiptData);
  };

  return (
    <ReceiptWorkflow
      territory="Martinique"
      onSubmit={handleSubmit}
    />
  );
}
```

### Exemple avec gestion d'état

```tsx
import { useState } from 'react';
import { ReceiptWorkflow, type ReceiptData } from '@/components/Receipt';

function AdvancedApp() {
  const [observations, setObservations] = useState<ReceiptData[]>([]);

  const handleSubmit = (receiptData: ReceiptData) => {
    setObservations(prev => [...prev, receiptData]);
    
    // Optionnel: sauvegarder dans localStorage
    localStorage.setItem('observations', JSON.stringify([...observations, receiptData]));
    
    // Optionnel: notifier l'utilisateur
    alert('Observation enregistrée avec succès!');
  };

  return (
    <div>
      <ReceiptWorkflow
        territory="Guadeloupe"
        onSubmit={handleSubmit}
      />
      
      {/* Afficher le nombre d'observations */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          {observations.length} observation(s) enregistrée(s)
        </p>
      </div>
    </div>
  );
}
```

### Exemple avec multi-territoires

```tsx
import { useState } from 'react';
import { ReceiptWorkflow } from '@/components/Receipt';

function MultiTerritoryApp() {
  const [selectedTerritory, setSelectedTerritory] = useState('Martinique');
  const territories = ['Guadeloupe', 'Martinique', 'Guyane', 'Réunion', 'Mayotte'];

  const handleSubmit = (receiptData: ReceiptData) => {
    console.log('Observation pour', receiptData.territoire, ':', receiptData);
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Sélectionner le territoire:</label>
        <select
          value={selectedTerritory}
          onChange={(e) => setSelectedTerritory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          {territories.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      
      <ReceiptWorkflow
        territory={selectedTerritory}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

## 🔧 Configuration Tesseract.js

Le module utilise Tesseract.js avec langue française:

```typescript
const worker = await createWorker('fra', 1, {
  logger: (m) => {
    if (m.status === 'recognizing text') {
      setProgress(Math.round(m.progress * 100));
    }
  },
});
```

## 📱 Compatibilité mobile

- ✅ Caméra arrière par défaut (`facingMode: 'environment'`)
- ✅ Fallback vers sélection fichier si caméra indisponible
- ✅ Responsive design (Tailwind CSS)
- ✅ Touch-friendly

## 🔒 Sécurité & Confidentialité

### Données locales uniquement
- ❌ Aucun envoi serveur automatique
- ✅ Images stockées en base64 (localStorage)
- ✅ OCR effectué côté client
- ✅ Aucun tracking

### Validation manuelle obligatoire
- ❌ Aucune donnée utilisée sans confirmation
- ✅ Chaque ligne doit être validée
- ✅ Possibilité de correction/suppression
- ✅ Niveau de confiance calculé

## 📊 Intégration avec Anti-Crisis Basket

### Seuil d'exploitation

```typescript
// Minimum pour être exploitable
const MIN_OBSERVATIONS_PER_PRODUCT = 3;

// Exemple de vérification
const productObservations = observations.filter(
  obs => obs.produits.some(p => p.libelle_ticket === 'RIZ BLANC 1KG')
);

if (productObservations.length >= MIN_OBSERVATIONS_PER_PRODUCT) {
  // ✅ Exploitable pour Anti-Crisis Basket
  console.log('Produit exploitable:', productObservations);
} else {
  // 🟡 Données limitées
  console.log('Plus d\'observations nécessaires');
}
```

## 🎨 Personnalisation UI

### Classes Tailwind utilisées

Le module utilise Tailwind CSS pour un style cohérent:
- Boutons: `bg-blue-600`, `hover:bg-blue-700`
- Alertes: `bg-blue-50`, `border-l-4`, `border-blue-500`
- Formulaires: `border`, `rounded-md`, `focus:ring-2`

### Personnalisation des couleurs

```tsx
// Exemple: thème personnalisé
<ReceiptWorkflow
  territory="Martinique"
  onSubmit={handleSubmit}
  className="custom-theme" // Ajouter une classe personnalisée
/>
```

## 🧪 Tests

### Test manuel recommandé

1. Scanner un vrai ticket de caisse
2. Vérifier l'extraction OCR
3. Valider ligne par ligne
4. Confirmer l'enregistrement
5. Vérifier le localStorage

### Points de contrôle

- [ ] Caméra fonctionne (mobile)
- [ ] Sélection fichier fonctionne (desktop)
- [ ] OCR extrait du texte
- [ ] Validation manuelle requise
- [ ] Données enregistrées correctement
- [ ] Niveau de confiance correct

## 📝 Notes importantes

### Limitations OCR
- Qualité dépend de la photo (netteté, éclairage)
- Nécessite validation manuelle systématique
- Certains formats de tickets complexes

### Performances
- Première reconnaissance: ~5-10 secondes (chargement modèle)
- Reconnaissances suivantes: ~2-5 secondes
- Taille image impacte performance

### Stockage
- Images base64: ~1-2 MB par ticket
- localStorage limité (5-10 MB typique)
- Considérer nettoyage périodique

## 🚀 Prochaines étapes

1. Ajouter export JSON des observations
2. Implémenter synchronisation optionnelle
3. Améliorer détection automatique magasin
4. Ajouter templates pour tickets courants
5. Intégration avec API Anti-Crisis Basket

## 📄 Licence

Ce module fait partie du projet A KI PRI SA YÉ - Observatoire citoyen des prix.

**Principes:**
- Outil d'intérêt général
- Aucune incitation commerciale
- Données descriptives uniquement
- Transparence radicale

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2026-01-12  
**Statut:** ✅ Production-ready
