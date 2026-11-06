export class AiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public supportEmail: string | null = null
  ) {
    super(message);
  }
}

type Envelope<T> = {
  success: boolean;
  data?: T;
  code?: string;
  message?: string;
  details?: { supportEmail?: string | null } | null;
};

/** Error codes that mean "AI is off or exhausted", not "you did something wrong". */
export const UNAVAILABLE_CODES = new Set(["AI_NOT_CONFIGURED", "AI_UNAVAILABLE", "AI_BUDGET_EXHAUSTED", "AI_PROVIDER_ERROR", "AI_BUSY"]);

export function toClientError(body: Envelope<unknown> | null, fallback = "Something went wrong. Please try again."): AiClientError {
  return new AiClientError(body?.code ?? "UNKNOWN", body?.message ?? fallback, body?.details?.supportEmail ?? null);
}

export async function postAi<T>(url: string, payload: unknown, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new AiClientError("NETWORK", "Network problem. Please check your connection and try again.");
  }
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !body?.success || body.data === undefined) throw toClientError(body);
  return body.data;
}
