import { useEffect, useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import FavoritesPanel from '../components/search/FavoritesPanel';
import SearchHistoryPanel from '../components/search/SearchHistoryPanel';
import { useFavorites, type FavoriteItem } from '../hooks/useFavorites';
import { useSearchHistory, type SearchHistoryEntry, type SearchHistoryType } from '../hooks/useSearchHistory';
import { searchProductPrices } from '../services/priceSearch/priceSearch.service';
import type { PriceSearchResult, TerritoryCode } from '../services/priceSearch/price.types';
import type { PriceObservationSnapshot, ScanData, ScanHubResult } from '../types/scanHubResult';
import { safeLocalStorage } from '../utils/safeLocalStorage';

const TERRITORIES: { code: TerritoryCode; label: string }[] = [
  { code: 'fr', label: 'France (métropole)' },
  { code: 'gp', label: 'Guadeloupe' },
  { code: 'mq', label: 'Martinique' },
  { code: 'gf', label: 'Guyane' },
  { code: 're', label: 'La Réunion' },
  { code: 'yt', label: 'Mayotte' },
  { code: 'pm', label: 'Saint-Pierre-et-Miquelon' },
  { code: 'bl', label: 'Saint-Barthélemy' },
  { code: 'mf', label: 'Saint-Martin' },
];

const ALL_TERRITORIES = 'ALL';

function getMedian(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Number(((sorted[middle - 1] + sorted[middle]) / 2).toFixed(2));
  }
  return Number(sorted[middle].toFixed(2));
}

function getObservationComparablePrice(observation: PriceObservationSnapshot): number {
  return observation.pricePerUnit ?? observation.price;
}

function getTerritoryStats(observations: PriceObservationSnapshot[], territory: string) {
  const values = observations
    .filter((observation) => observation.territory === territory)
    .map(getObservationComparablePrice)
    .filter(Number.isFinite);

  if (values.length === 0) {
    return null;
  }

  const median = getMedian(values);
  if (median === null) {
    return null;
  }

  return {
    count: values.length,
    median,
  };
}

const getTerritoryLabel = (code?: string) =>
  TERRITORIES.find((item) => item.code === code)?.label ?? 'Territoire non précisé';

const buildSearchLabel = (queryValue: string, barcodeValue: string) => {
  if (queryValue && barcodeValue) {
    return `${queryValue} (EAN ${barcodeValue})`;
  }
  if (barcodeValue) {
    return `EAN ${barcodeValue}`;
  }
  return queryValue || 'Recherche';
};

const buildProductFavoriteId = (params: {
  barcode?: string;
  query?: string;
  productName?: string;
}) => {
  const normalizedBarcode = params.barcode?.trim();
  if (normalizedBarcode) {
    return `product:barcode:${normalizedBarcode}`;
  }
  const normalizedQuery = params.query?.trim().toLowerCase();
  if (normalizedQuery) {
    return `product:query:${normalizedQuery}`;
  }
  const normalizedName = params.productName?.trim().toLowerCase() ?? 'unknown';
  return `product:name:${normalizedName}`;
};

export function SafeFallback({
  title,
  message,
  actions,
  onReturnToHub,
}: {
  title: string;
  message: string;
  actions: Array<{ label: string; onClick: () => void }>;
  onReturnToHub: () => void;
}) {
  return (
    <div
      className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl" aria-hidden="true">
          ℹ️
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-300 mt-1">{message}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 text-sm">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            {action.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onReturnToHub}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
        >
          🏠 Retour au ScanHub
        </button>
      </div>
    </div>
  );
}

export function NoPriceDataState({
  onRetry,
  onScanTicket,
  onReturnToHub,
}: {
  onRetry: () => void;
  onScanTicket: () => void;
  onReturnToHub: () => void;
}) {
  return (
    <SafeFallback
      title="Aucune donnée de prix disponible"
      message="Nous n’avons pas encore suffisamment de données fiables dans votre territoire. Le service continue de s’enrichir automatiquement."
      actions={[
        { label: '🔄 Rechercher un autre produit', onClick: onRetry },
        { label: '📷 Scanner un ticket ou une étiquette', onClick: onScanTicket },
      ]}
      onReturnToHub={onReturnToHub}
    />
  );
}

export function LoadingState() {
  return (
    <div
      className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-slate-200">Recherche en cours...</p>
    </div>
  );
}

export function UnknownState({ onReturnToHub }: { onReturnToHub: () => void }) {
  return (
    <SafeFallback
      title="Information indisponible"
      message="Le service fonctionne, mais aucune donnée exploitable n’a été trouvée."
      actions={[{ label: 'Réessayer', onClick: onReturnToHub }]}
      onReturnToHub={onReturnToHub}
    />
  );
}

function formatCachedLabel(cachedAt: string) {
  const cachedDate = new Date(cachedAt);
  if (Number.isNaN(cachedDate.getTime())) {
    return 'Date inconnue';
  }
  return cachedDate.toLocaleString('fr-FR');
}

export function PriceUnavailableState({
  onRetry,
  onReturnToHub,
}: {
  onRetry: () => void;
  onReturnToHub: () => void;
}) {
  return (
    <SafeFallback
      title="Prix momentanément indisponibles"
      message="Le service ne peut pas répondre pour le moment. Vous pouvez réessayer ou revenir au ScanHub."
      actions={[{ label: '🔄 Réessayer', onClick: onRetry }]}
      onReturnToHub={onReturnToHub}
    />
  );
}

export function PartialPriceState({
  result,
  onRetry,
  onReturnToHub,
}: {
  result: Partial<ScanData>;
  onRetry: () => void;
  onReturnToHub: () => void;
}) {
  const interval = result.prices?.[0];
  const formatRange = (value: number | null) => (value === null ? '—' : `${value.toFixed(2)}€`);
  const confidence = result.confidence ?? 0;
  const observations = interval?.priceCount ?? 0;
  const territoryLabel = getTerritoryLabel(result.territory);

  return (
    <div
      className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl" aria-hidden="true">
          🟡
        </div>
        <div>
          <h2 className="text-lg font-semibold">Données partielles</h2>
          <p className="text-sm text-slate-300 mt-1">
            Les prix disponibles sont incomplets ou peu récents. Ils restent indicatifs.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-slate-950 rounded-lg p-4">
          <p className="text-xs text-slate-400">Indice de confiance</p>
          <p className="text-xl font-semibold">{confidence}/100</p>
          <div className="h-2 bg-slate-800 rounded-full mt-2">
            <div
              className="h-2 rounded-full bg-amber-400"
              style={{ width: `${Math.min(confidence, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-slate-950 rounded-lg p-4">
          <p className="text-xs text-slate-400">Observations</p>
          <p className="text-xl font-semibold">{observations}</p>
          <p className="text-xs text-slate-500 mt-1">Sources: {result.sourcesUsed?.length ?? 0}</p>
        </div>
        <div className="bg-slate-950 rounded-lg p-4">
          <p className="text-xs text-slate-400">Territoire</p>
          <p className="text-base font-semibold">{territoryLabel}</p>
          <p className="text-xs text-slate-500 mt-1">Lecture locale</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-slate-950 rounded-lg p-4">
          <p className="text-xs text-slate-400">Prix minimum</p>
          <p className="text-xl font-semibold">{formatRange(interval?.min ?? null)}</p>
        </div>
        <div className="bg-slate-950 rounded-lg p-4">
          <p className="text-xs text-slate-400">Prix médian</p>
          <p className="text-xl font-semibold">{formatRange(interval?.median ?? null)}</p>
        </div>
        <div className="bg-slate-950 rounded-lg p-4">
          <p className="text-xs text-slate-400">Prix maximum</p>
          <p className="text-xl font-semibold">{formatRange(interval?.max ?? null)}</p>
        </div>
      </div>
      {result.warnings && result.warnings.length > 0 && (
        <div className="text-xs text-slate-300 bg-slate-950 rounded-lg p-3">
          {result.warnings.join(' ')}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-3 text-sm">
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          🔄 Relancer la recherche
        </button>
        <button
          type="button"
          onClick={onReturnToHub}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
        >
          🏠 Retour au ScanHub
        </button>
      </div>
    </div>
  );
}

export function PriceResults({
  result,
  searchQuery,
  searchBarcode,
  onReset,
  onScanTicket,
  onReturnToHub,
  onFavoriteToast,
}: {
  result: ScanData;
  searchQuery?: string;
  searchBarcode?: string;
  onReset: () => void;
  onScanTicket: () => void;
  onReturnToHub: () => void;
  onFavoriteToast?: (message: string) => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const formatRange = (value: number | null) => (value === null ? '—' : `${value.toFixed(2)}€`);

  const interval = result.prices?.[0];
  const confidence = result.confidence ?? 0;
  const observations = interval?.priceCount ?? 0;
  const territoryLabel = getTerritoryLabel(result.territory);
  const selectedTerritories = result.selectedTerritories ?? (result.territory ? [result.territory] : []);
  const territoryMode = result.territoryMode ?? 'CUSTOM';
  const priceObservations = result.priceObservations ?? [];
  const availableComparisonTerritories = Array.from(
    new Set(
      priceObservations
        .map((observation) => observation.territory)
        .filter((item): item is string => Boolean(item))
    )
  );
  const comparisonTerritories =
    availableComparisonTerritories.length >= 2
      ? availableComparisonTerritories
      : selectedTerritories;
  const defaultA = comparisonTerritories[0] ?? null;
  const defaultB = comparisonTerritories.find((territory) => territory !== defaultA) ?? null;
  const [territoryA, setTerritoryA] = useState<string | null>(defaultA);
  const [territoryB, setTerritoryB] = useState<string | null>(defaultB);

  useEffect(() => {
    if (!comparisonTerritories.length) {
      setTerritoryA(null);
      setTerritoryB(null);
      return;
    }

    setTerritoryA((previous) => {
      if (previous && comparisonTerritories.includes(previous)) {
        return previous;
      }
      return comparisonTerritories[0];
    });

    setTerritoryB((previous) => {
      if (previous && comparisonTerritories.includes(previous) && previous !== territoryA) {
        return previous;
      }
      return comparisonTerritories.find((territory) => territory !== territoryA) ?? null;
    });
  }, [comparisonTerritories, territoryA]);

  const statsA = territoryA ? getTerritoryStats(priceObservations, territoryA) : null;
  const statsB = territoryB ? getTerritoryStats(priceObservations, territoryB) : null;
  const deltaValue = statsA && statsB ? Number((statsB.median - statsA.median).toFixed(2)) : null;
  const deltaPct =
    statsA && statsB && statsA.median !== 0
      ? Number((((statsB.median - statsA.median) / statsA.median) * 100).toFixed(1))
      : null;
  const indexB =
    statsA && statsB && statsA.median !== 0
      ? Number(((statsB.median / statsA.median) * 100).toFixed(1))
      : null;
  const favoriteId = buildProductFavoriteId({
    barcode: searchBarcode,
    query: searchQuery,
    productName: result.productName,
  });
  const favoriteLabel = searchQuery?.trim() || searchBarcode?.trim()
    ? buildSearchLabel(searchQuery?.trim() ?? '', searchBarcode?.trim() ?? '')
    : result.productName || 'Produit favori';
  const favoriteActive = isFavorite(favoriteId);

  return (
    <section className="space-y-4">
      <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">
              {result.productName || 'Produit analysé'}
            </h2>
            <p className="text-sm text-slate-400">
              Confiance: {confidence}/100 • Sources: {result.sourcesUsed?.length ?? 0}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1">
              📍 {territoryLabel}
            </div>
            <div className="text-sm text-slate-200 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-1">
              Prix observés localement
            </div>
            <button
              type="button"
              onClick={() => {
                const message = favoriteActive ? 'Favori retiré' : '⭐ Ajouté aux favoris';
                toggleFavorite({
                  id: favoriteId,
                  label: favoriteLabel || result.productName || 'Produit favori',
                  type: 'product',
                  barcode: searchBarcode?.trim() || undefined,
                  query: searchQuery?.trim() || undefined,
                  productName: result.productName,
                  route:
                    searchBarcode?.trim() || searchQuery?.trim()
                      ? `/recherche-produits?${new URLSearchParams({
                          ...(searchBarcode?.trim() ? { ean: searchBarcode.trim() } : {}),
                          ...(searchQuery?.trim() ? { q: searchQuery.trim() } : {}),
                        }).toString()}`
                      : undefined,
                });
                onFavoriteToast?.(message);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                favoriteActive
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-amber-200'
              }`}
              aria-pressed={favoriteActive}
            >
              {favoriteActive ? '⭐ Favori' : '☆ Favori'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950 rounded-lg p-4">
            <p className="text-xs text-slate-400">Indice de confiance</p>
            <p className="text-xl font-semibold">{confidence}/100</p>
            <div className="h-2 bg-slate-800 rounded-full mt-2">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${Math.min(confidence, 100)}%` }}
              />
            </div>
          </div>
          <div className="bg-slate-950 rounded-lg p-4">
            <p className="text-xs text-slate-400">Observations</p>
            <p className="text-xl font-semibold">{observations}</p>
            <p className="text-xs text-slate-500 mt-1">Prix agrégés</p>
          </div>
          <div className="bg-slate-950 rounded-lg p-4">
            <p className="text-xs text-slate-400">Territoires</p>
            <p className="text-base font-semibold">
              {territoryMode === ALL_TERRITORIES ? 'Tous territoires' : territoryLabel}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedTerritories.length} zone{selectedTerritories.length > 1 ? 's' : ''} active
              {selectedTerritories.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {selectedTerritories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {territoryMode === ALL_TERRITORIES && (
              <span className="text-xs px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
                Tous territoires
              </span>
            )}
            {selectedTerritories.map((territoryCode) => (
              <span
                key={territoryCode}
                className="text-xs px-2.5 py-1 rounded-full border border-slate-700 bg-slate-900 text-slate-200"
              >
                {getTerritoryLabel(territoryCode)}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950 rounded-lg p-4">
            <p className="text-xs text-slate-400">Prix minimum</p>
            <p className="text-xl font-semibold">{formatRange(interval?.min ?? null)}</p>
          </div>
          <div className="bg-slate-950 rounded-lg p-4">
            <p className="text-xs text-slate-400">Prix médian</p>
            <p className="text-xl font-semibold">{formatRange(interval?.median ?? null)}</p>
          </div>
          <div className="bg-slate-950 rounded-lg p-4">
            <p className="text-xs text-slate-400">Prix maximum</p>
            <p className="text-xl font-semibold">{formatRange(interval?.max ?? null)}</p>
          </div>
        </div>

        {result.territoryMessage && (
          <div className="text-xs text-orange-200 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
            {result.territoryMessage}
          </div>
        )}

        <div className="text-xs text-slate-400">
          Sources utilisées : {result.sourcesUsed?.join(', ') || 'Aucune'}
        </div>
      </div>

      {comparisonTerritories.length >= 2 && (
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Comparaison territoires (vs)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="space-y-2 text-sm">
              <span className="text-slate-300">Territoire A</span>
              <select
                value={territoryA ?? ''}
                onChange={(event) => setTerritoryA(event.target.value || null)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
              >
                {comparisonTerritories.map((territoryCode) => (
                  <option key={`A-${territoryCode}`} value={territoryCode}>
                    {getTerritoryLabel(territoryCode)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-300">Territoire B</span>
              <select
                value={territoryB ?? ''}
                onChange={(event) => setTerritoryB(event.target.value || null)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
              >
                {comparisonTerritories.map((territoryCode) => (
                  <option key={`B-${territoryCode}`} value={territoryCode}>
                    {getTerritoryLabel(territoryCode)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {statsA && statsB && deltaValue !== null && deltaPct !== null && indexB !== null ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-center">
              <div className="bg-slate-950 rounded-lg p-3">
                <p className="text-xs text-slate-400">Médiane A</p>
                <p className="font-semibold text-white">{statsA.median.toFixed(2)}€</p>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <p className="text-xs text-slate-400">Médiane B</p>
                <p className="font-semibold text-white">{statsB.median.toFixed(2)}€</p>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <p className="text-xs text-slate-400">Écart €</p>
                <p className="font-semibold text-white">{deltaValue > 0 ? '+' : ''}{deltaValue.toFixed(2)}€</p>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <p className="text-xs text-slate-400">Écart %</p>
                <p className="font-semibold text-white">{deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <p className="text-xs text-slate-400">Indice base 100</p>
                <p className="font-semibold text-white">A=100 → B={indexB.toFixed(1)}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Données insuffisantes pour calculer les indicateurs A vs B.
            </p>
          )}
        </div>
      )}

      {priceObservations.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">Observations détaillées</h3>
          <div className="space-y-2">
            {priceObservations.slice(0, 12).map((observation, index) => (
              <div
                key={`${observation.source ?? 'source'}-${observation.observedAt ?? index}`}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 flex items-center justify-between gap-3"
              >
                <div className="text-sm text-slate-200">{observation.normalizedLabel ?? `${observation.price.toFixed(2)}€`}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {observation.source ?? 'source inconnue'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30">
                    {getTerritoryLabel(observation.territory)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-2">
          <h3 className="text-sm font-semibold text-slate-200">Informations</h3>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function PriceSearchResults({
  result,
  searchQuery,
  searchBarcode,
  onReset,
  onScanTicket,
  onReturnToHub,
  onFavoriteToast,
}: {
  result: ScanHubResult | null;
  searchQuery?: string;
  searchBarcode?: string;
  onReset: () => void;
  onScanTicket: () => void;
  onReturnToHub: () => void;
  onFavoriteToast?: (message: string) => void;
}) {
  if (!result) {
    return <LoadingState />;
  }

  switch (result.status) {
    case 'LOADING':
      return <LoadingState />;
    case 'NO_DATA':
      return (
        <NoPriceDataState
          onRetry={onReset}
          onScanTicket={onScanTicket}
          onReturnToHub={onReturnToHub}
        />
      );
    case 'UNAVAILABLE':
      return <PriceUnavailableState onRetry={onReset} onReturnToHub={onReturnToHub} />;
    case 'PARTIAL':
      return (
        <PartialPriceState
          result={result.data}
          onRetry={onReset}
          onReturnToHub={onReturnToHub}
        />
      );
    case 'OK':
      return (
        <PriceResults
          result={result.data}
          searchQuery={searchQuery}
          searchBarcode={searchBarcode}
          onReset={onReset}
          onScanTicket={onScanTicket}
          onReturnToHub={onReturnToHub}
          onFavoriteToast={onFavoriteToast}
        />
      );
    default:
      return <UnknownState onReturnToHub={onReturnToHub} />;
  }
}

function aggregatePriceSearchResults(
  responses: PriceSearchResult[],
  territories: TerritoryCode[],
  mode: 'ALL' | 'CUSTOM',
): ScanHubResult {
  const normalizedObservations: PriceObservationSnapshot[] = responses.flatMap((response, index) =>
    response.observations.map((observation) => ({
      source: observation.source,
      price: observation.price,
      pricePerUnit: observation.pricePerUnit,
      currency: observation.currency,
      unit: observation.unit,
      territory: observation.territory ?? territories[index],
      observedAt: observation.observedAt,
      normalizedLabel: observation.normalizedLabel,
    }))
  );

  const observations =
    mode === 'ALL'
      ? normalizedObservations
      : normalizedObservations.filter((observation) =>
          observation.territory ? territories.includes(observation.territory as TerritoryCode) : false
        );

  if (observations.length === 0) {
    return {
      status: 'NO_DATA',
      reason: 'Données insuffisantes pour établir une fourchette de prix fiable.',
    };
  }

  const values = observations.map(getObservationComparablePrice);
  const interval = {
    min: Number(Math.min(...values).toFixed(2)),
    median: getMedian(values),
    max: Number(Math.max(...values).toFixed(2)),
    currency: 'EUR' as const,
    priceCount: values.length,
  };

  const confidence = Math.round(
    responses.reduce((sum, response) => sum + response.confidence, 0) / responses.length
  );
  const warnings = Array.from(new Set(responses.flatMap((response) => response.warnings)));
  const sources = Array.from(new Set(responses.flatMap((response) => response.sourcesUsed)));
  const territory = mode === 'ALL' ? 'fr' : territories[0];
  const productName = responses.map((response) => response.productName).find(Boolean);
  const territoryMessage =
    mode === 'ALL'
      ? 'Comparaison multi-territoires active. Les prix affichés peuvent combiner plusieurs zones.'
      : responses.map((response) => response.metadata.territoryMessage).find(Boolean);

  const data: ScanData = {
    productName,
    prices: [interval],
    territory,
    confidence,
    sourcesUsed: sources,
    warnings,
    territoryMessage,
    selectedTerritories: territories,
    territoryMode: mode,
    priceObservations: observations,
  };

  return warnings.length > 0 ? { status: 'PARTIAL', data } : { status: 'OK', data };
}

export default function RechercheProduits() {
  const params = useMemo(
    () => new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search),
    [],
  );
  const navigate = useNavigate();
  const { history, addEntry, removeEntry, clearHistory } = useSearchHistory();
  const { favorites, removeFavorite } = useFavorites();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [barcode, setBarcode] = useState(params.get('ean') ?? '');
  const [territoriesMode, setTerritoriesMode] = useState<'ALL' | 'CUSTOM'>('CUSTOM');
  const [selectedTerritories, setSelectedTerritories] = useState<TerritoryCode[]>(['fr']);
  const [result, setResult] = useState<ScanHubResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasSearchInput = Boolean(barcode.trim() || query.trim());
  const canSearch = hasSearchInput && !loading;
  const shouldShowReset = hasSearchInput || Boolean(result) || Boolean(error);
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 1400);
  }, []);

  const buildCacheKey = useCallback((input?: {
    query?: string;
    barcode?: string;
    territories?: TerritoryCode[];
    mode?: 'ALL' | 'CUSTOM';
  }) => {
    const normalizedQuery = (input?.query ?? query).trim().toLowerCase();
    const normalizedBarcode = (input?.barcode ?? barcode).trim();
    const mode = input?.mode ?? territoriesMode;
    const territories = input?.territories ?? selectedTerritories;
    const normalizedTerritories =
      mode === 'ALL' ? ALL_TERRITORIES : [...territories].sort().join(',') || 'none';
    return `scanhub:price-search:${mode}:${normalizedTerritories}:${normalizedBarcode || 'no-barcode'}:${normalizedQuery || 'no-query'}`;
  }, [barcode, query, selectedTerritories, territoriesMode]);

  const readCache = useCallback((input?: {
    query?: string;
    barcode?: string;
    territories?: TerritoryCode[];
    mode?: 'ALL' | 'CUSTOM';
  }) => {
    const key = buildCacheKey(input);
    const raw = safeLocalStorage.getItem(key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { cachedAt: string; payload: ScanHubResult };
      return parsed;
    } catch {
      return null;
    }
  }, [buildCacheKey]);

  const writeCache = useCallback(
    (payload: ScanHubResult, input?: {
      query?: string;
      barcode?: string;
      territories?: TerritoryCode[];
      mode?: 'ALL' | 'CUSTOM';
    }) => {
      const key = buildCacheKey(input);
      const cachedPayload = JSON.stringify({
        cachedAt: new Date().toISOString(),
        payload,
      });
      safeLocalStorage.setItem(key, cachedPayload);
    },
    [buildCacheKey]
  );

  const runSearch = useCallback(async (input?: {
    query?: string;
    barcode?: string;
    territories?: TerritoryCode[];
    mode?: 'ALL' | 'CUSTOM';
    source?: SearchHistoryType;
    label?: string;
    recordHistory?: boolean;
  }) => {
    const nextQuery = input?.query ?? query;
    const nextBarcode = input?.barcode ?? barcode;
    const nextMode = input?.mode ?? territoriesMode;
    const nextTerritories = input?.territories ?? selectedTerritories;
    const territoriesToSearch =
      nextMode === 'ALL'
        ? TERRITORIES.map((territory) => territory.code)
        : nextTerritories.length > 0
          ? nextTerritories
          : ['fr'];
    const trimmedQuery = nextQuery.trim();
    const trimmedBarcode = nextBarcode.trim();
    const hasInput = Boolean(trimmedQuery || trimmedBarcode);

    if (input?.source && hasInput && input.recordHistory !== false) {
      addEntry({
        label: input.label ?? buildSearchLabel(trimmedQuery, trimmedBarcode),
        type: input.source,
        query: trimmedQuery || undefined,
        barcode: trimmedBarcode || undefined,
      });
    }

    setQuery(nextQuery);
    setBarcode(nextBarcode);
    setTerritoriesMode(nextMode);
    setSelectedTerritories(territoriesToSearch);

    setLoading(true);
    setError(null);
    setResult(null);
    setCachedAt(null);

    try {
      const responses = await Promise.all(
        territoriesToSearch.map((territory) =>
          searchProductPrices({
            barcode: trimmedBarcode || undefined,
            query: trimmedQuery || undefined,
            territory,
          })
        )
      );
      const mapped = aggregatePriceSearchResults(responses, territoriesToSearch, nextMode);
      setResult(mapped);
      writeCache(mapped, {
        query: trimmedQuery,
        barcode: trimmedBarcode,
        territories: territoriesToSearch,
        mode: nextMode,
      });
    } catch (err: any) {
      console.error('Price search error:', err);
      setError('Impossible de récupérer les prix pour le moment.');
    } finally {
      setLoading(false);
    }
  }, [addEntry, barcode, query, selectedTerritories, territoriesMode, writeCache]);

  const handleSearch = useCallback(async () => {
    const searchType = barcode.trim() ? 'barcode' : 'text';
    return runSearch({ source: searchType });
  }, [barcode, runSearch]);

  useEffect(() => {
    if (hasAutoSearched) {
      return;
    }
    if (!barcode.trim() && !query.trim()) {
      return;
    }
    const cached = readCache({ query, barcode, territories: selectedTerritories, mode: territoriesMode });
    if (cached?.payload) {
      setResult(cached.payload);
      setCachedAt(cached.cachedAt);
    }
    void runSearch({ source: barcode.trim() ? 'barcode' : 'text', recordHistory: false });
    setHasAutoSearched(true);
  }, [barcode, query, hasAutoSearched, readCache, runSearch, selectedTerritories, territoriesMode]);

  const handleReset = () => {
    setResult(null);
    setError(null);
    setQuery('');
    setBarcode('');
    setTerritoriesMode('CUSTOM');
    setSelectedTerritories(['fr']);
    setCachedAt(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReplayHistory = (entry: SearchHistoryEntry) => {
    void runSearch({
      query: entry.query ?? '',
      barcode: entry.barcode ?? '',
      source: entry.type,
      label: entry.label,
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewFavorite = (favorite: FavoriteItem) => {
    if (favorite.type === 'comparison' && favorite.route) {
      navigate(favorite.route);
      return;
    }
    if (favorite.barcode || favorite.query) {
      void runSearch({
        query: favorite.query ?? '',
        barcode: favorite.barcode ?? '',
        source: favorite.barcode ? 'barcode' : 'text',
        label: favorite.label,
      });
      return;
    }
    if (favorite.route) {
      navigate(favorite.route);
    }
  };
  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    showToast('Favori retiré');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <Helmet>
        <title>Recherche produits & prix réels</title>
        <meta
          name="description"
          content="Recherche multi-sources de prix observés, normalisés et contextualisés pour la France et les DOM."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-blue-300 text-sm font-semibold">Module ScanHub • Prix observés</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Recherche produits & prix réels
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Les prix affichés sont des observations anonymisées issues de sources ouvertes.
            Ils sont présentés sous forme de fourchette pour éviter toute confusion.
          </p>
        </header>

        <section className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-4">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSearch) {
                void handleSearch();
              }
            }}
          >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2 text-sm">
              <span className="text-slate-300">Code-barres (EAN)</span>
              <input
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
                placeholder="Scannez ou collez un EAN"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                aria-label="Code-barres"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-300">Nom produit</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex : riz 5kg, lait, eau…"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                aria-label="Nom produit"
              />
            </label>
          </div>
          <fieldset className="space-y-3 text-sm">
            <legend className="text-slate-300">Territoires</legend>
            <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={territoriesMode === 'ALL'}
                onChange={(event) => {
                  setTerritoriesMode(event.target.checked ? 'ALL' : 'CUSTOM');
                }}
                className="rounded border-slate-600 bg-slate-900"
              />
              <span>Tous territoires</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TERRITORIES.map((item) => {
                const checked = selectedTerritories.includes(item.code);
                return (
                  <label
                    key={item.code}
                    className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setTerritoriesMode('CUSTOM');
                        setSelectedTerritories((previous) => {
                          if (previous.includes(item.code)) {
                            const next = previous.filter((code) => code !== item.code);
                            return next.length > 0 ? next : ['fr'];
                          }
                          return [...previous, item.code];
                        });
                      }}
                      className="rounded border-slate-600 bg-slate-900"
                    />
                    <span className="truncate">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="submit"
              disabled={!canSearch}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 rounded-lg font-semibold"
            >
              {loading ? 'Recherche en cours...' : 'Lancer la recherche'}
            </button>
            {shouldShowReset && (
              <button
                type="button"
                onClick={handleReset}
                className="w-full md:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold"
              >
                Effacer
              </button>
            )}
          </div>
          {!hasSearchInput && (
            <p className="text-xs text-slate-400">
              Renseignez un code-barres ou un nom de produit pour lancer la comparaison.
            </p>
          )}
          </form>
        </section>

        {loading && (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 rounded-full bg-slate-800/80" />
            <div className="h-4 rounded-full bg-slate-800/60 w-5/6" />
          </div>
        )}

        <SearchHistoryPanel
          entries={history}
          onReplay={handleReplayHistory}
          onRemove={removeEntry}
          onClear={clearHistory}
        />

        <FavoritesPanel favorites={favorites} onView={handleViewFavorite} onRemove={handleRemoveFavorite} />

        <p className="text-xs text-slate-400">
          🔒 Les données restent sur votre appareil.
        </p>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-sm text-slate-300 space-y-2">
          <h2 className="font-semibold text-white">Conseils ScanHub</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>Combinez EAN et nom produit pour améliorer la précision.</li>
            <li>Vérifiez le territoire pour comparer des prix réellement observés localement.</li>
            <li>Un indice de confiance élevé signifie des données plus fiables.</li>
          </ul>
        </section>

        {cachedAt && !loading && (
          <div className="bg-emerald-900/20 border border-emerald-700 rounded-2xl p-4 text-sm text-emerald-200">
            Résultat affiché depuis le cache local ({formatCachedLabel(cachedAt)}).
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading && (
          <PriceSearchResults
            result={{ status: 'LOADING' }}
            searchQuery={query}
            searchBarcode={barcode}
            onReset={handleReset}
            onScanTicket={() => navigate('/scan')}
            onReturnToHub={() => navigate('/scanner')}
            onFavoriteToast={showToast}
          />
        )}
        {!loading && result && (
          <PriceSearchResults
            result={result}
            searchQuery={query}
            searchBarcode={barcode}
            onReset={handleReset}
            onScanTicket={() => navigate('/scan')}
            onReturnToHub={() => navigate('/scanner')}
            onFavoriteToast={showToast}
          />
        )}
        {toastMessage && (
          <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 text-slate-100 text-sm px-4 py-2 rounded-full shadow-lg"
            role="status"
            aria-live="polite"
          >
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
