import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const tickets = sqliteTable(
  "tickets",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    status: text("status", { enum: ["open", "in_progress", "closed"] }).notNull().default("open"),
    priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).notNull().default("medium"),
    /** JSON-encoded string[] */
    tags: text("tags").notNull().default("[]"),
    blockedBy: text("blocked_by"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("tickets_status_idx").on(t.status)],
);

export type TicketRow = typeof tickets.$inferSelect;
export type NewTicketRow = typeof tickets.$inferInsert;
