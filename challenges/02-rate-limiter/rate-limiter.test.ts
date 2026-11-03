import { describe, expect, it } from "vitest";
import { SlidingWindowRateLimiter } from "./index";

describe("SlidingWindowRateLimiter", () => {
  it("allows up to the limit and then blocks", () => {
    const rl = new SlidingWindowRateLimiter(3, 1000);
    expect(rl.allow("a", 0)).toBe(true);
    expect(rl.allow("a", 10)).toBe(true);
    expect(rl.allow("a", 20)).toBe(true);
    expect(rl.allow("a", 30)).toBe(false);
    expect(rl.remaining("a", 30)).toBe(0);
  });

  it("slides: old calls expire exactly after windowMs", () => {
    const rl = new SlidingWindowRateLimiter(2, 1000);
    rl.allow("a", 0);
    rl.allow("a", 500);
    expect(rl.allow("a", 999)).toBe(false);
    expect(rl.allow("a", 1000)).toBe(true); // the call at t=0 is now outside (0, 1000]
    expect(rl.allow("a", 1499)).toBe(false);
    expect(rl.allow("a", 1500)).toBe(true);
  });

  it("does not record blocked calls", () => {
    const rl = new SlidingWindowRateLimiter(1, 1000);
    rl.allow("a", 0);
    rl.allow("a", 100); // blocked
    rl.allow("a", 200); // blocked
    expect(rl.allow("a", 1000)).toBe(true);
  });

  it("isolates keys", () => {
    const rl = new SlidingWindowRateLimiter(1, 1000);
    expect(rl.allow("a", 0)).toBe(true);
    expect(rl.allow("b", 0)).toBe(true);
    expect(rl.allow("a", 1)).toBe(false);
  });

  it("prunes idle keys", () => {
    const rl = new SlidingWindowRateLimiter(5, 1000);
    rl.allow("a", 0);
    rl.allow("b", 900);
    expect(rl.prune(1500)).toBe(1); // only "a" is idle
    expect(rl.remaining("a", 1500)).toBe(5);
    expect(rl.remaining("b", 1500)).toBe(4);
  });

  it("rejects invalid configuration", () => {
    expect(() => new SlidingWindowRateLimiter(0, 1000)).toThrow(RangeError);
  });
});
