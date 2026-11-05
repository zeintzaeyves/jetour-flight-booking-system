import { toQueryString } from "./search";

export type SearchFormValues = {
  trip: "oneway" | "round";
  from: string;
  to: string;
  date: string;
  returnDate: string;
  passengers: number;
  cabin: string; // "" = any
};

export type SearchFormErrors = Partial<
  Record<"from" | "to" | "date" | "returnDate", string>
>;

/** `today` is YYYY-MM-DD, injected so this stays testable. */
export function validateSearchForm(
  v: SearchFormValues,
  today: string
): SearchFormErrors {
  const errors: SearchFormErrors = {};
  if (!v.from) errors.from = "Choose where you're flying from.";
  if (!v.to) errors.to = "Choose where you're flying to.";
  if (v.from && v.to && v.from === v.to) {
    errors.to = "Destination must be different from origin.";
  }
  if (!v.date) errors.date = "Pick a departure date.";
  else if (v.date < today) errors.date = "Departure can't be in the past.";
  if (v.trip === "round") {
    if (!v.returnDate) errors.returnDate = "Pick a return date.";
    else if (v.date && v.returnDate < v.date) {
      errors.returnDate = "Return must be on or after departure.";
    }
  }
  return errors;
}

export function buildSearchHref(v: SearchFormValues): string {
  const qs = toQueryString({
    trip: v.trip,
    from: v.from,
    to: v.to,
    date: v.date,
    return: v.trip === "round" ? v.returnDate : undefined,
    passengers: v.passengers,
    cabin: (v.cabin || undefined) as never,
  });
  return `/flights${qs ? `?${qs}` : ""}`;
}
