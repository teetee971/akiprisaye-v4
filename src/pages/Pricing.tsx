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
        <h3 className="font-semibold text-gray-100">🧑 Citoyen+</h3>
        <p className="text-sm text-gray-200">2,99 € / mois</p>
        <p className="text-xs text-gray-400 mt-1">
          Historique · Alertes · Exports basiques
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">🧑‍💼 Pro</h3>
        <p className="text-sm text-gray-200">9,99 € / mois</p>
        <p className="text-xs text-gray-400 mt-1">
          Agrégations avancées · Multi-territoires
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">🏛️ Institution</h3>
        <p className="text-sm text-gray-200">Sur devis</p>
        <p className="text-xs text-gray-400 mt-1">
          API · Open-data · Rapports
        </p>
      </GlassCard>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Paiement non activé — accès sur convention ou demande officielle
      </p>
    </div>
  );
}