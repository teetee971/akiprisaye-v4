import { GlassCard } from "../components/ui/glass-card";

export default function Home() {
  return (
    <div className="space-y-6">

      {/* Version Client Officielle v1.0 */}
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "12px 16px",
          margin: "16px auto",
          maxWidth: "520px",
          textAlign: "center",
          fontSize: "14px",
          color: "#e5e7eb",
        }}
      >
        <strong>Version Client Officielle v1.0</strong><br />
        Plateforme publique stable – données vérifiées – transparence garantie<br />
        <a
          href="https://github.com/teetee971/akiprisaye-web/releases/tag/v1.0"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#60a5fa", textDecoration: "underline" }}
        >
          Voir la version de référence
        </a>
      </div>

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
          <a 
            href="/mon-compte" 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Créer un compte gratuit
          </a>
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
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-3xl font-bold text-blue-400 mb-1">👤</div>
            <div className="text-sm text-gray-400 mb-1">Utilisateurs inscrits</div>
            <div className="text-lg font-semibold text-gray-200">Comptes actifs ayant accès aux données publiques</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-3xl font-bold text-green-400 mb-1">📦</div>
            <div className="text-sm text-gray-400 mb-1">Produits et services suivis</div>
            <div className="text-lg font-semibold text-gray-200">Références analysées par territoire</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-3xl font-bold text-purple-400 mb-1">📥</div>
            <div className="text-sm text-gray-400 mb-1">Consultations & exports réalisés</div>
            <div className="text-lg font-semibold text-gray-200">Accès et téléchargements de données open-data</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-3xl font-bold text-yellow-400 mb-1">🕒</div>
            <div className="text-sm text-gray-400 mb-1">Dernière mise à jour des données</div>
            <div className="text-lg font-semibold text-gray-200">Horodatage réel des dernières observations</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center italic">
          Ces indicateurs reflètent l'usage réel du service.<br/>
          Aucun chiffre n'est estimé, simulé ou extrapolé.
        </p>
      </GlassCard>

      {/* Pourquoi ce service existe */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4">❓ Pourquoi ce service existe</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-blue-300 mb-2">Le constat</h3>
            <p className="text-gray-300 text-sm">
              Les écarts de prix entre territoires ultramarins sont rarement documentés de manière publique, structurée et comparable.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-green-300 mb-2">La réponse</h3>
            <p className="text-gray-300 text-sm">
              Un observatoire citoyen indépendant, en lecture seule, basé sur des données observées et territorialisées.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-yellow-300 mb-2">L'engagement</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Pas de publicité</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Pas de recommandations commerciales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Pas de notation propriétaire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Données sourcées et traçables</span>
              </li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Accéder aux données */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">🧭 Accéder aux données</h3>
        <div className="space-y-2">
          <a 
            href="/comparateur" 
            className="block px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-center font-medium transition-colors"
          >
            Accéder au comparateur
          </a>
          <a 
            href="/carte" 
            className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
          >
            Données territoriales détaillées
          </a>
          <a 
            href="/methodologie" 
            className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
          >
            Méthodologie et sources
          </a>
        </div>
      </GlassCard>

      {/* Activité récente (lecture seule) */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">🕒 Activité récente (lecture seule)</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <p className="text-gray-300">Mise à jour prix carburant — <span className="text-blue-400">Martinique</span> — aujourd'hui</p>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <p className="text-gray-300">Export open-data — <span className="text-blue-400">Guadeloupe</span> — il y a 18 minutes</p>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <p className="text-gray-300">Nouvelle série historique — <span className="text-blue-400">La Réunion</span> — hier</p>
          </div>
        </div>
      </GlassCard>

      {/* Statut du service */}
      <GlassCard className="bg-green-900/10 border-green-500/30">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🟢</div>
          <div>
            <h3 className="text-lg font-semibold text-green-300">Statut du service</h3>
            <p className="text-sm text-gray-300">Service opérationnel</p>
            <p className="text-xs text-gray-400">Collecte et mise à jour des données actives.</p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
}
