import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as schema from "./schema.js";

const here = path.dirname(fileURLToPath(import.meta.url));
// src/db -> apps/api/drizzle (works from src/ via tsx and from dist/ after build)
const migrationsFolder = path.resolve(here, "../../drizzle");

export type Db = ReturnType<typeof createDb>;

export function createDb(url = process.env.DATABASE_URL ?? "./ticketly.db") {
  const sqlite = new Database(url);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder });
  return db;
}
