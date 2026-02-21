// src/services/territoryComparisonService.ts

export type TerritoryLike = string | null | undefined;
export type TerritoryScope = Set<string>;

export interface TerritoryPriceObservation {
  territory?: TerritoryLike;
  price?: number;
  pricePerUnit?: number;
  observedAt?: string; // ISO datetime
  date?: string; // YYYY-MM-DD
}

export interface TerritoryAverageMap {
  [territory: string]: number;
}

export interface TerritoryComparisonRow {
  territory: string;
  averagePrice: number;
  absoluteGap: number;
  relativeGap: number;
  rank: number;
}

export const DEFAULT_TERRITORY_SCOPE: TerritoryScope = new Set([
  'FR',
  'GP',
  'MQ',
  'GF',
  'RE',
  'YT',
]);

function avg(values: number[]): number {
  if (!values.length) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

export function normalizeTerritory(t: TerritoryLike): string | null {
  if (typeof t !== 'string') return null;
  const s = t.trim().toUpperCase();
  return s.length ? s : null;
}

function normalizeDate(obs: TerritoryPriceObservation): string | null {
  if (typeof obs.date === 'string' && obs.date.trim()) return obs.date.trim();
  if (typeof obs.observedAt === 'string' && obs.observedAt.trim()) {
    return obs.observedAt.trim().slice(0, 10);
  }
  return null;
}

function pickValue(obs: TerritoryPriceObservation): number | null {
  const v = typeof obs.pricePerUnit === 'number' ? obs.pricePerUnit : obs.price;
  if (typeof v !== 'number' || Number.isNaN(v)) return null;
  return v;
}

export function calculateTerritoryAverages(
  observations: TerritoryPriceObservation[],
  scope: TerritoryScope = DEFAULT_TERRITORY_SCOPE
): TerritoryAverageMap {
  const byTerr: Map<string, number[]> = new Map();

  for (const o of observations) {
    const terr = normalizeTerritory(o.territory);
    if (!terr) continue;
    if (scope && !scope.has(terr)) continue;

    const v = pickValue(o);
    if (v === null) continue;

    if (!byTerr.has(terr)) byTerr.set(terr, []);
    byTerr.get(terr)!.push(v);
  }

  const out: TerritoryAverageMap = {};
  for (const [terr, values] of byTerr.entries()) {
    out[terr] = avg(values);
  }
  return out;
}

export function calculateTerritoryComparison(
  observations: TerritoryPriceObservation[],
  baseTerritory: string = 'FR',
  scope: TerritoryScope = DEFAULT_TERRITORY_SCOPE
): TerritoryComparisonRow[] {
  const averages = calculateTerritoryAverages(observations, scope);
  const territories = Object.keys(averages);
  if (!territories.length) return [];

  // tri croissant (moins cher d'abord) => rank = index+1
  const sorted = territories.sort((a, b) => averages[a] - averages[b]);

  const requestedBase = normalizeTerritory(baseTerritory);
  const effectiveBase =
    requestedBase && averages[requestedBase] !== undefined ? requestedBase : sorted[0];

  const baseAvg = averages[effectiveBase];

  return sorted.map((territory, index) => {
    const averagePrice = averages[territory];
    const absoluteGap = averagePrice - baseAvg;
    const relativeGap = baseAvg === 0 ? 0 : (absoluteGap / baseAvg) * 100;

    return {
      territory,
      averagePrice,
      absoluteGap,
      relativeGap,
      rank: index + 1,
    };
  });
}

export function buildTerritoryTimeSeries(
  observations: TerritoryPriceObservation[],
  scope: TerritoryScope = DEFAULT_TERRITORY_SCOPE
): Array<Record<string, any>> {
  // date -> territory -> values[]
  const byDate: Map<string, Map<string, number[]>> = new Map();

  for (const o of observations) {
    const date = normalizeDate(o);
    if (!date) continue;

    const terr = normalizeTerritory(o.territory);
    if (!terr) continue;
    if (scope && !scope.has(terr)) continue;

    const v = pickValue(o);
    if (v === null) continue;

    if (!byDate.has(date)) byDate.set(date, new Map());
    const terrMap = byDate.get(date)!;

    if (!terrMap.has(terr)) terrMap.set(terr, []);
    terrMap.get(terr)!.push(v);
  }

  const dates = Array.from(byDate.keys()).sort();

  // format attendu par tes tests: { date: 'YYYY-MM-DD', FR: x, GP: y, ... }
  return dates.map((date) => {
    const terrMap = byDate.get(date)!;
    const row: Record<string, any> = { date };

    for (const [terr, values] of terrMap.entries()) {
      row[terr] = avg(values);
    }

    return row;
  });
}