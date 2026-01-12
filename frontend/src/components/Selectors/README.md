# AdvancedSelectors Component

## 📋 Overview

React TypeScript component providing cascading **Territory → Store → Product** selection with strict legal neutrality. No comparisons, no rankings, descriptive display only.

## 🎯 Purpose

Enables fine-grained data exploration while maintaining:
- ✅ Cascading selection (parent → child relationship)
- ✅ No automatic comparisons between stores
- ✅ Descriptive data display only
- ✅ Legal neutrality throughout
- ✅ Mobile-first responsive design
- ✅ Transparent UX

## 📦 Installation

```typescript
import { AdvancedSelectors } from '@/components/Selectors';
import type { Dataset, Selection } from '@/components/Selectors';
```

## 🔧 Type Definitions

### Dataset Structure

```typescript
type Product = {
  id: string;
  label: string;
  observations: number;
  price_min: number;
  price_max: number;
};

type Store = {
  id: string;
  label: string;
  products: Product[];
};

type Territory = {
  code: string;
  label: string;
  stores: Store[];
};

type Dataset = {
  version: string;
  last_update: string;
  currency: string;
  territories: Territory[];
};
```

### Selection Output

```typescript
type Selection = {
  territory?: string;  // Territory code (e.g., 'GP')
  store?: string;      // Store ID (e.g., 'carrefour_gp')
  product?: string;    // Product ID (e.g., 'riz_1kg')
};
```

### Component Props

```typescript
type AdvancedSelectorsProps = {
  dataset: Dataset;
  onSelectionChange: (selection: Selection) => void;
  initialSelection?: Selection;
};
```

## 🔄 Cascading Logic

### Selection Order (Mandatory)

```
1. Territory (Always enabled)
   ↓
2. Store (Enabled when territory selected)
   ↓
3. Product (Enabled when store selected)
```

### Reset Behavior

- **Territory change** → Resets store AND product
- **Store change** → Resets product only
- **Product change** → No reset

## 💡 Usage Examples

### Basic Usage

```tsx
import { AdvancedSelectors } from '@/components/Selectors';

function MyComponent() {
  const [dataset, setDataset] = useState(null);
  const [selection, setSelection] = useState({});

  useEffect(() => {
    fetch('/data/prices-dataset.json')
      .then(res => res.json())
      .then(data => setDataset(data));
  }, []);

  if (!dataset) return <div>Loading...</div>;

  return (
    <AdvancedSelectors
      dataset={dataset}
      onSelectionChange={(newSelection) => {
        setSelection(newSelection);
        console.log('Selected:', newSelection);
      }}
    />
  );
}
```

### With Initial Selection

```tsx
<AdvancedSelectors
  dataset={dataset}
  onSelectionChange={handleChange}
  initialSelection={{
    territory: 'GP',
    store: 'carrefour_gp',
    product: 'riz_1kg'
  }}
/>
```

### Integration with Interpretation Generator

```tsx
const handleSelectionChange = async (selection: Selection) => {
  if (selection.territory && selection.store && selection.product) {
    // Find product details
    const territory = dataset.territories.find(t => t.code === selection.territory);
    const store = territory?.stores.find(s => s.id === selection.store);
    const product = store?.products.find(p => p.id === selection.product);

    if (product) {
      // Generate interpretation
      const result = await generateNeutralInterpretation({
        observationsUsed: product.observations,
        observationsMax: 100,
        territoriesCovered: 1,
        dispersionIndex: calculateDispersion(product),
        method: 'full'
      });

      console.log('Interpretation:', result.interpretation);
    }
  }
};
```

## 📊 Data Display Features

### Allowed Information
- ✅ Territory name
- ✅ Store name
- ✅ Product name
- ✅ Number of observations
- ✅ Price range (min–max)

### Prohibited Information
- ❌ Store rankings
- ❌ Price arrows (↑ ↓)
- ❌ Interpretative colors
- ❌ Automatic comparisons
- ❌ "Cheapest" or "Most expensive" labels

## 🎨 UI Components

### 1. Territory Selector
- Always enabled
- Simple dropdown
- Shows all available territories
- Resets dependent selections on change

### 2. Store Selector
- Disabled until territory selected
- Filtered by selected territory
- Unordered list
- Note: "Enseignes observées dans ce territoire"

### 3. Product Selector
- Disabled until store selected
- Filtered by selected store
- Shows observation count in label
- No price badges

### 4. Product Details Display
When product is selected, shows:
- Product name (large)
- Territory and store (side by side)
- Observation count (prominent)
- Price range (min — max)
- Contextual note

## ⚖️ Legal Compliance

### Automatic Disclaimers

The component includes:

1. **Main Legal Disclaimer** (always visible):
```
Les sélections permettent une consultation descriptive
des données observées. Aucune comparaison, classement
ou interprétation causale n'est effectuée entre enseignes.
```

2. **Product Details Note**:
```
Ces valeurs représentent l'intervalle des prix observés
pour ce produit dans cette enseigne et ce territoire.
Elles ne constituent pas une garantie de prix actuels
ni une comparaison avec d'autres enseignes.
```

3. **Usage Principle**:
```
L'ordre descendant (Territoire → Enseigne → Produit)
garantit une exploration cohérente des données sans
biais de présentation.
```

### Neutrality Features
- No comparative language
- No judgmental colors
- No store performance indicators
- No causal attribution
- Descriptive terminology only

## 📱 Mobile Optimization

- Single column layout on small screens
- Large touch-friendly selectors (py-3)
- Readable text sizes (text-base minimum)
- Optimized spacing for thumbs
- Responsive grid (2 cols on mobile for territory/store)

## 🔗 Integration Points

### With Backend Interpretation Module

```tsx
import { generateNeutralInterpretation } from '@/backend/analysis';

const handleSelection = async (selection: Selection) => {
  // Get product data
  const productData = getProductFromSelection(selection, dataset);
  
  // Generate interpretation
  const interpretation = generateNeutralInterpretation({
    observationsUsed: productData.observations,
    observationsMax: 200,
    territoriesCovered: 1,
    dispersionIndex: calculateDispersionIndex(
      [productData.price_min, productData.price_max]
    ),
    method: 'full'
  });

  // Display interpretation
  console.log(interpretation.interpretation);
};
```

### With Frontend Display Component

```tsx
<AdvancedSelectors
  dataset={dataset}
  onSelectionChange={(selection) => {
    // Pass to AnalyseStatistiqueNeutre
    setAnalysisData({
      signalLevel: calculateSignal(selection),
      interpretation: getInterpretation(selection),
      enseignesPresentes: getStoresInTerritory(selection.territory),
      observations: {
        used: getObservationCount(selection),
        max: getTotalPossibleObservations(),
        method: 'full'
      }
    });
  }}
/>
```

## 📈 Dataset Structure

### File Location
```
/public/data/prices-dataset.json
```

### Example Structure
```json
{
  "version": "1.0",
  "last_update": "2026-01-12",
  "currency": "EUR",
  "territories": [
    {
      "code": "GP",
      "label": "Guadeloupe",
      "stores": [
        {
          "id": "carrefour_gp",
          "label": "Carrefour",
          "products": [
            {
              "id": "riz_1kg",
              "label": "Riz long grain 1kg",
              "observations": 42,
              "price_min": 1.89,
              "price_max": 2.35
            }
          ]
        }
      ]
    }
  ]
}
```

## 🚨 Important Notes

### Data Integrity
- Dataset is read-only
- No client-side filtering or sorting
- Data reflects actual observations
- Price ranges are min/max from real data

### UX Principles
- Progressive disclosure
- Clear disabled states
- Helpful hints at each step
- No surprise resets (always documented)

### Legal Safety
- Component designed for public use
- Press-compatible presentation
- Institutional tone
- No defamation risk
- Audit-ready disclaimers

## 🧪 Testing

Create test file: `AdvancedSelectors.test.tsx`

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AdvancedSelectors from './AdvancedSelectors';

describe('AdvancedSelectors', () => {
  it('disables store selector until territory selected', () => {
    const { getByLabelText } = render(
      <AdvancedSelectors dataset={mockDataset} onSelectionChange={() => {}} />
    );
    
    const storeSelect = getByLabelText(/Enseigne/);
    expect(storeSelect).toBeDisabled();
  });

  it('resets store and product when territory changes', () => {
    // Test implementation
  });

  // More tests...
});
```

## 🔄 Version History

- **v1.0.0** (2026-01-12): Initial release with cascading selection

## 📚 Related Components

- **Backend**: `generateNeutralInterpretation.ts` - Interpretation generator
- **Frontend**: `AnalyseStatistiqueNeutre.tsx` - Display component
- **Data**: `prices-dataset.json` - Source data

## 🤝 Contributing

When modifying:
1. Maintain cascading logic
2. Keep legal disclaimers visible
3. Test on mobile and desktop
4. Validate neutrality
5. Update documentation

---

**Component:** `frontend/src/components/Selectors/AdvancedSelectors.tsx`  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2026-01-12
