export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export class NotFoundError extends HttpError {
  constructor(what: string, id: string) {
    super(404, "not_found", `${what} ${id} not found`);
  }
}

export class ValidationError extends HttpError {
  constructor(details: unknown) {
    super(400, "validation_error", "Invalid request", details);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, "conflict", message);
  }
}
