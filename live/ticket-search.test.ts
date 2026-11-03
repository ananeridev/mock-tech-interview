import { describe, expect, it } from "vitest";
import { searchTickets, type SearchableTicket } from "./ticket-search";

const tickets: SearchableTicket[] = [
  { id: "1", title: "Login page returns 500", tags: ["auth", "bug"] },
  { id: "2", title: "Auth token refresh fails", tags: ["auth"] },
  { id: "3", title: "Export CSV missing column", tags: ["export", "auth"] },
  { id: "4", title: "login", tags: [] },
  { id: "5", title: "Login button misaligned on mobile", tags: ["ui", "login"] },
];
const ids = (r: SearchableTicket[]) => r.map((t) => t.id);

describe("searchTickets", () => {
  it("returns everything for an empty query", () => {
    expect(ids(searchTickets(tickets, "   "))).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("is case-insensitive", () => {
    expect(ids(searchTickets(tickets, "LOGIN"))).toContain("1");
  });

  it("matches on tags as well as title", () => {
    expect(ids(searchTickets(tickets, "auth"))).toEqual(expect.arrayContaining(["1", "2"]));
    expect(ids(searchTickets(tickets, "auth"))).not.toContain("4");
  });

  it("requires every term to match (AND)", () => {
    expect(ids(searchTickets(tickets, "login mobile"))).toEqual(["5"]);
    expect(ids(searchTickets(tickets, "login nothing"))).toEqual([]);
  });

  it("ranks exact title match first, then prefix matches, then the rest", () => {
    expect(ids(searchTickets(tickets, "login"))).toEqual(["4", "1", "5"]);
  });

  it("keeps original order within the same rank", () => {
    // "2" is a prefix match (rank 1); "1" and "3" match by tag only (rank 2) and keep their order
    expect(ids(searchTickets(tickets, "auth"))).toEqual(["2", "1", "3"]);
  });
});
