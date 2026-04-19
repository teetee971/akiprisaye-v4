import React from 'react';

const producers = [
  { name: "Karukera Vanilline", product: "Vanille Givrée & Extraits", location: "Basse-Terre", type: "Excellence", url: "https://www.karukera-vanilline.com/" },
  { name: "Vanibel", product: "Café Arabica, Vanille, Banane", location: "Vieux-Habitants", type: "Agrotourisme", url: "https://vanibel.net/" },
  { name: "Domaine de Valombreuse", product: "Plantes & Produits Naturels", location: "Petit-Bourg", type: "Parc & Boutique", url: "https://www.valombreuse.com/" },
  { name: "Distillerie Bologne", product: "Rhum Agricole & Produits Dérivés", location: "Basse-Terre", type: "Distillerie", url: "https://www.rhumbologne.fr/" },
  { name: "Maison du Cacao", product: "Chocolat & Transformation Cacao", location: "Pointe-Noire", type: "Agrotourisme", url: "http://maisanducacao.fr/" },
  { name: "Mon Panier Bio", product: "Paniers Bio & Circuit Court", location: "Livraison", type: "Bio", url: "https://www.monpanierbioguadeloupe.fr/" },
  { name: "Myel et Une Saveurs", product: "Miels tropicaux", location: "Guadeloupe", type: "Apiculture", url: "https://myel-et-une-saveurs.sumupstore.com" },
  { name: "Caraïbes Melonniers", product: "Melons IGP", location: "G-Terre / MG", type: "Export", url: "https://www.caraibes-melonniers.fr/" },
  { name: "SICAPAG", product: "Coopérative Agricole", location: "Marie-Galante / Gpe", type: "Coopérative", url: "https://www.sicapag-gpe.fr/" },
  { name: "Inakobé", product: "Farines alternatives sans gluten", location: "Morne-à-l'Eau", type: "Innovation", url: "https://inakobe.fr/" },
  { name: "Sam's Délices", product: "Sirops Sikofwi & Artisanat", location: "Baie-Mahault", type: "Artisanat", url: "https://www.samsdelices971.com/" }
];

export const LocalProducers = () => {
  return (
    <div className="mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-4">
        <div>
          <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter leading-none">
            Points d'Intérêt <span className="text-gold-600">Souverains</span> 🇬🇵
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium underline decoration-green-500 decoration-2">L'élite de la production locale.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase italic">Direct Pays</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {producers.map((p, i) => (
          <div key={p.url} className="bg-white border border-slate-100 p-6 rounded-[2rem] hover:shadow-2xl hover:border-blue-900/10 transition-all group relative">
            <div className="absolute top-4 right-4">
              <span className="text-[8px] font-black bg-slate-900 text-white px-2 py-1 rounded-lg uppercase tracking-widest">{p.type}</span>
            </div>

            <h4 className="font-black text-slate-800 text-lg mb-1 mt-4 group-hover:text-blue-900 transition-colors">{p.name}</h4>
            <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-tighter">📍 {p.location}</p>
            <p className="text-sm text-slate-600 mb-6 h-10 overflow-hidden line-clamp-2">{p.product}</p>

            <div className="flex flex-col gap-2">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-center w-full py-2.5 bg-blue-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-gold-500 transition-colors">
                Voir les prix
              </a>
              <button className="text-center w-full py-2 border border-slate-200 text-slate-400 text-[9px] font-bold rounded-xl uppercase hover:bg-slate-50 transition-colors">
                Ce commerce m'appartient
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 rounded-[3rem] p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h3 className="text-2xl font-black text-white uppercase relative z-10">Rejoindre l'Alliance A Ki Pri Sa Yé</h3>
        <p className="text-slate-400 my-4 max-w-lg mx-auto relative z-10">Vous êtes producteur, commerçant ou artisan ? Prenez le contrôle de vos données et touchez directement vos clients.</p>
        <button className="bg-gold-500 text-blue-900 px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest relative z-10 hover:scale-105 transition-transform shadow-2xl">
          Inscrire mon activité
        </button>
      </div>
    </div>
  );
};
