import React, { useState } from "react";
import { GlassCard } from "../components/ui/glass-card";
import VersionBanner from "../components/ui/VersionBanner";

export default function Home() {
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <div className="space-y-6">

      {/* Centralized public version banner */}
      <VersionBanner />

      {/* Hero principal - Proposition de valeur */}
      <GlassCard>
        <h1 className="text-3xl font-semibold leading-tight mb-3">
          Comparateur citoyen des prix<br />
          <span className="text-blue-400 text-2xl">DOM • ROM • COM</span>
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-4">
          Observer, comparer et suivre l'évolution réelle des prix<br className="hidden sm:block" />
          dans tous les territoires ultramarins.
        </p>
        <p className="text-gray-400 text-base">
          Service public numérique indépendant, fondé exclusivement sur des données observées, sourcées et vérifiables.
        </p>
      </GlassCard>

      {/* Accès libre avec fonctionnalités avancées protégées */}
      <GlassCard className="bg-blue-900/10 border-blue-500/30">
        <h2 className="text-xl font-semibold mb-3 text-blue-300">🔓 Accès libre au service</h2>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          Les comparaisons de prix, la recherche de produits et la consultation des territoires sont <strong>accessibles librement</strong>.
        </p>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          L'inscription est requise pour activer les <strong>alertes prix</strong>, le <strong>panier</strong> et l'<strong>historique</strong>.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setShowSignupModal(true)}
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Créer un compte gratuit
          </button>
          <a 
            href="/mon-compte" 
            className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Se connecter
          </a>
        </div>
      </GlassCard>

      {/* Indicateurs publics de transparence */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4">📊 Indicateurs publics de transparence</h2>
        <p className="text-sm text-gray-400 mb-6">Indicateurs d'usage réel</p>

      </GlassCard>

      {showSignupModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="signup-modal-title"
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSignupModal(false)} />

          <div className="z-10 max-w-lg w-full">
            <GlassCard>
              <h3 id="signup-modal-title" className="text-xl font-semibold mb-3">Inscription au service</h3>
              <p className="text-gray-300 text-sm mb-6">
                L’inscription au service A KI PRI SA YÉ sera prochainement disponible.
                Le service est actuellement accessible en consultation publique,
                dans un cadre de transparence et de données ouvertes.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSignupModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white"
                >
                  Fermer
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

    </div>
  )
}
