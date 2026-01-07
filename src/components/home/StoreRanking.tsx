/**
 * ⑤ CLASSEMENT SIMPLE DES ENSEIGNES
 * Top 3 des enseignes les plus économiques
 */

import { GlassCard } from "../ui/glass-card";

interface StoreRank {
  rank: number;
  name: string;
  productsCount: number;
  medal: string;
}

export function StoreRanking() {
  const territory = "Guadeloupe";
  const rankings: StoreRank[] = [
    { rank: 1, name: "Leader Price", productsCount: 12, medal: "🥇" },
    { rank: 2, name: "Super U", productsCount: 9, medal: "🥈" },
    { rank: 3, name: "Carrefour", productsCount: 7, medal: "🥉" }
  ];

  return (
    <GlassCard className="bg-yellow-900/10 border-yellow-500/30">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2 text-yellow-300">
            🏆 Enseignes les plus économiques – {territory}
          </h3>
        </div>

        {/* Classement */}
        <div className="space-y-3">
          {rankings.map((store) => (
            <div 
              key={store.rank}
              className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all transform hover:scale-102"
            >
              <div className="text-4xl">{store.medal}</div>
              <div className="flex-1">
                <div className="font-bold text-lg text-white">{store.name}</div>
                <div className="text-sm text-gray-400">
                  {store.productsCount} produits les moins chers
                </div>
              </div>
              <div className="text-2xl font-bold text-green-400">
                #{store.rank}
              </div>
            </div>
          ))}
        </div>

        {/* Mention légale */}
        <div className="text-center pt-4 border-t border-slate-700">
          <div className="text-xs text-gray-400">
            📊 Données publiques – observatoire citoyen
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Basé sur {rankings.reduce((sum, r) => sum + r.productsCount, 0)} produits suivis
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
