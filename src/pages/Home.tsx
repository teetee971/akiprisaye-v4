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

      {/* Hero principal - Proposition de valeur claire */}
      <GlassCard>
        <h1 className="text-3xl font-semibold leading-tight mb-3">
          Comparateur citoyen des prix<br />
          <span className="text-blue-400 text-2xl">DOM • ROM • COM</span>
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed">
          Observer, comparer et suivre l'évolution réelle des prix<br className="hidden sm:block" />
          dans tous les territoires ultramarins.
        </p>
      </GlassCard>

      {/* Pourquoi ce service existe - Légitimité */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-3">Pourquoi A KI PRI SA YÉ ?</h2>
        <p className="text-gray-300 leading-relaxed">
          Les écarts de prix entre territoires ultramarins sont réels, 
          mais rarement documentés de manière publique, vérifiable et continue.
        </p>
        <p className="text-gray-300 leading-relaxed mt-3">
          <strong>A KI PRI SA YÉ</strong> est un service citoyen indépendant 
          qui agrège uniquement des données observées et sourcées, 
          sans publicité, sans recommandations commerciales.
        </p>
      </GlassCard>

      {/* Crédibilité - Preuves visibles */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Notre engagement</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✔</span>
            <span><strong>Données observées par territoire</strong> (DOM-ROM-COM)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✔</span>
            <span><strong>Historique des prix multi-années</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✔</span>
            <span><strong>Sources publiques et vérifiables</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✔</span>
            <span><strong>Lecture seule</strong> – aucun conseil, aucune publicité</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">✔</span>
            <span><strong>Données exportables</strong> – Open-Data</span>
          </li>
        </ul>
      </GlassCard>

      {/* CTAs clairs */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Accéder aux données</h3>
        <div className="space-y-2">
          <a 
            href="/comparateur" 
            className="block px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-center font-medium transition-colors"
          >
            → Accéder au comparateur
          </a>
          <a 
            href="/carte" 
            className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
          >
            → Consulter les données par territoire
          </a>
          <a 
            href="https://github.com/teetee971/akiprisaye-web/blob/main/docs/CHARTE_TRANSPARENCE.md" 
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
          >
            → Voir la méthodologie
          </a>
        </div>
      </GlassCard>

      {/* Fonctionnalités en cours de déploiement */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-3 text-gray-400">Fonctionnalités en cours de déploiement</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Comparaison multi-services (énergie, télécoms, transports)</li>
          <li>• Indices du coût de la vie par territoire</li>
          <li>• Données ouvertes pour chercheurs et institutions</li>
        </ul>
      </GlassCard>

    </div>
  );
}
