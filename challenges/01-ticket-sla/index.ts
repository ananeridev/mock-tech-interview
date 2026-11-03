import type { TicketPriority } from "@ticketly/shared";

export interface SlaTicket {
  id: string;
  priority: TicketPriority;
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of resolution; undefined if still open */
  resolvedAt?: string;
}

/** Hours of *business time* allowed per priority. */
export const SLA_HOURS: Record<TicketPriority, number> = {
  urgent: 4,
  high: 8,
  medium: 24,
  low: 72,
};

export interface BusinessHours {
  /** 0 = Sunday … 6 = Saturday. Days NOT in this list are skipped entirely. */
  workDays: number[];
  /** Local hour the day starts, inclusive (e.g. 9) */
  startHour: number;
  /** Local hour the day ends, exclusive (e.g. 18) */
  endHour: number;
}

export const DEFAULT_BUSINESS_HOURS: BusinessHours = { workDays: [1, 2, 3, 4, 5], startHour: 9, endHour: 18 };

/**
 * Returns the number of business hours between two instants (fractional allowed).
 * Only time inside [startHour, endHour) on workDays counts. Use UTC for day/hour math.
 */
export function businessHoursBetween(start: Date, end: Date, hours: BusinessHours = DEFAULT_BUSINESS_HOURS): number {
  throw new Error("Not implemented");
}

/**
 * Returns the ids of tickets that breached their SLA, i.e. the business hours between
 * createdAt and (resolvedAt ?? now) exceed SLA_HOURS[priority]. Preserve input order.
 */
export function breachedTickets(tickets: SlaTicket[], now: Date, hours: BusinessHours = DEFAULT_BUSINESS_HOURS): string[] {
  throw new Error("Not implemented");
}
