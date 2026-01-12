/**
 * Public Readability Index Types
 * 
 * Institutional-grade public index measuring receipt readability
 * NO punishment, NO individual scoring, informative only
 * 
 * Philosophy: "Positive pressure, not punishment"
 */

export type ReadabilityLevel = 'tres_lisible' | 'lisibilite_moyenne' | 'lisibilite_limitee' | 'donnees_insuffisantes';

export type ReadabilityMetrics = {
  readable_lines_percentage: number; // High weight
  price_format_coherence: number; // Medium weight
  ocr_stability: number; // Medium weight
  anomaly_rate: number; // Low weight (inverted)
  inter_receipt_repeatability: number; // Medium weight
};

export type ReadabilityIndexCalculation = {
  metrics: ReadabilityMetrics;
  weights: {
    readable_lines: number; // e.g., 0.35
    coherence: number; // e.g., 0.25
    stability: number; // e.g., 0.20
    anomaly_rate: number; // e.g., 0.10
    repeatability: number; // e.g., 0.10
  };
  final_score: number; // 0-100
  level: ReadabilityLevel;
};

export type StoreChainReadabilityIndex = {
  store_chain: string;
  territory?: string; // Optional, for regional view
  period: string; // e.g., "2026-Q1"
  
  index: ReadabilityIndexCalculation;
  
  sample_size: number; // Number of receipts analyzed
  confidence_level: number; // Statistical confidence
  
  trend: {
    previous_period_score?: number;
    evolution: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  };
  
  // NO individual store scores
  // NO punitive rankings
  // NO commercial impact data
};

export type PublicReadabilityReport = {
  index_name: string; // e.g., "IPLT - Indice Public de Lisibilité des Tickets"
  version: string;
  generated_at: Date;
  period: string;
  
  overall_statistics: {
    national_average: number;
    dom_average: number;
    total_receipts_analyzed: number;
    stores_covered: number;
  };
  
  store_chain_indices: StoreChainReadabilityIndex[];
  
  methodology: {
    description: string;
    metrics_used: string[];
    weights_explanation: string;
    sample_requirements: string;
    calculation_formula: string;
    limitations: string[];
  };
  
  intended_use: {
    for_citizens: string[];
    for_stores: string[];
    for_authorities: string[];
  };
  
  mandatory_disclaimer: string;
};

/**
 * Get readability level from score
 */
export function getReadabilityLevel(score: number, sampleSize: number): ReadabilityLevel {
  // Insufficient data check
  if (sampleSize < 30) {
    return 'donnees_insuffisantes';
  }
  
  // Neutral scale (NO red, NO "bad")
  if (score >= 80) return 'tres_lisible';
  if (score >= 60) return 'lisibilite_moyenne';
  return 'lisibilite_limitee';
}

/**
 * Get readability level display
 */
export function getReadabilityLevelDisplay(level: ReadabilityLevel): {
  icon: string;
  label: string;
  color: string;
  description: string;
} {
  const displays = {
    tres_lisible: {
      icon: '🟢',
      label: 'Très lisible',
      color: '#10B981', // Green
      description: 'Tickets généralement bien lisibles par OCR',
    },
    lisibilite_moyenne: {
      icon: '🟡',
      label: 'Lisibilité moyenne',
      color: '#F59E0B', // Yellow/Orange
      description: 'Tickets lisibles avec quelques difficultés',
    },
    lisibilite_limitee: {
      icon: '🟠',
      label: 'Lisibilité limitée',
      color: '#F97316', // Orange
      description: 'Tickets difficiles à lire automatiquement',
    },
    donnees_insuffisantes: {
      icon: '⚪',
      label: 'Données insuffisantes',
      color: '#9CA3AF', // Gray
      description: 'Pas assez de données pour évaluation fiable',
    },
  };
  
  return displays[level];
}

/**
 * Calculate readability index from metrics
 */
export function calculateReadabilityIndex(metrics: ReadabilityMetrics): ReadabilityIndexCalculation {
  const weights = {
    readable_lines: 0.35,
    coherence: 0.25,
    stability: 0.20,
    anomaly_rate: 0.10, // Inverted (lower is better)
    repeatability: 0.10,
  };
  
  const final_score = 
    metrics.readable_lines_percentage * weights.readable_lines +
    metrics.price_format_coherence * weights.coherence +
    metrics.ocr_stability * weights.stability +
    (100 - metrics.anomaly_rate) * weights.anomaly_rate + // Inverted
    metrics.inter_receipt_repeatability * weights.repeatability;
  
  return {
    metrics,
    weights,
    final_score: Math.round(final_score),
    level: getReadabilityLevel(final_score, 100), // Assuming sufficient sample
  };
}

/**
 * Get intended use explanations
 */
export function getIntendedUseExplanations(): {
  for_citizens: string[];
  for_stores: string[];
  for_authorities: string[];
} {
  return {
    for_citizens: [
      'Comprendre pourquoi certains prix sont difficiles à comparer',
      'Relativiser l\'absence de données pour certaines enseignes',
      'Identifier les tickets les plus fiables pour la contribution',
    ],
    for_stores: [
      'Amélioration volontaire de la qualité des tickets',
      'Benchmark technique entre enseignes',
      'Réduction des litiges liés aux tickets illisibles',
    ],
    for_authorities: [
      'Signal faible sur l\'accès à l\'information consommateur',
      'Base factuelle neutre pour politiques publiques',
      'Indicateur de transparence commerciale',
    ],
  };
}

/**
 * Mandatory disclaimer (MUST be displayed)
 */
export const READABILITY_INDEX_DISCLAIMER = 
  "Cet indice mesure uniquement la lisibilité technique des tickets. " +
  "Il ne constitue ni une notation commerciale, ni une évaluation de prix. " +
  "Il vise à améliorer la transparence de l'information consommateur.";

/**
 * Index name options
 */
export const INDEX_NAME_OPTIONS = [
  'IPLT - Indice Public de Lisibilité des Tickets',
  'Indice OCR - Transparence des Prix',
  'Indice de Qualité d\'Information Consommateur',
];

/**
 * Get methodology summary
 */
export function getMethodologySummary(): string {
  return `
L'indice est calculé à partir de 5 métriques agrégées :

1. **Lignes lisibles** (35%) - Pourcentage de lignes correctement lues
2. **Cohérence prix/format** (25%) - Cohérence entre prix et format produit
3. **Stabilité OCR** (20%) - Répétabilité de la lecture
4. **Taux d'anomalies** (10%) - Fréquence des incohérences détectées (inversé)
5. **Répétabilité** (10%) - Constance entre tickets similaires

**Échelle :**
- 🟢 Très lisible (80-100)
- 🟡 Lisibilité moyenne (60-79)
- 🟠 Lisibilité limitée (< 60)
- ⚪ Données insuffisantes (< 30 tickets)

**Important :** Cet indice mesure la qualité technique uniquement.
  `.trim();
}
