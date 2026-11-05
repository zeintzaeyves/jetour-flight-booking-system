import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
    public headers?: Record<string, string>
  ) {
    super(message);
  }
}

export function ok<T>(data: T, status = 200, message?: string) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown,
  headers?: Record<string, string>
) {
  return NextResponse.json(
    { success: false, code, message, details },
    { status, headers }
  );
}

/** Maps any thrown value to a consistent JSON error response. */
export function handleError(error: unknown, context: string) {
  if (error instanceof ApiError) {
    return fail(
      error.status,
      error.code,
      error.message,
      error.details,
      error.headers
    );
  }
  if (error instanceof ZodError) {
    return fail(400, "VALIDATION_ERROR", "Invalid request.", {
      fields: error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }
  if (error instanceof SyntaxError) {
    return fail(400, "INVALID_JSON", "Request body must be valid JSON.");
  }
  if (isDuplicateKeyError(error)) {
    return fail(409, "DUPLICATE", "A record with that value already exists.");
  }
  console.error(`${context}:`, error);
  return fail(500, "INTERNAL_ERROR", "Something went wrong. Please try again.");
}

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: number }).code === 11000
  );
}
