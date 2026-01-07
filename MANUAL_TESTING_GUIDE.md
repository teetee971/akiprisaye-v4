# Guide de Test Manuel - Fusion Scan-Comparateur + Améliorations Caméra

## 📋 Vue d'ensemble

Ce guide vous accompagne pour tester manuellement les nouvelles fonctionnalités implémentées dans le PR "Fusion module scan-comparateur + Améliorations caméra intelligentes".

## 🎯 Objectifs des Tests

1. Valider le **flux unifié de scan** fonctionne correctement
2. Vérifier les **améliorations caméra** sur appareils réels
3. Confirmer la **compatibilité** avec les flux existants
4. S'assurer de la **conformité RGPD** et des principes institutionnels

---

## 🧪 Tests Flux Unifié

### Test 1: Point d'Entrée Unique

**Route:** `/scanner-produit`

**Étapes:**
1. Accéder à `/scanner-produit`
2. Vérifier l'affichage de 3 options:
   - 📷 Code-barres (caméra)
   - 🖼️ Photo produit
   - 🧾 Ticket de caisse
3. Vérifier l'affichage du message institutionnel (observatoire citoyen)

**Résultat attendu:**
- Page s'affiche correctement
- 3 boutons visibles et cliquables
- Indicateur de progression visible (étape 1/3)
- Message RGPD affiché

---

### Test 2: Scan Code-Barres (EAN)

**Étapes:**
1. Depuis `/scanner-produit`, cliquer "Code-barres"
2. Vérifier redirection vers `/scan-ean?flow=unified`
3. Scanner un code-barres réel
4. Observer la redirection automatique vers le comparateur
5. Vérifier affichage du contexte scanné (source, EAN, confiance 95%)

**Produits de test:**
- Nutella 750g: `3017620422003`
- Coca-Cola 1.5L: `5449000000996`
- Pain de mie: `3228857000067`

**Résultat attendu:**
- Scan réussi en < 5 secondes
- Redirection automatique vers `/comparateur-intelligent?ean=XXX&source=ean&confidence=95`
- Badge "📱 Produit scanné" visible
- Source affichée: "Code-barres caméra"
- Confiance: 95% (vert)

---

### Test 3: Scan Photo Produit

**Étapes:**
1. Depuis `/scanner-produit`, cliquer "Photo produit"
2. Vérifier redirection vers `/scan-ean?flow=unified&mode=photo`
3. Uploader une photo d'un code-barres
4. Vérifier traitement OCR
5. Observer redirection vers comparateur si EAN détecté

**Résultat attendu:**
- Upload fonctionne
- Message "📝 Détection OCR en cours..." affiché
- Si EAN détecté: redirection avec `confidence=75`
- Si échec: suggestions produits ou message d'erreur clair
- Badge source: "Photo produit (OCR)"

---

### Test 4: Scan Ticket de Caisse

**Étapes:**
1. Depuis `/scanner-produit`, cliquer "Ticket de caisse"
2. Vérifier redirection vers `/scan?flow=unified`
3. Uploader une photo de ticket
4. Vérifier extraction OCR
5. Si prix détecté, vérifier affichage dans comparateur

**Résultat attendu:**
- Upload fonctionne
- OCR extrait texte du ticket
- Prix et enseigne détectés si lisibles
- Badge source: "Ticket de caisse (OCR)"
- Confiance: 60-80% (jaune/orange)
- Prix de référence affiché si disponible

---

## 📱 Tests Améliorations Caméra

### Test 5: Guide Visuel Intelligent

**Route:** `/scan-ean` ou via flux unifié

**Étapes:**
1. Démarrer la caméra
2. Observer l'indicateur de qualité en haut
3. Tester différentes conditions:
   - ☀️ Trop de lumière (pointer vers fenêtre)
   - 🌑 Trop sombre (cacher la caméra)
   - 📏 Trop proche (< 5cm)
   - 📐 Trop loin (> 30cm)
   - 🎯 Position parfaite (10-15cm, bon éclairage)
4. Observer les conseils contextuels affichés

**Résultat attendu:**
- Indicateur de qualité se met à jour (1-2s)
- Score affiché (0-100%)
- Couleur varie: 🔴 rouge (< 60%), 🟡 jaune (60-80%), 🟢 vert (80%+)
- Conseils pertinents selon situation:
  - "💡 Plus de lumière nécessaire"
  - "↔️ Rapprochez-vous de 10cm"
  - "✅ Position parfaite !"

---

### Test 6: Feedback Haptique et Audio

**Prérequis:** Autoriser vibrations et son

**Étapes:**
1. Scanner un code-barres
2. Observer/ressentir les feedbacks:
   - Au début du scan: vibration courte (50ms)
   - Quand détecté: double vibration + double beep
   - Si erreur: vibration longue + beep grave
3. Tester désactivation dans les paramètres
4. Vérifier que feedbacks s'arrêtent

**Résultat attendu:**
- **Détection**: Vibration courte + beep aigu (1000Hz)
- **Succès**: Double vibration + double beep ascendant (800Hz → 1200Hz)
- **Erreur**: Vibration longue + beep grave (400Hz)
- **Configuration**: Persistée dans localStorage
- **Désactivation**: Fonctionne immédiatement

---

### Test 7: Contrôles Flash/Torche

**Appareil requis:** Mobile avec flash

**Étapes:**
1. Démarrer caméra en environnement sombre
2. Cliquer bouton flash (éclair en bas à gauche)
3. Vérifier activation de la torche
4. Scanner un code-barres avec torche active
5. Désactiver la torche

**Résultat attendu:**
- Bouton flash visible et réactif
- Torche s'active immédiatement
- Bouton change d'apparence (jaune = actif)
- Scan possible avec torche
- Torche se désactive au clic
- Si non supporté: message "Flash non disponible"

---

### Test 8: Zoom Adaptatif

**Étapes:**
1. Démarrer caméra
2. Utiliser boutons +/- en bas pour zoomer
3. Tester valeurs: 1x, 1.5x, 2x, 2.5x, 3x
4. Scanner un code-barres petit avec zoom 2x
5. Revenir à 1x

**Résultat attendu:**
- Boutons +/- fonctionnels
- Niveau de zoom affiché (ex: "2.0x")
- Image zoom progressivement
- Scan possible à différents niveaux
- Limites respectées (min 1x, max selon appareil)

---

### Test 9: Changement de Caméra

**Appareil requis:** Mobile avec caméras avant + arrière

**Étapes:**
1. Démarrer caméra (arrière par défaut)
2. Cliquer bouton rotation (🔄 en bas à droite)
3. Vérifier passage à caméra avant
4. Cliquer à nouveau
5. Vérifier retour à caméra arrière

**Résultat attendu:**
- Changement instantané de caméra
- Video s'actualise correctement
- Pas de freeze ou crash
- Bouton toujours réactif

---

## 🔄 Tests Compatibilité Rétroactive

### Test 10: Routes Existantes Préservées

**Étapes:**
1. Accéder à `/scan-ean` directement (sans `?flow=unified`)
2. Utiliser la page normalement
3. Vérifier que tout fonctionne comme avant
4. Répéter pour `/scan` et `/comparateur-intelligent`

**Résultat attendu:**
- Pages s'affichent normalement
- Fonctionnalités intactes
- Pas de redirection non désirée
- UI identique à avant (pas de régression)

---

## 🔒 Tests Conformité RGPD

### Test 11: Aucune Donnée Serveur

**Étapes:**
1. Ouvrir DevTools → Network
2. Scanner un produit (flux complet)
3. Observer les requêtes réseau
4. Vérifier qu'aucune image n'est uploadée
5. Vérifier localStorage uniquement

**Résultat attendu:**
- Aucune requête POST d'image vers serveur
- Aucune donnée personnelle transmise
- Traitement 100% local (navigateur)
- localStorage: uniquement config utilisateur et historique local
- Aucune écriture dans Firebase (lecture seule)

---

### Test 12: Messages Limites/Fiabilité

**Étapes:**
1. Parcourir le flux unifié
2. Lire tous les messages affichés
3. Vérifier mentions explicites:
   - Limites OCR
   - Scores de confiance
   - Caractère informatif (non contractuel)
   - Observatoire citoyen

**Résultat attendu:**
- Chaque source affiche son niveau de fiabilité:
  - Code-barres: "95%+"
  - Photo: "75% (expérimental)"
  - Ticket: "60-80% (selon qualité)"
- Message "informatif et non contractuel" visible
- Aucune promesse de "temps réel exhaustif"
- Principe "observatoire citoyen" rappelé

---

## 📊 Matrice de Tests

| Test | iOS Safari | Android Chrome | Desktop Chrome | Desktop Firefox |
|------|------------|----------------|----------------|-----------------|
| 1. Point d'entrée | ⬜ | ⬜ | ⬜ | ⬜ |
| 2. Scan EAN | ⬜ | ⬜ | ⬜ | ⬜ |
| 3. Photo produit | ⬜ | ⬜ | ⬜ | ⬜ |
| 4. Ticket caisse | ⬜ | ⬜ | ⬜ | ⬜ |
| 5. Guide visuel | ⬜ | ⬜ | ⬜ | ⬜ |
| 6. Feedback | ⬜ | ⬜ | ⬜ | ⬜ |
| 7. Flash | ⬜ | ⬜ | N/A | N/A |
| 8. Zoom | ⬜ | ⬜ | ⬜ | ⬜ |
| 9. Rotation caméra | ⬜ | ⬜ | N/A | N/A |
| 10. Rétrocompat | ⬜ | ⬜ | ⬜ | ⬜ |
| 11. RGPD | ⬜ | ⬜ | ⬜ | ⬜ |
| 12. Messages | ⬜ | ⬜ | ⬜ | ⬜ |

**Légende:**
- ✅ Test passé
- ❌ Test échoué
- ⚠️ Problème mineur
- ⬜ Non testé
- N/A Non applicable

---

## 🐛 Rapport de Bugs

Si vous rencontrez un problème, notez:

1. **Environnement:**
   - Appareil: (ex: iPhone 13, Samsung S21)
   - OS: (ex: iOS 16.5, Android 13)
   - Navigateur: (ex: Safari 16, Chrome 110)

2. **Étape problématique:**
   - Numéro de test: (ex: Test 5)
   - Action effectuée: (ex: "Cliqué sur bouton zoom")

3. **Comportement observé:**
   - Description: (ex: "Zoom ne fonctionne pas")
   - Message d'erreur: (ex: "Erreur console: TypeError...")

4. **Comportement attendu:**
   - Ce qui devrait se passer: (ex: "Image devrait zoomer à 2x")

5. **Reproduction:**
   - Étapes pour reproduire: (liste numérotée)
   - Fréquence: (toujours / parfois / rare)

---

## 📸 Screenshots Recommandés

Pour valider visuellement, prendre des captures d'écran de:

1. Page `/scanner-produit` (choix des 3 méthodes)
2. Indicateur de qualité caméra (rouge, jaune, vert)
3. Badge "Produit scanné" dans comparateur
4. Message de conseils contextuels
5. Contrôles caméra (flash, zoom, rotation)

---

## ✅ Checklist Finale

Avant de valider le PR, vérifier:

- [ ] Tous les tests passent sur au moins 2 plateformes (iOS + Android)
- [ ] Aucune régression sur flux existants
- [ ] Feedbacks sensoriels fonctionnent
- [ ] Guide visuel pertinent et utile
- [ ] Messages RGPD/limites clairs
- [ ] Aucune donnée uploadée sur serveur
- [ ] Performance acceptable (scan < 5s)
- [ ] UI responsive et accessible
- [ ] Pas de crash ou freeze

---

## 📞 Contact

Pour toute question ou problème durant les tests:
- Créer une issue GitHub avec tag `test-manual`
- Joindre screenshots/videos si possible
- Référencer ce document (MANUAL_TESTING_GUIDE.md)

---

**Version:** 1.0.0  
**Date:** 2026-01-07  
**Auteur:** GitHub Copilot Agent  
**Statut:** Prêt pour tests manuels
