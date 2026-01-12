import {
  ContributionData,
  ContributionRecord,
  ContributionSettings,
  ContributionStats,
  ContributionStatus,
  FilterCriteria,
  DEFAULT_FILTER_CRITERIA,
} from '../../../types/citizenContribution';
import { AIEnhancedLine } from './localAIAssistance';

/**
 * Citizen Contribution Service
 * 
 * Manages opt-in contributions to public price data
 * Strict privacy, explicit consent, full control
 * 
 * Philosophy: "Explicit consent, full control, complete transparency"
 */

const CONTRIBUTION_SETTINGS_KEY = 'contribution_settings';
const CONTRIBUTION_HISTORY_KEY = 'contribution_history';

/**
 * Get contribution settings
 */
export function getContributionSettings(): ContributionSettings {
  try {
    const stored = localStorage.getItem(CONTRIBUTION_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading contribution settings:', error);
  }

  // Default: disabled, explicit consent required
  return {
    enabled: false,
    auto_contribute: false, // NEVER auto-contribute by default
    min_confidence_threshold: DEFAULT_FILTER_CRITERIA.min_ocr_confidence,
    show_confirmation: true,
    contribution_history: [],
  };
}

/**
 * Update contribution settings
 */
export function updateContributionSettings(settings: Partial<ContributionSettings>): void {
  try {
    const current = getContributionSettings();
    const updated = { ...current, ...settings };
    
    // Safety: NEVER allow auto_contribute to be true without explicit user action
    if (settings.auto_contribute === undefined) {
      updated.auto_contribute = false;
    }
    
    localStorage.setItem(CONTRIBUTION_SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving contribution settings:', error);
  }
}

/**
 * Check if a receipt is eligible for contribution
 */
export function isEligibleForContribution(
  lines: AIEnhancedLine[],
  manuallyValidated: boolean,
  criteria: FilterCriteria = DEFAULT_FILTER_CRITERIA
): {
  eligible: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Must have validated lines
  if (!manuallyValidated && criteria.require_manual_validation) {
    reasons.push('no_validation');
  }

  // Check OCR confidence
  const avgConfidence = lines.reduce((sum, line) => sum + line.confidence_score, 0) / lines.length;
  if (avgConfidence < criteria.min_ocr_confidence) {
    reasons.push('low_confidence');
  }

  // Check for required fields
  const validLines = lines.filter(line => 
    line.label && 
    line.price !== undefined && 
    line.price > 0 &&
    line.enabled
  );

  if (validLines.length === 0) {
    reasons.push('missing_required_fields');
  }

  // Check for incomplete data
  if (criteria.exclude_if_incomplete && validLines.length < 3) {
    reasons.push('incomplete_receipt');
  }

  // Check for ambiguous data
  if (criteria.exclude_if_ambiguous) {
    const lowConfidenceLines = lines.filter(line => line.confidence_score < 0.6);
    if (lowConfidenceLines.length > lines.length * 0.3) {
      reasons.push('ambiguous_data');
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

/**
 * Prepare contribution data from receipt lines
 * Filters and anonymizes data
 */
export function prepareContributionData(
  lines: AIEnhancedLine[],
  storeChain: string,
  territoryCode: string
): ContributionData[] {
  const contributions: ContributionData[] = [];
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD only

  for (const line of lines) {
    if (!line.enabled || !line.label || line.price === undefined) {
      continue;
    }

    contributions.push({
      product_label: line.label,
      product_price: line.price,
      product_format: line.quantity ? `${line.quantity}` : undefined,
      product_quantity: line.quantity,
      store_chain: storeChain,
      territory_code: territoryCode,
      date: today, // Day only, no time
      ocr_confidence: line.confidence_score,
      ai_matched: line.ai_enhanced || false,
      manually_validated: true,
    });
  }

  return contributions;
}

/**
 * Record contribution locally
 */
export function recordContribution(
  data: ContributionData,
  status: ContributionStatus,
  rejectionReason?: string
): void {
  try {
    const history = getContributionHistory();
    
    const record: ContributionRecord = {
      id: `contrib-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data,
      status,
      contributed_at: new Date(),
      rejection_reason: rejectionReason,
      local_only: status !== 'accepted',
    };

    history.push(record);

    // Keep last 100 records
    const trimmed = history.slice(-100);
    
    localStorage.setItem(CONTRIBUTION_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error recording contribution:', error);
  }
}

/**
 * Get contribution history
 */
export function getContributionHistory(): ContributionRecord[] {
  try {
    const stored = localStorage.getItem(CONTRIBUTION_HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading contribution history:', error);
  }

  return [];
}

/**
 * Get contribution statistics
 */
export function getContributionStats(): ContributionStats {
  const history = getContributionHistory();

  const stats: ContributionStats = {
    total_contributions: history.length,
    accepted: history.filter(r => r.status === 'accepted').length,
    rejected: history.filter(r => r.status === 'rejected').length,
    filtered: history.filter(r => r.status === 'filtered').length,
  };

  if (history.length > 0) {
    stats.last_contribution = new Date(history[history.length - 1].contributed_at);
  }

  return stats;
}

/**
 * Clear contribution history
 */
export function clearContributionHistory(): void {
  try {
    localStorage.removeItem(CONTRIBUTION_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing contribution history:', error);
  }
}

/**
 * Simulate contribution submission (would be API call in production)
 * For now, just marks as accepted locally
 */
export async function submitContributions(
  contributions: ContributionData[]
): Promise<{ success: boolean; accepted: number; rejected: number }> {
  // In production, this would be an API call to the backend
  // For now, we simulate local processing
  
  let accepted = 0;
  let rejected = 0;

  for (const contribution of contributions) {
    // Simulate quality check
    if (contribution.ocr_confidence >= 0.7 && contribution.manually_validated) {
      recordContribution(contribution, 'accepted');
      accepted++;
    } else {
      recordContribution(contribution, 'rejected', 'quality_threshold');
      rejected++;
    }
  }

  return {
    success: true,
    accepted,
    rejected,
  };
}

/**
 * Disable contributions
 */
export function disableContributions(): void {
  updateContributionSettings({
    enabled: false,
    auto_contribute: false,
  });
}

/**
 * Enable contributions (with explicit consent)
 */
export function enableContributions(): void {
  updateContributionSettings({
    enabled: true,
    auto_contribute: false, // Never auto
    show_confirmation: true, // Always show confirmation
  });
}
