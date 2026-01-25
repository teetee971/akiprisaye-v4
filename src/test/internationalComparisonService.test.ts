import { describe, it, expect } from 'vitest';

import { compareDOMTerritory } from '@/services/internationalComparisonService';
import type { TerritoryCode } from '@/types/territory';

describe('internationalComparisonService', () => {
  it('compares prices for Martinique (mq)', async () => {
    const territory: TerritoryCode = 'mq';

    const result = await compareDOMTerritory(territory);

    expect(result).toBeDefined();
    expect(result.territory).toBe('mq');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('compares prices for Guadeloupe (gp)', async () => {
    const territory: TerritoryCode = 'gp';

    const result = await compareDOMTerritory(territory);

    expect(result).toBeDefined();
    expect(result.territory).toBe('gp');
  });

  it('throws on unsupported territory', async () => {
    await expect(
      // @ts-expect-error — test volontairement invalide
      compareDOMTerritory('MTQ')
    ).rejects.toThrow();
  });
});