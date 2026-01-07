/**
 * Home Page v3.0 - Grand Public
 * 
 * Simplified user journey: scan → understand → compare
 * Mobile-first, pedagogical, friction-free UX
 */

import { Link } from 'react-router-dom';
import { GlassCard } from "../components/ui/glass-card";
import { useState, useEffect } from 'react';
import { RealSavingsBlock } from "../components/home/RealSavingsBlock";
import { BeforeAfterComparison } from "../components/home/BeforeAfterComparison";
import { OptimalRoutePreview } from "../components/home/OptimalRoutePreview";
import { StoreRanking } from "../components/home/StoreRanking";
import { DailyShockCard } from "../components/home/DailyShockCard";

export default function HomeV3() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    scans: 0,
    territories: 12
  });

  useEffect(() => {
    // Load real stats from localStorage or API
    const savedStats = localStorage.getItem('platform_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Hero Section - Clear Value Proposition */}
      <GlassCard className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Comparez les prix<br />
          <span className="text-blue-400">simplement</span>
        </h1>
        <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          Scannez, comprenez et comparez les prix dans votre territoire en 3 étapes
        </p>
        
        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/scan" 
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            📸 Scanner un produit
          </Link>
          <Link 
            to="/observatoire-temps-reel" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-lg font-semibold transition-all"
          >
            📊 Observatoire Temps Réel
          </Link>
        </div>
        <div className="mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-slate-800/60 text-xs text-slate-200">
          <span className="text-blue-300">●</span>
          Données publiques • stockage local • aucun suivi utilisateur
        </div>
        <div className="mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-100">
          <span className="text-sm">🏛️</span>
          Observatoire citoyen indépendant – données ouvertes
        </div>
      </GlassCard>

      {/* ⑭ HAUSSES DU JOUR - EMOTIONAL HOOK - AU-DESSUS DE TOUT */}
      <DailyShockCard territory="GP" />

      {/* ① BLOC "ÉCONOMIES RÉELLES" - PRIORITÉ ABSOLUE - IMPACT MAX */}
      <RealSavingsBlock />

      {/* ② COMPARAISON VISUELLE "AVANT / APRÈS" - Exemple concret */}
      <BeforeAfterComparison />

      {/* ③ ITINÉRAIRE OPTIMAL - Différenciation forte */}
      <OptimalRoutePreview />

      {/* ⑤ CLASSEMENT DES ENSEIGNES - Social + Crédible */}
      <StoreRanking />

      {/* Public Counters - Transparency */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-6 text-center">📈 Compteurs publics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <div className="text-3xl font-bold text-blue-400 mb-2">{stats.scans.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Scans effectués</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.products.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Produits suivis</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">{stats.territories}</div>
            <div className="text-sm text-gray-400">Territoires</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.users.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Utilisateurs</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4 italic">
          Données réelles · Aucune estimation · Transparence totale
        </p>
      </GlassCard>

      {/* User Journey - 3 Steps */}
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="text-center hover:border-blue-500/50 transition-colors">
          <div className="text-5xl mb-4">📸</div>
          <h3 className="text-xl font-bold mb-3">1. Scanner</h3>
          <p className="text-gray-300 mb-4">
            Photographiez le code-barres ou votre ticket de caisse
          </p>
          <Link 
            to="/scan" 
            className="inline-block px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 font-medium transition-colors"
          >
            Essayer →
          </Link>
        </GlassCard>

        <GlassCard className="text-center hover:border-green-500/50 transition-colors">
          <div className="text-5xl mb-4">💡</div>
          <h3 className="text-xl font-bold mb-3">2. Comprendre</h3>
          <p className="text-gray-300 mb-4">
            Consultez les infos produit, prix et équivalences
          </p>
          <Link 
            to="/historique-prix" 
            className="inline-block px-6 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 font-medium transition-colors"
          >
            Découvrir →
          </Link>
        </GlassCard>

        <GlassCard className="text-center hover:border-purple-500/50 transition-colors">
          <div className="text-5xl mb-4">⚖️</div>
          <h3 className="text-xl font-bold mb-3">3. Comparer</h3>
          <p className="text-gray-300 mb-4">
            Comparez les prix entre enseignes et territoires
          </p>
          <Link 
            to="/comparateur" 
            className="inline-block px-6 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 font-medium transition-colors"
          >
            Comparer →
          </Link>
        </GlassCard>
      </div>

      {/* Key Features - Pedagogical */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-6">🎯 Ce que vous pouvez faire</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg">
            <div className="text-2xl">🔍</div>
            <div>
              <h4 className="font-semibold mb-1">Suivre l'évolution des prix</h4>
              <p className="text-sm text-gray-400">Historiques détaillés avec graphiques et tendances</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg">
            <div className="text-2xl">🗺️</div>
            <div>
              <h4 className="font-semibold mb-1">Localiser les meilleurs prix</h4>
              <p className="text-sm text-gray-400">Carte interactive des enseignes et prix par zone</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg">
            <div className="text-2xl">📥</div>
            <div>
              <h4 className="font-semibold mb-1">Exporter les données ouvertes</h4>
              <p className="text-sm text-gray-400">Formats CSV/JSON pour analyses personnalisées</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg">
            <div className="text-2xl">🔔</div>
            <div>
              <h4 className="font-semibold mb-1">Recevoir des alertes prix</h4>
              <p className="text-sm text-gray-400">Notifications en cas de hausses significatives</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Open Data Notice */}
      <GlassCard className="bg-blue-900/10 border-blue-500/30">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🏛️</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-blue-300">Observatoire Temps Réel</h3>
            <p className="text-gray-300 mb-3">
              Suivi en temps réel des prix · Détection d'anomalies · Open Data sous licence Etalab 2.0, exploitables par citoyens, 
              médias, chercheurs et institutions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/observatoire-temps-reel" 
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
              >
                🔴 Observatoire Temps Réel
              </Link>
              <a 
                href="/OBSERVATOIRE_PUBLIC_v1.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Territorial Coverage */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">🌍 Territoires couverts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵' },
            { code: 'MQ', name: 'Martinique', flag: '🇲🇶' },
            { code: 'GF', name: 'Guyane', flag: '🇬🇫' },
            { code: 'RE', name: 'Réunion', flag: '🇷🇪' },
            { code: 'YT', name: 'Mayotte', flag: '🇾🇹' },
            { code: 'PM', name: 'Saint-Pierre-et-Miquelon', flag: '🇵🇲' },
            { code: 'WF', name: 'Wallis-et-Futuna', flag: '🇼🇫' },
            { code: 'PF', name: 'Polynésie française', flag: '🇵🇫' },
            { code: 'NC', name: 'Nouvelle-Calédonie', flag: '🇳🇨' },
            { code: 'BL', name: 'Saint-Barthélemy', flag: '🇧🇱' },
            { code: 'MF', name: 'Saint-Martin', flag: '🇲🇫' },
            { code: 'TF', name: 'TAAF', flag: '🇹🇫' }
          ].map(territory => (
            <div key={territory.code} className="p-3 bg-slate-800/50 rounded-lg text-center">
              <div className="text-2xl mb-1">{territory.flag}</div>
              <div className="text-xs text-gray-400">{territory.name}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* No Advisory - Clear Disclaimer */}
      <GlassCard className="bg-yellow-900/10 border-yellow-500/30">
        <div className="flex items-start gap-4">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-yellow-300 mb-2">Service d'observation - Aucun conseil</h3>
            <p className="text-sm text-gray-300">
              Cette plateforme présente des données observées et vérifiables. 
              <strong> Nous ne donnons aucun conseil d'achat, aucun score propriétaire, aucune recommandation.</strong> 
              Les informations sont factuelles et laissent l'utilisateur libre de ses choix.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Quick Access Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/faq" className="p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors">
          <div className="text-2xl mb-2">❓</div>
          <h4 className="font-semibold mb-1">Questions fréquentes</h4>
          <p className="text-xs text-gray-400">Tout savoir sur le service</p>
        </Link>
        <Link to="/methodologie" className="p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors">
          <div className="text-2xl mb-2">📖</div>
          <h4 className="font-semibold mb-1">Méthodologie</h4>
          <p className="text-xs text-gray-400">Comment nous collectons les données</p>
        </Link>
        <Link to="/contact" className="p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors">
          <div className="text-2xl mb-2">📧</div>
          <h4 className="font-semibold mb-1">Contact</h4>
          <p className="text-xs text-gray-400">Une question ? Contactez-nous</p>
        </Link>
      </div>

    </div>
  );
}
