const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});
const pesoExact = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₱12,499 — whole pesos for display; pass exact=true for totals with centavos. */
export function formatPeso(amount: number, exact = false): string {
  return (exact ? pesoExact : peso).format(amount);
}

/** "08:00" -> "8:00 AM"; returns the input unchanged if it isn't a readable time. */
export function formatTime12(value: string): string {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return value;
  const h = Number(m[1]);
  if (h > 23 || Number(m[2]) > 59) return value;
  return `${h % 12 || 12}:${m[2]} ${h >= 12 ? "PM" : "AM"}`;
}

/** "2026-12-01" -> "Tue, Dec 1". Timezone-independent (the date is a calendar date, not an instant). */
export function formatDateShort(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Intl.DateTimeFormat("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
