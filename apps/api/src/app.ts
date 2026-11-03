import Fastify from "fastify";
import cors from "@fastify/cors";
import { createDb, type Db } from "./db/client.js";
import { HttpError } from "./lib/errors.js";
import { ticketRoutes } from "./routes/tickets.js";

declare module "fastify" {
  interface FastifyInstance {
    db: Db;
  }
}

export interface BuildOptions {
  databaseUrl?: string;
  logger?: boolean;
}

export function buildApp(opts: BuildOptions = {}) {
  const app = Fastify({ logger: opts.logger ?? false });

  app.decorate("db", createDb(opts.databaseUrl));
  app.register(cors, { origin: true });

  app.get("/health", async () => ({ ok: true }));
  app.register(ticketRoutes);

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof HttpError) {
      return reply
        .code(err.status)
        .send({ error: { code: err.code, message: err.message, details: err.details } });
    }
    req.log.error(err);
    return reply.code(500).send({ error: { code: "internal_error", message: "Something went wrong" } });
  });

  app.setNotFoundHandler((req, reply) =>
    reply.code(404).send({ error: { code: "not_found", message: `Route ${req.method} ${req.url} not found` } }),
  );

  return app;
}
