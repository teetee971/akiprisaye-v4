/**
 * Assistant IA Hub - Unified entry point for all AI features
 * 
 * Groups all AI-powered functionalities:
 * - Budget advisor
 * - Interactive chat
 * - Market insights
 * - Smart product recommendations
 * - AI-powered shopping assistant
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Brain, MessageCircle, TrendingUp, Sparkles, ShoppingBag, HelpCircle } from 'lucide-react';

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  badge?: string;
}

const AI_FEATURES: AIFeature[] = [
  {
    id: 'advisor',
    title: 'Conseiller Budget IA',
    description: 'Obtenez des recommandations personnalisées pour optimiser votre budget',
    icon: Brain,
    route: '/ia-conseiller',
    color: 'blue',
    badge: 'Populaire',
  },
  {
    id: 'chat',
    title: 'Chat IA Local',
    description: 'Posez vos questions sur les prix et produits en langage naturel',
    icon: MessageCircle,
    route: '/chat',
    color: 'green',
    badge: '100% Local',
  },
  {
    id: 'insights',
    title: 'Analyses de Marché',
    description: 'Insights et tendances du marché des produits DOM-COM',
    icon: TrendingUp,
    route: '/admin/ai-market-insights',
    color: 'purple',
  },
  {
    id: 'smart-shopping',
    title: 'Assistant Courses Intelligent',
    description: 'Suggestions de produits et d\'économies basées sur vos habitudes',
    icon: ShoppingBag,
    route: '/liste-courses?mode=ai',
    color: 'orange',
    badge: 'Beta',
  },
];

const CAPABILITIES = [
  {
    icon: '🤖',
    title: 'IA 100% Locale',
    description: 'Traitement sur votre appareil, respect total de votre vie privée',
  },
  {
    icon: '🎯',
    title: 'Recommandations Précises',
    description: 'Analyses basées sur des données réelles et actualisées',
  },
  {
    icon: '⚡',
    title: 'Réponses Instantanées',
    description: 'Obtenez des réponses en temps réel à toutes vos questions',
  },
  {
    icon: '🔒',
    title: 'Sécurisé & Privé',
    description: 'Vos données ne quittent jamais votre appareil',
  },
];

const PRIVACY_PRINCIPLES = [
  {
    icon: '🛡️',
    title: 'Pas de tracking',
    description: 'Aucune donnée comportementale collectée',
  },
  {
    icon: '🔐',
    title: 'Chiffrement local',
    description: 'Toutes vos données restent sur votre appareil',
  },
  {
    icon: '✅',
    title: 'Conforme RGPD',
    description: 'Respect total de la réglementation européenne',
  },
  {
    icon: '🎓',
    title: 'Transparent',
    description: 'Code source ouvert et auditable',
  },
];

export default function AssistantIAHub() {
  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', hover: 'hover:border-blue-500/50' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', hover: 'hover:border-green-500/50' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', hover: 'hover:border-purple-500/50' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', hover: 'hover:border-orange-500/50' },
    };
    return colorMap[color]?.[type] || colorMap.blue[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Helmet>
        <title>Assistant IA - A KI PRI SA YÉ</title>
        <meta name="description" content="Intelligence artificielle locale pour vous aider à optimiser vos courses et votre budget" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            🤖 Assistant IA
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Intelligence artificielle locale et respectueuse de votre vie privée 
            pour optimiser vos courses et votre budget.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {AI_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                to={feature.route}
                className={`
                  relative group
                  bg-slate-900/50 backdrop-blur-sm
                  border-2 ${getColorClasses(feature.color, 'border')} ${getColorClasses(feature.color, 'hover')}
                  rounded-xl p-8
                  transition-all duration-300
                  hover:scale-105 hover:shadow-2xl
                `}
              >
                {/* Badge */}
                {feature.badge && (
                  <div className={`absolute top-4 right-4 ${getColorClasses(feature.color, 'bg')} ${getColorClasses(feature.color, 'text')} text-xs px-3 py-1 rounded-full font-medium`}>
                    {feature.badge}
                  </div>
                )}

                {/* Icon */}
                <div className={`${getColorClasses(feature.color, 'bg')} ${getColorClasses(feature.color, 'text')} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={32} />
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-semibold mb-3 ${getColorClasses(feature.color, 'text')}`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* CTA */}
                <div className={`${getColorClasses(feature.color, 'text')} flex items-center font-medium group-hover:translate-x-2 transition-transform`}>
                  Essayer <span className="ml-2">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Capabilities */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CAPABILITIES.map((capability, index) => (
            <div
              key={index}
              className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{capability.icon}</div>
              <h4 className="font-semibold text-slate-100 mb-2">{capability.title}</h4>
              <p className="text-sm text-slate-400">{capability.description}</p>
            </div>
          ))}
        </div>

        {/* Privacy Section */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <HelpCircle size={24} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-100">
              Votre vie privée est notre priorité
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRIVACY_PRINCIPLES.map((principle, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{principle.icon}</div>
                <h4 className="font-semibold text-slate-200 mb-1 text-sm">{principle.title}</h4>
                <p className="text-xs text-slate-400">{principle.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <p className="text-sm text-slate-300 text-center">
              <strong>Notre engagement :</strong> Toutes les fonctionnalités IA tournent directement 
              dans votre navigateur. Aucune donnée n'est envoyée vers nos serveurs ou des services tiers.
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-slate-100 flex items-center gap-2">
            <Sparkles size={24} className="text-yellow-400" />
            Cas d'usage
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">💡</div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Optimiser mon budget</h3>
                  <p className="text-sm text-slate-400">
                    "Comment puis-je réduire mes dépenses de courses de 20% ?"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">🛒</div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Planifier mes courses</h3>
                  <p className="text-sm text-slate-400">
                    "Crée-moi une liste de courses équilibrée pour une famille de 4"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">📊</div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Analyser les prix</h3>
                  <p className="text-sm text-slate-400">
                    "Montre-moi l'évolution du prix du riz dans ma région"
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Trouver les meilleures offres</h3>
                  <p className="text-sm text-slate-400">
                    "Quels sont les produits en promotion cette semaine ?"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">🌍</div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Comparer avec la Métropole</h3>
                  <p className="text-sm text-slate-400">
                    "Combien coûte ce produit en Métropole comparé à ici ?"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">📝</div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Suggestions intelligentes</h3>
                  <p className="text-sm text-slate-400">
                    "Recommande-moi des alternatives moins chères"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <p className="text-slate-400 mb-4">Découvrez aussi</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/comparateurs"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              📊 Comparateur de prix
            </Link>
            <Link
              to="/scanner"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              📷 Scanner un produit
            </Link>
            <Link
              to="/observatoire"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              📈 Observatoire des prix
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
