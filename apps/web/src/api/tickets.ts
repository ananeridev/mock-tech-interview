import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginatedTickets, TicketSchema, type CreateTicketInput, type ListTicketsQuery } from "@ticketly/shared";
import { request } from "./client";

export const ticketKeys = {
  all: ["tickets"] as const,
  list: (q: ListTicketsQuery) => ["tickets", "list", q] as const,
  detail: (id: string) => ["tickets", "detail", id] as const,
};

export function useTickets(query: ListTicketsQuery) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v !== undefined) params.set(k, String(v));
  return useQuery({
    queryKey: ticketKeys.list(query),
    queryFn: () => request(`/tickets?${params}`, PaginatedTickets),
    placeholderData: (prev) => prev,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => request(`/tickets/${id}`, TicketSchema),
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTicketInput) =>
      request("/tickets", TicketSchema, { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ticketKeys.all }),
  });
}

// TODO (Stage 3): useUpdateTicket, useCloseTicket (with optimistic update)
