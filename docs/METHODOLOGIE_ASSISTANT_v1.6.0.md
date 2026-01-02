# Méthodologie Assistant - A KI PRI SA YÉ v1.6.0

## Vue d'ensemble

L'assistant intelligent A KI PRI SA YÉ est un chatbot en lecture seule conçu pour répondre aux questions des utilisateurs en se basant uniquement sur des sources vérifiables : FAQ, méthodologies et données publiques observées.

## Principes Fondamentaux

### 1. Lecture Seule
L'assistant ne fournit **AUCUN** :
- Conseil d'achat
- Recommandation de fournisseur
- Conseil médical
- Conseil financier
- Conseil juridique
- Notation ou score propriétaire

### 2. Sources Vérifiables
Toutes les réponses incluent :
- Les sources utilisées (FAQ, méthodologie, données officielles)
- Des références aux documents officiels
- Des suggestions de FAQ liées

### 3. Transparence Totale
- Chaque réponse cite ses sources
- Les limitations sont clairement indiquées
- Les disclaimers sont affichés quand nécessaire

## Architecture

### Sources de Données

1. **FAQ Étendue** (`src/data/faq.ts`)
   - 20 questions/réponses
   - Catégorisées par thème
   - Searchable par mots-clés

2. **Méthodologies Officielles**
   - Documents de référence
   - Standards INSEE / Eurostat
   - Chartes de transparence

3. **Données Publiques Observées**
   - INSEE
   - OPMR
   - DGCCRF
   - data.gouv.fr

### Analyse des Intentions

L'assistant analyse la question pour déterminer :
- **Catégorie** : général, pricing, data, technical, institutional
- **Mots-clés** : extraction des termes pertinents
- **FAQ liées** : jusqu'à 3 questions similaires

### Génération de Réponse

1. **Recherche dans la FAQ**
   - Matching par question, réponse et tags
   - Score de pertinence
   - Top 3 résultats

2. **Réponse structurée**
   - Message principal
   - Sources citées
   - FAQ liées
   - Disclaimer si nécessaire

3. **Disclaimers automatiques**
   - Détection de sujets sensibles (santé, finances, juridique)
   - Affichage d'avertissement approprié
   - Redirection vers professionnels qualifiés

## Feature Flags

### Variables d'environnement

```env
VITE_FEATURE_ASSISTANT=true    # Active l'assistant
VITE_FEATURE_FAQ=true          # Active la page FAQ
```

### Activation par Défaut
- **Development** : Activé (pour tests)
- **Production** : Désactivé jusqu'à validation complète

## Interface Utilisateur

### Bouton Flottant
- Position : Bottom-right (mobile-first)
- Icône : 💬 (fermé) / ✕ (ouvert)
- Animation : Pulse subtil pour attirer l'attention
- Responsive : S'adapte à toutes les tailles d'écran

### Fenêtre de Chat
- Taille : 400px × 600px (max)
- Position : Flottante en bas à droite
- Responsive : Pleine largeur sur mobile
- Design : GlassCard avec backdrop blur

### Messages
- **Utilisateur** : Bleu, aligné à droite
- **Assistant** : Gris foncé, aligné à gauche
- **Sources** : Affichées en bas de chaque réponse
- **FAQ liées** : Compteur discret

### Suggestions Rapides
Affichées au démarrage :
- "Quels sont les tarifs ?"
- "D'où viennent les données ?"
- "Comment fonctionne le service ?"

## Sécurité

### Contenu Prohibé
Détection automatique de :
- hack, exploit, crack
- pirate, illegal, fraude
- Tout contenu malveillant

### Limitations
- Pas de stockage des conversations
- Pas de données personnelles traitées
- Pas de tracking utilisateur

## Performance

### Optimisations
- Recherche locale (pas d'API externe)
- Réponse instantanée (<1s)
- Cache des résultats fréquents
- Lazy loading du composant

### Scalabilité
- FAQ extensible sans limite
- Ajout de nouvelles catégories simple
- Multilangue-ready (structure préparée)

## Accessibilité

- **Clavier** : Navigation complète au clavier
- **Screen readers** : ARIA labels complets
- **Contraste** : WCAG AA compliant
- **Taille de texte** : Responsive et zoomable

## Métriques (Non-Tracking)

### Indicateurs Internes
- Nombre de questions posées (agrégé)
- Catégories les plus sollicitées
- Questions sans réponse satisfaisante

**Note** : Aucune donnée personnelle n'est collectée.

## Améliorations Futures

### v1.7.0 (Prévu)
- Suggestions contextuelles intelligentes
- Historique de conversation (local seulement)
- Export de conversation (privacy-first)

### v2.0.0 (En étude)
- Multilangue (Créole, Anglais)
- Intégration vocale (optionnelle)
- Mode hors-ligne

## Maintenance

### Mise à Jour de la FAQ
1. Éditer `src/data/faq.ts`
2. Ajouter la nouvelle question avec son ID unique
3. Catégoriser correctement
4. Ajouter des tags pertinents
5. Tester la recherche

### Mise à Jour des Réponses
- Modifier l'answer de la FAQ
- Vérifier les sources citées
- Tester avec l'assistant

## Support

Pour signaler un problème avec l'assistant :
1. Indiquer la question posée
2. Décrire la réponse reçue
3. Préciser la réponse attendue
4. Joindre une capture d'écran si possible

---

**Version** : 1.6.0  
**Date** : 2 janvier 2026  
**Auteur** : Équipe A KI PRI SA YÉ  
**Statut** : Production-ready
