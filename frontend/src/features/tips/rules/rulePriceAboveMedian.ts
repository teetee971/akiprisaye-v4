import type { TipRule } from '../types';

export const rulePriceAboveMedian: TipRule = {
  id: 'price-above-median',
  run(ctx) {
    const price = ctx.price;
    const median = ctx.interval?.median;

    if (!price || !median || price <= 0 || median <= 0) {
      return [];
    }

    const ratio = price / median;
    if (ratio < 1.15) {
      return [];
    }

    return [
      {
        id: 'tip.priceAboveMedian',
        message: 'Prix au-dessus de la médiane locale : comparez avant d’acheter.',
        severity: 'warn',
        confidence: Math.min(1, (ratio - 1) / 0.5),
        tags: ['prix', 'comparaison'],
      },
    ];
  },
};
