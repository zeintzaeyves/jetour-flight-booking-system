const TZ = "Asia/Manila";

/** Today's calendar date in Jetour's home timezone, "YYYY-MM-DD". */
export function manilaToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);
}

const addDays = (iso: string, n: number): string => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const weekday = (iso: string): number => new Date(`${iso}T00:00:00Z`).getUTCDay(); // 0 = Sunday

/** Anchors the model can use instead of doing calendar arithmetic itself. */
export function dateAnchors(today: string) {
  const toSat = (6 - weekday(today) + 7) % 7;
  const thisSaturday = addDays(today, toSat === 0 ? 7 : toSat);
  const toMon = (8 - weekday(today)) % 7 || 7;
  return {
    today,
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(
      new Date(`${today}T00:00:00Z`)
    ),
    tomorrow: addDays(today, 1),
    thisComingSaturday: thisSaturday,
    saturdayAfterThat: addDays(thisSaturday, 7),
    nextMonday: addDays(today, toMon),
  };
}
