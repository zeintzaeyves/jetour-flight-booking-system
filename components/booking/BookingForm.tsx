"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Info, Plane, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { computeTotal } from "@/lib/bookings/pricing";
import {
  rememberBooking,
  saveConfirmation,
} from "@/lib/bookings/clientStore";
import type { PublicBooking } from "@/lib/bookings/serialize";
import { normalizeDate } from "@/lib/flights/search";
import { formatDateShort, formatPeso, formatTime12 } from "@/lib/format";
import {
  MAX_PASSENGERS,
  SEAT_PREFERENCES,
  bookingInputSchema,
} from "@/lib/validation/booking";
import type { Flight } from "@/types/flight";

type Errors = Record<string, string>;

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5">
        {label}
      </Label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function BookingForm({
  flight,
  defaultPassengers,
}: {
  flight: Flight;
  defaultPassengers: number;
}) {
  const router = useRouter();
  const maxPax = Math.max(1, Math.min(MAX_PASSENGERS, flight.availableSeats));
  const [passengers, setPassengers] = useState(
    Math.min(Math.max(1, defaultPassengers), maxPax)
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [others, setOthers] = useState<string[]>([]);
  const [seatPreference, setSeatPreference] = useState<string>(SEAT_PREFERENCES[0]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // One key per form instance: retries and double-clicks cannot create two bookings.
  const idempotencyKey = useRef(crypto.randomUUID());

  const total = computeTotal(flight.price, passengers);
  const date = normalizeDate(flight.departureDate);
  const stops = flight.stops ?? 0;

  const clear = (key: string) =>
    errors[key] && setErrors((e) => ({ ...e, [key]: "" }));

  function focusFirst(found: Errors) {
    const first = Object.keys(found).find((k) => found[k]);
    if (first) document.getElementById(`f-${first}`)?.focus();
  }

  function fromPath(path: PropertyKey[]): string {
    if (path[0] === "additionalPassengers" && typeof path[1] === "number") {
      return `additional-${path[1]}`;
    }
    return String(path[0] ?? "form");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setFormError(null);

    const parsed = bookingInputSchema.safeParse({
      flightNo: flight.flightNo,
      fullName,
      email,
      phone,
      passengers,
      additionalPassengers: Array.from(
        { length: passengers - 1 },
        (_, i) => others[i] ?? ""
      ),
      seatPreference,
      specialRequest,
      idempotencyKey: idempotencyKey.current,
    });

    if (!parsed.success) {
      const found: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = fromPath(issue.path);
        found[key] ||= issue.message;
      }
      setErrors(found);
      focusFirst(found);
      return;
    }
    setErrors({});
    setBusy(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await res.json();

      if (!res.ok) {
        const fields = result?.details?.fields as
          | { path: string; message: string }[]
          | undefined;
        if (fields?.length) {
          const found: Errors = {};
          for (const f of fields) {
            const [head, idx] = f.path.split(".");
            found[head === "additionalPassengers" && idx ? `additional-${idx}` : head] ||= f.message;
          }
          setErrors(found);
          focusFirst(found);
        } else {
          setFormError(result?.message || "We couldn't complete your booking.");
        }
        return;
      }

      const booking = result.data as PublicBooking;
      saveConfirmation(booking);
      rememberBooking({ reference: booking.bookingReference, email: booking.email });
      toast.success("Booking confirmed.");
      router.push(`/booking/success?ref=${encodeURIComponent(booking.bookingReference)}`);
    } catch {
      setFormError("Network problem. Your booking was not placed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const a11y = (key: string) => ({
    id: `f-${key}`,
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `f-${key}-error` : undefined,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {formError ? (
          <div
            role="alert"
            className="flex gap-3 rounded-xl border border-destructive/30 bg-danger-soft p-4 text-sm text-danger-ink"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">{formError}</p>
              <p className="mt-1 opacity-80">
                <Link href={`/flights/${flight.flightNo}`} className="underline">
                  Back to this flight
                </Link>{" "}
                or{" "}
                <Link href="/flights" className="underline">
                  search other flights
                </Link>
                .
              </p>
            </div>
          </div>
        ) : null}

        <fieldset className="space-y-5 rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-6">
          <legend className="sr-only">Contact details</legend>
          <h2 className="text-title">Contact details</h2>
          <Field {...{ id: "f-fullName", label: "Lead passenger full name", error: errors.fullName, hint: "As shown on your ID" }}>
            <Input {...a11y("fullName")} autoComplete="name" value={fullName}
              onChange={(e) => { setFullName(e.target.value); clear("fullName"); }} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field {...{ id: "f-email", label: "Email", error: errors.email, hint: "Used to look up your booking" }}>
              <Input {...a11y("email")} type="email" autoComplete="email" value={email}
                onChange={(e) => { setEmail(e.target.value); clear("email"); }} />
            </Field>
            <Field {...{ id: "f-phone", label: "Phone", error: errors.phone }}>
              <Input {...a11y("phone")} type="tel" autoComplete="tel" placeholder="+63 917 123 4567" value={phone}
                onChange={(e) => { setPhone(e.target.value); clear("phone"); }} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-5 rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-6">
          <legend className="sr-only">Passengers</legend>
          <h2 className="text-title">Passengers</h2>
          <Field {...{ id: "f-passengers", label: "Number of passengers", hint: `${flight.availableSeats} seat${flight.availableSeats === 1 ? "" : "s"} available` }}>
            <NativeSelect id="f-passengers" value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}>
              {Array.from({ length: maxPax }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "passenger" : "passengers"}
                </option>
              ))}
            </NativeSelect>
          </Field>
          {passengers > 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: passengers - 1 }, (_, i) => (
                <Field key={i} {...{ id: `f-additional-${i}`, label: `Passenger ${i + 2} full name`, error: errors[`additional-${i}`] }}>
                  <Input {...a11y(`additional-${i}`)} value={others[i] ?? ""}
                    onChange={(e) => {
                      setOthers((prev) => {
                        const next = [...prev];
                        next[i] = e.target.value;
                        return next;
                      });
                      clear(`additional-${i}`);
                    }} />
                </Field>
              ))}
            </div>
          ) : null}
        </fieldset>

        <fieldset className="space-y-5 rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-6">
          <legend className="sr-only">Preferences</legend>
          <h2 className="text-title">Preferences</h2>
          <Field {...{ id: "f-seatPreference", label: "Seat preference", hint: "A preference, not a guaranteed seat assignment" }}>
            <NativeSelect id="f-seatPreference" value={seatPreference}
              onChange={(e) => setSeatPreference(e.target.value)}>
              {SEAT_PREFERENCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field {...{ id: "f-specialRequest", label: "Special request (optional)", error: errors.specialRequest }}>
            <Textarea {...a11y("specialRequest")} rows={3} maxLength={500}
              placeholder="Meal preference, assistance, or other notes" value={specialRequest}
              onChange={(e) => { setSpecialRequest(e.target.value); clear("specialRequest"); }} />
            <p className="mt-1 text-right text-xs tabular-nums text-muted-foreground">
              {specialRequest.length}/500
            </p>
          </Field>
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              No payment is collected online. Your seats are reserved straight away under a booking
              reference, and you can cancel any time from Manage booking.
            </span>
          </p>
          <Button type="submit" variant="brand" size="lg" disabled={busy} className="sm:min-w-52">
            {busy ? "Confirming…" : `Confirm booking · ${formatPeso(total)}`}
          </Button>
        </div>
      </form>

      <aside aria-label="Booking summary" className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-card">
          <h2 className="text-title mb-4">Your flight</h2>
          <p className="text-2xl font-semibold tracking-tight">
            {flight.originCode} → {flight.destinationCode}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {flight.origin} to {flight.destination}
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <dt className="mt-0.5">
                <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
                <span className="sr-only">Departure</span>
              </dt>
              <dd>
                {date ? formatDateShort(date) : flight.departureDate} ·{" "}
                {formatTime12(flight.departureTime)} → {formatTime12(flight.arrivalTime)}
              </dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="mt-0.5">
                <Plane className="size-4 text-muted-foreground" aria-hidden />
                <span className="sr-only">Flight</span>
              </dt>
              <dd>
                {flight.airline} {flight.flightNo} · {flight.classType} · {flight.duration} ·{" "}
                {stops === 0 ? "Nonstop" : `${stops} stop${stops > 1 ? "s" : ""}`}
              </dd>
            </div>
          </dl>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {passengers} × {formatPeso(flight.price)}
              </span>
              <span className="tabular-nums">{formatPeso(total, true)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Baggage</span>
              <span>{flight.baggage} per passenger</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatPeso(total, true)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Fares are all-inclusive, per passenger, in Philippine pesos.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
