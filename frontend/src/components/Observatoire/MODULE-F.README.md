# Module F - Territory Ranking System

## Overview

Module F implements a **strictly factual and ordinal territory ranking system** based on observed price data. This module is designed to provide transparent, legally defensible, and statistically valid comparisons between territories.

## ⚠️ Critical Design Principles

### 1. **Opt-In Only (Advanced Analysis Mode)**
- ✅ Activation requires explicit user consent
- ✅ Not enabled by default
- ✅ Clear explanation before activation
- ❌ No automatic activation
- ❌ No pre-filled consent

### 2. **Factual and Ordinal Only**
- ✅ Ordinal ranking (1st, 2nd, 3rd...)
- ✅ Based on real observed data only
- ✅ Transparent methodology
- ❌ NO recommendations ("you should go here")
- ❌ NO value judgments ("this is better")
- ❌ NO predictions or estimates

### 3. **Methodology First**
- ✅ Methodology displayed BEFORE results
- ✅ Limitations clearly stated
- ✅ Data sources visible
- ✅ Calculation method explained
- ❌ Results never shown without methodology

### 4. **Real Data Only**
- ✅ Mandatory minimum thresholds enforced
- ✅ Data recency validated (max 90 days old)
- ✅ Statistical significance required
- ❌ NO estimates or interpolations
- ❌ NO data when thresholds not met

### 5. **Neutral Presentation**
- ✅ Uniform typography for all territories
- ✅ Neutral colors only (no red/green)
- ✅ No badges or icons suggesting quality
- ✅ No commercial wording
- ❌ NO gamification elements
- ❌ NO comparative adjectives

---

## Components

### 1. **TerritoryRanking.tsx** (Main Component)

The primary component for displaying territory rankings.

**Props:**
```typescript
interface TerritoryRankingProps {
  territories: TerritoryData[];
  advancedAnalysisEnabled: boolean;
  showMethodology?: boolean;
  className?: string;
  onOptInToggle?: (enabled: boolean) => void;
}
```

**Usage:**
```tsx
import { TerritoryRanking } from '@/components/Observatoire/TerritoryRanking';

const [advancedMode, setAdvancedMode] = useState(false);

<TerritoryRanking
  territories={territoryData}
  advancedAnalysisEnabled={advancedMode}
  showMethodology={true}
  onOptInToggle={setAdvancedMode}
/>
```

**Behavior:**
- Shows opt-in UI when `advancedAnalysisEnabled` is `false`
- Validates data and shows errors if thresholds not met
- Displays methodology before ranking
- Shows factual ordinal ranking when valid

---

### 2. **TerritoryRankingMethodology.tsx** (Methodology Display)

Component that displays the methodology used for ranking.

**Props:**
```typescript
interface TerritoryRankingMethodologyProps {
  compact?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { TerritoryRankingMethodology } from '@/components/Observatoire/TerritoryRankingMethodology';

<TerritoryRankingMethodology compact={false} />
```

**Content:**
- Principle and purpose
- Validation criteria
- Calculation method
- Limitations
- Data sources
- Legal disclaimer

---

## Utilities

### 1. **territoryRankingThresholds.ts** (Validation & Calculation)

Contains all thresholds, validation logic, and ranking calculation.

**Key Constants:**
```typescript
TERRITORY_RANKING_THRESHOLDS = {
  MIN_OBSERVATIONS_PER_TERRITORY: 100,
  MIN_TERRITORIES_FOR_RANKING: 3,
  MIN_PRODUCTS_PER_TERRITORY: 10,
  MIN_STORES_PER_TERRITORY: 3,
  MAX_OBSERVATION_AGE_DAYS: 90,
  MIN_PRODUCT_OVERLAP_PERCENTAGE: 50,
}
```

**Key Functions:**

#### `validateTerritoryData(territory: TerritoryData): string[]`
Validates a single territory against all thresholds.

#### `validateRanking(territories: TerritoryData[]): RankingValidation`
Validates a complete set of territories for ranking.

#### `calculateOrdinalRanking(territories: TerritoryData[]): Array<TerritoryData & { rank: number }>`
Calculates ordinal ranking by average price (ascending).

#### `isRankingAvailable(territories: TerritoryData[]): boolean`
Quick check if ranking is possible.

#### `getThresholdDescriptions(): Record<string, string>`
Human-readable threshold descriptions for UI.

---

## Data Types

### TerritoryData
```typescript
interface TerritoryData {
  code: string;                // e.g., "971"
  name: string;                // e.g., "Guadeloupe"
  observations: number;        // Number of valid observations
  products: number;            // Number of unique products
  stores: number;              // Number of stores
  averagePrice: number;        // Average price of common basket
  lastObservation: Date;       // Most recent observation
  commonProducts: number;      // Products in common basket
}
```

### RankingValidation
```typescript
interface RankingValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  validTerritories: number;
  excludedTerritories: Array<{
    territory: string;
    reason: string;
  }>;
}
```

---

## Validation Rules

### Territory-Level Validation

Each territory must meet:
- ✅ ≥ 100 observations
- ✅ ≥ 10 products
- ✅ ≥ 3 stores
- ✅ Data < 90 days old
- ✅ Valid average price (> 0)

### Ranking-Level Validation

For a valid ranking:
- ✅ ≥ 3 valid territories
- ⚠️ ≥ 50% product overlap (warning if below)

### Exclusion Rules

Territories are excluded if:
- ❌ Below minimum observation threshold
- ❌ Below minimum products threshold
- ❌ Below minimum stores threshold
- ❌ Data too old (> 90 days)
- ❌ Invalid price data

---

## Example Scenarios

### Scenario 1: Valid Ranking
```typescript
const territories: TerritoryData[] = [
  {
    code: '971',
    name: 'Guadeloupe',
    observations: 150,
    products: 25,
    stores: 5,
    averagePrice: 125.50,
    lastObservation: new Date('2026-01-10'),
    commonProducts: 20,
  },
  // ... 2 more valid territories
];

// Result: Valid ranking displayed
```

### Scenario 2: Insufficient Data
```typescript
const territories: TerritoryData[] = [
  {
    code: '971',
    name: 'Guadeloupe',
    observations: 50,  // Below threshold
    products: 8,       // Below threshold
    stores: 2,         // Below threshold
    // ...
  },
];

// Result: Error message with specific threshold violations
```

### Scenario 3: Opt-In Required
```typescript
<TerritoryRanking
  territories={validTerritories}
  advancedAnalysisEnabled={false}  // Not opted in
  onOptInToggle={handleOptIn}
/>

// Result: Opt-in UI displayed
```

---

## UI States

### 1. **Opt-In Required**
- Icon: 🔒
- Message: "Mode Analyse Avancée Requis"
- Action: Button to enable advanced mode
- No data preview

### 2. **Invalid Data**
- Icon: ⚠️
- Message: "Classement Non Disponible"
- Details: Specific validation errors
- Excluded territories with reasons

### 3. **Valid Ranking**
- Methodology section (first)
- Ranking table (ordinal, neutral)
- Footer with date and disclaimer
- No colors, no badges, no judgments

---

## Integration Guidelines

### 1. **In Observatory Dashboard**
```tsx
import { TerritoryRanking } from '@/components/Observatoire/TerritoryRanking';

function ObservatoryDashboard() {
  const [advancedMode, setAdvancedMode] = useLocalStorage('advancedAnalysis', false);
  const territories = useTerritoryData();
  
  return (
    <div>
      <h2>Analyse Territoriale</h2>
      <TerritoryRanking
        territories={territories}
        advancedAnalysisEnabled={advancedMode}
        onOptInToggle={setAdvancedMode}
      />
    </div>
  );
}
```

### 2. **In Advanced Settings**
```tsx
function AdvancedSettings() {
  const [advancedMode, setAdvancedMode] = useState(false);
  
  return (
    <label>
      <input
        type="checkbox"
        checked={advancedMode}
        onChange={(e) => setAdvancedMode(e.target.checked)}
      />
      Activer le mode Analyse Avancée (inclut classement territorial)
    </label>
  );
}
```

### 3. **Persistent State**
```tsx
// Store opt-in preference in localStorage
const [advancedMode, setAdvancedMode] = useLocalStorage('observatory_advanced_mode', false);
```

---

## Testing

### Unit Tests (to be created)

Test file: `frontend/src/utils/territoryRankingThresholds.test.ts`

**Test Coverage:**
- ✅ validateTerritoryData with valid data
- ✅ validateTerritoryData with insufficient observations
- ✅ validateTerritoryData with old data
- ✅ validateRanking with valid territories
- ✅ validateRanking with insufficient territories
- ✅ calculateOrdinalRanking correct order
- ✅ calculateOrdinalRanking with ties
- ✅ isRankingAvailable returns correct boolean

### Component Tests (to be created)

Test file: `frontend/src/components/Observatoire/TerritoryRanking.test.tsx`

**Test Coverage:**
- ✅ Renders opt-in UI when disabled
- ✅ Renders error state with invalid data
- ✅ Renders ranking table with valid data
- ✅ Methodology shown by default
- ✅ Methodology hidden when showMethodology={false}
- ✅ onOptInToggle callback triggered
- ✅ Excluded territories listed with reasons

---

## Legal Safeguards

### Compliance Checklist

- [x] Opt-in required (no default activation)
- [x] Methodology displayed first
- [x] No recommendations or value judgments
- [x] No commercial wording
- [x] No gamification (badges, colors, rankings)
- [x] Real data only (no estimates)
- [x] Mandatory thresholds enforced
- [x] Limitations clearly stated
- [x] Data sources transparent
- [x] Calculation method documented
- [x] Disclaimer included
- [x] Neutral presentation

### Audit Trail

**What is tracked:**
- Threshold validation results
- Excluded territories with reasons
- Data recency checks
- Product overlap calculations

**What is NOT tracked:**
- User preferences (beyond opt-in)
- Individual territory "scores"
- Comparative judgments
- Recommendations

---

## File Structure

```
frontend/src/
├── utils/
│   └── territoryRankingThresholds.ts    # Validation & calculation
├── components/Observatoire/
│   ├── TerritoryRanking.tsx             # Main component
│   ├── TerritoryRanking.examples.tsx    # Usage examples
│   ├── TerritoryRankingMethodology.tsx  # Methodology display
│   └── MODULE-F.README.md               # This file
```

---

## Success Criteria

✅ **Zero Legal Risk**
- No recommendations or value judgments
- No commercial wording or gamification
- Methodology transparent and documented
- Opt-in required

✅ **Statistically Sound**
- Mandatory thresholds enforced
- Real data only
- Data recency validated
- Product overlap checked

✅ **User-Friendly**
- Clear opt-in explanation
- Validation errors detailed
- Methodology before results
- Mobile-responsive design

✅ **Audit-Ready**
- All thresholds documented
- All validation logic explicit
- All exclusions reasoned
- All calculations transparent

---

## Next Steps

After Module F implementation:

1. **Testing Phase**
   - Write comprehensive unit tests
   - Add component integration tests
   - Validate with real data samples

2. **Data Integration**
   - Connect to real observatory data
   - Implement data caching
   - Add periodic data refresh

3. **User Documentation**
   - Add help tooltips
   - Create user guide
   - Add FAQ section

4. **Analytics (Privacy-Preserving)**
   - Track opt-in rate (anonymous)
   - Monitor validation failures
   - Identify data quality issues

5. **Future Enhancements**
   - Historical ranking trends (descriptive only)
   - Product category breakdowns
   - Store type analysis
   - Time series comparisons

---

## Related Modules

- **Module D**: Observation thresholds & intelligent locking
- **Module E**: Neutral store display
- **Module F**: Territory ranking (this module)

All three modules work together to provide a legally safe, statistically valid, and transparent price observatory system.

---

## Support & Contact

For questions or issues related to Module F:
- GitHub Issues: https://github.com/teetee971/akiprisaye-web/issues
- Documentation: See `CIVIC_MODULES_IMPLEMENTATION.md`
- Examples: See `TerritoryRanking.examples.tsx`

---

**Last Updated**: January 12, 2026
**Version**: 1.0.0
**Status**: Initial Structure Implementation
