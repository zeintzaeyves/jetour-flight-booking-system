import { cookies } from "next/headers";
import { z } from "zod";

import { ApiError, handleError, ok } from "@/lib/api/response";
import { enforceRateLimit } from "@/lib/rateLimit";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  checkAdminPassword,
  createSessionToken,
  getSecret,
} from "@/lib/auth/session";

const schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  try {
    // Brute-force guard: 10 attempts per IP per 15 minutes.
    await enforceRateLimit(request, "login", 10, 15 * 60);
    const secret = getSecret();
    if (!secret || !process.env.ADMIN_PASSWORD) {
      throw new ApiError(
        503,
        "AUTH_NOT_CONFIGURED",
        "Admin login is not configured on this server."
      );
    }
    const { password } = schema.parse(await request.json());
    if (!(await checkAdminPassword(password))) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Incorrect password.");
    }
    (await cookies()).set(SESSION_COOKIE, await createSessionToken(secret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    return ok(null, 200, "Signed in.");
  } catch (error) {
    return handleError(error, "LOGIN_ERROR");
  }
}
