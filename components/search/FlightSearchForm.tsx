"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { CABINS } from "@/lib/flights/search";
import {
  buildSearchHref,
  validateSearchForm,
  type SearchFormErrors,
  type SearchFormValues,
} from "@/lib/flights/searchForm";
import type { Airport } from "@/lib/flights/service";
import { cn } from "@/lib/utils";

// Used only when the catalog can't be read, so the form is never empty.
export const FALLBACK_AIRPORTS: Airport[] = [
  { code: "MNL", city: "Manila" },
  { code: "CEB", city: "Cebu" },
  { code: "NRT", city: "Tokyo" },
  { code: "ICN", city: "Seoul" },
  { code: "SIN", city: "Singapore" },
  { code: "BKK", city: "Bangkok" },
];

const EMPTY: SearchFormValues = {
  trip: "round",
  from: "",
  to: "",
  date: "",
  returnDate: "",
  passengers: 1,
  cabin: "",
};

function localToday(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const SWAP_BUTTON =
  "group/swap inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-card text-muted-foreground shadow-xs outline-none transition-colors duration-200 hover:border-white/30 hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-95";

type Props = {
  airports: Airport[];
  initial?: Partial<SearchFormValues>;
  /** "compact" is the slim bar on the results page. */
  variant?: "hero" | "compact";
  className?: string;
};

export default function FlightSearchForm({
  airports,
  initial,
  variant = "hero",
  className,
}: Props) {
  const router = useRouter();
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const [values, setValues] = useState<SearchFormValues>({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState<SearchFormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  // Each swap adds a half turn, so the icon keeps rotating the same way.
  const [swapTurns, setSwapTurns] = useState(0);

  const options = airports.length ? airports : FALLBACK_AIRPORTS;
  const compact = variant === "compact";

  // `min` depends on the visitor's local date, so set it after mount to avoid a
  // server/client mismatch around midnight.
  useEffect(() => {
    const today = localToday();
    formRef.current
      ?.querySelectorAll<HTMLInputElement>('input[type="date"]')
      .forEach((el) => (el.min = today));
  }, []);

  const set = <K extends keyof SearchFormValues>(k: K, v: SearchFormValues[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k as keyof SearchFormErrors]) {
      setErrors((prev) => ({ ...prev, [k]: undefined }));
    }
  };

  function swap() {
    setValues((prev) => ({ ...prev, from: prev.to, to: prev.from }));
    setSwapTurns((n) => n + 1);
  }

  // Outer span: hover turn. Inner icon: a half turn per click. Separate elements so they compose.
  const swapIcon = (
    <span className="flex transition-transform duration-300 ease-out group-hover/swap:rotate-180 group-focus-visible/swap:rotate-180 motion-reduce:transition-none">
      <ArrowLeftRight
        className="size-4 transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ rotate: `${swapTurns * 180}deg` }}
        aria-hidden
      />
    </span>
  );

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validateSearchForm(values, localToday());
    setErrors(found);
    const first = (["from", "to", "date", "returnDate"] as const).find(
      (k) => found[k]
    );
    if (first) {
      const target = first === "returnDate" ? "return" : first;
      formRef.current
        ?.querySelector<HTMLElement>(`[id$="-${target}"]`)
        ?.focus();
      return;
    }
    router.push(buildSearchHref(values));
  }

  const fieldError = (k: keyof SearchFormErrors, name: string) =>
    errors[k] ? (
      <p id={id(`${name}-error`)} role="alert" className="mt-1.5 text-sm text-danger-ink">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof SearchFormErrors, name: string) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? id(`${name}-error`) : undefined,
  });

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-label="Search flights"
      className={cn(
        "rounded-[1.75rem] border border-border bg-card p-4 shadow-pop sm:p-6",
        compact && "p-4 shadow-card sm:p-4",
        className
      )}
    >
      <fieldset className="mb-4 flex gap-1 rounded-xl bg-muted p-1 w-fit">
        <legend className="sr-only">Trip type</legend>
        {(
          [
            ["round", "Round trip"],
            ["oneway", "One way"],
          ] as const
        ).map(([value, label]) => (
          <label
            key={value}
            className="cursor-pointer rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors has-[:checked]:bg-card has-[:checked]:text-foreground has-[:checked]:shadow-xs has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40"
          >
            <input
              type="radio"
              name="trip"
              value={value}
              checked={values.trip === value}
              onChange={() => set("trip", value)}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div
        className={cn(
          "grid gap-3 sm:grid-cols-2",
          "lg:grid-cols-4"
        )}
      >
        {/* From + To form one pair with a wider gutter that holds the swap button, so it never overlaps a field. */}
        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 sm:gap-x-(--pair-gap) [--pair-gap:3rem]">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor={id("from")}>From</Label>
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className={cn(SWAP_BUTTON, "h-8 gap-1.5 px-3 text-xs font-medium sm:hidden")}
            >
              {swapIcon}
              Swap
            </button>
          </div>
          {/* The select's own box is the positioning context, so the button is centred on it exactly. */}
          <div className="relative">
            <NativeSelect
              id={id("from")}
              value={values.from}
              onChange={(e) => set("from", e.target.value)}
              {...a11y("from", "from")}
            >
              <option value="">Select origin</option>
              {options.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </NativeSelect>
            {/* Centred in the pair gutter, with 0.375rem of clear space on each side. */}
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className={cn(
                SWAP_BUTTON,
                "absolute left-[calc(100%+var(--pair-gap)/2)] top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 sm:flex"
              )}
            >
              {swapIcon}
            </button>
          </div>
          {fieldError("from", "from")}
        </div>

        <div>
          <Label htmlFor={id("to")} className="mb-1.5">To</Label>
          <NativeSelect
            id={id("to")}
            value={values.to}
            onChange={(e) => set("to", e.target.value)}
            {...a11y("to", "to")}
          >
            <option value="">Select destination</option>
            {options.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </NativeSelect>
          {fieldError("to", "to")}
        </div>
        </div>

        <div>
          <Label htmlFor={id("date")} className="mb-1.5">Depart</Label>
          <Input
            id={id("date")}
            type="date"
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            {...a11y("date", "date")}
          />
          {fieldError("date", "date")}
        </div>

        <div>
          <Label
            htmlFor={id("return")}
            className={cn("mb-1.5", values.trip === "oneway" && "text-muted-foreground")}
          >
            Return
          </Label>
          <Input
            id={id("return")}
            type="date"
            value={values.returnDate}
            disabled={values.trip === "oneway"}
            onChange={(e) => set("returnDate", e.target.value)}
            {...a11y("returnDate", "return")}
          />
          {fieldError("returnDate", "return")}
        </div>

        <div>
          <Label htmlFor={id("passengers")} className="mb-1.5">Passengers</Label>
          <NativeSelect
            id={id("passengers")}
            value={values.passengers}
            onChange={(e) => set("passengers", Number(e.target.value))}
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "passenger" : "passengers"}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div>
          <Label htmlFor={id("cabin")} className="mb-1.5">Cabin</Label>
          <NativeSelect
            id={id("cabin")}
            value={values.cabin}
            onChange={(e) => set("cabin", e.target.value)}
          >
            <option value="">Any cabin</option>
            {CABINS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="flex items-end sm:col-span-2 lg:col-span-2">
          <Button type="submit" variant="brand" size="lg" className="w-full">
            <Search aria-hidden />
            Search flights
          </Button>
        </div>
      </div>
    </form>
  );
}
