export type ScanHubResult =
  | { status: 'LOADING' }
  | { status: 'NO_DATA'; reason?: string }
  | { status: 'UNAVAILABLE'; service: string }
  | { status: 'PARTIAL'; data: Partial<ScanData> }
  | { status: 'OK'; data: ScanData };

export interface ScanData {
  productName?: string;
  brand?: string;
  barcode?: string;
  prices?: PriceInterval[];
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
  ingredients?: string[];
  territory?: string;
  confidence?: number;
  sourcesUsed?: string[];
  warnings?: string[];
  territoryMessage?: string;
  selectedTerritories?: string[];
  territoryMode?: 'ALL' | 'CUSTOM';
  priceObservations?: PriceObservationSnapshot[];
}

export interface PriceObservationSnapshot {
  source?: string;
  price: number;
  pricePerUnit?: number;
  currency: 'EUR';
  unit?: 'unit' | 'kg' | 'l';
  territory?: string;
  observedAt?: string;
  normalizedLabel?: string;
}

export interface PriceInterval {
  min: number | null;
  median: number | null;
  max: number | null;
  currency: 'EUR';
  priceCount: number;
}
