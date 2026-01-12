/**
 * Citizen Contribution Types
 * 
 * Controlled, opt-in contribution system
 * NO default sharing, NO personal data, NO obligation
 * 
 * Philosophy: "Explicit consent, full control, complete transparency"
 */

export type ContributionData = {
  // Product information (normalized)
  product_label: string; // Normalized product name
  product_price: number; // Numeric value only
  product_format?: string; // e.g., "1L", "500g"
  product_quantity?: number;
  
  // Context (anonymized)
  store_chain: string; // Store name only
  territory_code: string; // INSEE code or DOM identifier
  date: string; // Day only (YYYY-MM-DD)
  
  // Quality metadata
  ocr_confidence: number; // 0-1
  ai_matched: boolean;
  manually_validated: boolean;
  
  // NO photo
  // NO raw receipt text
  // NO precise geolocation
  // NO user identifier
};

export type ContributionStatus = 'pending' | 'accepted' | 'rejected' | 'filtered';

export type ContributionRecord = {
  id: string;
  data: ContributionData;
  status: ContributionStatus;
  contributed_at: Date;
  rejection_reason?: string;
  local_only: boolean;
};

export type ContributionSettings = {
  enabled: boolean;
  auto_contribute: boolean; // Always false by default
  min_confidence_threshold: number;
  show_confirmation: boolean;
  contribution_history: ContributionRecord[];
};

export type ContributionStats = {
  total_contributions: number;
  accepted: number;
  rejected: number;
  filtered: number;
  last_contribution?: Date;
};

/**
 * Ethical filtering criteria
 */
export type FilterCriteria = {
  min_ocr_confidence: number; // e.g., 0.7
  require_ai_match: boolean;
  require_manual_validation: boolean;
  exclude_if_ambiguous: boolean;
  exclude_if_incomplete: boolean;
};

/**
 * Default filter criteria (strict)
 */
export const DEFAULT_FILTER_CRITERIA: FilterCriteria = {
  min_ocr_confidence: 0.7,
  require_ai_match: false, // Don't require, but prefer
  require_manual_validation: true, // User must have validated
  exclude_if_ambiguous: true,
  exclude_if_incomplete: true,
};

/**
 * Get contribution consent message (non-incentive)
 */
export function getContributionConsentMessage(): {
  title: string;
  message: string;
  benefits: string[];
  guarantees: string[];
} {
  return {
    title: 'Contribution citoyenne anonyme',
    message: 'Souhaitez-vous contribuer anonymement à l\'amélioration des données publiques de prix ?',
    benefits: [
      'Améliore la fiabilité des données Anti-Crise',
      'Renforce la détection des anomalies',
      'Contribue à la transparence des prix',
      'Aide les collectivités locales',
    ],
    guarantees: [
      '❌ Pas de photo partagée',
      '❌ Pas de ticket brut transmis',
      '❌ Pas de géolocalisation fine',
      '❌ Pas de données personnelles',
      '✅ Contribution anonyme uniquement',
      '✅ Désactivation possible à tout moment',
    ],
  };
}

/**
 * Get rejection reason description
 */
export function getRejectionReasonDescription(reason: string): string {
  const reasons: Record<string, string> = {
    'low_confidence': 'Confiance OCR insuffisante',
    'ambiguous_data': 'Données ambiguës détectées',
    'incomplete_receipt': 'Ticket incomplet',
    'no_validation': 'Validation manuelle requise',
    'missing_required_fields': 'Champs obligatoires manquants',
    'duplicate': 'Contribution en double',
    'quality_threshold': 'Seuil de qualité non atteint',
  };
  
  return reasons[reason] || 'Raison non spécifiée';
}

/**
 * Contribution transparency statement
 */
export const CONTRIBUTION_TRANSPARENCY_STATEMENT = `
Les données contribuées sont :
• Strictement anonymes
• Agrégées avec d'autres contributions
• Utilisées uniquement pour améliorer les données publiques de prix
• Jamais revendues ou utilisées à des fins commerciales
• Accessibles en open data

Vous gardez le contrôle total :
• Contribution uniquement si vous le souhaitez
• Désactivation à tout moment
• Historique consultable localement
• Aucune obligation
`.trim();
