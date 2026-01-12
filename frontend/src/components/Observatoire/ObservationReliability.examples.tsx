/**
 * Module E - Observation Reliability Examples
 * 
 * Comprehensive usage examples demonstrating the reliability scoring system
 * All examples maintain neutrality and avoid rankings/recommendations
 */

import React from 'react';
import { ObservationReliability } from './ObservationReliability';
import {
  calculateReliabilityScore,
  calculateVolumeScore,
  calculateSourceScore,
  calculateFreshnessScore,
  calculateDispersionScore,
  getReliabilityLevelLabel,
  getMethodologyExplanation,
} from '../../utils/observationReliability';
import type { ReceiptData } from '../Receipt/types';

// ============================================================================
// EXAMPLE 1: Basic Reliability Display
// ============================================================================

export function Example1_BasicDisplay() {
  const observations: ReceiptData[] = [
    {
      type: 'ticket_caisse',
      territoire: 'Martinique',
      enseigne: 'Leader Price',
      magasin: { nom: 'Leader Price Fort-de-France', adresse: 'Rue Victor Hugo' },
      date_achat: '2026-01-10',
      heure_achat: '14:30',
      produits: [
        { libelle_ticket: 'Riz blanc 1kg', prix: 1.29, quantite: 1, ean: null, confiance: 'manuel' }
      ],
      preuve: { image: 'data:image/jpeg;base64,...', ocr_local: true },
      auteur: 'citoyen_anonyme',
      niveau_confiance_global: 'élevé',
      statut: 'valide',
    },
    {
      type: 'etiquette_rayon',
      territoire: 'Martinique',
      enseigne: 'Carrefour',
      magasin: { nom: 'Carrefour Lamentin', adresse: 'Zone commerciale' },
      date_achat: '2026-01-11',
      heure_achat: '10:15',
      produits: [
        { libelle_ticket: 'Riz blanc 1kg', prix: 1.35, quantite: 1, ean: null, confiance: 'manuel' }
      ],
      preuve: { image: 'data:image/jpeg;base64,...', ocr_local: true },
      auteur: 'citoyen_anonyme',
      niveau_confiance_global: 'élevé',
      statut: 'valide',
    },
  ];
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exemple 1 : Affichage basique</h2>
      
      <ObservationReliability
        observations={observations}
        excludePromotional={true}
        showMethodology={true}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Programmatic Score Calculation
// ============================================================================

export function Example2_ProgrammaticCalculation() {
  const observations: ReceiptData[] = [
    // ... same as Example 1
  ];
  
  const score = calculateReliabilityScore(observations, true);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exemple 2 : Calcul programmatique</h2>
      
      <div className="bg-gray-100 p-4 rounded font-mono text-sm">
        <div>Score total: {score.total}/100</div>
        <div>Niveau: {getReliabilityLevelLabel(score.level)}</div>
        <div>Utilisable pour analyse: {score.canUseForAnalysis ? 'Oui' : 'Non'}</div>
        <div className="mt-2">Composantes:</div>
        <div className="ml-4">
          <div>- Volume: {score.components.volumeScore}</div>
          <div>- Source: {Math.round(score.components.sourceScore)}</div>
          <div>- Fraîcheur: {Math.round(score.components.freshnessScore)}</div>
          <div>- Dispersion: {Math.round(score.components.dispersionScore)}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Filtering Promotional Observations
// ============================================================================

export function Example3_PromotionalFiltering() {
  const observationsWithPromo: ReceiptData[] = [
    {
      type: 'ticket_caisse',
      territoire: 'Martinique',
      enseigne: 'Super U',
      magasin: { nom: 'Super U Schoelcher', adresse: 'Route de Schoelcher' },
      date_achat: '2026-01-12',
      heure_achat: '16:00',
      produits: [
        { libelle_ticket: 'Huile olive 1L', prix: 5.99, quantite: 1, ean: null, confiance: 'manuel' }
      ],
      preuve: { image: 'data:image/jpeg;base64,...', ocr_local: true },
      auteur: 'citoyen_anonyme',
      niveau_confiance_global: 'élevé',
      statut: 'valide',
    },
    {
      type: 'presentoir_promo',
      territoire: 'Martinique',
      enseigne: 'Super U',
      magasin: { nom: 'Super U Schoelcher', adresse: 'Route de Schoelcher' },
      date_achat: '2026-01-12',
      heure_achat: '16:05',
      produits: [
        { libelle_ticket: 'Huile olive 1L - PROMO', prix: 3.99, quantite: 1, ean: null, confiance: 'manuel' }
      ],
      preuve: { image: 'data:image/jpeg;base64,...', ocr_local: true },
      source_metadata: { is_promotional: true },
      auteur: 'citoyen_anonyme',
      niveau_confiance_global: 'moyen',
      statut: 'valide',
    },
  ];
  
  const scoreWithPromo = calculateReliabilityScore(observationsWithPromo, false);
  const scoreWithoutPromo = calculateReliabilityScore(observationsWithPromo, true);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exemple 3 : Filtrage des promotions</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Avec promotions incluses:</h3>
          <ObservationReliability
            observations={observationsWithPromo}
            excludePromotional={false}
          />
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Promotions exclues (recommandé):</h3>
          <ObservationReliability
            observations={observationsWithPromo}
            excludePromotional={true}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Component Score Breakdown
// ============================================================================

export function Example4_ComponentBreakdown() {
  // Test each component individually
  const volumeScores = [0, 1, 5, 10, 20].map(count => ({
    count,
    score: calculateVolumeScore(count),
  }));
  
  const sourceScores = [
    { type: 'ticket_caisse' as const, score: calculateSourceScore('ticket_caisse') },
    { type: 'etiquette_rayon' as const, score: calculateSourceScore('etiquette_rayon') },
    { type: 'presentoir_promo' as const, score: calculateSourceScore('presentoir_promo') },
  ];
  
  const freshnessScores = [
    { days: 3, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { days: 15, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { days: 45, date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  ].map(item => ({
    ...item,
    score: calculateFreshnessScore(item.date),
  }));
  
  const dispersionScores = [
    { prices: [1.29, 1.30, 1.29, 1.31, 1.30], label: 'Très cohérent (±1%)' },
    { prices: [1.29, 1.35, 1.32, 1.40, 1.28], label: 'Modéré (±10%)' },
    { prices: [1.29, 1.65, 1.10, 1.80, 1.05], label: 'Dispersé (±30%)' },
  ].map(item => ({
    ...item,
    score: calculateDispersionScore(item.prices),
  }));
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exemple 4 : Détail des composantes</h2>
      
      <div className="space-y-6">
        {/* Volume */}
        <div>
          <h3 className="font-semibold mb-2">Scores de volume:</h3>
          <div className="space-y-1">
            {volumeScores.map((item, i) => (
              <div key={i} className="flex justify-between bg-gray-100 p-2 rounded">
                <span>{item.count} observations</span>
                <span className="font-mono">{item.score}/100</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Source Type */}
        <div>
          <h3 className="font-semibold mb-2">Crédibilité par source:</h3>
          <div className="space-y-1">
            {sourceScores.map((item, i) => (
              <div key={i} className="flex justify-between bg-gray-100 p-2 rounded">
                <span>{item.type}</span>
                <span className="font-mono">{item.score}/100</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Freshness */}
        <div>
          <h3 className="font-semibold mb-2">Scores de fraîcheur:</h3>
          <div className="space-y-1">
            {freshnessScores.map((item, i) => (
              <div key={i} className="flex justify-between bg-gray-100 p-2 rounded">
                <span>Il y a {item.days} jours</span>
                <span className="font-mono">{item.score}/100</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dispersion */}
        <div>
          <h3 className="font-semibold mb-2">Scores de cohérence:</h3>
          <div className="space-y-1">
            {dispersionScores.map((item, i) => (
              <div key={i} className="flex justify-between bg-gray-100 p-2 rounded">
                <span>{item.label}</span>
                <span className="font-mono">{item.score}/100</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Conditional Analysis Based on Reliability
// ============================================================================

export function Example5_ConditionalAnalysis() {
  function analyzeWithReliabilityCheck(observations: ReceiptData[]) {
    const score = calculateReliabilityScore(observations);
    
    if (!score.canUseForAnalysis) {
      return {
        status: 'insufficient',
        message: `Données insuffisantes (score: ${score.total}/100, minimum: 40)`,
        score,
      };
    }
    
    // Proceed with analysis
    const prices = observations.flatMap(obs => obs.produits.map(p => p.prix));
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    
    return {
      status: 'success',
      analysis: {
        averagePrice: avgPrice.toFixed(2),
        observationCount: observations.length,
        priceRange: {
          min: Math.min(...prices).toFixed(2),
          max: Math.max(...prices).toFixed(2),
        },
      },
      score,
    };
  }
  
  // Test with insufficient data
  const fewObservations: ReceiptData[] = [
    {
      type: 'etiquette_rayon',
      territoire: 'Guadeloupe',
      enseigne: 'Leader Price',
      magasin: { nom: 'Leader Price Pointe-à-Pitre', adresse: 'Centre ville' },
      date_achat: '2025-12-15',
      heure_achat: '11:00',
      produits: [
        { libelle_ticket: 'Farine 1kg', prix: 1.99, quantite: 1, ean: null, confiance: 'manuel' }
      ],
      preuve: { image: 'data:image/jpeg;base64,...', ocr_local: true },
      auteur: 'citoyen_anonyme',
      niveau_confiance_global: 'moyen',
      statut: 'valide',
    },
  ];
  
  const result = analyzeWithReliabilityCheck(fewObservations);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exemple 5 : Analyse conditionnelle</h2>
      
      <div className="bg-gray-100 p-4 rounded">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          ⚠️ L'analyse est bloquée si le score de fiabilité est inférieur à 40/100.
          Les données restent visibles mais aucune interprétation n'est générée.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Methodology Transparency
// ============================================================================

export function Example6_MethodologyDisplay() {
  const methodology = getMethodologyExplanation();
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exemple 6 : Transparence méthodologique</h2>
      
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">{methodology.title}</h3>
        <p className="text-gray-700 mb-4">{methodology.description}</p>
        
        <div className="space-y-3">
          {methodology.components.map((component, index) => (
            <div key={index} className="border-l-4 border-gray-400 pl-4">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">{component.name}</span>
                <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                  {Math.round(component.weight * 100)}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{component.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Garantie de transparence :</strong> Cette méthodologie est publique,
            auditable et sans logique commerciale. Le calcul est déterministe et
            identique pour tous les utilisateurs.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Anti-Crisis Integration (Correct Usage)
// ============================================================================

export function Example7_AntiCrisisIntegration() {
  function prepareAntiCrisisData(observations: ReceiptData[]) {
    const score = calculateReliabilityScore(observations);
    
    return {
      observations: score.canUseForAnalysis ? observations : [],
      reliability: score,
      metadata: {
        canUseForBasket: score.canUseForAnalysis,
        observationCount: observations.length,
        excludedPromotional: score.excludedPromotional,
        calculatedAt: new Date().toISOString(),
        note: score.canUseForAnalysis 
          ? 'Données suffisantes pour intégration dans le panier anti-crise'
          : 'Données insuffisantes - non intégrées au panier',
      },
    };
  }
  
  const observations: ReceiptData[] = [
    // Multiple observations...
  ];
  
  const antiCrisisData = prepareAntiCrisisData(observations);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Exemple 7 : Intégration Anti-Crise (usage correct)
      </h2>
      
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <h3 className="font-semibold text-green-800 mb-2">✓ Usage autorisé :</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Vérifier la qualité des données avant agrégation</li>
            <li>• Bloquer l'analyse si score &lt; 40</li>
            <li>• Afficher le niveau de fiabilité en contexte</li>
            <li>• Exclure les observations promotionnelles</li>
          </ul>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h3 className="font-semibold text-red-800 mb-2">✗ Usage interdit :</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Classer les enseignes par score de fiabilité</li>
            <li>• Afficher des badges "données fiables" / "peu fiables"</li>
            <li>• Utiliser les scores pour recommander un magasin</li>
            <li>• Appliquer des codes couleur rouge/vert incitatifs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// All Examples Component (for documentation/testing)
// ============================================================================

export function AllReliabilityExamples() {
  return (
    <div className="space-y-8">
      <Example1_BasicDisplay />
      <Example2_ProgrammaticCalculation />
      <Example3_PromotionalFiltering />
      <Example4_ComponentBreakdown />
      <Example5_ConditionalAnalysis />
      <Example6_MethodologyDisplay />
      <Example7_AntiCrisisIntegration />
    </div>
  );
}

export default AllReliabilityExamples;
