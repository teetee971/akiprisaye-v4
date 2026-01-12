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

export type ReceiptData = {
  type: 'ticket_caisse';
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
