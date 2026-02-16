import type { TipContext } from './types';

const DOM_TERRITORIES = new Set(['gp', 'mq', 'gf', 're', 'yt']);

export function computeSavingsScore(ctx: TipContext): number {
  const observedPrice = ctx.price ?? null;
  const median = ctx.interval?.median ?? null;
  const min = ctx.interval?.min ?? null;
  const max = ctx.interval?.max ?? null;

  let score = 0;

  if (observedPrice !== null && median !== null && observedPrice > 0 && median > 0) {
    const overMedianRatio = (observedPrice - median) / observedPrice;
    score += Math.min(60, Math.max(0, overMedianRatio * 120));
  }

  if (min !== null && max !== null && min > 0 && max > min) {
    const spread = (max - min) / max;
    score += Math.min(30, spread * 80);
  }

  if (ctx.territory && DOM_TERRITORIES.has(ctx.territory)) {
    score += 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function isPremiumTipEnabled(score: number): boolean {
  return score >= 70;
}
