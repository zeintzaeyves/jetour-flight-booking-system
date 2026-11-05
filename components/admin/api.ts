export type ApiResult = {
  ok: boolean;
  status: number;
  message: string;
  fields: { path: string; message: string }[];
};

/** JSON request helper for admin mutations. Never throws; returns a normalized result. */
export async function adminRequest(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown
): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    return {
      ok: res.ok,
      status: res.status,
      message: json?.message ?? (res.ok ? "Done." : "Request failed."),
      fields: json?.details?.fields ?? [],
    };
  } catch {
    return { ok: false, status: 0, message: "Network problem. Please try again.", fields: [] };
  }
}
