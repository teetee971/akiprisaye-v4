import { ReceiptLine } from '../../../types/receiptLine';
import { PRODUCT_REFERENCE_DICTIONARY, ProductReference } from './productReferenceDictionary';

/**
 * Local AI-Assisted OCR Enhancement
 * 
 * Uses local heuristics and embedded models to improve OCR quality
 * NO cloud, NO generative AI, NO price invention
 * 
 * Philosophy: "Correct, classify, match, verify - never invent"
 */

export type AIEnhancedLine = ReceiptLine & {
  ai_enhanced: boolean;
  original_raw: string;
  suggested_correction?: string;
  matched_product?: ProductReference;
  confidence_score: number;
  enhancement_reason?: string;
};

export type AIEnhancementResult = {
  enhanced_lines: AIEnhancedLine[];
  false_positives_removed: number;
  products_matched: number;
  corrections_suggested: number;
  overall_confidence: number;
};

const FALSE_POSITIVE_PATTERNS = [
  // Receipt metadata (not products)
  /^(TICKET|CAISSE|CB|MERCI|BONNE|AU REVOIR|WWW\.|TEL|SIRET)/i,
  // Dates and times
  /^\d{2}[\/\-]\d{2}[\/\-]\d{2,4}$/,
  /^\d{2}:\d{2}:\d{2}$/,
  // Internal numbers
  /^N[°º]\s*\d+$/i,
  /^REF\s*\d+$/i,
  // Empty or very short
  /^[\s\-_\.]+$/,
];

/**
 * Enhance OCR lines with local AI assistance
 */
export function enhanceWithLocalAI(lines: ReceiptLine[]): AIEnhancementResult {
  const enhanced_lines: AIEnhancedLine[] = [];
  let false_positives_removed = 0;
  let products_matched = 0;
  let corrections_suggested = 0;

  for (const line of lines) {
    // Step 1: Check for false positives
    if (isFalsePositive(line.raw)) {
      false_positives_removed++;
      continue; // Skip this line
    }

    // Step 2: Try to match with product dictionary
    const matchResult = matchProductFuzzy(line.raw);

    // Step 3: Verify price coherence if product matched
    let confidence_score = calculateLineConfidence(line, matchResult);

    // Step 4: Check price plausibility
    if (line.price !== undefined && matchResult.product) {
      confidence_score *= checkPricePlausibility(line.price, matchResult.product);
    }

    // Create enhanced line
    const enhanced: AIEnhancedLine = {
      ...line,
      ai_enhanced: matchResult.matched || false,
      original_raw: line.raw,
      confidence_score,
    };

    if (matchResult.matched && matchResult.product) {
      enhanced.matched_product = matchResult.product;
      enhanced.suggested_correction = matchResult.corrected_text;
      enhanced.enhancement_reason = `Produit reconnu: ${matchResult.product.normalized_name}`;
      products_matched++;
      
      if (matchResult.corrected_text !== line.raw) {
        corrections_suggested++;
      }
    }

    enhanced_lines.push(enhanced);
  }

  // Calculate overall confidence
  const overall_confidence = enhanced_lines.length > 0
    ? enhanced_lines.reduce((sum, line) => sum + line.confidence_score, 0) / enhanced_lines.length
    : 0;

  return {
    enhanced_lines,
    false_positives_removed,
    products_matched,
    corrections_suggested,
    overall_confidence,
  };
}

/**
 * Check if a line is a false positive (not a product)
 */
function isFalsePositive(text: string): boolean {
  const trimmed = text.trim();
  
  // Too short
  if (trimmed.length < 3) return true;
  
  // Check patterns
  for (const pattern of FALSE_POSITIVE_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }
  
  return false;
}

/**
 * Fuzzy match product text with reference dictionary
 */
function matchProductFuzzy(text: string): {
  matched: boolean;
  product?: ProductReference;
  corrected_text?: string;
  similarity: number;
} {
  const normalizedText = text.toUpperCase().trim();
  let bestMatch: { product: ProductReference; similarity: number; variant: string } | null = null;

  for (const product of PRODUCT_REFERENCE_DICTIONARY) {
    // Check exact match with variants
    for (const variant of product.common_variants) {
      if (normalizedText.includes(variant)) {
        return {
          matched: true,
          product,
          corrected_text: product.normalized_name,
          similarity: 1.0,
        };
      }
    }

    // Check fuzzy similarity
    for (const variant of product.common_variants) {
      const similarity = calculateStringSimilarity(normalizedText, variant);
      if (similarity > 0.75 && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = { product, similarity, variant };
      }
    }
  }

  if (bestMatch && bestMatch.similarity > 0.8) {
    return {
      matched: true,
      product: bestMatch.product,
      corrected_text: bestMatch.product.normalized_name,
      similarity: bestMatch.similarity,
    };
  }

  return {
    matched: false,
    similarity: 0,
  };
}

/**
 * Calculate string similarity (Levenshtein-based)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate confidence score for a line
 */
function calculateLineConfidence(
  line: ReceiptLine,
  matchResult: { matched: boolean; similarity: number }
): number {
  let confidence = 0.5; // Base confidence

  // Bonus for matched product
  if (matchResult.matched) {
    confidence += 0.3 * matchResult.similarity;
  }

  // Bonus for having price
  if (line.price !== undefined && line.price > 0) {
    confidence += 0.1;
  }

  // Bonus for having quantity
  if (line.quantity !== undefined && line.quantity > 0) {
    confidence += 0.05;
  }

  // Bonus for complete label
  if (line.label && line.label.length > 5) {
    confidence += 0.05;
  }

  return Math.min(1.0, confidence);
}

/**
 * Check price plausibility against product reference
 */
function checkPricePlausibility(price: number, product: ProductReference): number {
  if (!product.typical_unit_price_range) return 1.0;

  const range = product.typical_unit_price_range;

  // Price within expected range
  if (price >= range.min && price <= range.max) {
    return 1.0;
  }

  // Price slightly outside range (warning but not impossible)
  if (price >= range.min * 0.5 && price <= range.max * 2) {
    return 0.7;
  }

  // Price very far from expected (suspicious)
  return 0.3;
}

/**
 * Merge duplicate lines intelligently across photos
 */
export function mergeLinesSmart(
  linesPhoto1: AIEnhancedLine[],
  linesPhoto2: AIEnhancedLine[]
): AIEnhancedLine[] {
  const merged: AIEnhancedLine[] = [];
  const used = new Set<number>();

  // For each line in photo 1
  for (const line1 of linesPhoto1) {
    let bestMatch: { line: AIEnhancedLine; index: number; similarity: number } | null = null;

    // Look for matches in photo 2
    linesPhoto2.forEach((line2, index) => {
      if (used.has(index)) return;

      const similarity = calculateStringSimilarity(
        line1.raw.toUpperCase(),
        line2.raw.toUpperCase()
      );

      // Same product and similar text
      if (similarity > 0.85 && line1.price === line2.price) {
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = { line: line2, index, similarity };
        }
      }
    });

    if (bestMatch) {
      // Found duplicate - keep better quality version
      const betterLine = line1.confidence_score >= bestMatch.line.confidence_score
        ? line1
        : bestMatch.line;
      
      merged.push({
        ...betterLine,
        enhancement_reason: `${betterLine.enhancement_reason || ''} (dédoublonné)`.trim(),
      });
      
      used.add(bestMatch.index);
    } else {
      merged.push(line1);
    }
  }

  // Add remaining lines from photo 2
  linesPhoto2.forEach((line, index) => {
    if (!used.has(index)) {
      merged.push(line);
    }
  });

  return merged;
}

/**
 * Get AI enhancement summary for display
 */
export function getEnhancementSummary(result: AIEnhancementResult): string {
  const parts: string[] = [];

  if (result.products_matched > 0) {
    parts.push(`${result.products_matched} produit${result.products_matched > 1 ? 's' : ''} reconnu${result.products_matched > 1 ? 's' : ''}`);
  }

  if (result.corrections_suggested > 0) {
    parts.push(`${result.corrections_suggested} suggestion${result.corrections_suggested > 1 ? 's' : ''}`);
  }

  if (result.false_positives_removed > 0) {
    parts.push(`${result.false_positives_removed} ligne${result.false_positives_removed > 1 ? 's' : ''} filtrée${result.false_positives_removed > 1 ? 's' : ''}`);
  }

  parts.push(`Confiance : ${(result.overall_confidence * 100).toFixed(0)}%`);

  return parts.join(' • ');
}

/**
 * Mandatory AI disclosure
 */
export const AI_ASSISTANCE_NOTICE = 
  "L'analyse est assistée par des règles locales et des référentiels embarqués. " +
  "Aucun calcul externe. Aucun apprentissage.";
