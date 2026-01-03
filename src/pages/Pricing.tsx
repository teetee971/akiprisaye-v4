import React from 'react';
import { Check, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

const pricingPlans = [
  {
    id: 'free',
    name: 'Gratuit',
    icon: '📖',
    price: '0',
    period: 'Toujours gratuit',
    description: 'Accès public aux fonctionnalités essentielles',
    features: [
      'Scan EAN illimité',
      'Comparaisons de prix basiques',
      'Consultation en lecture seule',
      'Sans publicité',
      'Accès à tous les territoires',
    ],
    cta: 'Commencer gratuitement',
    ctaLink: '/mon-compte',
    popular: false,
    note: 'Inscription obligatoire pour garantir la qualité du service',
    color: 'from-slate-600 to-slate-700',
    badge: null,
  },
  {
    id: 'citizen',
    name: 'Citoyen',
    icon: '🧑',
    price: '3.99',
    period: '/ mois',
    description: 'L\'outil complet pour les citoyens engagés',
    features: [
      'Tout du plan Gratuit',
      'OCR ingrédients avancé',
      'Fiches produits enrichies',
      'Alertes prix personnalisées',
      'Historique personnel illimité',
      'Signalements citoyens',
      'Export de vos données',
      'Support prioritaire',
    ],
    cta: 'Choisir Citoyen',
    ctaLink: '/subscribe?plan=citizen',
    popular: true,
    note: 'Le plus populaire auprès des familles',
    color: 'from-blue-600 to-blue-700',
    badge: '⭐ Populaire',
  },
  {
    id: 'professional',
    name: 'Professionnel',
    icon: '🧑‍💼',
    price: '19',
    period: '/ mois',
    description: 'Pour les professionnels et associations',
    features: [
      'Tout du plan Citoyen',
      'Comparaisons temporelles multi-marques',
      'Historique étendu (12-36 mois)',
      'Export CSV / JSON / Excel',
      'Agrégations territoriales',
      'API d\'accès aux données',
      'Rapports personnalisés',
      'Support dédié',
    ],
    cta: 'Choisir Pro',
    ctaLink: '/subscribe?plan=professional',
    popular: false,
    note: 'Idéal pour artisans, associations, journalistes',
    color: 'from-purple-600 to-purple-700',
    badge: null,
  },
  {
    id: 'institutional',
    name: 'Institution',
    icon: '🏛️',
    price: 'Sur devis',
    period: 'Licence annuelle',
    description: 'Pour les collectivités et organismes publics',
    features: [
      'Tout du plan Professionnel',
      'Données publiques agrégées',
      'Auditabilité complète',
      'Accès open-data structuré',
      'Comparaisons internationales',
      'Observatoire officiel',
      'Formation des équipes',
      'SLA garanti',
    ],
    cta: 'Nous contacter',
    ctaLink: '/contact-collectivites',
    popular: false,
    note: 'Conforme INSEE / Eurostat / standards publics',
    color: 'from-emerald-600 to-emerald-700',
    badge: '🏆 Enterprise',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-md border-b border-blue-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Service public de transparence des prix
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Choisissez votre formule
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Un outil adapté à chaque besoin, pour plus de transparence sur les prix en Outre-mer
          </p>
        </div>
      </div>

      {/* Why Subscribe Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-600 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Pourquoi un abonnement ?
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                A KI PRI SA YÉ est un outil <strong>citoyen, indépendant et sans publicité</strong>.
                L'abonnement permet de maintenir des données fiables, auditées et mises à jour,
                sans revente ni influence commerciale.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-green-500 rounded-lg text-green-700 dark:text-green-300 font-semibold text-sm">
              ✅ Sans publicité
            </span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-green-500 rounded-lg text-green-700 dark:text-green-300 font-semibold text-sm">
              ✅ Pas de vente de données
            </span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-green-500 rounded-lg text-green-700 dark:text-green-300 font-semibold text-sm">
              ✅ Transparence totale
            </span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-green-500 rounded-lg text-green-700 dark:text-green-300 font-semibold text-sm">
              ✅ Indépendant
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-2 ${
                plan.popular
                  ? 'border-blue-500 dark:border-blue-600 scale-105'
                  : 'border-slate-200 dark:border-slate-700'
              } p-6 flex flex-col transition-all hover:shadow-xl hover:scale-105`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Icon & Title */}
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price !== 'Sur devis' && (
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">€</span>
                  )}
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {plan.period}
                </p>
              </div>

              {/* Features */}
              <div className="flex-1 mb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Note */}
              {plan.note && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                    💡 {plan.note}
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <a
                href={plan.ctaLink}
                className={`block w-full py-3 px-6 text-center font-bold rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700">
            <TrendingUp className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Données actualisées
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Mises à jour régulières pour des comparaisons précises
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700">
            <Shield className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Données sécurisées
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vos informations protégées et jamais revendues
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700">
            <Zap className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Résiliation facile
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Annulez votre abonnement à tout moment en un clic
            </p>
          </div>
        </div>

        {/* FAQ Quick */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Questions fréquentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                💳 Comment payer ?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Carte bancaire sécurisée. Pas de frais cachés. Annulation en un clic.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                📱 Compatible mobile ?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Oui, 100% responsive. Fonctionne sur tous les appareils.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                🔒 Mes données sont-elles protégées ?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Absolument. Chiffrement, pas de revente, conformité RGPD.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                ❓ Besoin d'aide ?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Support par email. Réponse sous 24-48h.{' '}
                <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Contactez-nous
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers de citoyens qui comparent déjà leurs prix
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/mon-compte"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              Essayer gratuitement
            </a>
            <a
              href="/subscribe?plan=citizen"
              className="px-8 py-4 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 transition-all border-2 border-white"
            >
              Choisir Citoyen (3,99 €)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}