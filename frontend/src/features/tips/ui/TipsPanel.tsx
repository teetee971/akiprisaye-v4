import type { ReactElement } from 'react';
import { buildTips, type TipContext } from '../index';
import { TipBadge } from './TipBadge';

export function TipsPanel({ ctx }: { ctx: TipContext }): ReactElement | null {
  const { tips, score, premiumEnabled } = buildTips(ctx);

  if (!tips.length) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">Astuces intelligentes</div>
        <TipBadge premium={premiumEnabled} />
      </div>

      <div className="mt-2 text-xs opacity-80">
        Score économies : <span className="font-semibold">{score}/100</span>
      </div>

      <ul className="mt-3 space-y-2 text-sm">
        {tips.slice(0, 4).map((tip) => (
          <li key={tip.id} className="leading-snug">
            {tip.severity === 'premium' ? '★ ' : tip.severity === 'warn' ? '⚠ ' : '• '}
            {tip.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
