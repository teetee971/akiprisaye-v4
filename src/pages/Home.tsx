import { GlassCard } from "../components/ui/glass-card";

export default function Home() {
  return (
    <div className="space-y-6">

      {/* 🟢 Version Client Officielle v1.0 */}
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
        🟢 <strong>Version Client Officielle v1.0</strong><br />
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

      {/* Carte principale */}
      <GlassCard>
        <h1 className="text-2xl font-semibold">
          Comparateur de prix citoyen – DOM-ROM-COM
        </h1>
        <p className="text-gray-300 mt-2">
          Comparez les prix réels dans les DOM-COM et suivez l’évolution des produits du quotidien.
        </p>
      </GlassCard>

      {/* Carte fonctionnalités */}
      <GlassCard>
        <ul className="grid grid-cols-2 gap-4 text-sm">
          <li>📍 Tous territoires ultramarins</li>
          <li>📊 Historique & évolution des prix</li>
          <li>🧾 Sources officielles visibles</li>
          <li>⚖️ Service civique, sans publicité</li>
        </ul>
      </GlassCard>

    </div>
  );
}