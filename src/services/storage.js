const STORAGE_KEY = 'neurocard_app_state_v1';

/** Approximate localStorage usage in bytes across all keys. */
function estimateUsageBytes() {
  let total = 0;
  for (const key of Object.keys(localStorage)) {
    total += (localStorage.getItem(key) ?? '').length * 2; // UTF-16: 2 bytes/char
  }
  return total;
}

/**
 * Returns an object describing the current storage pressure.
 * Quota is estimated at 5 MB (conservative — browsers vary from 5–10 MB).
 */
export function getStorageInfo() {
  const usedBytes  = estimateUsageBytes();
  const quotaBytes = 5 * 1024 * 1024; // 5 MB
  return {
    usedBytes,
    quotaBytes,
    usedMB:  (usedBytes  / (1024 * 1024)).toFixed(2),
    totalMB: (quotaBytes / (1024 * 1024)).toFixed(1),
    percentUsed: Math.round((usedBytes / quotaBytes) * 100),
    isNearLimit: usedBytes > quotaBytes * 0.8,
  };
}

export function saveState(state) {
  try {
    const { pipeline: _p, ...persistable } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch (err) {
    // QuotaExceededError — surface a warning rather than silently failing
    if (err?.name === 'QuotaExceededError' || err?.code === 22) {
      console.warn('[storage] localStorage quota exceeded — some data may not have been saved.');
    } else {
      console.warn('[storage] Failed to save state:', err);
    }
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
