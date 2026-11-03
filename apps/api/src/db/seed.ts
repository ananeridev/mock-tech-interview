import { createDb } from "./client.js";
import { tickets } from "./schema.js";
import { randomUUID } from "node:crypto";

const db = createDb();
const now = Date.now();
const seed = [
  { title: "Login page returns 500 for SSO users", priority: "urgent", status: "open", tags: ["auth", "bug"] },
  { title: "Export CSV is missing the 'owner' column", priority: "high", status: "in_progress", tags: ["export"] },
  { title: "Dark mode toggle does not persist", priority: "low", status: "open", tags: ["ui"] },
  { title: "Webhook retries fire twice", priority: "high", status: "open", tags: ["integrations", "bug"] },
  { title: "Add Portuguese translation for onboarding", priority: "medium", status: "open", tags: ["i18n"] },
  { title: "Rate limit error message is unclear", priority: "medium", status: "closed", tags: ["api", "docs"] },
] as const;

db.delete(tickets).run();
for (const [i, t] of seed.entries()) {
  db.insert(tickets)
    .values({
      id: randomUUID(),
      title: t.title,
      description: `Seeded ticket #${i + 1}. Replace with a real description.`,
      priority: t.priority,
      status: t.status,
      tags: JSON.stringify(t.tags),
      blockedBy: null,
      createdAt: new Date(now - i * 3_600_000),
      updatedAt: new Date(now - i * 3_600_000),
    })
    .run();
}
console.log(`seeded ${seed.length} tickets`);
