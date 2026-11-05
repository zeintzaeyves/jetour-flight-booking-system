// Browser-only helpers. Everything is wrapped in try/catch because storage can
// be unavailable (private mode, blocked cookies); the UI must work without it.
import type { PublicBooking } from "./serialize";

const confirmationKey = (ref: string) => `jetour:booking:${ref}`;
const RECENT_KEY = "jetour:recent";
const MAX_RECENT = 5;
const EVENT = "jetour:store";

export type RecentRef = { reference: string; email: string };

export function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

/** Per-tab copy of the booking just made, so the success page can show details without an email lookup. */
export function saveConfirmation(booking: PublicBooking) {
  try {
    sessionStorage.setItem(
      confirmationKey(booking.bookingReference),
      JSON.stringify(booking)
    );
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function readConfirmationRaw(reference: string): string | null {
  try {
    return sessionStorage.getItem(confirmationKey(reference));
  } catch {
    return null;
  }
}

export function parseConfirmation(raw: string | null): PublicBooking | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PublicBooking;
  } catch {
    return null;
  }
}

/** Device-local "recent bookings" so guests can reopen them without retyping. Never leaves the browser. */
export function readRecentRaw(): string | null {
  try {
    return localStorage.getItem(RECENT_KEY);
  } catch {
    return null;
  }
}

export function parseRecent(raw: string | null): RecentRef[] {
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list)
      ? list.filter(
          (r): r is RecentRef =>
            typeof r?.reference === "string" && typeof r?.email === "string"
        )
      : [];
  } catch {
    return [];
  }
}

export function rememberBooking(ref: RecentRef) {
  try {
    const next = [
      ref,
      ...parseRecent(readRecentRaw()).filter(
        (r) => r.reference !== ref.reference
      ),
    ].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function forgetBooking(reference: string) {
  try {
    const next = parseRecent(readRecentRaw()).filter(
      (r) => r.reference !== reference
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}
