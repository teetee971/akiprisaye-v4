/**
 * OCR Quality History Types
 * 
 * Institutional-grade measurement of receipt readability
 * NO store ratings, NO commercial comparison
 * ONLY technical document quality indicators
 * 
 * Philosophy: "Measure, explain, document - never judge prices"
 */

export type OCRQualityLevel = 'excellente' | 'correcte' | 'limitée';

export type OCRQualityMetrics = {
  photo_sharpness: number; // 0-100
  document_structure: number; // 0-100 (completeness)
  character_recognition: number; // 0-100 (% recognized)
  block_coherence: number; // 0-100
  duplicate_rate: number; // 0-100 (lower is better)
};

export type OCRQualityDistribution = {
  excellente: number; // percentage
  correcte: number; // percentage
  limitée: number; // percentage
};

export type QualityCause = {
  type: 'papier_thermique_pale' | 'ticket_long' | 'impression_basse_def' | 
        'format_non_standard' | 'plies_froissures' | 'eclairage_faible';
  frequency: number; // percentage of tickets affected
  description: string;
};

export type StoreChainQualityHistory = {
  enseigne: string;
  territoire: string;
  periode: string; // e.g., "2025-Q4"
  tickets_analysés: number;
  qualité_ocr: OCRQualityDistribution;
  causes_principales: QualityCause[];
  metadata: {
    dernier_ticket: Date;
    premier_ticket: Date;
    version_système: string;
  };
};

export type TerritoryQualityComparison = {
  territoire: string;
  qualité_moyenne: number; // 0-100
  tickets_total: number;
  enseignes_couvertes: number;
};

export type TemporalQualityTrend = {
  periode: string;
  qualité_moyenne: number;
  tickets_count: number;
};

export type QualityBadge = {
  type: 'ticket_long_frequent' | 'impression_thermique_pale' | 
        'format_non_standard' | 'lisibilité_variable';
  label: string;
  description: string;
  icon: string;
  severity: 'info' | 'warning';
};

/**
 * Calculate overall quality score from metrics
 */
export function calculateOverallQuality(metrics: OCRQualityMetrics): number {
  // Weighted average of all metrics
  const weights = {
    photo_sharpness: 0.25,
    document_structure: 0.20,
    character_recognition: 0.30,
    block_coherence: 0.15,
    duplicate_rate: 0.10, // Inverted (lower is better)
  };

  const score =
    metrics.photo_sharpness * weights.photo_sharpness +
    metrics.document_structure * weights.document_structure +
    metrics.character_recognition * weights.character_recognition +
    metrics.block_coherence * weights.block_coherence +
    (100 - metrics.duplicate_rate) * weights.duplicate_rate;

  return Math.round(score);
}

/**
 * Categorize quality level from score
 */
export function categorizeQuality(score: number): OCRQualityLevel {
  if (score >= 80) return 'excellente';
  if (score >= 60) return 'correcte';
  return 'limitée';
}

/**
 * Get quality level color (neutral palette)
 */
export function getQualityColor(level: OCRQualityLevel): string {
  const colors: Record<OCRQualityLevel, string> = {
    excellente: '#3B82F6', // Blue
    correcte: '#F59E0B', // Orange
    limitée: '#9CA3AF', // Gray
  };
  return colors[level];
}

/**
 * Get quality level icon
 */
export function getQualityIcon(level: OCRQualityLevel): string {
  const icons: Record<OCRQualityLevel, string> = {
    excellente: '🔵',
    correcte: '🟠',
    limitée: '⚪',
  };
  return icons[level];
}

/**
 * Get quality level description
 */
export function getQualityDescription(level: OCRQualityLevel): string {
  const descriptions: Record<OCRQualityLevel, string> = {
    excellente: 'Majoritairement lisible',
    correcte: 'Lisibilité variable',
    limitée: 'Données limitées',
  };
  return descriptions[level];
}

/**
 * Get quality badges based on causes
 */
export function generateQualityBadges(causes: QualityCause[]): QualityBadge[] {
  const badges: QualityBadge[] = [];

  for (const cause of causes) {
    if (cause.frequency < 20) continue; // Only show significant causes

    switch (cause.type) {
      case 'ticket_long':
        badges.push({
          type: 'ticket_long_frequent',
          label: 'Tickets longs fréquents',
          description: 'Présence régulière de tickets de plus de 60 lignes',
          icon: '📄',
          severity: 'info',
        });
        break;

      case 'papier_thermique_pale':
        badges.push({
          type: 'impression_thermique_pale',
          label: 'Impression thermique pâle',
          description: 'Qualité d\'impression variable sur papier thermique',
          icon: '🖨️',
          severity: 'warning',
        });
        break;

      case 'format_non_standard':
        badges.push({
          type: 'format_non_standard',
          label: 'Format non standard',
          description: 'Mise en page variable selon les magasins',
          icon: '📐',
          severity: 'info',
        });
        break;

      case 'impression_basse_def':
        badges.push({
          type: 'lisibilité_variable',
          label: 'Lisibilité variable',
          description: 'Qualité de lecture dépendant de la source',
          icon: '🔍',
          severity: 'warning',
        });
        break;
    }
  }

  return badges;
}

/**
 * Mandatory disclaimer text
 */
export const QUALITY_DISCLAIMER = 
  "Cet indicateur reflète la qualité des documents collectés, " +
  "pas la politique de prix de l'enseigne.";

/**
 * Get methodology explanation
 */
export function getMethodologyExplanation(): string {
  return `
Méthodologie de mesure :
• Netteté des photos (analyse de contraste et netteté)
• Structure des tickets (présence des blocs attendus)
• Taux de reconnaissance des caractères (OCR)
• Cohérence des données (totaux, dates, etc.)
• Détection des doublons (tickets en plusieurs photos)

Ces indicateurs mesurent uniquement la qualité technique
des documents collectés, sans aucun lien avec les prix pratiqués.
  `.trim();
}
