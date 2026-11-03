import type { z } from "zod";
import { ApiError } from "@ticketly/shared";

export class RequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

const BASE = import.meta.env.VITE_API_URL ?? "/api";

/** Fetch JSON and validate it with a zod schema so the generic is honest at runtime. */
export async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "content-type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const parsed = ApiError.safeParse(await res.json().catch(() => null));
    if (parsed.success) {
      const { code, message, details } = parsed.data.error;
      throw new RequestError(res.status, code, message, details);
    }
    throw new RequestError(res.status, "unknown", `Request failed with ${res.status}`);
  }

  return schema.parse(await res.json());
}
