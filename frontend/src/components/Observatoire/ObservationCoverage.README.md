# ObservationCoverage Component

## 📋 Overview

React TypeScript component for displaying observation volume coverage in a **neutral, legally-safe manner**. Shows data availability without value judgments, comparisons, or recommendations.

## 🎯 Purpose

Indicates the volume of observation data available for analysis:
- ✅ Descriptive terminology only
- ✅ No value judgments (no "good/bad", "sufficient/insufficient")
- ✅ No store comparisons
- ✅ Fixed, auditable thresholds
- ✅ Legal disclaimer included
- ✅ Neutral visual design (gray only)

## 📦 Installation

```typescript
import { ObservationCoverage } from '@/components/Observatoire';
import type { ObservationCoverageProps } from '@/components/Observatoire';
```

## 🔧 Type Definitions

### Component Props

```typescript
type ObservationCoverageProps = {
  used: number; // Observations actually used/available
  max: number;  // Maximum possible observations
};
```

### Observation Levels

```typescript
type ObservationLevel = 'minimal' | 'faible' | 'modéré' | 'fort' | 'maximal';
```

## 📊 Fixed Thresholds (Auditable)

```typescript
const OBSERVATION_THRESHOLDS = {
  minimal: 10,   // < 10 observations
  faible: 25,    // < 25 observations
  modere: 50,    // < 50 observations
  fort: 100,     // < 100 observations
  maximal: 150,  // ≥ 100 observations
};
```

### Level Calculation Logic

```typescript
function computeObservationLevel(count: number): ObservationLevel {
  if (count < 10) return 'minimal';
  if (count < 25) return 'faible';
  if (count < 50) return 'modéré';
  if (count < 100) return 'fort';
  return 'maximal';
}
```

✅ **Deterministic:** Same input always produces same output
✅ **Auditable:** Clear, documented thresholds
✅ **No hidden weighting:** Simple comparison logic

## 💡 Usage Examples

### Basic Usage

```tsx
import { ObservationCoverage } from '@/components/Observatoire';

function MyComponent() {
  return (
    <ObservationCoverage
      used={42}  // 42 observations available
      max={120}  // Out of 120 possible
    />
  );
}
```

### With AdvancedSelectors Integration

```tsx
import { AdvancedSelectors } from '@/components/Selectors';
import { ObservationCoverage } from '@/components/Observatoire';

function ProductAnalysis() {
  const [selection, setSelection] = useState({});
  const [productData, setProductData] = useState(null);

  const handleSelectionChange = (newSelection) => {
    setSelection(newSelection);
    // Fetch product data based on selection
    const product = getProductFromSelection(newSelection);
    setProductData(product);
  };

  return (
    <div>
      <AdvancedSelectors
        dataset={dataset}
        onSelectionChange={handleSelectionChange}
      />

      {productData && (
        <ObservationCoverage
          used={productData.observations}
          max={productData.maxPossible}
        />
      )}
    </div>
  );
}
```

### With Statistical Interpretation

```tsx
import { ObservationCoverage } from '@/components/Observatoire';
import { AnalyseStatistiqueNeutre } from '@/components/Observatoire';
import { generateNeutralInterpretation } from '@/backend/analysis';

function CompleteAnalysis() {
  const observationData = { used: 87, max: 150 };

  // Generate interpretation adjusted by coverage
  const interpretation = generateNeutralInterpretation({
    observationsUsed: observationData.used,
    observationsMax: observationData.max,
    territoriesCovered: 2,
    dispersionIndex: 45,
    method: 'full'
  });

  return (
    <div className="space-y-6">
      {/* Show coverage first */}
      <ObservationCoverage
        used={observationData.used}
        max={observationData.max}
      />

      {/* Then show interpretation */}
      <AnalyseStatistiqueNeutre
        signalLevel={interpretation.signalLevel}
        interpretation={interpretation.interpretation}
        enseignesPresentes={['Carrefour', 'Leader Price']}
        observations={{
          used: observationData.used,
          max: observationData.max,
          method: 'full'
        }}
      />
    </div>
  );
}
```

## 🎨 Visual Design

### Display Elements

1. **Observation Counts** (large, centered)
   ```
   42 / 120
   observations disponibles
   ```

2. **Coverage Level Badge** (neutral gray)
   ```
   Niveau de couverture: Modéré
   ```

3. **Progress Bar** (neutral gray, no colors)
   ```
   [████████████░░░░░░░░] 35.0%
   ```

4. **Threshold Reference** (blue info box)
   ```
   Seuils de référence: Minimal (<10), Faible (<25),
   Modéré (<50), Fort (<100), Maximal (≥100)
   ```

### Color Scheme (Neutral Only)

- **Progress bar:** Gray-600 (no green/red)
- **Badge:** Gray-100 with gray-800 text
- **Background:** Gray-50 for data areas
- **Legal box:** Yellow-50 (warning, not judgment)

## ⚖️ Legal Compliance

### Automatic Disclaimers

**Main Disclaimer** (always visible):
```
Le niveau de couverture indique uniquement le volume
de données observées disponibles. Il ne constitue ni
une évaluation des prix, ni une comparaison entre
enseignes, ni un jugement sur la qualité ou la
représentativité des données.
```

**Methodological Note**:
```
Les seuils utilisés (10, 25, 50, 100, 150) sont fixes,
déterministes et auditables. Ils servent uniquement à
qualifier le volume de données, sans aucune pondération
cachée ni calcul interprétatif.
```

### Approved Terminology

✅ **Allowed:**
- couverture
- volume d'observations
- niveau descriptif
- données disponibles
- minimal, faible, modéré, fort, maximal

❌ **Prohibited:**
- fiable / non fiable
- bon / mauvais
- suffisant / insuffisant
- représentatif / non représentatif
- recommandé / non recommandé

## 📱 Mobile Optimization

- Large, readable numbers (text-4xl)
- Touch-friendly spacing
- Stacked layout on mobile
- Readable minimum text size (text-xs)
- Clear visual hierarchy

## 🔗 Integration Points

### Backend Connection

```typescript
// Fetch real-time observation counts
const response = await fetch('/api/v1/observations/coverage', {
  method: 'POST',
  body: JSON.stringify({
    territory: 'GP',
    store: 'carrefour_gp',
    product: 'riz_1kg'
  })
});

const data = await response.json();

// Display coverage
<ObservationCoverage
  used={data.observations_used}
  max={data.observations_max}
/>
```

### With Interpretation Adjustment

```typescript
import { computeObservationLevel } from '@/utils/observationThresholds';

// Adjust interpretation based on coverage
const level = computeObservationLevel(observationsUsed);

const interpretationNote = {
  minimal: "Volume très limité de données. Interprétation à considérer avec prudence.",
  faible: "Volume limité. Tendances préliminaires uniquement.",
  modéré: "Volume intermédiaire. Analyse descriptive possible.",
  fort: "Volume important. Analyse détaillée possible.",
  maximal: "Volume très important. Données robustes disponibles."
}[level];
```

## 🚨 Important Notes

### What This Component Shows

- ✅ Volume of observations (count)
- ✅ Coverage percentage (used/max)
- ✅ Descriptive level (minimal to maximal)
- ✅ Fixed thresholds for transparency

### What This Component Does NOT Show

- ❌ Quality assessment
- ❌ Data reliability score
- ❌ Store comparison
- ❌ Recommendations
- ❌ Price evaluation

### Usage Guidelines

1. **Always include legal disclaimer** (automatic)
2. **Never add interpretative colors** (keep gray)
3. **Do not compare between stores** using coverage
4. **Use for context only**, not as quality metric
5. **Explain thresholds** if asked (they're documented)

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react';
import ObservationCoverage from './ObservationCoverage';

describe('ObservationCoverage', () => {
  it('displays observation counts correctly', () => {
    render(<ObservationCoverage used={42} max={120} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('shows correct level for moderate coverage', () => {
    render(<ObservationCoverage used={42} max={120} />);
    expect(screen.getByText('Modéré')).toBeInTheDocument();
  });

  it('includes legal disclaimer', () => {
    render(<ObservationCoverage used={42} max={120} />);
    expect(screen.getByText(/niveau de couverture indique uniquement/i))
      .toBeInTheDocument();
  });
});
```

## 🔄 Version History

- **v1.0.0** (2026-01-12): Initial release with fixed thresholds

## 📚 Related Components

- **AdvancedSelectors** - For product selection
- **AnalyseStatistiqueNeutre** - For statistical interpretation
- **generateNeutralInterpretation** - Backend analysis module

## 🤝 Contributing

When modifying:
1. Maintain neutral terminology
2. Keep gray color scheme
3. Preserve legal disclaimers
4. Document any threshold changes
5. Update tests

---

**Component:** `frontend/src/components/Observatoire/ObservationCoverage.tsx`  
**Utilities:** `frontend/src/utils/observationThresholds.ts`  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2026-01-12
