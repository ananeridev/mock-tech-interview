import { Link, useParams } from "react-router-dom";
import { useTicket } from "../api/tickets";

export function TicketDetailPage() {
  const { id = "" } = useParams();
  const { data: ticket, isPending, isError, error } = useTicket(id);

  if (isPending) return <p className="muted">Loading ticket…</p>;
  if (isError) return <p className="error">Could not load ticket: {error.message}</p>;

  return (
    <article>
      <p><Link to="/">← Back to tickets</Link></p>
      <h1>{ticket.title}</h1>
      <p>
        <span className={`badge ${ticket.priority}`}>{ticket.priority}</span>
        <span className={`badge ${ticket.status}`}>{ticket.status.replace("_", " ")}</span>
        {ticket.tags.map((tag) => <span key={tag} className="badge">#{tag}</span>)}
      </p>
      <p>{ticket.description || <span className="muted">No description.</span>}</p>
      {ticket.blockedBy && (
        <p className="muted">Blocked by <Link to={`/tickets/${ticket.blockedBy}`}>{ticket.blockedBy}</Link></p>
      )}
      <p className="muted">Created {new Date(ticket.createdAt).toLocaleString()}</p>

      {/* TODO (Stage 3): status/priority controls and a Close button with optimistic update */}
    </article>
  );
}
