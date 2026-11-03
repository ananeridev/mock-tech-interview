import { describe, expect, it } from "vitest";
import { mergeActivity, type Activity } from "./index";

const a = (at: number, type: Activity["type"], payload: string, ticketId = "t1"): Activity => ({ ticketId, type, at, payload });

describe("mergeActivity", () => {
  it("merges two sorted streams by time", () => {
    const out = mergeActivity([
      [a(1, "comment", "c1"), a(5, "comment", "c5")],
      [a(2, "status_change", "s2"), a(9, "status_change", "s9")],
    ]);
    expect(out.map((x) => x.payload)).toEqual(["c1", "s2", "c5", "s9"]);
  });

  it("breaks ties by type order, then by stream order", () => {
    const out = mergeActivity([
      [a(1, "comment", "comment-from-stream-0")],
      [a(1, "status_change", "status-from-stream-1")],
      [a(1, "comment", "comment-from-stream-2")],
      [a(1, "assignment", "assignment-from-stream-3")],
    ]);
    expect(out.map((x) => x.payload)).toEqual([
      "status-from-stream-1",
      "assignment-from-stream-3",
      "comment-from-stream-0",
      "comment-from-stream-2",
    ]);
  });

  it("handles empty streams and no streams", () => {
    expect(mergeActivity([])).toEqual([]);
    expect(mergeActivity([[], []])).toEqual([]);
    expect(mergeActivity([[], [a(1, "comment", "x")], []]).map((x) => x.payload)).toEqual(["x"]);
  });

  it("does not mutate the input streams", () => {
    const s1 = [a(1, "comment", "x"), a(3, "comment", "y")];
    const s2 = [a(2, "comment", "z")];
    const copy1 = [...s1];
    mergeActivity([s1, s2]);
    expect(s1).toEqual(copy1);
  });

  it("handles many streams", () => {
    const streams = Array.from({ length: 50 }, (_, i) => [a(i, "comment", `c${i}`), a(100 + i, "comment", `d${i}`)]);
    const out = mergeActivity(streams);
    expect(out).toHaveLength(100);
    for (let i = 1; i < out.length; i++) expect(out[i]!.at).toBeGreaterThanOrEqual(out[i - 1]!.at);
  });
});
