import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateTicketForm } from "./CreateTicketForm";

describe("CreateTicketForm", () => {
  it("shows a validation error and does not submit when the title is too short", async () => {
    const onSubmit = vi.fn();
    render(<CreateTicketForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/title/i), "no");
    await userEvent.click(screen.getByRole("button", { name: /create ticket/i }));

    expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits parsed values, splitting tags", async () => {
    const onSubmit = vi.fn();
    render(<CreateTicketForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/title/i), "Printer is on fire");
    await userEvent.type(screen.getByLabelText(/tags/i), "hardware, urgent-ish");
    await userEvent.click(screen.getByRole("button", { name: /create ticket/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({
      title: "Printer is on fire",
      priority: "medium",
      tags: ["hardware", "urgent-ish"],
    });
  });
});
