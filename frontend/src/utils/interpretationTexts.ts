/**
 * Fixed Interpretation Texts
 * 
 * Pre-written, auditable, legally-safe interpretation texts
 * based on observation volume levels
 * 
 * No dynamic generation - all texts are fixed and validated
 */

export type ObservationLevel = 'minimal' | 'faible' | 'modéré' | 'fort' | 'maximal';

/**
 * Fixed interpretation texts by observation level
 * These texts are strictly descriptive with no value judgments
 */
export const INTERPRETATION_TEXT: Record<ObservationLevel, string> = {
  minimal:
    "Les données actuellement disponibles sont peu nombreuses. Elles permettent une observation ponctuelle mais ne couvrent pas l'ensemble des situations possibles.",
  faible:
    "Les données disponibles offrent une première vision descriptive. Le volume observé reste partiel et peut évoluer avec de nouveaux relevés.",
  modéré:
    "Le volume de données permet une lecture descriptive plus structurée. Les observations couvrent une diversité raisonnable de situations.",
  fort:
    "Les données observées sont nombreuses et couvrent une large partie des situations recensées sur la période analysée.",
  maximal:
    "Le volume d'observations atteint un niveau élevé. Les données couvrent une très grande diversité de situations observées.",
};

/**
 * Additional context text templates
 */
export const CONTEXT_TEMPLATES = {
  automatic:
    'Cette interprétation est générée automatiquement à partir du volume d\'observations disponibles',
  legal:
    'Ce texte est informatif. Il ne constitue ni une analyse économique, ni une recommandation, ni une comparaison entre enseignes.',
};

/**
 * Scope labels in French
 */
export const SCOPE_LABELS: Record<string, string> = {
  territoire: 'territoire',
  magasin: 'magasin',
  produit: 'produit',
  'multi-territoires': 'multi-territoires',
  global: 'ensemble des données',
};

/**
 * Validate that interpretation text follows neutrality rules
 * @param text - Text to validate
 * @returns true if neutral, false otherwise
 */
export function validateInterpretationNeutrality(text: string): boolean {
  // Prohibited terms (value judgments)
  const prohibitedTerms = [
    'fiable',
    'non fiable',
    'prix élevés',
    'prix bas',
    'meilleure enseigne',
    'suffisant pour conclure',
    'recommandé',
    'déconseillé',
    'bon',
    'mauvais',
    'anormal',
    'suspect',
  ];

  const lowerText = text.toLowerCase();
  
  for (const term of prohibitedTerms) {
    if (lowerText.includes(term.toLowerCase())) {
      return false;
    }
  }

  return true;
}

/**
 * Get interpretation text for a given level
 * With built-in validation
 * 
 * @param level - Observation level
 * @returns Validated interpretation text
 * @throws Error if level is invalid or text fails validation
 */
export function getInterpretationText(level: ObservationLevel): string {
  const text = INTERPRETATION_TEXT[level];
  
  if (!text) {
    throw new Error(`Invalid observation level: ${level}`);
  }

  if (!validateInterpretationNeutrality(text)) {
    throw new Error(`Interpretation text failed neutrality validation for level: ${level}`);
  }

  return text;
}
