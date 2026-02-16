import type { Tip, TipContext, TipRule } from './types';

export function runTips(rules: TipRule[], ctx: TipContext): Tip[] {
  const tips = rules.flatMap((rule) => rule.run(ctx));

  const byId = new Map<string, Tip>();
  for (const tip of tips) {
    const previous = byId.get(tip.id);
    if (!previous || tip.confidence > previous.confidence) {
      byId.set(tip.id, tip);
    }
  }

  return Array.from(byId.values()).sort((a, b) => b.confidence - a.confidence);
}
