import { useNavigate } from "react-router-dom";
import { CreateTicketForm } from "../components/CreateTicketForm";
import { useCreateTicket } from "../api/tickets";

export function NewTicketPage() {
  const navigate = useNavigate();
  const create = useCreateTicket();

  return (
    <section>
      <h1>New ticket</h1>
      <CreateTicketForm
        isSubmitting={create.isPending}
        serverError={create.error}
        onSubmit={async (values) => {
          const ticket = await create.mutateAsync(values);
          navigate(`/tickets/${ticket.id}`);
        }}
      />
    </section>
  );
}
