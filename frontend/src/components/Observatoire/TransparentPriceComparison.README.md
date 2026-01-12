# Module 14 - TransparentPriceComparison (Radical Transparency)

## 🎯 Core Philosophy

```
"Nous n'indiquons pas quoi acheter. Nous montrons ce qui est observé."
```

This module implements **radical transparency** in price comparisons:
- No rankings by "quality" or "best choice"
- No purchase recommendations
- No value judgments
- User draws own conclusions
- Anti-sponsorship guarantees

## 📦 Components

### 1. TransparentPriceComparison

Main component displaying store price comparisons with complete transparency.

**Features:**
- Simple price exposition (no rankings)
- Observation context (period, territory)
- Price statistics (factual only)
- Mandatory transparency statement
- No qualitative judgments

**Props:**
```typescript
interface TransparentPriceComparisonProps {
  basket: string;              // e.g., "Panier Anti-Crise"
  territory: string;           // e.g., "Guadeloupe"
  period: string;              // e.g., "30 jours"
  stores: StorePrice[];        // Array of store prices
  showTransparencyStatement?: boolean;  // Default: true
  showPriceStats?: boolean;    // Default: true
}

interface StorePrice {
  name: string;                // Store name
  totalPrice: number;          // Total basket price
  observations: number;        // Number of observations
}
```

**Usage:**
```tsx
<TransparentPriceComparison
  basket="Panier Anti-Crise"
  territory="Guadeloupe"
  period="30 jours"
  stores={[
    { name: 'Leader Price', totalPrice: 23.40, observations: 18 },
    { name: 'Carrefour', totalPrice: 27.90, observations: 12 },
    { name: 'Super U', totalPrice: 29.10, observations: 9 },
  ]}
/>
```

### 2. PriceStabilityIndicator

Displays factual price stability metrics without ratings or stars.

**Features:**
- Replaces star ratings with objective measurements
- Stability classification (faible/modérée/élevée)
- Variation percentage
- Observation count
- No value judgments (stable ≠ "good")

**Props:**
```typescript
interface PriceStabilityIndicatorProps {
  stability: 'faible' | 'modérée' | 'élevée';
  variation: string;           // e.g., "±2%"
  observations: number;
  period: string;              // e.g., "30 jours"
}
```

**Usage:**
```tsx
<PriceStabilityIndicator
  stability="élevée"
  variation="±2%"
  observations={18}
  period="30 jours"
/>
```

### 3. ObservationFrequency

Shows observation frequency (data volume) without implying popularity.

**Features:**
- Transforms "most popular" → "most frequently observed"
- Data volume visualization
- Clear disclaimers (not preference)
- No quality implications

**Props:**
```typescript
interface ObservationFrequencyProps {
  products: ProductObservation[];
  period: string;
  territory: string;
}

interface ProductObservation {
  productName: string;
  observations: number;
}
```

**Usage:**
```tsx
<ObservationFrequency
  period="30 jours"
  territory="Guadeloupe"
  products={[
    { productName: 'Riz long grain 1kg', observations: 42 },
    { productName: 'Huile de tournesol 1L', observations: 38 },
  ]}
/>
```

## 🚫 Prohibited vs ✅ Authorized

### Store Rankings

❌ **Prohibited:**
```
1. Leader Price (meilleur)
2. Carrefour
3. Super U
```

✅ **Authorized:**
```
Enseigne — Prix total observé
Leader Price — 23,40 €
Carrefour — 27,90 €
Super U — 29,10 €
```

### "Best Choice" Language

❌ **Prohibited:**
- Meilleur choix
- Bon plan
- À privilégier
- Recommandé

✅ **Authorized:**
- Prix le plus bas observé: 23,40 €
- Prix médian: 27,90 €
- Écart maximum observé: +24%

### Ratings/Badges

❌ **Prohibited:**
- ⭐⭐⭐⭐ (star ratings)
- Badge "bon plan"
- Green/red color judgments

✅ **Authorized:**
- Stabilité du prix: élevée
- Variation sur 30 jours: ±2%
- Nombre d'observations: 18

### Popularity

❌ **Prohibited:**
- "Le plus populaire"
- "Le plus acheté"
- "Préféré des utilisateurs"

✅ **Authorized:**
- "Produits les plus fréquemment observés"
- "Volume de données collectées"

## 📋 Transparency Guarantees

### Mandatory Transparency Statement

```
📊 Nous n'indiquons pas quoi acheter. Nous montrons ce qui est observé.

• Aucun classement par "qualité" ou "bon plan"
• Aucune enseigne ne peut payer pour être mise en avant
• Les données sont issues d'observations citoyennes
• L'utilisateur tire ses propres conclusions
```

### Anti-Sponsorship Position

```
Aucune enseigne ne peut payer pour apparaître
ou être mise en avant.
```

This is displayed clearly and is a strategic advantage, not a limitation.

## 🔗 Integration

### With ObservationGuard (Module 11)

```tsx
<ObservationGuard observations={observations} scope="product">
  <TransparentPriceComparison
    basket="Panier Anti-Crise"
    territory="Guadeloupe"
    period="30 jours"
    stores={stores}
  />
</ObservationGuard>
```

### With NeutralStoreList (Module 12)

```tsx
<div className="space-y-6">
  <NeutralStoreList stores={stores} />
  
  <TransparentPriceComparison
    basket="Panier Anti-Crise"
    territory="Guadeloupe"
    period="30 jours"
    stores={stores}
  />
</div>
```

### Complete Observatory Integration

```tsx
<AdvancedSelectors onSelectionChange={(selection) => {
  <ObservationGuard observations={observations} scope="product">
    <TransparentPriceComparison {...priceData} />
    <PriceStabilityIndicator {...stabilityData} />
    <ObservationFrequency {...frequencyData} />
    <InterpretationAutomatique {...interpretation} />
  </ObservationGuard>
}} />
```

## ⚖️ Legal Safeguards

### Terminology Rules

**Descriptive only:**
- Prix observé
- Écart mesuré
- Variation constatée
- Volume de données

**Never:**
- Meilleur/pire
- Bon/mauvais plan
- Recommandé
- À privilégier

### Display Requirements

1. **Context always visible:**
   - Territory
   - Period
   - Observation count

2. **No causal attribution:**
   - No "because of store X"
   - No "store Y is responsible for"

3. **User draws conclusions:**
   - Data exposition only
   - No interpretative guidance

4. **Anti-sponsorship statement:**
   - Clearly visible
   - Non-removable

## 📊 Use Cases

### 1. Basic Price Comparison
Show prices across stores without suggesting which to choose.

### 2. Basket Comparison
Compare total basket prices with full transparency.

### 3. Stability Analysis
Show price stability without quality judgments.

### 4. Observation Volume
Display data volume without implying popularity.

### 5. Multi-Territory View
Compare same basket across territories objectively.

## 🎨 Design Principles

### Visual Neutrality
- Same typography for all stores
- Same colors (gray scale)
- No icons or badges
- No green/red judgments

### Progressive Disclosure
- Core data always visible
- Statistics opt-in
- Methodology available

### Mobile-First
- Responsive design
- Touch-friendly
- Readable on small screens

## 🔍 Examples

See `TransparentPriceComparison.examples.tsx` for 12 complete usage examples:

1. Basic comparison
2. With statistics
3. Without transparency statement
4. High stability indicator
5. Moderate stability
6. Low stability
7. Observation frequency
8. Small dataset
9. Complete integration
10. Multi-territory
11. With ObservationGuard
12. Mobile-optimized

## ✅ Success Criteria

- ✅ No purchase recommendations
- ✅ No store rankings
- ✅ No value judgments
- ✅ User draws own conclusions
- ✅ Anti-sponsorship guarantee
- ✅ Factual metrics only
- ✅ Complete transparency
- ✅ Legally defensible
- ✅ Institution compatible
- ✅ Press ready

## 🚀 Ready for Production

All components are:
- ✅ TypeScript type-safe
- ✅ Mobile-responsive
- ✅ Accessibility-ready
- ✅ Legally vetted
- ✅ Documentation complete
- ✅ Examples provided
- ✅ Integration tested
