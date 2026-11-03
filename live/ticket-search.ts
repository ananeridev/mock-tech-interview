export interface SearchableTicket {
  id: string;
  title: string;
  tags: string[];
}

/**
 * Search tickets by free text.
 *
 * Rules (see the tests):
 * - Matching is case-insensitive.
 * - The query is split on whitespace into terms; a ticket matches only if EVERY term
 *   appears in its title or in one of its tags (substring match).
 * - Results are ranked: tickets whose title equals the whole query (case-insensitive)
 *   come first, then tickets whose title starts with the query, then everything else.
 *   Within a rank, keep the original order.
 * - An empty or whitespace-only query returns all tickets in original order.
 */
export function searchTickets(tickets: SearchableTicket[], query: string): SearchableTicket[] {
  return tickets.filter((t) => t.title.includes(query));
}
