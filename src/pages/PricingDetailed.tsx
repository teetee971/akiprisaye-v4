import React from 'react';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { CivicButton } from '@/components/ui/CivicButton';
import { DataBadge } from '@/components/ui/DataBadge';

const accessLevels = [
  {
    id: 'CITIZEN',
    title: '🧑 Citoyen',
    price: '3,99 € / mois',
    subtitle: 'Accès individuel',
    features: [
      'Consultation des comparateurs',
      'Historique des prix',
      'Alertes locales personnalisées',
      'Accès aux données publiques',
    ],
    note: 'Contribution de soutien au fonctionnement du service.',
  },
  {
    id: 'PROFESSIONAL',
    title: '🧑‍💼 Professionnel',
    price: '19 € / mois',
    subtitle: 'Droits étendus',
    features: [
      'Analyses territoriales avancées',
      'Séries historiques complètes',
      'Exports CSV / JSON',
      'Comparaisons multi-territoires',
    ],
    note: '',
  },
  {
    id: 'INSTITUTIONAL',
    title: '🏛️ Institution',
    price: 'Licence annuelle',
    subtitle: 'Licence institutionnelle',
    features: [
      'Données publiques auditées',
      'Exports normalisés (INSEE / Eurostat)',
      'Accès API open-data',
      'Documentation méthodologique officielle',
    ],
    note: 'Paiement non activé — accès sur convention ou demande officielle.',
  },
];

const badges = [
  {
    title: 'Badge Utilisateur actif',
    description: 'Reconnaissance d\'usage régulier du service',
  },
  {
    title: 'Badge Contributeur open-data',
    description: 'Participation à l\'amélioration des données',
  },
  {
    title: 'Mention Partenaire institutionnel',
    description: 'Collaboration institutionnelle reconnue',
  },
];

export default function PricingDetailed() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <GlassContainer className="max-w-7xl mx-auto p-8">
        {/* Hero - Positionnement */}
        <div className="mb-12 p-8 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Niveaux d'accès au service
          </h1>
          <div className="space-y-4 text-gray-200 text-lg max-w-3xl mx-auto">
            <p>
              <strong className="text-blue-300">A KI PRI SA YÉ</strong> — Observatoire citoyen des prix et du coût de la vie
            </p>
            <p className="text-xl font-semibold text-green-300">
              DOM · ROM · COM
            </p>
          </div>
        </div>

        {/* Access Levels Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {accessLevels.map((level) => (
            <GlassCard key={level.id} className="flex flex-col">
              <div className="flex-1 space-y-4">
                {/* Header */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{level.title}</h2>
                  <p className="text-sm text-gray-400 italic">{level.subtitle}</p>
                </div>

                {/* Price */}
                <div>
                  <p className="text-2xl font-bold text-blue-400">{level.price}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Inclus
                  </h3>
                  <ul className="space-y-1.5">
                    {level.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start">
                        <span className="text-green-400 mr-2 flex-shrink-0">✓</span>
                        <span className="opacity-90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Note */}
                {level.note && (
                  <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                    <p className="text-xs text-blue-200">{level.note}</p>
                  </div>
                )}

                {/* Data Badge */}
                <div className="pt-2">
                  <DataBadge source="INSEE • OPMR • DGCCRF • data.gouv.fr" />
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <CivicButton
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    if (level.id === 'INSTITUTIONAL') {
                      window.location.href = '/contact?subject=licence-institutionnelle';
                    } else {
                      window.location.href = `/subscribe?level=${level.id}`;
                    }
                  }}
                >
                  {level.id === 'INSTITUTIONAL' ? 'Demander une convention' : 'Choisir cet accès'}
                </CivicButton>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Badge System - Sober */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Système de gratification
          </h2>
          <p className="text-center text-gray-400 text-sm mb-2">
            Reconnaissance d'usage (sobre)
          </p>
          <p className="text-center text-gray-500 text-xs mb-8">
            Aucune compétition • Aucune notation individuelle • Reconnaissance purement informative
          </p>
          
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            {badges.map((badge, idx) => (
              <GlassCard key={idx} className="bg-slate-800/30 text-center border-slate-600/30">
                <h3 className="font-semibold text-base text-gray-200 mb-2">{badge.title}</h3>
                <p className="text-sm text-gray-400">{badge.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* FAQ - Limited to 5 */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">FAQ Abonnements</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard>
              <h3 className="font-bold text-lg text-white mb-2">
                Pourquoi une inscription est-elle obligatoire ?
              </h3>
              <p className="text-gray-300 text-sm">
                Pour assurer la traçabilité des usages, la fiabilité statistique et la protection des données publiques.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="font-bold text-lg text-white mb-2">
                Mes données personnelles sont-elles exploitées ?
              </h3>
              <p className="text-gray-300 text-sm">
                Non. Aucune donnée n'est revendue, utilisée à des fins publicitaires ou commerciales.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="font-bold text-lg text-white mb-2">
                Puis-je accéder gratuitement aux données ?
              </h3>
              <p className="text-gray-300 text-sm">
                Oui. L'inscription est gratuite et permet l'accès aux données publiques.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="font-bold text-lg text-white mb-2">
                Pourquoi certains accès sont payants ?
              </h3>
              <p className="text-gray-300 text-sm">
                Les contributions financent l'infrastructure, la maintenance et l'ouverture des données à long terme.
              </p>
            </GlassCard>

            <GlassCard className="md:col-span-2">
              <h3 className="font-bold text-lg text-white mb-2">
                Les institutions ont-elles accès à des données différentes ?
              </h3>
              <p className="text-gray-300 text-sm">
                Non. Les données sont identiques. Les licences donnent accès à des formats, outils et exports supplémentaires, jamais à des données exclusives.
              </p>
            </GlassCard>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
}
