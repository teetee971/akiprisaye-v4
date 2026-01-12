/**
 * Non-Food Products & Services Extension Types
 * 
 * Extends OCR analysis beyond food products
 * Each domain isolated, specific methodology, NO abusive comparison
 * 
 * Philosophy: "Extend responsibly, compare fairly"
 */

export type ProductServiceDomain = 
  | 'alimentaire' // Food (base)
  | 'services_essentiels' // Essential services
  | 'logistique_transport' // Logistics & transport
  | 'non_alimentaire' // Non-food products
  | 'mixte'; // Mixed (flagged for review)

export type ServiceType = 
  | 'eau' | 'electricite' | 'gaz'
  | 'internet' | 'mobile' | 'tv'
  | 'transport_public';

export type LogisticsType =
  | 'billet_avion' | 'billet_bateau'
  | 'fret' | 'surcharge_carburant'
  | 'frais_portuaire';

export type NonFoodProductType =
  | 'hygiene' | 'entretien'
  | 'scolaire' | 'bebe'
  | 'bricolage_base';

export type DocumentType =
  | 'ticket_caisse' // Regular receipt
  | 'facture' // Bill (services)
  | 'abonnement' // Subscription
  | 'billet' // Ticket
  | 'devis' // Quote
  | 'contrat'; // Contract

/**
 * OCR adaptations per document type
 */
export type OCRAdaptation = {
  document_type: DocumentType;
  specific_fields: string[];
  date_handling: 'single' | 'period' | 'multiple';
  amount_detection: 'line_items' | 'total_only' | 'breakdown';
  special_rules: string[];
};

/**
 * Domain-specific receipt
 */
export type DomainReceipt = {
  domain: ProductServiceDomain;
  document_type: DocumentType;
  
  // Standard fields
  items: DomainReceiptItem[];
  total?: number;
  date: string | { start: string; end: string }; // Period for bills
  
  // Domain-specific
  provider?: string; // For services
  route?: { origin: string; destination: string }; // For transport
  subscription_period?: 'mensuel' | 'annuel'; // For subscriptions
  
  // Metadata
  ocr_adaptation_used: string;
  processing_notes: string[];
};

export type DomainReceiptItem = {
  label: string;
  amount: number;
  unit?: string;
  category?: string;
  is_fixed_fee?: boolean; // For logistics
  is_variable?: boolean;
  period?: string; // For recurring charges
};

/**
 * Domain isolation rules
 */
export type DomainIsolationRules = {
  domain: ProductServiceDomain;
  can_compare_with: ProductServiceDomain[];
  comparison_warnings: string[];
  specific_methodology: string;
  display_separately: boolean;
};

/**
 * Get OCR adaptation for document type
 */
export function getOCRAdaptation(documentType: DocumentType): OCRAdaptation {
  const adaptations: Record<DocumentType, OCRAdaptation> = {
    ticket_caisse: {
      document_type: 'ticket_caisse',
      specific_fields: ['product', 'price', 'quantity'],
      date_handling: 'single',
      amount_detection: 'line_items',
      special_rules: ['Standard receipt processing'],
    },
    
    facture: {
      document_type: 'facture',
      specific_fields: ['period', 'consumption', 'fixed_charges', 'variable_charges', 'taxes'],
      date_handling: 'period',
      amount_detection: 'breakdown',
      special_rules: [
        'Extract billing period',
        'Separate fixed and variable charges',
        'Identify consumption units',
      ],
    },
    
    abonnement: {
      document_type: 'abonnement',
      specific_fields: ['service_name', 'monthly_fee', 'annual_fee', 'options'],
      date_handling: 'single',
      amount_detection: 'total_only',
      special_rules: [
        'Detect subscription frequency (monthly/annual)',
        'Identify included services',
        'Extract optional additions',
      ],
    },
    
    billet: {
      document_type: 'billet',
      specific_fields: ['origin', 'destination', 'date', 'class', 'fare_type'],
      date_handling: 'single',
      amount_detection: 'breakdown',
      special_rules: [
        'Extract route information',
        'Identify fare class',
        'Detect surcharges',
      ],
    },
    
    devis: {
      document_type: 'devis',
      specific_fields: ['services', 'labor', 'materials', 'taxes'],
      date_handling: 'single',
      amount_detection: 'breakdown',
      special_rules: [
        'Read-only mode (not final price)',
        'Extract itemized costs',
      ],
    },
    
    contrat: {
      document_type: 'contrat',
      specific_fields: ['terms', 'duration', 'monthly_amount', 'conditions'],
      date_handling: 'period',
      amount_detection: 'total_only',
      special_rules: [
        'Extract contractual terms',
        'Identify commitment duration',
      ],
    },
  };
  
  return adaptations[documentType];
}

/**
 * Get domain isolation rules
 */
export function getDomainIsolationRules(domain: ProductServiceDomain): DomainIsolationRules {
  const rules: Record<ProductServiceDomain, DomainIsolationRules> = {
    alimentaire: {
      domain: 'alimentaire',
      can_compare_with: ['alimentaire'],
      comparison_warnings: [],
      specific_methodology: 'Tickets de caisse alimentaire standard',
      display_separately: false,
    },
    
    services_essentiels: {
      domain: 'services_essentiels',
      can_compare_with: ['services_essentiels'],
      comparison_warnings: [
        '⚠️ Les services essentiels ne sont pas comparables aux produits alimentaires',
        'Méthodologie spécifique : analyse de factures avec périodes',
      ],
      specific_methodology: 'Factures de services avec consommation et abonnement',
      display_separately: true,
    },
    
    logistique_transport: {
      domain: 'logistique_transport',
      can_compare_with: ['logistique_transport'],
      comparison_warnings: [
        '⚠️ Les coûts de transport ne sont pas comparables aux produits',
        'Inclut : billets, fret, surcharges variables',
      ],
      specific_methodology: 'Billets et factures de transport/fret',
      display_separately: true,
    },
    
    non_alimentaire: {
      domain: 'non_alimentaire',
      can_compare_with: ['non_alimentaire'],
      comparison_warnings: [
        'Produits non alimentaires - comparaison intra-domaine uniquement',
      ],
      specific_methodology: 'Tickets de caisse non-alimentaire',
      display_separately: true,
    },
    
    mixte: {
      domain: 'mixte',
      can_compare_with: [], // Cannot compare mixed
      comparison_warnings: [
        '⚠️ Ticket mixte détecté - séparation manuelle recommandée',
        'Les tickets mixtes nécessitent une revue utilisateur',
      ],
      specific_methodology: 'Nécessite séparation manuelle par domaine',
      display_separately: true,
    },
  };
  
  return rules[domain];
}

/**
 * Detect document domain
 */
export function detectDocumentDomain(text: string, documentType: DocumentType): ProductServiceDomain {
  const upperText = text.toUpperCase();
  
  // Service keywords
  const serviceKeywords = ['FACTURE', 'CONSOMMATION', 'ABONNEMENT', 'kWh', 'm³', 'ELECTRICITE', 'EAU', 'GAZ'];
  const hasServiceKeywords = serviceKeywords.some(kw => upperText.includes(kw));
  
  // Transport keywords
  const transportKeywords = ['BILLET', 'VOL', 'TRAJET', 'FRET', 'CARGO', 'SURCHARGE'];
  const hasTransportKeywords = transportKeywords.some(kw => upperText.includes(kw));
  
  // Non-food product keywords
  const nonFoodKeywords = ['HYGIENE', 'LESSIVE', 'SHAMPOOING', 'COUCHE', 'CAHIER'];
  const hasNonFoodKeywords = nonFoodKeywords.some(kw => upperText.includes(kw));
  
  // Determine domain
  if (documentType === 'facture' || hasServiceKeywords) {
    return 'services_essentiels';
  }
  
  if (documentType === 'billet' || hasTransportKeywords) {
    return 'logistique_transport';
  }
  
  if (hasNonFoodKeywords) {
    return 'non_alimentaire';
  }
  
  // Check if mixed
  const domainCount = [hasServiceKeywords, hasTransportKeywords, hasNonFoodKeywords].filter(Boolean).length;
  if (domainCount > 1) {
    return 'mixte';
  }
  
  // Default to food
  return 'alimentaire';
}

/**
 * Get domain-specific safeguards
 */
export function getDomainSafeguards(): {
  no_abusive_comparison: string;
  no_mixed_basket: string;
  no_best_price_across: string;
  methodology_requirement: string;
} {
  return {
    no_abusive_comparison: 
      '❌ Les comparaisons entre domaines différents sont interdites (ex: électricité vs alimentaire)',
    no_mixed_basket: 
      '❌ Aucun panier mixte trompeur - chaque domaine est traité séparément',
    no_best_price_across: 
      '❌ Pas de "meilleur prix" inter-domaines - comparaison intra-domaine uniquement',
    methodology_requirement: 
      '✅ Chaque domaine a sa méthodologie spécifique affichée',
  };
}

/**
 * Get user restitution format by domain
 */
export function getUserRestitutionFormat(domain: ProductServiceDomain): {
  separate_view: boolean;
  contextual_warning: string;
  read_only_option: boolean;
} {
  const formats: Record<ProductServiceDomain, any> = {
    alimentaire: {
      separate_view: false,
      contextual_warning: '',
      read_only_option: false,
    },
    services_essentiels: {
      separate_view: true,
      contextual_warning: 'Services essentiels - Analyse de factures avec périodes de facturation',
      read_only_option: true,
    },
    logistique_transport: {
      separate_view: true,
      contextual_warning: 'Transport & logistique - Inclut surcharges et frais variables',
      read_only_option: true,
    },
    non_alimentaire: {
      separate_view: true,
      contextual_warning: 'Produits non alimentaires - Méthodologie adaptée',
      read_only_option: false,
    },
    mixte: {
      separate_view: true,
      contextual_warning: '⚠️ Ticket mixte - Revue manuelle recommandée',
      read_only_option: true,
    },
  };
  
  return formats[domain];
}

/**
 * Public value by stakeholder
 */
export function getPublicValueByStakeholder(): {
  citoyen: string[];
  presse: string[];
  collectivites: string[];
  etat: string[];
} {
  return {
    citoyen: [
      'Compréhension réelle du coût de la vie (au-delà de l\'alimentaire)',
      'Vision complète des dépenses contraintes',
      'Transparence sur les services essentiels',
    ],
    presse: [
      'Données solides sur l\'ensemble des postes de dépense',
      'Comparaisons territoriales fiables',
      'Base factuelle pour enquêtes',
    ],
    collectivites: [
      'Indicateurs objectifs sur le coût de la vie local',
      'Identification des postes problématiques',
      'Suivi de l\'évolution par domaine',
    ],
    etat: [
      'Base neutre d\'analyse multi-domaines',
      'Détection des tensions économiques',
      'Suivi de la vie chère hors alimentaire',
    ],
  };
}
