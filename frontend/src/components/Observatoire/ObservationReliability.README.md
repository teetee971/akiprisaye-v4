# Module E - Observation Reliability & Weighting

## Purpose

Calculate transparent, explainable reliability scores for citizen price observations based on factual indicators. This module supports data quality assessment without introducing store rankings, recommendations, or commercial bias.

## Core Principles

✅ **Allowed:**
- Factual reliability indicators (volume, source type, freshness, dispersion)
- Transparent, auditable methodology
- Read-only neutral display
- Exclusion of promotional observations by default

❌ **Prohibited:**
- Store rankings or comparisons
- Recommendation badges ("best", "recommended")
- Color-coded incentives (red/yellow/green traffic lights)
- Predictive or commercial logic
- Automated decision-making

## Architecture

### Reliability Score Components

The reliability score (0-100) is calculated from 4 weighted components:

| Component | Weight | Description |
|-----------|--------|-------------|
| **Volume** | 40% | Number of observations available |
| **Source Type** | 25% | Credibility of observation source |
| **Freshness** | 20% | Recency of observations |
| **Dispersion** | 15% | Price consistency (if ≥5 observations) |

### Source Type Credibility

| Source Type | Score | Rationale |
|-------------|-------|-----------|
| `ticket_caisse` | 100 | Official transaction record with date/time |
| `etiquette_rayon` | 80 | Direct shelf observation |
| `presentoir_promo` | 0 | Excluded by default (promotional pricing) |

### Reliability Levels

| Score Range | Level | Description |
|-------------|-------|-------------|
| 80-100 | Très élevé | High volume of recent, consistent data |
| 60-79 | Élevé | Good volume with satisfactory reliability |
| 40-59 | Moyen | Moderate volume, acceptable reliability |
| 20-39 | Faible | Limited data, interpret with caution |
| 0-19 | Très faible | Insufficient data for reliable analysis |

## Usage

### Basic Usage

```typescript
import { ObservationReliability } from '@/components/Observatoire/ObservationReliability';
import type { ReceiptData } from '@/components/Receipt/types';

function PriceAnalysisPage({ observations }: { observations: ReceiptData[] }) {
  return (
    <div>
      <h1>Analyse des prix</h1>
      
      {/* Display reliability score */}
      <ObservationReliability
        observations={observations}
        excludePromotional={true}
        showMethodology={true}
      />
      
      {/* Rest of analysis... */}
    </div>
  );
}
```

### Programmatic Score Calculation

```typescript
import { calculateReliabilityScore } from '@/utils/observationReliability';

const observations: ReceiptData[] = [...]; // Your observations

const score = calculateReliabilityScore(observations, true);

console.log(`Reliability: ${score.total}/100 (${score.level})`);
console.log(`Can use for analysis: ${score.canUseForAnalysis}`);
console.log('Components:', score.components);
```

### Conditional Analysis Based on Reliability

```typescript
import { calculateReliabilityScore } from '@/utils/observationReliability';

function performAnalysis(observations: ReceiptData[]) {
  const score = calculateReliabilityScore(observations);
  
  if (!score.canUseForAnalysis) {
    return {
      error: 'Données insuffisantes pour une analyse fiable',
      minimumScore: 40,
      currentScore: score.total,
    };
  }
  
  // Proceed with analysis...
  return {
    reliability: score,
    analysis: {
      // Your analysis results
    },
  };
}
```

## API Reference

### Functions

#### `calculateReliabilityScore(observations, excludePromotional?)`

Calculate overall reliability score for observations.

**Parameters:**
- `observations: ReceiptData[]` - Array of observation data
- `excludePromotional: boolean` - Exclude promotional observations (default: true)

**Returns:** `ReliabilityScore`
```typescript
{
  total: number;                    // 0-100
  components: {
    volumeScore: number;
    sourceScore: number;
    freshnessScore: number;
    dispersionScore: number;
  };
  level: 'très_faible' | 'faible' | 'moyen' | 'élevé' | 'très_élevé';
  canUseForAnalysis: boolean;       // true if score >= 40
  excludedPromotional: boolean;     // true if promo obs were filtered
}
```

#### `calculateVolumeScore(count)`

Calculate volume component based on observation count.

**Parameters:**
- `count: number` - Number of observations

**Returns:** `number` (0-100)

**Scoring:**
- 0 observations → 0
- 1 observation → 20
- 2-4 observations → 40
- 5-9 observations → 60
- 10-19 observations → 80
- 20+ observations → 100

#### `calculateSourceScore(sourceType)`

Calculate source credibility score.

**Parameters:**
- `sourceType: ObservationSourceType`

**Returns:** `number` (0-100)

#### `calculateFreshnessScore(observationDate)`

Calculate freshness score based on observation age.

**Parameters:**
- `observationDate: string` - ISO date string

**Returns:** `number` (0-100)

**Scoring:**
- ≤7 days → 100
- ≤14 days → 90
- ≤30 days → 75
- ≤60 days → 60
- ≤90 days → 40
- >90 days → 20

#### `calculateDispersionScore(prices)`

Calculate price consistency score. Only calculated if ≥5 prices available.

**Parameters:**
- `prices: number[]` - Array of observed prices

**Returns:** `number | null` (0-100 or null if insufficient data)

**Scoring (based on coefficient of variation):**
- ≤5% CV → 100 (very consistent)
- ≤10% CV → 80 (consistent)
- ≤20% CV → 60 (moderate variation)
- ≤30% CV → 40 (high variation)
- >30% CV → 20 (very high variation)

### Components

#### `<ObservationReliability>`

React component for displaying reliability scores.

**Props:**
```typescript
{
  observations: ReceiptData[];      // Observations to analyze
  excludePromotional?: boolean;     // Exclude promo obs (default: true)
  showMethodology?: boolean;        // Show methodology button (default: false)
  className?: string;               // Additional CSS classes
}
```

**Features:**
- Displays overall score with neutral gray progress bar
- Shows reliability level and description
- Analysis status indicator
- Expandable component breakdown
- Optional methodology modal with full transparency

## Data Flow

```
Observations
    ↓
Filter promotional (optional)
    ↓
Calculate 4 component scores
    ↓
Apply fixed weights
    ↓
Compute total (0-100)
    ↓
Determine reliability level
    ↓
Display in UI (read-only)
```

## Anti-Patterns (DO NOT DO)

❌ **Using reliability scores for store ranking**
```typescript
// WRONG - violates neutrality principle
const rankedStores = stores.sort((a, b) => 
  calculateReliabilityScore(b.obs).total - calculateReliabilityScore(a.obs).total
);
```

✅ **Correct - display factual information only**
```typescript
// CORRECT - show reliability for context
stores.forEach(store => {
  const score = calculateReliabilityScore(store.observations);
  console.log(`${store.name}: ${score.total}/100 reliability`);
});
```

❌ **Using scores for recommendations**
```typescript
// WRONG - creates commercial bias
if (score.total >= 80) {
  return <Badge>Recommandé</Badge>;
}
```

✅ **Correct - factual threshold check**
```typescript
// CORRECT - objective data quality check
if (!score.canUseForAnalysis) {
  return <Warning>Données insuffisantes pour analyse</Warning>;
}
```

## Integration with Anti-Crisis Basket

The reliability module can be used to assess observation quality before aggregation:

```typescript
import { calculateReliabilityScore } from '@/utils/observationReliability';

function prepareAntiCrisisData(observations: ReceiptData[]) {
  const score = calculateReliabilityScore(observations);
  
  return {
    observations,
    reliability: score,
    metadata: {
      canUseForBasket: score.canUseForAnalysis,
      observationCount: observations.length,
      excludedPromotional: score.excludedPromotional,
      calculatedAt: new Date().toISOString(),
    },
  };
}
```

## Transparency & Auditability

All calculations in this module are:

1. **Deterministic** - Same inputs always produce same outputs
2. **Transparent** - Formulas and weights are publicly documented
3. **Auditable** - No hidden logic or black-box algorithms
4. **Non-commercial** - No business logic or revenue optimization
5. **Neutral** - No store comparisons or recommendations

The methodology can be explained to regulators, journalists, or citizens without reservation.

## Legal Safety

This module maintains legal safety by:

- ✅ Providing factual data quality indicators only
- ✅ Never ranking stores or making recommendations
- ✅ Using neutral terminology throughout
- ✅ Excluding promotional observations by default
- ✅ Full transparency on calculation methodology
- ✅ No predictive or decision-making logic

## Testing

```typescript
import { calculateReliabilityScore, calculateVolumeScore } from '@/utils/observationReliability';

describe('Observation Reliability', () => {
  test('volume score increases with observation count', () => {
    expect(calculateVolumeScore(0)).toBe(0);
    expect(calculateVolumeScore(1)).toBe(20);
    expect(calculateVolumeScore(5)).toBe(60);
    expect(calculateVolumeScore(20)).toBe(100);
  });
  
  test('excludes promotional observations by default', () => {
    const observations = [
      { type: 'ticket_caisse', /* ... */ },
      { type: 'presentoir_promo', /* ... */ },
    ];
    
    const score = calculateReliabilityScore(observations, true);
    expect(score.excludedPromotional).toBe(true);
  });
  
  test('minimum score for analysis is 40', () => {
    const lowScore = { total: 35, /* ... */ };
    const highScore = { total: 45, /* ... */ };
    
    expect(lowScore.canUseForAnalysis).toBe(false);
    expect(highScore.canUseForAnalysis).toBe(true);
  });
});
```

## Future Enhancements

Potential extensions that maintain neutrality:

1. **Geographic density indicator** - Show observation coverage by territory
2. **Temporal coverage** - Indicate time period span of observations
3. **Multi-source validation** - Cross-reference between source types
4. **Outlier detection** - Flag statistical anomalies (descriptive only)

All enhancements must preserve the zero-ranking, zero-recommendation principle.
