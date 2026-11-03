import { useState } from "react";
import { Link } from "react-router-dom";
import { TICKET_PRIORITIES, TICKET_STATUSES, type TicketPriority, type TicketStatus } from "@ticketly/shared";
import { useTickets } from "../api/tickets";

export function TicketListPage() {
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isPending, isError, error, isFetching } = useTickets({
    status: status || undefined,
    priority: priority || undefined,
    page,
    pageSize,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <section>
      <h1>Tickets</h1>
      <div className="filters">
        <select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value as TicketStatus | ""); setPage(1); }}>
          <option value="">All statuses</option>
          {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        <select aria-label="Filter by priority" value={priority} onChange={(e) => { setPriority(e.target.value as TicketPriority | ""); setPage(1); }}>
          <option value="">All priorities</option>
          {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {isFetching && <span className="muted">Refreshing…</span>}
      </div>

      {isPending && <p className="muted">Loading tickets…</p>}
      {isError && <p className="error">Could not load tickets: {error.message}</p>}
      {data && data.items.length === 0 && <p className="muted">No tickets match these filters.</p>}

      {data && data.items.length > 0 && (
        <ul className="ticket-list">
          {data.items.map((t) => (
            <li key={t.id}>
              <Link to={`/tickets/${t.id}`} className="ticket-card">
                <span>{t.title}</span>
                <span>
                  <span className={`badge ${t.priority}`}>{t.priority}</span>
                  <span className={`badge ${t.status}`}>{t.status.replace("_", " ")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data && (
        <div className="pager">
          <button className="btn secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span className="muted">Page {page} of {totalPages} · {data.total} total</span>
          <button className="btn secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </section>
  );
}
