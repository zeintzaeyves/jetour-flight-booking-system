import type { z } from "zod";

import { ApiError } from "@/lib/api/response";

const MAX_BODY_BYTES = 20_000;

/** Reads and validates a JSON body with a hard size cap, before anything else is spent on it. */
export async function readBody<S extends z.ZodType>(request: Request, schema: S): Promise<z.infer<S>> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) throw new ApiError(413, "PAYLOAD_TOO_LARGE", "That request is too large.");
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) throw new ApiError(413, "PAYLOAD_TOO_LARGE", "That request is too large.");
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }
  return schema.parse(json);
}
