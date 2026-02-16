export type TipSeverity = 'info' | 'warn' | 'premium';

export interface TipContext {
  territory?: string;
  category?: string;
  query?: string;
  price?: number;
  interval?: {
    min?: number;
    median?: number;
    max?: number;
  };
  currency?: 'EUR';
  unit?: 'unit' | 'kg' | 'l';
  month?: number;
  lastSeen?: Record<string, number>;
}

export interface Tip {
  id: string;
  message: string;
  severity: TipSeverity;
  confidence: number;
  tags?: string[];
}

export interface TipRule {
  id: string;
  run(ctx: TipContext): Tip[];
}
