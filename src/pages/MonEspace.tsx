import { useEffect, useMemo, useState } from 'react';
import { observatoireLocalData } from '../data/observatoireLocalData';

type UserHistoryState = {
  lastPage: string;
  lastTerritory: string;
  updatedAt?: string;
};

type Alert = {
  id: string;
  product: string;
  targetPrice: number;
};

type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
};

const HISTORY_KEY = 'akiprisaye:user:history';
const ALERTS_KEY = 'akiprisaye:alerts';
const SHOPPING_KEY = 'akiprisaye:shopping:list';

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function UserHistory() {
  const [history, setHistory] = useState<UserHistoryState | null>(null);

  useEffect(() => {
    setHistory(safeParse<UserHistoryState>(localStorage.getItem(HISTORY_KEY)));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory(null);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Historique utilisateur</h2>
        <button
          onClick={clearHistory}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-700 text-slate-100 hover:border-red-400 hover:text-red-200 transition-colors"
          type="button"
        >
          Effacer l&apos;historique
        </button>
      </div>
      {history ? (
        <dl className="space-y-2 text-slate-200">
          <div>
            <dt className="text-sm text-slate-400">Dernière page observatoire</dt>
            <dd className="font-semibold">{history.lastPage}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">Dernier territoire</dt>
            <dd className="font-semibold">{history.lastTerritory || 'Non renseigné'}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">Mise à jour</dt>
            <dd className="font-semibold">
              {history.updatedAt
                ? new Intl.DateTimeFormat('fr-FR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(history.updatedAt))
                : 'Date inconnue'}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-slate-300 text-sm">
          Aucun historique local enregistré pour l&apos;observatoire. Visitez la page Observatoire pour initialiser ces
          données.
        </p>
      )}
    </section>
  );
}

function PriceAlerts() {
  const [product, setProduct] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>(() => safeParse<Alert[]>(localStorage.getItem(ALERTS_KEY)) ?? []);

  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const priceValue = Number.parseFloat(targetPrice);
    if (!product.trim() || Number.isNaN(priceValue) || priceValue <= 0) return;
    setAlerts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), product: product.trim(), targetPrice: Number(priceValue.toFixed(2)) },
    ]);
    setProduct('');
    setTargetPrice('');
  };

  const removeAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const priceIndex = useMemo(() => {
    const map = new Map<string, number>();
    observatoireLocalData.panier.forEach((item) => map.set(item.produit.toLowerCase(), item.prix_moyen));
    return map;
  }, []);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Alertes prix locales</h2>
        <span className="text-xs text-slate-400">Comparaison sur les données statiques du panier publié</span>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1 text-sm text-slate-200">
          Produit
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            placeholder="Ex : Riz 1kg"
            required
          />
        </label>
        <label className="w-full sm:w-48 text-sm text-slate-200">
          Prix cible (EUR)
          <input
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            inputMode="decimal"
            required
          />
        </label>
        <button
          type="submit"
          className="h-fit mt-5 sm:mt-0 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
        >
          Ajouter
        </button>
      </form>

      {alerts.length === 0 ? (
        <p className="text-slate-300 text-sm">Aucune alerte définie. Les données restent locales à cet appareil.</p>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => {
            const currentPrice = priceIndex.get(alert.product.toLowerCase());
            const triggered = currentPrice !== undefined && currentPrice <= alert.targetPrice;
            return (
              <li
                key={alert.id}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-white">{alert.product}</p>
                  <p className="text-sm text-slate-300">
                    Cible : {alert.targetPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € —{' '}
                    {currentPrice !== undefined
                      ? `Prix panier : ${currentPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                      : 'Produit non trouvé dans le panier publié'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      triggered ? 'text-green-300' : 'text-slate-400'
                    }`}
                    aria-live="polite"
                  >
                    {triggered ? 'Alerte déclenchée' : 'En attente'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAlert(alert.id)}
                    className="text-sm text-red-300 hover:text-red-200"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ShoppingList() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<ShoppingItem[]>(() => safeParse<ShoppingItem[]>(localStorage.getItem(SHOPPING_KEY)) ?? []);

  useEffect(() => {
    localStorage.setItem(SHOPPING_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!itemName.trim() || quantity <= 0) return;
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: itemName.trim(), quantity: Math.max(1, Math.round(quantity)) },
    ]);
    setItemName('');
    setQuantity(1);
  };

  const updateQuantity = (id: string, delta: number) =>
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    );

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Liste de courses</h2>
        <span className="text-xs text-slate-400">Persistance locale uniquement</span>
      </div>

      <form onSubmit={addItem} className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1 text-sm text-slate-200">
          Produit
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            placeholder="Ex : Lait 1L"
            required
          />
        </label>
        <label className="w-full sm:w-32 text-sm text-slate-200">
          Quantité
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="h-fit mt-5 sm:mt-0 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
        >
          Ajouter
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-slate-300 text-sm">Aucun article enregistré pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-slate-300">Quantité : {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, -1)}
                  className="px-3 py-1 rounded-lg border border-slate-700 text-slate-100 hover:border-blue-400"
                  aria-label={`Diminuer ${item.name}`}
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-3 py-1 rounded-lg border border-slate-700 text-slate-100 hover:border-blue-400"
                  aria-label={`Augmenter ${item.name}`}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-red-300 hover:text-red-200"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function MonEspace() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="space-y-2">
          <p className="text-sm text-blue-200 uppercase tracking-wide">Espace local</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Mon espace</h1>
          <p className="text-slate-300 max-w-3xl">
            Les données de cet espace sont stockées uniquement sur cet appareil. Aucun compte ni appel réseau ne sont
            nécessaires.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <UserHistory />
          <PriceAlerts />
        </div>

        <ShoppingList />
      </div>
    </div>
  );
}
