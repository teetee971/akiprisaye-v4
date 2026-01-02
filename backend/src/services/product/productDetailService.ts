/**
 * Product Detail Service - Service d'analyse factuelle de produits
 * Version: 1.9.0
 * 
 * Conformité:
 * - Lecture seule - Données observées uniquement
 * - Aucune recommandation - Aucun conseil
 * - Aucune notation propriétaire
 * - Sources citées obligatoires
 * 
 * Fonctionnalités:
 * - Parsing structuré des ingrédients
 * - Détection des allergènes déclarés
 * - Identification des additifs (codes E)
 * - Mentions légales et origine
 * - Métadonnées de qualité
 */

/**
 * Ingrédient structuré
 */
export interface Ingredient {
  /** Nom de l'ingrédient */
  name: string;
  /** Position dans la liste (1 = premier = plus présent) */
  order: number;
  /** Pourcentage si mentionné */
  percentage?: number;
  /** Est un allergène déclaré */
  isAllergen?: boolean;
  /** Est un additif (code E) */
  isAdditive?: boolean;
  /** Code additif si applicable */
  additiveCode?: string;
}

/**
 * Allergène déclaré
 */
export interface DeclaredAllergen {
  /** Nom de l'allergène */
  name: string;
  /** Type */
  type: 'contains' | 'may_contain';
}

/**
 * Origine du produit
 */
export interface ProductOrigin {
  /** Pays d'origine */
  country?: string;
  /** Lieu de fabrication */
  manufacturingLocation?: string;
  /** Lieu de conditionnement */
  packagingLocation?: string;
}

/**
 * Mentions légales observées
 */
export interface LegalMentions {
  /** Label bio */
  organicLabel?: string;
  /** Labels qualité */
  qualityLabels?: string[];
  /** Certifications */
  certifications?: string[];
  /** Avertissements */
  warnings?: string[];
}

/**
 * Métadonnées de qualité de l'analyse
 */
export interface AnalysisQuality {
  /** Lisibilité de l'étiquette (0-1) */
  readability: number;
  /** Complétude des données (0-1) */
  completeness: number;
  /** Date d'analyse */
  analysisDate: Date;
  /** Méthode d'analyse */
  analysisMethod: 'ocr' | 'manual' | 'database';
  /** Confiance globale (0-1) */
  confidence: number;
}

/**
 * Détails d'un produit
 */
export interface ProductDetails {
  /** EAN du produit */
  ean?: string;
  /** Nom du produit */
  productName: string;
  /** Marque */
  brand?: string;
  /** Liste des ingrédients structurée */
  ingredients: Ingredient[];
  /** Allergènes déclarés */
  allergens: DeclaredAllergen[];
  /** Additifs identifiés */
  additives: {
    code: string;
    name?: string;
    category?: string;
  }[];
  /** Origine */
  origin?: ProductOrigin;
  /** Mentions légales */
  legalMentions?: LegalMentions;
  /** Informations nutritionnelles observées */
  nutritionalInfo?: Record<string, string>;
  /** Métadonnées de qualité */
  quality: AnalysisQuality;
  /** Source de l'analyse */
  source: {
    origin: string;
    observationDate: Date;
    imageUrl?: string;
  };
}

/**
 * Historique d'un changement de composition
 */
export interface CompositionChange {
  /** Date du changement */
  changeDate: Date;
  /** Type de changement */
  changeType: 'ingredients' | 'allergens' | 'additives' | 'origin' | 'labels';
  /** Description du changement */
  description: string;
  /** Détails avant */
  before?: unknown;
  /** Détails après */
  after?: unknown;
  /** Source de l'observation */
  source: string;
}

/**
 * Service d'analyse de détails produit
 */
export class ProductDetailService {
  private static instance: ProductDetailService;
  private productDatabase: Map<string, ProductDetails> = new Map();
  private compositionHistory: Map<string, CompositionChange[]> = new Map();

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): ProductDetailService {
    if (!ProductDetailService.instance) {
      ProductDetailService.instance = new ProductDetailService();
    }
    return ProductDetailService.instance;
  }

  /**
   * Parse une liste d'ingrédients brute
   * Format typique: "Ingrédient1, Ingrédient2 (sous-ingrédient), Ingrédient3"
   */
  public parseIngredients(rawIngredients: string): Ingredient[] {
    const ingredients: Ingredient[] = [];
    
    // Nettoyage et séparation
    const parts = rawIngredients
      .split(',')
      .map(part => part.trim())
      .filter(part => part.length > 0);

    parts.forEach((part, index) => {
      // Extraction du pourcentage si présent (ex: "Tomate 50%")
      const percentageMatch = part.match(/(\d+(?:\.\d+)?)\s*%/);
      const percentage = percentageMatch ? parseFloat(percentageMatch[1]) : undefined;
      
      // Nettoyage du nom
      let name = part.replace(/\d+(?:\.\d+)?\s*%/, '').trim();
      name = name.replace(/\([^)]*\)/, '').trim(); // Retirer parenthèses
      
      // Détection additif (code E)
      const additiveMatch = name.match(/E\d{3,4}[a-z]?/i);
      const isAdditive = !!additiveMatch;
      const additiveCode = additiveMatch ? additiveMatch[0] : undefined;

      ingredients.push({
        name,
        order: index + 1,
        percentage,
        isAdditive,
        additiveCode,
      });
    });

    return ingredients;
  }

  /**
   * Identifie les additifs dans une liste d'ingrédients
   */
  public identifyAdditives(ingredients: Ingredient[]): Array<{
    code: string;
    name?: string;
    category?: string;
  }> {
    const additives: Array<{ code: string; name?: string; category?: string }> = [];

    ingredients
      .filter(ing => ing.isAdditive && ing.additiveCode)
      .forEach(ing => {
        additives.push({
          code: ing.additiveCode!,
          name: this.getAdditiveName(ing.additiveCode!),
          category: this.getAdditiveCategory(ing.additiveCode!),
        });
      });

    return additives;
  }

  /**
   * Parse les allergènes déclarés
   * Format typique: "Contient: lait, œufs. Peut contenir: fruits à coque"
   */
  public parseAllergens(rawAllergens: string): DeclaredAllergen[] {
    const allergens: DeclaredAllergen[] = [];

    // Détection "Contient:"
    const containsMatch = rawAllergens.match(/contient\s*:([^.]*)/i);
    if (containsMatch) {
      const items = containsMatch[1].split(',').map(s => s.trim());
      items.forEach(item => {
        if (item) {
          allergens.push({ name: item, type: 'contains' });
        }
      });
    }

    // Détection "Peut contenir:"
    const mayContainMatch = rawAllergens.match(/peut contenir\s*:([^.]*)/i);
    if (mayContainMatch) {
      const items = mayContainMatch[1].split(',').map(s => s.trim());
      items.forEach(item => {
        if (item) {
          allergens.push({ name: item, type: 'may_contain' });
        }
      });
    }

    return allergens;
  }

  /**
   * Enregistre les détails d'un produit
   */
  public storeProductDetails(ean: string, details: ProductDetails): void {
    this.productDatabase.set(ean, details);
  }

  /**
   * Récupère les détails d'un produit
   */
  public getProductDetails(ean: string): ProductDetails | undefined {
    return this.productDatabase.get(ean);
  }

  /**
   * Enregistre un changement de composition
   */
  public recordCompositionChange(ean: string, change: CompositionChange): void {
    if (!this.compositionHistory.has(ean)) {
      this.compositionHistory.set(ean, []);
    }
    this.compositionHistory.get(ean)!.push(change);
  }

  /**
   * Récupère l'historique des changements
   */
  public getCompositionHistory(ean: string): CompositionChange[] {
    return this.compositionHistory.get(ean) || [];
  }

  /**
   * Base de données simplifiée des additifs (extrait)
   * En production, ceci serait une vraie base de données
   */
  private getAdditiveName(code: string): string | undefined {
    const additiveNames: Record<string, string> = {
      E100: 'Curcumine',
      E101: 'Riboflavine',
      E102: 'Tartrazine',
      E200: 'Acide sorbique',
      E300: 'Acide ascorbique',
      E330: 'Acide citrique',
      // ... autres additifs
    };
    return additiveNames[code.toUpperCase()];
  }

  /**
   * Catégorie d'additif
   */
  private getAdditiveCategory(code: string): string | undefined {
    const num = parseInt(code.substring(1));
    if (num >= 100 && num < 200) return 'Colorant';
    if (num >= 200 && num < 300) return 'Conservateur';
    if (num >= 300 && num < 400) return 'Antioxydant';
    if (num >= 400 && num < 500) return 'Épaississant';
    if (num >= 500 && num < 600) return 'Régulateur d\'acidité';
    if (num >= 600 && num < 700) return 'Exhausteur de goût';
    return undefined;
  }
}
