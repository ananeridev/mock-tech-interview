import { z } from "zod";

export const TICKET_STATUSES = ["open", "in_progress", "closed"] as const;
export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const TicketStatus = z.enum(TICKET_STATUSES);
export const TicketPriority = z.enum(TICKET_PRIORITIES);

export type TicketStatus = z.infer<typeof TicketStatus>;
export type TicketPriority = z.infer<typeof TicketPriority>;

export const TicketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: TicketStatus,
  priority: TicketPriority,
  tags: z.array(z.string()),
  /** Id of another ticket that blocks this one, if any. */
  blockedBy: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Ticket = z.infer<typeof TicketSchema>;

export const CreateTicketInput = z.object({
  title: z.string().trim().min(3, "Title must have at least 3 characters").max(120),
  description: z.string().trim().max(2000).default(""),
  priority: TicketPriority.default("medium"),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
  blockedBy: z.string().nullable().optional(),
});
export type CreateTicketInput = z.input<typeof CreateTicketInput>;

export const UpdateTicketInput = CreateTicketInput.partial().extend({
  status: TicketStatus.optional(),
});
export type UpdateTicketInput = z.input<typeof UpdateTicketInput>;

export const ListTicketsQuery = z.object({
  status: TicketStatus.optional(),
  priority: TicketPriority.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListTicketsQuery = z.input<typeof ListTicketsQuery>;

export const PaginatedTickets = z.object({
  items: z.array(TicketSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});
export type PaginatedTickets = z.infer<typeof PaginatedTickets>;

export const ApiError = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
export type ApiError = z.infer<typeof ApiError>;
