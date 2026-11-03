import type { FastifyPluginAsync } from "fastify";
import { and, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { CreateTicketInput, ListTicketsQuery } from "@ticketly/shared";
import { tickets } from "../db/schema.js";
import { NotFoundError, ValidationError } from "../lib/errors.js";
import { toTicket } from "../lib/serialize.js";

export const ticketRoutes: FastifyPluginAsync = async (app) => {
  const { db } = app;

  app.get("/tickets", async (req) => {
    const parsed = ListTicketsQuery.safeParse(req.query);
    if (!parsed.success) throw new ValidationError(parsed.error.flatten());
    const { status, page, pageSize } = parsed.data;

    const where = and(status ? eq(tickets.status, status) : undefined);

    const total =
      db.select({ total: sql<number>`count(*)` }).from(tickets).where(where).get()?.total ?? 0;

    const rows = db
      .select()
      .from(tickets)
      .where(where)
      .orderBy(desc(tickets.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .all();

    return { items: rows.map(toTicket), page, pageSize, total };
  });

  app.get<{ Params: { id: string } }>("/tickets/:id", async (req) => {
    const row = db.select().from(tickets).where(eq(tickets.id, req.params.id)).get();
    if (!row) throw new NotFoundError("Ticket", req.params.id);
    return toTicket(row);
  });

  app.post("/tickets", async (req, reply) => {
    const parsed = CreateTicketInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError(parsed.error.flatten());
    const input = parsed.data;

    if (input.blockedBy) {
      const blocker = db.select({ id: tickets.id }).from(tickets).where(eq(tickets.id, input.blockedBy)).get();
      if (!blocker) throw new ValidationError({ fieldErrors: { blockedBy: ["Blocking ticket does not exist"] } });
    }

    const now = new Date();
    const row = db
      .insert(tickets)
      .values({
        id: randomUUID(),
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: "open",
        tags: JSON.stringify(input.tags),
        blockedBy: input.blockedBy ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    reply.code(201);
    return toTicket(row);
  });

  // TODO (Stage 3): PATCH /tickets/:id and POST /tickets/:id/close
};
