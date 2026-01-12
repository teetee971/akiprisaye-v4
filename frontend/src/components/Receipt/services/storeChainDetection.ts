import { StoreChainProfile, STORE_CHAIN_PROFILES, getGenericProfile } from './storeChainProfiles';

/**
 * Store Chain Detection Result
 */
export type StoreDetectionResult = {
  profile: StoreChainProfile;
  confidence: number; // 0-1
  method: 'text_header' | 'vocabulary' | 'structure' | 'generic';
  detected_name?: string;
};

// Confidence threshold for using detected profile
const CONFIDENCE_THRESHOLD = 0.6;

/**
 * Detect store chain from OCR text (probabilistic, non-intrusive)
 * 
 * Methods:
 * 1. Header text detection
 * 2. Recurring vocabulary
 * 3. Structure patterns
 * 
 * If confidence < threshold → generic profile
 */
export function detectStoreChain(ocrText: string): StoreDetectionResult {
  const upperText = ocrText.toUpperCase();
  const lines = upperText.split('\n').filter(l => l.trim().length > 0);
  
  // Early lines more likely to contain store name
  const headerLines = lines.slice(0, 5).join(' ');
  
  let bestMatch: { profile: StoreChainProfile; confidence: number; name: string } | null = null;
  
  // Method 1: Text header detection
  for (const [key, profile] of Object.entries(STORE_CHAIN_PROFILES)) {
    if (key === 'generic') continue;
    
    // Check main name
    if (headerLines.includes(profile.enseigne.toUpperCase())) {
      const confidence = 0.9;
      if (!bestMatch || confidence > bestMatch.confidence) {
        bestMatch = { profile, confidence, name: profile.enseigne };
      }
    }
    
    // Check aliases
    for (const alias of profile.aliases) {
      if (headerLines.includes(alias)) {
        const confidence = 0.85;
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { profile, confidence, name: alias };
        }
      }
    }
  }
  
  // Method 2: Vocabulary analysis (lower confidence)
  if (!bestMatch || bestMatch.confidence < 0.7) {
    const vocabularyMatch = detectByVocabulary(ocrText);
    if (vocabularyMatch && (!bestMatch || vocabularyMatch.confidence > bestMatch.confidence)) {
      bestMatch = vocabularyMatch;
    }
  }
  
  // Use detected profile if confidence above threshold
  if (bestMatch && bestMatch.confidence >= CONFIDENCE_THRESHOLD) {
    return {
      profile: bestMatch.profile,
      confidence: bestMatch.confidence,
      method: 'text_header',
      detected_name: bestMatch.name,
    };
  }
  
  // Fallback to generic profile
  return {
    profile: getGenericProfile(),
    confidence: 1.0,
    method: 'generic',
  };
}

/**
 * Detect store by vocabulary patterns
 * Lower confidence than direct name match
 */
function detectByVocabulary(ocrText: string): { profile: StoreChainProfile; confidence: number; name: string } | null {
  const upperText = ocrText.toUpperCase();
  
  // Vocabulary signatures (weak signals, cumulative)
  const vocabularySignatures: Record<string, { keywords: string[]; profile_key: string }> = {
    'leader_price': {
      keywords: ['LEADER', 'PRIX BAS', 'HARD DISCOUNT'],
      profile_key: 'leader_price',
    },
    'carrefour': {
      keywords: ['CARREFOUR', 'PASSAGE CAISSE'],
      profile_key: 'carrefour',
    },
    'leclerc': {
      keywords: ['LECLERC', 'PASSAGE EN CAISSE'],
      profile_key: 'leclerc',
    },
  };
  
  let bestVocabMatch: { profile: StoreChainProfile; confidence: number; name: string } | null = null;
  
  for (const [key, signature] of Object.entries(vocabularySignatures)) {
    let matchCount = 0;
    for (const keyword of signature.keywords) {
      if (upperText.includes(keyword)) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      const profile = STORE_CHAIN_PROFILES[signature.profile_key];
      if (profile) {
        const confidence = 0.5 + (matchCount / signature.keywords.length) * 0.2; // Max 0.7
        if (!bestVocabMatch || confidence > bestVocabMatch.confidence) {
          bestVocabMatch = { profile, confidence, name: key };
        }
      }
    }
  }
  
  return bestVocabMatch;
}

/**
 * Get detection confidence description for UI
 */
export function getConfidenceDescription(confidence: number): string {
  if (confidence >= 0.85) {
    return 'Enseigne détectée avec haute confiance';
  } else if (confidence >= 0.7) {
    return 'Enseigne probablement détectée';
  } else if (confidence >= 0.5) {
    return 'Enseigne possiblement détectée';
  } else {
    return 'Enseigne non détectée - profil générique utilisé';
  }
}

/**
 * Validate that a profile is suitable for the detected text
 * Additional safety check
 */
export function validateProfileForText(profile: StoreChainProfile, ocrText: string): boolean {
  // Check decimal separator consistency
  const commaCount = (ocrText.match(/,/g) || []).length;
  const dotCount = (ocrText.match(/\./g) || []).length;
  
  if (profile.decimal === ',' && dotCount > commaCount * 2) {
    return false; // Profile expects comma but text has mostly dots
  }
  
  if (profile.decimal === '.' && commaCount > dotCount * 2) {
    return false; // Profile expects dot but text has mostly commas
  }
  
  return true;
}
