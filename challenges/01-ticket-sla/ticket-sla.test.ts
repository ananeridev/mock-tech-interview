import { describe, expect, it } from "vitest";
import { breachedTickets, businessHoursBetween } from "./index";

// 2026-11-02 is a Monday.
const d = (s: string) => new Date(s);

describe("businessHoursBetween", () => {
  it("counts hours inside a single business day", () => {
    expect(businessHoursBetween(d("2026-11-02T10:00:00Z"), d("2026-11-02T14:30:00Z"))).toBeCloseTo(4.5);
  });

  it("ignores time before start and after end of the day", () => {
    expect(businessHoursBetween(d("2026-11-02T06:00:00Z"), d("2026-11-02T20:00:00Z"))).toBeCloseTo(9);
  });

  it("skips the weekend", () => {
    // Friday 17:00 -> Monday 10:00 = 1h Friday + 1h Monday
    expect(businessHoursBetween(d("2026-11-06T17:00:00Z"), d("2026-11-09T10:00:00Z"))).toBeCloseTo(2);
  });

  it("returns 0 when end is before start", () => {
    expect(businessHoursBetween(d("2026-11-03T10:00:00Z"), d("2026-11-02T10:00:00Z"))).toBe(0);
  });

  it("spans several full days", () => {
    // Mon 09:00 -> Thu 09:00 = 3 full days * 9h
    expect(businessHoursBetween(d("2026-11-02T09:00:00Z"), d("2026-11-05T09:00:00Z"))).toBeCloseTo(27);
  });
});

describe("breachedTickets", () => {
  const now = d("2026-11-04T12:00:00Z"); // Wednesday noon

  it("flags open tickets past their SLA and keeps input order", () => {
    const result = breachedTickets(
      [
        { id: "a", priority: "urgent", createdAt: "2026-11-04T09:00:00Z" }, // 3h < 4h ok
        { id: "b", priority: "urgent", createdAt: "2026-11-03T16:00:00Z" }, // 2h + 3h = 5h > 4h breached
        { id: "c", priority: "low", createdAt: "2026-10-21T09:00:00Z" }, // ~93 business hours > 72h breached
        { id: "d", priority: "medium", createdAt: "2026-11-03T09:00:00Z" }, // 9h + 3h = 12h < 24h ok
      ],
      now,
    );
    expect(result).toEqual(["b", "c"]);
  });

  it("uses resolvedAt instead of now when present", () => {
    const result = breachedTickets(
      [{ id: "x", priority: "urgent", createdAt: "2026-10-26T09:00:00Z", resolvedAt: "2026-10-26T12:00:00Z" }],
      now,
    );
    expect(result).toEqual([]);
  });

  it("handles an empty list", () => {
    expect(breachedTickets([], now)).toEqual([]);
  });
});
