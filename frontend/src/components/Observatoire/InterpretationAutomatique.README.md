# InterpretationAutomatique Component

## 📋 Overview

React TypeScript component that generates **automatic neutral interpretation** based ONLY on observation volume. Uses fixed, pre-validated texts with no dynamic generation or value judgments.

## 🎯 Purpose

Provides context about data volume without:
- ❌ Price evaluation
- ❌ Store comparisons
- ❌ Value judgments
- ❌ Recommendations
- ❌ Causal attribution

Explains **what data is available**, not what it means.

## 📦 Installation

```typescript
import { InterpretationAutomatique } from '@/components/Observatoire';
import { computeObservationLevel } from '@/utils/observationThresholds';
```

## 🔧 Type Definitions

### Component Props

```typescript
type InterpretationAutomatiqueProps = {
  level: 'minimal' | 'faible' | 'modéré' | 'fort' | 'maximal';
  used: number;       // Observations used
  max: number;        // Maximum possible
  scopeLabel: string; // Context: "produit", "magasin", "territoire"
};
```

## 📝 Fixed Interpretation Texts

### Text Table (Pre-validated, Auditable)

| Level | Text |
|-------|------|
| **Minimal** | Les données actuellement disponibles sont peu nombreuses. Elles permettent une observation ponctuelle mais ne couvrent pas l'ensemble des situations possibles. |
| **Faible** | Les données disponibles offrent une première vision descriptive. Le volume observé reste partiel et peut évoluer avec de nouveaux relevés. |
| **Modéré** | Le volume de données permet une lecture descriptive plus structurée. Les observations couvrent une diversité raisonnable de situations. |
| **Fort** | Les données observées sont nombreuses et couvrent une large partie des situations recensées sur la période analysée. |
| **Maximal** | Le volume d'observations atteint un niveau élevé. Les données couvrent une très grande diversité de situations observées. |

✅ **No dynamic conditions**
✅ **No subjective vocabulary**
✅ **No conclusions**
✅ **100% deterministic**

## 💡 Usage Examples

### Basic Usage

```tsx
import { InterpretationAutomatique } from '@/components/Observatoire';

function MyComponent() {
  return (
    <InterpretationAutomatique
      level="modéré"
      used={42}
      max={120}
      scopeLabel="produit"
    />
  );
}
```

### With Automatic Level Computation

```tsx
import { InterpretationAutomatique } from '@/components/Observatoire';
import { computeObservationLevel } from '@/utils/observationThresholds';

function AutomaticInterpretation({ observationCount }: { observationCount: number }) {
  // Compute level based on count
  const level = computeObservationLevel(observationCount);

  return (
    <InterpretationAutomatique
      level={level}
      used={observationCount}
      max={150}
      scopeLabel="produit"
    />
  );
}
```

### Complete Integration Chain

```tsx
import { ObservationCoverage, InterpretationAutomatique } from '@/components/Observatoire';
import { computeObservationLevel } from '@/utils/observationThresholds';

function CompleteAnalysis() {
  const observationData = {
    used: 42,
    max: 120,
  };

  const level = computeObservationLevel(observationData.used);

  return (
    <div className="space-y-6">
      {/* 1. Show observation coverage */}
      <ObservationCoverage
        used={observationData.used}
        max={observationData.max}
      />

      {/* 2. Show automatic interpretation */}
      <InterpretationAutomatique
        level={level}
        used={observationData.used}
        max={observationData.max}
        scopeLabel="produit"
      />
    </div>
  );
}
```

### With AdvancedSelectors

```tsx
import { AdvancedSelectors } from '@/components/Selectors';
import { InterpretationAutomatique } from '@/components/Observatoire';
import { computeObservationLevel } from '@/utils/observationThresholds';

function ProductAnalysis() {
  const [productData, setProductData] = useState(null);

  const handleSelectionChange = (selection) => {
    const product = getProductFromSelection(selection);
    setProductData(product);
  };

  if (!productData) return null;

  const level = computeObservationLevel(productData.observations);

  return (
    <div className="space-y-6">
      <AdvancedSelectors
        dataset={dataset}
        onSelectionChange={handleSelectionChange}
      />

      <InterpretationAutomatique
        level={level}
        used={productData.observations}
        max={productData.maxPossible}
        scopeLabel="produit"
      />
    </div>
  );
}
```

## 🎨 UI Structure

### Display Elements

1. **Section Header**: "📖 Lecture des données observées"
2. **Interpretation Text** (blue background): Fixed text for level
3. **Context Information** (gray background): Count and scope
4. **Legal Disclaimer** (yellow box): Mandatory warning
5. **Methodology Note** (gray box): Deterministic explanation

### Visual Design

- **Main text**: Blue-50 background with blue-900 text
- **Context**: Gray-50 background with gray-700 text
- **Legal**: Yellow-50 with yellow-900 text
- **Method**: Gray-50 with gray-700 text

## ⚖️ Legal Compliance

### Automatic Disclaimers

**Legal Warning** (always visible):
```
Ce texte est informatif. Il ne constitue ni une analyse
économique, ni une recommandation, ni une comparaison
entre enseignes.
```

**Methodology Note**:
```
L'interprétation est strictement déterministe. Chaque
niveau de couverture correspond à un texte fixe,
pré-validé et auditable. Aucune génération dynamique
ou calcul interprétatif n'est effectué.
```

### Approved Terminology

✅ **Allowed:**
- données disponibles
- volume observé
- lecture descriptive
- couverture
- situations observées
- diversité

❌ **Strictly Prohibited:**
- fiable / non fiable
- prix élevés / bas
- meilleure enseigne
- suffisant pour conclure
- recommandé / déconseillé
- causalité (any form)

## 🔒 Text Validation

### Built-in Neutrality Check

```typescript
import { validateInterpretationNeutrality } from '@/utils/interpretationTexts';

const text = "Les données disponibles...";
const isNeutral = validateInterpretationNeutrality(text);
// Returns: true if no prohibited terms found
```

### Prohibited Terms List

The validation function checks for:
- fiable / non fiable
- prix élevés / prix bas
- meilleure enseigne
- suffisant pour conclure
- recommandé / déconseillé
- bon / mauvais
- anormal / suspect

## 📱 Mobile Optimization

- Clean, readable text layout
- Touch-friendly spacing
- Responsive boxes
- Minimum text-xs for small print
- Clear visual hierarchy

## 🔗 Integration Points

### With ObservationCoverage

```tsx
// Show coverage first, then interpretation
<ObservationCoverage used={42} max={120} />
<InterpretationAutomatique level="modéré" used={42} max={120} scopeLabel="produit" />
```

### With Backend Module

```tsx
// Use backend interpretation for more complex analysis
import { generateNeutralInterpretation } from '@/backend/analysis';

const backendInterpretation = generateNeutralInterpretation({
  observationsUsed: 42,
  observationsMax: 120,
  territoriesCovered: 1,
  dispersionIndex: 25,
  method: 'full'
});

// Then use frontend component for display
<InterpretationAutomatique
  level={computeObservationLevel(42)}
  used={42}
  max={120}
  scopeLabel="produit"
/>
```

### With AnalyseStatistiqueNeutre

```tsx
// Complete analysis display
<ObservationCoverage used={42} max={120} />
<InterpretationAutomatique level="modéré" used={42} max={120} scopeLabel="produit" />
<AnalyseStatistiqueNeutre
  signalLevel={75}
  interpretation="..."
  enseignesPresentes={['Carrefour', 'Leader Price']}
  observations={{ used: 42, max: 120, method: 'full' }}
/>
```

## 🚨 Important Notes

### What This Component Does

- ✅ Describes data volume context
- ✅ Uses fixed, pre-validated texts
- ✅ 100% deterministic output
- ✅ Audit-ready and transparent

### What This Component Does NOT Do

- ❌ Evaluate prices
- ❌ Compare stores
- ❌ Make recommendations
- ❌ Generate dynamic text
- ❌ Assess data quality

### Text Modification Rules

1. **Never modify texts without legal review**
2. **All changes must pass neutrality validation**
3. **Document any text updates in CHANGELOG**
4. **Re-run validation after changes**
5. **Update tests for new texts**

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react';
import InterpretationAutomatique from './InterpretationAutomatique';

describe('InterpretationAutomatique', () => {
  it('displays correct text for moderate level', () => {
    render(
      <InterpretationAutomatique
        level="modéré"
        used={42}
        max={120}
        scopeLabel="produit"
      />
    );
    
    expect(screen.getByText(/volume de données permet une lecture/i))
      .toBeInTheDocument();
  });

  it('includes legal disclaimer', () => {
    render(
      <InterpretationAutomatique
        level="modéré"
        used={42}
        max={120}
        scopeLabel="produit"
      />
    );
    
    expect(screen.getByText(/Ce texte est informatif/i))
      .toBeInTheDocument();
  });

  it('shows observation counts in context', () => {
    render(
      <InterpretationAutomatique
        level="modéré"
        used={42}
        max={120}
        scopeLabel="produit"
      />
    );
    
    expect(screen.getByText(/42 sur 120/)).toBeInTheDocument();
  });
});
```

## 🔄 Version History

- **v1.0.0** (2026-01-12): Initial release with 5 fixed texts

## 📚 Related Components

- **ObservationCoverage** - Shows volume coverage
- **AnalyseStatistiqueNeutre** - Full statistical analysis
- **AdvancedSelectors** - Product/store selection
- **generateNeutralInterpretation** (Backend) - Complex interpretation

## 🤝 Contributing

When modifying:
1. Never change texts without legal review
2. Validate neutrality of any new texts
3. Keep 100% deterministic logic
4. Update documentation
5. Add tests for changes

---

**Component:** `frontend/src/components/Observatoire/InterpretationAutomatique.tsx`  
**Utilities:** `frontend/src/utils/interpretationTexts.ts`  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2026-01-12
