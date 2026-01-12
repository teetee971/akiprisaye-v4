# AnalyseStatistiqueNeutre Component

## 📋 Overview

A legally-safe React TypeScript component for displaying neutral statistical analysis in a price observatory context. Designed for public sector use with strict compliance to legal neutrality requirements.

## 🎯 Purpose

Provides transparent, non-accusatory statistical information about price variations without:
- Causal attribution
- Store rankings or comparisons
- Accusatory terminology
- Legal liability

## 📦 Installation

```tsx
import { AnalyseStatistiqueNeutre } from '@/components/Observatoire';
```

## 🔧 Props

```typescript
type AnalyseStatistiqueNeutreProps = {
  signalLevel: number;           // 0-100: Statistical signal intensity
  interpretation: string;         // Neutral explanation text
  enseignesPresentes: string[];   // List of stores (no ranking)
  observations: {
    used: number;                 // Observations used in analysis
    max: number;                  // Maximum available observations
    method: 'full' | 'stratified'; // Statistical method
  };
};
```

## 📊 Signal Level Guide

| Range | Label | Color | Meaning |
|-------|-------|-------|---------|
| 80-100 | Signal fort | Red | Strong statistical signal |
| 50-79 | Signal modéré | Orange | Moderate signal |
| 20-49 | Signal faible | Yellow | Weak signal |
| 0-19 | Signal minimal | Gray | Minimal signal |

## 🎨 Component Structure

### 1. Interpretation Block (🧠)
- Signal level badge with neutral terminology
- Statistical interpretation text
- Methodological note

### 2. Stores Block (🏪)
- Neutral grid display of store names
- Warning: No ranking or comparison
- Presence indication only

### 3. Observations Volume (📊)
- Used vs. maximum observations
- Statistical method (full/stratified)
- Usage rate progress bar
- Methodology explanation

### 4. Legal Disclaimer (⚖️)
- Mandatory 4-point legal notice
- Data nature and limitations
- No causal attribution
- Transparent methodology

### 5. Neutrality Principle
- Final reminder about neutrality
- Link to methodology documentation

## 💡 Usage Examples

### Basic Usage

```tsx
<AnalyseStatistiqueNeutre
  signalLevel={75}
  interpretation="L'analyse révèle un signal modéré de variation..."
  enseignesPresentes={['Carrefour', 'Leader Price', 'Super U']}
  observations={{
    used: 450,
    max: 600,
    method: 'stratified'
  }}
/>
```

### Strong Signal Example

```tsx
<AnalyseStatistiqueNeutre
  signalLevel={92}
  interpretation="Signal fort détecté avec cohérence élevée..."
  enseignesPresentes={[
    'Carrefour', 'Leader Price', 'Super U', 
    'Hyper U', 'Leclerc', 'Auchan'
  ]}
  observations={{
    used: 2347,
    max: 2500,
    method: 'full'
  }}
/>
```

## ⚖️ Legal Compliance Features

### ✅ Required Elements
- [x] Neutral terminology (no "abus", "surprofit", "fraude")
- [x] No causal attribution
- [x] No store rankings
- [x] Mandatory disclaimers
- [x] Transparent methodology
- [x] Data limitations clearly stated

### ❌ Prohibited Elements
- [ ] Store-to-store comparisons
- [ ] Accusatory language
- [ ] Performance rankings
- [ ] Causal conclusions
- [ ] Contractual value claims

## 🎨 Design Features

### Responsive
- Mobile-first design
- Grid adapts to screen size (2 cols mobile, 3 cols desktop)
- Consistent spacing and padding

### Accessibility
- Clear hierarchy with semantic HTML
- High contrast text
- Descriptive labels
- Screen reader friendly

### Visual Hierarchy
1. Signal level (prominent badge)
2. Interpretation (highlighted box)
3. Supporting data (cards)
4. Legal disclaimers (clearly marked)

## 📱 Mobile Optimization

- Single column layout on small screens
- Touch-friendly spacing
- Readable text sizes (12px minimum)
- Optimized for portrait orientation

## 🔍 Testing

See `AnalyseStatistiqueNeutre.examples.tsx` for:
- Strong signal scenario
- Moderate signal scenario
- Low signal scenario
- No stores scenario
- Extensive data scenario

## 🚨 Important Notes

### Data Interpretation
- Signal level indicates statistical intensity only
- No causation implied between stores and signals
- Observations are citizen-contributed and partial
- Not exhaustive market representation

### Legal Safety
- Component designed for institutional use
- Press-compatible neutral language
- Audit-ready disclaimers
- No defamation risk when used correctly

### Methodology
- "Full" method: Exhaustive analysis of all available data
- "Stratified" method: Representative statistical sampling
- Both methods documented and auditable

## 📚 Related Components

- `ObservatoireMarges.jsx` - Price differential observatory
- `HistoriqueVariations.jsx` - Historical price evolution
- `CarteObservations.jsx` - Validated observations map

## 🤝 Contributing

When modifying this component:
1. Maintain legal neutrality
2. Keep disclaimers intact
3. Test on mobile and desktop
4. Verify accessibility
5. Update examples and documentation

## 📄 License

Part of the A KI PRI SA YÉ price observatory system.
Open-source, public sector use.

---

**Last Updated:** 2026-01-12
**Component Version:** 1.0.0
**Status:** ✅ Production Ready
