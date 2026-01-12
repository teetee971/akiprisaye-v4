export type ReceiptProduct = {
  libelle_ticket: string;
  prix: number;
  quantite: number;
  ean: string | null;
  confiance: 'manuel' | 'ocr' | 'hybride';
};

export type ReceiptMagasin = {
  nom: string;
  adresse: string;
};

export type ReceiptPreuve = {
  image: string;
  ocr_local: boolean;
};

export type ReceiptCaptureSession = {
  sessionId: string;
  images: Blob[];
  createdAt: number;
};

export type ObservationSourceType = 
  | 'ticket_caisse'           // Receipt/till slip (existing)
  | 'etiquette_rayon'         // Shelf label
  | 'presentoir_promo';       // Promotional display

export type ReceiptData = {
  type: ObservationSourceType;
  territoire: string;
  enseigne: string;
  magasin: ReceiptMagasin;
  date_achat: string;
  heure_achat: string;
  produits: ReceiptProduct[];
  preuve: ReceiptPreuve;
  auteur: string;
  niveau_confiance_global: 'faible' | 'moyen' | 'élevé';
  statut: 'valide' | 'en_attente' | 'rejeté';
  // Optional metadata for enhanced traceability
  source_metadata?: {
    is_promotional?: boolean;   // If promotional display
    capture_quality?: 'high' | 'medium' | 'low';
    geolocation?: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  };
};

export type ReceiptQualityBadge = {
  level: 'minimal' | 'limited' | 'multiple' | 'insufficient';
  label: string;
  icon: string;
  color: string;
};

export const getQualityBadge = (observationCount: number): ReceiptQualityBadge => {
  if (observationCount === 0) {
    return {
      level: 'insufficient',
      label: 'Données insuffisantes',
      icon: '🔴',
      color: 'red',
    };
  }
  if (observationCount === 1) {
    return {
      level: 'minimal',
      label: 'Observation isolée',
      icon: '🟡',
      color: 'yellow',
    };
  }
  if (observationCount < 3) {
    return {
      level: 'limited',
      label: 'Données limitées',
      icon: '🟡',
      color: 'yellow',
    };
  }
  return {
    level: 'multiple',
    label: 'Observations multiples',
    icon: '🟢',
    color: 'green',
  };
};

export const getSourceTypeLabel = (sourceType: ObservationSourceType): string => {
  switch (sourceType) {
    case 'ticket_caisse':
      return 'Ticket de caisse';
    case 'etiquette_rayon':
      return 'Étiquette rayon';
    case 'presentoir_promo':
      return 'Présentoir promotionnel';
    default:
      return 'Source inconnue';
  }
};

export const getSourceTypeDescription = (sourceType: ObservationSourceType): string => {
  switch (sourceType) {
    case 'ticket_caisse':
      return 'Prix capturé depuis un ticket de caisse validé avec date et heure précises';
    case 'etiquette_rayon':
      return 'Prix observé sur étiquette de rayon en magasin';
    case 'presentoir_promo':
      return 'Prix promotionnel observé - marqué comme offre temporaire';
    default:
      return '';
  }
};
