import { GlassCard } from "../components/ui/glass-card";
import VersionBanner from "../components/ui/VersionBanner";

export default function Home() {
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

      {/* Inscription obligatoire */}
      <GlassCard className="bg-blue-900/10 border-blue-500/30">
        <h2 className="text-xl font-semibold mb-3 text-blue-300">🔐 Accès au service</h2>
        <h3 className="text-lg font-semibold mb-2">Inscription obligatoire</h3>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          L'inscription gratuite est requise pour consulter les données publiques,
          afin de garantir la transparence des usages et l'intégrité des données observées.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => alert("L'inscription au service sera prochainement disponible.")}
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

    </div>
  )
}
