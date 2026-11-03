import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

const app = buildApp({ databaseUrl: ":memory:" });

beforeAll(() => app.ready());
afterAll(() => app.close());

async function createTicket(body: Record<string, unknown>) {
  const res = await app.inject({ method: "POST", url: "/tickets", payload: body });
  return { status: res.statusCode, body: res.json() };
}

describe("GET /health", () => {
  it("responds ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });
});

describe("POST /tickets", () => {
  it("creates a ticket with defaults", async () => {
    const { status, body } = await createTicket({ title: "Printer is on fire" });
    expect(status).toBe(201);
    expect(body).toMatchObject({ title: "Printer is on fire", status: "open", priority: "medium", tags: [] });
    expect(body.id).toBeTypeOf("string");
  });

  it("rejects a short title with a consistent error body", async () => {
    const { status, body } = await createTicket({ title: "no" });
    expect(status).toBe(400);
    expect(body.error.code).toBe("validation_error");
    expect(body.error.details.fieldErrors.title).toBeDefined();
  });
});

describe("GET /tickets", () => {
  it("lists tickets newest first with pagination metadata", async () => {
    const res = await app.inject({ method: "GET", url: "/tickets?pageSize=1" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.items).toHaveLength(1);
    expect(body.total).toBeGreaterThanOrEqual(1);
    expect(body.page).toBe(1);
  });

  it("filters by status", async () => {
    const res = await app.inject({ method: "GET", url: "/tickets?status=closed" });
    expect(res.json().items).toEqual([]);
  });

  // Hint: this test is deliberately not written. Should it be?
});

describe("GET /tickets/:id", () => {
  it("returns 404 for an unknown id", async () => {
    const res = await app.inject({ method: "GET", url: "/tickets/nope" });
    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe("not_found");
  });
});
