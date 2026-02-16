import { safeLocalStorage } from '../../utils/safeLocalStorage';

const TIPS_LAST_SEEN_KEY = 'tips:last-seen';

type LastSeenMap = Record<string, number>;

export function getTipsLastSeen(): LastSeenMap {
  const value = safeLocalStorage.getItem(TIPS_LAST_SEEN_KEY);
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const normalized: LastSeenMap = {};
    for (const [key, timestamp] of Object.entries(parsed)) {
      if (typeof timestamp === 'number' && Number.isFinite(timestamp)) {
        normalized[key] = timestamp;
      }
    }
    return normalized;
  } catch {
    return {};
  }
}

export function markTipSeen(tipId: string, at = Date.now()): void {
  const current = getTipsLastSeen();
  current[tipId] = at;
  safeLocalStorage.setItem(TIPS_LAST_SEEN_KEY, JSON.stringify(current));
}
