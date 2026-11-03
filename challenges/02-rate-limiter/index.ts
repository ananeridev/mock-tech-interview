/**
 * Sliding-window rate limiter.
 *
 * `allow(key, now)` returns true if the caller identified by `key` has made fewer than
 * `limit` allowed calls in the last `windowMs` milliseconds (relative to `now`), and
 * records the call. Otherwise returns false and does NOT record it.
 *
 * Requirements:
 * - O(1) amortized per call (hint: a queue per key; evict expired timestamps lazily).
 * - Memory must not grow unbounded for keys that stop calling: implement `prune(now)`.
 * - `now` is injected (milliseconds) so tests are deterministic.
 */
export class SlidingWindowRateLimiter {
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {
    if (limit <= 0 || windowMs <= 0) throw new RangeError("limit and windowMs must be positive");
  }

  allow(key: string, now: number): boolean {
    throw new Error("Not implemented");
  }

  /** How many calls `key` may still make at `now` before being limited. */
  remaining(key: string, now: number): number {
    throw new Error("Not implemented");
  }

  /** Drop all state for keys with no calls inside the window at `now`. Returns keys dropped. */
  prune(now: number): number {
    throw new Error("Not implemented");
  }
}
