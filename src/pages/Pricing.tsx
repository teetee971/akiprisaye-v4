import { GlassCard } from "../components/ui/glass-card";

export default function Pricing() {
  return (
    <div className="grid gap-4">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-300 font-semibold">Niveaux d'accès au service</p>
        <p className="text-xs text-gray-400 mt-1">
          Observatoire citoyen des prix et du coût de la vie — DOM · ROM · COM
        </p>
      </div>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">🧑 Citoyen</h3>
        <p className="text-sm text-gray-200">3,99 € / mois</p>
        <p className="text-xs text-gray-400 mt-1">
          Accès individuel • Contribution de soutien
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">🧑‍💼 Professionnel</h3>
        <p className="text-sm text-gray-200">19 € / mois</p>
        <p className="text-xs text-gray-400 mt-1">
          Droits étendus • Analyses territoriales avancées
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">🏛️ Institution</h3>
        <p className="text-sm text-gray-200">Licence annuelle</p>
        <p className="text-xs text-gray-400 mt-1">
          Licence institutionnelle • Données publiques auditées
        </p>
      </GlassCard>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Paiement non activé — accès sur convention ou demande officielle
      </p>
    </div>
  );
}