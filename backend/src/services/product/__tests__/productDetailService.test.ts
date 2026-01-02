/**
 * Tests unitaires pour ProductDetailService
 * Version: 1.9.0
 */

import {
  ProductDetailService,
  Ingredient,
  ProductDetails,
} from '../productDetailService.js';

describe('ProductDetailService', () => {
  let service: ProductDetailService;

  beforeEach(() => {
    service = ProductDetailService.getInstance();
  });

  test('devrait créer une instance singleton', () => {
    const instance1 = ProductDetailService.getInstance();
    const instance2 = ProductDetailService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('devrait parser une liste d\'ingrédients simple', () => {
    const raw = 'Farine de blé, Eau, Sel, Levure';
    const ingredients = service.parseIngredients(raw);

    expect(ingredients).toHaveLength(4);
    expect(ingredients[0].name).toBe('Farine de blé');
    expect(ingredients[0].order).toBe(1);
    expect(ingredients[3].name).toBe('Levure');
  });

  test('devrait extraire les pourcentages', () => {
    const raw = 'Tomate 50%, Eau 30%, Sel 2%';
    const ingredients = service.parseIngredients(raw);

    expect(ingredients[0].percentage).toBe(50);
    expect(ingredients[1].percentage).toBe(30);
    expect(ingredients[2].percentage).toBe(2);
  });

  test('devrait détecter les additifs (codes E)', () => {
    const raw = 'Farine, E300, Sel, E330';
    const ingredients = service.parseIngredients(raw);

    expect(ingredients[1].isAdditive).toBe(true);
    expect(ingredients[1].additiveCode).toBe('E300');
    expect(ingredients[3].isAdditive).toBe(true);
    expect(ingredients[3].additiveCode).toBe('E330');
  });

  test('devrait identifier les additifs', () => {
    const ingredients: Ingredient[] = [
      { name: 'Farine', order: 1 },
      { name: 'E300', order: 2, isAdditive: true, additiveCode: 'E300' },
      { name: 'E330', order: 3, isAdditive: true, additiveCode: 'E330' },
    ];

    const additives = service.identifyAdditives(ingredients);

    expect(additives).toHaveLength(2);
    expect(additives[0].code).toBe('E300');
    expect(additives[0].name).toBe('Acide ascorbique');
    expect(additives[0].category).toBe('Antioxydant');
  });

  test('devrait parser les allergènes déclarés', () => {
    const raw = 'Contient: lait, œufs. Peut contenir: fruits à coque';
    const allergens = service.parseAllergens(raw);

    expect(allergens).toHaveLength(3);
    expect(allergens[0]).toEqual({ name: 'lait', type: 'contains' });
    expect(allergens[1]).toEqual({ name: 'œufs', type: 'contains' });
    expect(allergens[2]).toEqual({ name: 'fruits à coque', type: 'may_contain' });
  });

  test('devrait stocker et récupérer les détails d\'un produit', () => {
    const details: ProductDetails = {
      ean: '3228857000906',
      productName: 'Lait UHT',
      brand: 'Test Brand',
      ingredients: [
        { name: 'Lait', order: 1 },
      ],
      allergens: [
        { name: 'lait', type: 'contains' },
      ],
      additives: [],
      quality: {
        readability: 0.95,
        completeness: 0.90,
        analysisDate: new Date(),
        analysisMethod: 'manual',
        confidence: 0.92,
      },
      source: {
        origin: 'manual-entry',
        observationDate: new Date(),
      },
    };

    service.storeProductDetails('3228857000906', details);
    const retrieved = service.getProductDetails('3228857000906');

    expect(retrieved).toBeDefined();
    expect(retrieved?.productName).toBe('Lait UHT');
    expect(retrieved?.brand).toBe('Test Brand');
  });

  test('devrait enregistrer l\'historique des changements', () => {
    const change = {
      changeDate: new Date(),
      changeType: 'ingredients' as const,
      description: 'Ajout d\'un additif',
      source: 'observation-directe',
    };

    service.recordCompositionChange('3228857000906', change);
    const history = service.getCompositionHistory('3228857000906');

    expect(history).toHaveLength(1);
    expect(history[0].description).toBe('Ajout d\'un additif');
  });
});
