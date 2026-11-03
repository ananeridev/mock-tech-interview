# Ticketly — mock technical interview (fullstack React + Node)

A small support-ticket app used as the base for a three-stage technical interview modeled on
how [Howdy.com](https://www.howdy.com) vets engineers: a short take-home, a live coding round,
and an AI-assisted work sample inside a realistic repo.

```
apps/api        Fastify 5 + Drizzle ORM + SQLite (better-sqlite3), TypeScript
apps/web        React 18 + Vite + TanStack Query + React Hook Form, TypeScript
packages/shared zod schemas and types shared by both ends
challenges/     Stage 1 — three take-home problems with tests
live/           Stage 2 — one live coding exercise with failing tests
```

## Getting started

Requirements: Node 20+ and pnpm 10 (`corepack enable && corepack prepare pnpm@10 --activate`).

```bash
pnpm install
pnpm db:migrate     # creates apps/api/ticketly.db
pnpm db:seed        # six sample tickets
pnpm dev            # api on http://localhost:3001, web on http://localhost:5173
```

Other scripts: `pnpm test` (apps), `pnpm test:challenges`, `pnpm test:live`, `pnpm typecheck`, `pnpm build`.

The web app proxies `/api/*` to the API in dev, so no CORS setup is needed locally.

## The interview

### Stage 1 — Take-home (2 hours, no AI)

See [`challenges/README.md`](challenges/README.md). Open a PR named `stage-1/<your-name>`.

### Stage 2 — Live coding (20 min, screen shared)

See [`live/README.md`](live/README.md). Done together on a call, followed by ~10 minutes of conceptual questions.

### Stage 3 — AI-assisted work sample (90 min + 15 min debrief)

AI tools are allowed and expected (Copilot, Cursor, Claude Code, ChatGPT…). You must share your prompt
history, and you are evaluated on how you frame the problem, give the model context, verify its output and
explain your decisions — not on typing speed.

**The task: ship the "close ticket" feature end to end.**

1. **API** — `POST /tickets/:id/close`
   - Idempotent: closing an already-closed ticket returns 200 with the same ticket, not an error.
   - Sets `closedAt` (new column + migration) and `status = "closed"`.
   - Returns `409 conflict` if the ticket is blocked by another ticket (`blockedBy`) that is not closed.
   - Also add `PATCH /tickets/:id` to change `title`, `description`, `priority`, `status`, `tags`.
2. **Shared** — extend the zod schemas in `packages/shared` so both ends agree on the new shape.
3. **Web** — on the ticket detail page: controls to change status/priority, and a **Close** button with an
   optimistic update (the UI updates immediately and rolls back if the request fails). Loading, error and
   "already closed" states must be handled.
4. **Tests** — integration tests for the new routes (success, idempotency, 409, 404) and a component test for
   the Close interaction. CI must stay green.
5. **DECISIONS.md** — fill it in. We will go through it together in the debrief.

Somewhere in the existing code there is at least one bug that affects this feature's users. Finding it and
fixing it (with a test) is part of the job.

Open a PR named `stage-3/<your-name>` with your prompt history attached (a file in the PR or a link).

### What we evaluate

| Competency | We want to see | Red flag |
| --- | --- | --- |
| Problem framing | You restate the goal and define "done" before coding | Jumping straight into code |
| Context management | You give the model the repo's conventions and constraints | Vague prompts that ignore existing patterns |
| Prompt quality | Specific, iterative, grounded in this codebase | "Build the whole feature" one-shot prompts |
| Verification | You run and write tests, check edge cases, review the diff | Accepting generated output unchecked |
| Debugging | Hypothesis-driven; you find the planted bug | Trial and error without learning |
| Communication | You explain trade-offs clearly in English in the debrief | Cannot justify your choices |

## Conventions

- Validation at the boundary with the shared zod schemas; never trust `req.body` or `response.json()` as-is.
- Errors are thrown as `HttpError` subclasses and rendered by one error handler as `{ error: { code, message, details } }`.
- Server state lives in TanStack Query hooks under `apps/web/src/api`; components do not call `fetch`.
- Small commits with clear messages. The commit history is part of what we review.
# mock-tech-interview
