import type { ReactElement } from 'react';

export function TipBadge({ premium }: { premium: boolean }): ReactElement | null {
  if (!premium) {
    return null;
  }

  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border border-white/10 bg-white/5">
      Astuce Premium
    </span>
  );
}
