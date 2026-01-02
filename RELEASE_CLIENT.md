# 🚀 RELEASE CLIENT – A KI PRI SA YÉ

## Objectif
Mettre en production une version **fonctionnelle, crédible et utilisable immédiatement par les clients**, sans refonte lourde.

- Cible : utilisateurs finaux (citoyens, associations, institutions)
- Plateforme : Web mobile-first (Cloudflare Pages)
- Priorité : UX claire, zéro confusion, zéro “fonction cassée”

---

## ✅ STATUT GLOBAL
- [ ] Release client prête
- [ ] Tests mobiles validés
- [ ] Communication publique possible

---

## 1️⃣ HOME — CLARTÉ & CRÉDIBILITÉ

### Actions
- [ ] Supprimer toute mention **VERSION TEST**
- [ ] Message clair sur l’utilité du service

### Code (Home.tsx)
```tsx
<p className="text-gray-300 text-center mt-2">
  Comparez les prix réels dans les DOM-COM et suivez l’évolution des produits du quotidien.
</p>
```

## 2️⃣ COMPARATEUR — FONCTION CŒUR
### Vérifications
- [ ] Recherche par nom produit fonctionnelle
- [ ] Recherche par code EAN fonctionnelle
- [ ] Sélecteur territoire visible (ex : Guadeloupe)
- [ ] Bouton “Comparer les prix” actif
**Objectif : valeur immédiate pour l’utilisateur**

## 3️⃣ LISTE DE COURSES — FEEDBACK UTILISATEUR
### Actions
- [ ] Confirmation visuelle après ajout produit

### Code (ListeCourses.tsx)
```tsx
toast.success("Produit ajouté à la liste !");
```

### Dépendance
```bash
npm i react-hot-toast
```

### main.tsx
```tsx
import { Toaster } from "react-hot-toast";

<>
  <App />
  <Toaster position="bottom-center" />
</>
```

## 4️⃣ SCAN OCR — ÉVITER TOUTE CONFUSION
### Règle
⚠️ Aucune fonctionnalité ne doit sembler cassée

### UI recommandée (ScanOCR.tsx)
```tsx
<section className="p-4 text-center">
  <h2>📸 Scan OCR du ticket</h2>
  <p className="text-sm opacity-80 mt-2">
    Fonction en cours de déploiement — disponible prochainement.
  </p>
  <button disabled className="mt-4 bg-gray-500/30 rounded-xl p-2 text-gray-300 cursor-not-allowed">
    OCR non actif
  </button>
</section>
```

## 5️⃣ TARIFS — SÉCURITÉ JURIDIQUE
### Règle
Aucun paiement actif sans backend + CGV validées.

### Texte obligatoire (Pricing.tsx)
```tsx
<p className="text-xs text-gray-400 mt-2">
  Paiement non activé — inscription sur demande.
</p>
```

## 6️⃣ MENU MOBILE — PARCOURS CLIENT
### Ordre recommandé
1. Accueil
2. Comparateur
3. Liste de courses
4. Carte
5. Actualités
6. Cosmétiques
7. Tarifs
8. Contact
**Objectif : ce que l’utilisateur cherche en premier**

## 7️⃣ CONTACT — CONFIANCE MINIMALE
### Texte recommandé
```tsx
<p className="text-center text-gray-400 mt-6">
  Pour toute question ou partenariat :
  <a href="mailto:contact@akiprisaye.fr" className="text-blue-400 underline">
    contact@akiprisaye.fr
  </a>
</p>
```

## 8️⃣ ROUTAGE SPA — CLOUDFARE PAGES
### Fichier obligatoire
`frontend/public/_redirects`
```txt
/* /index.html 200
```

## 9️⃣ FOOTER — COHÉRENCE LÉGALE
### Texte final
```tsx
© 2026 A KI PRI SA YÉ — Transparence des prix Outre-mer.
<a href="/mentions-legales" className="underline ml-2">Mentions légales</a>
```

## 🔟 CHECKLIST AVANT DÉPLOIEMENT
- [ ] Build Vite OK
- [ ] Aucun écran vide
- [ ] Aucun bouton “mort”
- [ ] Texte compréhensible sans explication
- [ ] Mobile Android testé

## 🚀 DÉPLOIEMENT
```bash
git add .
git commit -m "feat: release client fonctionnelle"
git push origin main
```
Cloudflare Pages déploie automatiquement.

## 📱 TESTS À FAIRE SUR TÉLÉPHONE
| Page | Résultat attendu |
|---|---|
| Accueil | Compréhension immédiate |
| Comparateur | Résultats visibles |
| Liste de courses | Confirmation ajout |
| Scan OCR | Message clair |
| Tarifs | Pas de confusion |
| Menu | Navigation fluide |

## ✅ STATUT FINAL
Quand tout est coché :
✔️ Version montrable au public
✔️ Clients peuvent utiliser
✔️ Aucun risque juridique
✔️ Base saine pour évolutions futures
