import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateTicketInput, TICKET_PRIORITIES, TicketPriority } from "@ticketly/shared";
import { RequestError } from "../api/client";

// The form works with plain strings; it reuses the shared field rules and converts
// tags into the array shape the API expects on submit.
const FormSchema = z.object({
  title: CreateTicketInput.shape.title,
  description: z.string().trim().max(2000),
  priority: TicketPriority,
  tags: z.string(),
});
type FormValues = z.infer<typeof FormSchema>;

function toInput(values: FormValues): CreateTicketInput {
  return {
    ...values,
    tags: values.tags.split(",").map((t) => t.trim()).filter(Boolean),
  };
}

interface Props {
  onSubmit: (values: CreateTicketInput) => Promise<void> | void;
  isSubmitting?: boolean;
  serverError?: Error | null;
}

export function CreateTicketForm({ onSubmit, isSubmitting, serverError }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: "", description: "", priority: "medium", tags: "" },
  });

  const fieldErrors =
    serverError instanceof RequestError && serverError.code === "validation_error"
      ? ((serverError.details as { fieldErrors?: Record<string, string[]> })?.fieldErrors ?? {})
      : {};

  return (
    <form className="form" onSubmit={handleSubmit((values) => onSubmit(toInput(values)))} noValidate>
      <label>
        Title
        <input {...register("title")} aria-invalid={!!errors.title} aria-describedby="title-error" />
        <span id="title-error" className="error">{errors.title?.message ?? fieldErrors.title?.[0]}</span>
      </label>

      <label>
        Description
        <textarea rows={4} {...register("description")} />
        <span className="error">{errors.description?.message}</span>
      </label>

      <label>
        Priority
        <select {...register("priority")}>
          {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>

      <label>
        Tags (comma separated)
        <input {...register("tags")} placeholder="auth, bug" />
      </label>

      {serverError && !(serverError instanceof RequestError && serverError.code === "validation_error") && (
        <p className="error" role="alert">{serverError.message}</p>
      )}

      <button className="btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create ticket"}
      </button>
    </form>
  );
}
