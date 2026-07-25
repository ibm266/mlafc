/**
 * Fixed-window rate limiting held in process memory.
 *
 * Enough for a clinic site whose only write path is the enquiry form: it stops
 * a stuck retry loop or a casual flood from filling the clinic inbox. It is not
 * a shared store, so on a serverless or multi-instance deployment each instance
 * keeps its own counts and the effective limit is per instance.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Keeps the map from growing without bound if keys are many and short-lived. */
function prune(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) {
      windows.delete(key);
    }
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Milliseconds until the current window resets. */
  retryAfterMs: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    prune(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }

  if (current.count >= limit) {
    return { ok: false, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

/** Test helper: forget every window. */
export function resetRateLimits(): void {
  windows.clear();
}
