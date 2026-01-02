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
          Scan illimité · OCR · Historique · Alertes
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">🧑‍💼 Professionnel</h3>
        <p className="text-sm text-gray-200">19 € / mois</p>
        <p className="text-xs text-gray-400 mt-1">
          Comparaisons temporelles · Exports · Agrégations
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">🏛️ Institution</h3>
        <p className="text-sm text-gray-200">Sur devis</p>
        <p className="text-xs text-gray-400 mt-1">
          Licence annuelle · Open-data · Observatoire
        </p>
      </GlassCard>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Paiement non activé — accès sur convention ou demande officielle
      </p>
    </div>
  );
}