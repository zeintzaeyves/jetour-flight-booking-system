const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME = /^(\d{1,2}):(\d{2})$/;

/**
 * Flight's printed local wall-clock time, stored as if it were UTC ("floating" time).
 * Deterministic whatever timezone it runs in; meant for ordering/comparing flights,
 * not for timezone arithmetic. Returns null for anything it can't read exactly.
 */
export function floatingDeparture(date, time) {
  const d = DATE.exec(String(date).trim());
  const t = TIME.exec(String(time).trim());
  if (!d || !t) return null;
  const [y, mo, da, h, mi] = [d[1], d[2], d[3], t[1], t[2]].map(Number);
  const back = new Date(Date.UTC(y, mo - 1, da, h, mi));
  // Reject impossible values (2026-02-31, 25:00) instead of letting Date roll them over.
  if (
    back.getUTCFullYear() !== y ||
    back.getUTCMonth() !== mo - 1 ||
    back.getUTCDate() !== da ||
    h > 23 ||
    mi > 59
  ) {
    return null;
  }
  return back;
}
