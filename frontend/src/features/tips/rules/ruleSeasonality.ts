import type { TipRule } from '../types';

const PEAK_MONTHS_BY_CATEGORY: Record<string, number[]> = {
  fruit: [6, 7, 8],
  fruits: [6, 7, 8],
  legumes: [11, 12, 1, 2],
  légume: [11, 12, 1, 2],
  laits: [8, 9],
};

export const ruleSeasonality: TipRule = {
  id: 'seasonality',
  run(ctx) {
    const month = ctx.month;
    if (!month || month < 1 || month > 12) {
      return [];
    }

    const categoryKey = ctx.category?.trim().toLowerCase();
    if (!categoryKey) {
      return [];
    }

    const peakMonths = PEAK_MONTHS_BY_CATEGORY[categoryKey];
    if (!peakMonths || peakMonths.includes(month)) {
      return [];
    }

    return [
      {
        id: `tip.seasonality.${categoryKey}`,
        message: 'Produit hors période de prix favorable : vérifiez une alternative de saison.',
        severity: 'info',
        confidence: 0.45,
        tags: ['saisonnalité'],
      },
    ];
  },
};
