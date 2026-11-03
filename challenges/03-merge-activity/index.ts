export type ActivityType = "comment" | "status_change" | "assignment";

export interface Activity {
  ticketId: string;
  type: ActivityType;
  /** epoch milliseconds */
  at: number;
  payload: string;
}

/** Tie-break order when two activities share the same `at`. */
export const TYPE_ORDER: ActivityType[] = ["status_change", "assignment", "comment"];

/**
 * Merge N streams, each already sorted ascending by `at`, into one timeline sorted by
 * `at` ascending. Ties are broken by TYPE_ORDER, then by the order of the input streams
 * (stable). Must run in O(total * log N); do not concatenate and sort.
 */
export function mergeActivity(streams: Activity[][]): Activity[] {
  throw new Error("Not implemented");
}
