# Stage 1 — Take-home assessment

Three self-contained problems. Time box: **2 hours total**. No AI tools for this stage.

Each folder has a stub (`index.ts`) and a test file. Make the tests pass without changing the tests.
Run everything with `pnpm test:challenges`, or one problem with `pnpm vitest run challenges/01-ticket-sla`.

Submit as a pull request named `stage-1/<your-name>`. We read the code, not just the green checks:
naming, edge cases, complexity, and whether you added tests of your own.

| # | Problem | What we look at |
| --- | --- | --- |
| 01 | `ticket-sla` — which tickets breached their SLA | date math, business-hours edge cases |
| 02 | `rate-limiter` — sliding-window limiter | data structure choice, O(1) amortized per call |
| 03 | `merge-activity` — merge N sorted streams | correctness of ordering, stability, empty inputs |
