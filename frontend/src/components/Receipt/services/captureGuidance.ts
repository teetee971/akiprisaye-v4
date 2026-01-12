/**
 * Camera Capture Best Practices & Guidance
 * 
 * User-friendly recommendations for optimal receipt photography
 * Designed for DOM territories, general public, robust OCR
 * NO special equipment required
 * 
 * Philosophy: "Help, don't blame - guide, don't frustrate"
 */

export type CaptureGuidanceType = 
  | 'positioning' 
  | 'angle' 
  | 'distance' 
  | 'lighting' 
  | 'content' 
  | 'quality';

export type CaptureQualityFactor = {
  factor: string;
  status: 'good' | 'warning' | 'poor';
  message: string;
  recommendation?: string;
  icon: string;
};

export type CaptureQualityAssessment = {
  overall_score: number; // 0-100
  factors: CaptureQualityFactor[];
  is_acceptable: boolean;
  gentle_suggestions: string[];
};

/**
 * Positioning guidance
 */
export const POSITIONING_GUIDANCE = {
  title: 'Position du ticket',
  recommendations: [
    {
      icon: '✅',
      text: 'Ticket bien à plat',
      details: 'Sur une table, genoux, capot ou comptoir',
    },
    {
      icon: '❌',
      text: 'Éviter',
      details: 'Ticket froissé, roulé ou tenu à la main',
    },
  ],
  ui_hint: 'Afficher une silhouette de ticket "fantôme" à aligner',
};

/**
 * Angle guidance
 */
export const ANGLE_GUIDANCE = {
  title: 'Angle de prise de vue',
  optimal: '90° (perpendiculaire)',
  tolerance: '±10°',
  gentle_message: 'Redresse légèrement le téléphone pour une meilleure lecture',
  avoid: [
    'Angle trop oblique',
    'Perspective trop marquée',
  ],
};

/**
 * Distance guidance
 */
export const DISTANCE_GUIDANCE = {
  title: 'Distance idéale',
  optimal_fill: '70-85% de l\'image',
  too_far: 'Texte trop petit',
  too_close: 'Coupure des bords',
  ui_element: 'Barre visuelle "trop loin / parfait / trop près"',
};

/**
 * Lighting guidance
 */
export const LIGHTING_GUIDANCE = {
  title: 'Éclairage',
  recommended: 'Lumière naturelle',
  avoid: [
    {
      issue: 'Flash direct',
      reason: 'Reflets sur papier thermique',
    },
    {
      issue: 'Ombres du téléphone',
      reason: 'Masque le texte',
    },
    {
      issue: 'Lumière jaune forte',
      reason: 'Altère le contraste',
    },
  ],
  gentle_message: 'Ajoute un peu de lumière, sans flash si possible',
};

/**
 * Content guidance (what should appear)
 */
export const CONTENT_GUIDANCE = {
  title: 'Zones clés à inclure',
  required_zones: [
    { zone: 'Nom de l\'enseigne', importance: 'high' },
    { zone: 'Date', importance: 'high' },
    { zone: 'Lignes produits', importance: 'high' },
    { zone: 'Prix unitaires', importance: 'high' },
    { zone: 'Total', importance: 'medium' },
  ],
  avoid: [
    'Couper le haut (nom magasin)',
    'Couper le bas (total)',
    'Photos partielles sans fusion',
  ],
  missing_info_message: 'Certaines infos sont absentes, la comparaison peut être limitée',
};

/**
 * Educational messages (rotating, non-blaming)
 */
export const EDUCATIONAL_MESSAGES = [
  '💡 Un ticket bien à plat = meilleurs résultats',
  '☀️ La lumière naturelle aide beaucoup',
  '📸 Pas besoin de flash',
  '📄 Les tickets longs peuvent être pris en plusieurs photos',
  '✨ Stabilise le téléphone quelques secondes',
  '🎯 Centre le ticket dans le cadre',
  '📏 Le ticket doit occuper la majorité de l\'image',
  '🔆 Évite les reflets brillants',
];

/**
 * Privacy reassurance messages
 */
export const PRIVACY_REASSURANCE = {
  always_display: [
    '🔒 Traitement local uniquement',
    '❌ Pas de reconnaissance faciale',
    '❌ Pas de données personnelles exploitées',
    '🗑️ Suppression possible à tout moment',
  ],
  full_statement: `
    Toutes les photos sont traitées localement sur votre appareil.
    Aucune image n'est transmise.
    Aucune reconnaissance faciale.
    Vous pouvez supprimer vos données à tout moment.
  `.trim(),
};

/**
 * Assess capture quality (real-time or post-capture)
 */
export function assessCaptureQuality(
  imageAnalysis: {
    sharpness: number; // 0-100
    brightness: number; // 0-255
    contrast: number; // 0-100
    fillPercentage: number; // 0-100
    angleDegrees: number; // 0-90
  }
): CaptureQualityAssessment {
  const factors: CaptureQualityFactor[] = [];
  
  // Sharpness check
  if (imageAnalysis.sharpness >= 70) {
    factors.push({
      factor: 'Netteté',
      status: 'good',
      message: 'Image nette',
      icon: '✔',
    });
  } else if (imageAnalysis.sharpness >= 50) {
    factors.push({
      factor: 'Netteté',
      status: 'warning',
      message: 'Image légèrement floue',
      recommendation: 'Stabilise le téléphone',
      icon: 'ℹ️',
    });
  } else {
    factors.push({
      factor: 'Netteté',
      status: 'poor',
      message: 'Image floue',
      recommendation: 'Reprends la photo en stabilisant le téléphone',
      icon: '⚠️',
    });
  }
  
  // Brightness check
  if (imageAnalysis.brightness >= 100 && imageAnalysis.brightness <= 200) {
    factors.push({
      factor: 'Luminosité',
      status: 'good',
      message: 'Bon éclairage',
      icon: '✔',
    });
  } else if (imageAnalysis.brightness < 100) {
    factors.push({
      factor: 'Luminosité',
      status: 'warning',
      message: 'Image un peu sombre',
      recommendation: 'Ajoute un peu de lumière (sans flash)',
      icon: 'ℹ️',
    });
  } else {
    factors.push({
      factor: 'Luminosité',
      status: 'warning',
      message: 'Image très claire',
      recommendation: 'Réduis l\'éclairage ou évite le flash',
      icon: 'ℹ️',
    });
  }
  
  // Fill percentage check
  if (imageAnalysis.fillPercentage >= 70 && imageAnalysis.fillPercentage <= 85) {
    factors.push({
      factor: 'Cadrage',
      status: 'good',
      message: 'Ticket bien cadré',
      icon: '✔',
    });
  } else if (imageAnalysis.fillPercentage < 70) {
    factors.push({
      factor: 'Cadrage',
      status: 'warning',
      message: 'Ticket un peu loin',
      recommendation: 'Rapproche légèrement',
      icon: 'ℹ️',
    });
  } else {
    factors.push({
      factor: 'Cadrage',
      status: 'warning',
      message: 'Ticket trop proche',
      recommendation: 'Éloigne un peu pour voir les bords',
      icon: 'ℹ️',
    });
  }
  
  // Angle check
  if (imageAnalysis.angleDegrees <= 10) {
    factors.push({
      factor: 'Angle',
      status: 'good',
      message: 'Vue perpendiculaire',
      icon: '✔',
    });
  } else {
    factors.push({
      factor: 'Angle',
      status: 'warning',
      message: 'Angle légèrement oblique',
      recommendation: 'Tiens le téléphone bien droit au-dessus du ticket',
      icon: 'ℹ️',
    });
  }
  
  // Calculate overall score
  const goodCount = factors.filter(f => f.status === 'good').length;
  const warningCount = factors.filter(f => f.status === 'warning').length;
  const poorCount = factors.filter(f => f.status === 'poor').length;
  
  const overall_score = (goodCount * 100 + warningCount * 60 + poorCount * 20) / factors.length;
  
  // Generate gentle suggestions
  const gentle_suggestions = factors
    .filter(f => f.recommendation)
    .map(f => f.recommendation!);
  
  return {
    overall_score: Math.round(overall_score),
    factors,
    is_acceptable: overall_score >= 50 && poorCount === 0,
    gentle_suggestions,
  };
}

/**
 * Get quality score display (non-blaming)
 */
export function getQualityScoreDisplay(score: number): {
  label: string;
  color: string;
  icon: string;
  message: string;
} {
  if (score >= 80) {
    return {
      label: 'Excellente',
      color: '#10B981',
      icon: '✨',
      message: 'Qualité du scan : Excellente',
    };
  } else if (score >= 60) {
    return {
      label: 'Bonne',
      color: '#3B82F6',
      icon: '✔',
      message: 'Qualité du scan : Bonne',
    };
  } else if (score >= 40) {
    return {
      label: 'Correcte',
      color: '#F59E0B',
      icon: 'ℹ️',
      message: 'Qualité du scan : Correcte',
    };
  } else {
    return {
      label: 'À améliorer',
      color: '#9CA3AF',
      icon: '💡',
      message: 'Qualité du scan : À améliorer',
    };
  }
  
  // NEVER: "mauvais scan", "erreur utilisateur"
}

/**
 * Get random educational tip
 */
export function getRandomEducationalTip(): string {
  const index = Math.floor(Math.random() * EDUCATIONAL_MESSAGES.length);
  return EDUCATIONAL_MESSAGES[index];
}

/**
 * Get checklist for user (integrable UI)
 */
export function getCaptureChecklist(): {
  item: string;
  icon: string;
  priority: 'high' | 'medium';
}[] {
  return [
    { item: 'Ticket à plat', icon: '✔', priority: 'high' },
    { item: 'Angle droit', icon: '✔', priority: 'high' },
    { item: 'Bonne lumière', icon: '✔', priority: 'high' },
    { item: 'Ticket centré', icon: '✔', priority: 'medium' },
    { item: 'Multi-photo autorisée', icon: '✔', priority: 'medium' },
    { item: 'Feedback visuel doux', icon: '✔', priority: 'medium' },
  ];
}

/**
 * Real-time blur detection message
 */
export function getBlurDetectionMessage(blurLevel: 'none' | 'slight' | 'heavy'): {
  should_warn: boolean;
  message?: string;
  vibrate: boolean;
} {
  switch (blurLevel) {
    case 'none':
      return { should_warn: false, vibrate: false };
    
    case 'slight':
      return {
        should_warn: true,
        message: 'Image légèrement floue, stabilise le téléphone',
        vibrate: true, // Light vibration
      };
    
    case 'heavy':
      return {
        should_warn: true,
        message: 'Image floue - maintiens le téléphone stable',
        vibrate: true, // Stronger vibration
      };
  }
}

/**
 * Multi-photo progress indicator
 */
export function getMultiPhotoProgressMessage(current: number, total: number, zone: string): string {
  return `Photo ${current}/${total} — ${zone}`;
}

/**
 * Multi-photo zone guidance
 */
export const MULTI_PHOTO_ZONES = [
  {
    id: 'top',
    label: 'Haut du ticket',
    description: 'Capture le nom de l\'enseigne et la date',
    icon: '📄',
  },
  {
    id: 'middle',
    label: 'Lignes produits',
    description: 'Capture les articles et leurs prix',
    icon: '🛒',
  },
  {
    id: 'bottom',
    label: 'Totaux et bas',
    description: 'Capture les totaux et le bas du ticket',
    icon: '💶',
  },
];
