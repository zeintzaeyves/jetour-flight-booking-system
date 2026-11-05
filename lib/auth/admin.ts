import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/lib/api/response";
import { SESSION_COOKIE, getSecret, verifySessionToken } from "./session";

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value, getSecret());
}

/** Authoritative check for route handlers. Throws a 401 ApiError. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new ApiError(401, "UNAUTHORIZED", "Admin authentication required.");
  }
}

/** Authoritative guard for admin *pages* (the proxy only gates optimistically). */
export async function assertAdminPage(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
