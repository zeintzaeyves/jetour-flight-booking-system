"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { adminRequest } from "@/components/admin/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { CLASS_TYPES, FLIGHT_STATUSES } from "@/lib/validation/flight";
import type { Flight } from "@/types/flight";

function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={`ff-${name}`} className="mb-1.5">{label}</Label>
      {children}
      {error ? (
        <p id={`ff-${name}-error`} role="alert" className="mt-1 text-sm text-danger-ink">{error}</p>
      ) : null}
    </div>
  );
}

/** Create (no `flight`) or edit (with `flight`) a flight. Validation is authoritative on the server. */
export default function FlightFormDialog({
  flight,
  children,
}: {
  flight?: Flight;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const editing = Boolean(flight);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const payload: Record<string, unknown> = {
      airline: get("airline"),
      origin: get("origin"),
      destination: get("destination"),
      originCode: get("originCode"),
      destinationCode: get("destinationCode"),
      departureDate: get("departureDate"),
      departureTime: get("departureTime"),
      arrivalTime: get("arrivalTime"),
      duration: get("duration"),
      classType: get("classType"),
      baggage: get("baggage"),
      price: get("price"),
      availableSeats: get("availableSeats"),
      stops: get("stops") || "0",
      status: get("status"),
      tag: get("tag"),
    };
    if (!editing) payload.flightNo = get("flightNo");

    setBusy(true);
    setErrors({});
    setFormError(null);
    const result = editing
      ? await adminRequest(`/api/flights/${encodeURIComponent(flight!.flightNo)}`, "PATCH", payload)
      : await adminRequest("/api/flights", "POST", payload);
    setBusy(false);

    if (result.ok) {
      toast.success(editing ? "Flight updated." : "Flight created.");
      setOpen(false);
      router.refresh();
      return;
    }
    if (result.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (result.fields.length) {
      const found: Record<string, string> = {};
      for (const f of result.fields) found[f.path] ||= f.message;
      setErrors(found);
      document.getElementById(`ff-${Object.keys(found)[0]}`)?.focus();
    } else {
      setFormError(
        result.status === 409 ? "A flight with this number already exists." : result.message
      );
    }
  }

  const err = (k: string) => ({
    id: `ff-${k}`,
    name: k,
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `ff-${k}-error` : undefined,
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ${flight!.flightNo}` : "Add flight"}</DialogTitle>
          <DialogDescription>
            Dates use the calendar picker and times are 24-hour. Seats and price apply per flight.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {formError ? (
            <p role="alert" className="rounded-lg bg-danger-soft p-3 text-sm text-danger-ink">{formError}</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="flightNo" label="Flight number" error={errors.flightNo}>
              <Input {...err("flightNo")} defaultValue={flight?.flightNo} readOnly={editing} placeholder="JT-520" />
            </Field>
            <Field name="airline" label="Airline" error={errors.airline}>
              <Input {...err("airline")} defaultValue={flight?.airline ?? "Jetour Airways"} />
            </Field>
            <Field name="origin" label="Origin city" error={errors.origin}>
              <Input {...err("origin")} defaultValue={flight?.origin} placeholder="Manila" />
            </Field>
            <Field name="originCode" label="Origin code" error={errors.originCode}>
              <Input {...err("originCode")} defaultValue={flight?.originCode} placeholder="MNL" maxLength={3} className="uppercase" />
            </Field>
            <Field name="destination" label="Destination city" error={errors.destination}>
              <Input {...err("destination")} defaultValue={flight?.destination} placeholder="Tokyo" />
            </Field>
            <Field name="destinationCode" label="Destination code" error={errors.destinationCode}>
              <Input {...err("destinationCode")} defaultValue={flight?.destinationCode} placeholder="NRT" maxLength={3} className="uppercase" />
            </Field>
            <Field name="departureDate" label="Departure date" error={errors.departureDate}>
              <DatePicker {...err("departureDate")} defaultValue={flight?.departureDate} />
            </Field>
            <Field name="departureTime" label="Departure time" error={errors.departureTime}>
              <Input {...err("departureTime")} type="time" defaultValue={flight?.departureTime} />
            </Field>
            <Field name="arrivalTime" label="Arrival time" error={errors.arrivalTime}>
              <Input {...err("arrivalTime")} type="time" defaultValue={flight?.arrivalTime} />
            </Field>
            <Field name="duration" label="Duration" error={errors.duration}>
              <Input {...err("duration")} defaultValue={flight?.duration} placeholder="4h 20m" />
            </Field>
            <Field name="price" label="Price per passenger (₱)" error={errors.price}>
              <Input {...err("price")} type="number" min={1} step="any" inputMode="decimal" defaultValue={flight?.price} />
            </Field>
            <Field name="availableSeats" label="Available seats" error={errors.availableSeats}>
              <Input {...err("availableSeats")} type="number" min={0} step={1} inputMode="numeric" defaultValue={flight?.availableSeats} />
            </Field>
            <Field name="stops" label="Stops" error={errors.stops}>
              <Input {...err("stops")} type="number" min={0} max={5} step={1} inputMode="numeric" defaultValue={flight?.stops ?? 0} />
            </Field>
            <Field name="classType" label="Cabin" error={errors.classType}>
              <NativeSelect {...err("classType")} defaultValue={flight?.classType ?? "Economy"}>
                {CLASS_TYPES.map((c) => <option key={c}>{c}</option>)}
              </NativeSelect>
            </Field>
            <Field name="baggage" label="Baggage" error={errors.baggage}>
              <Input {...err("baggage")} defaultValue={flight?.baggage ?? "20kg"} />
            </Field>
            <Field name="status" label="Status" error={errors.status}>
              <NativeSelect {...err("status")} defaultValue={flight?.status ?? "Scheduled"}>
                {FLIGHT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </NativeSelect>
            </Field>
            <Field name="tag" label="Label" error={errors.tag}>
              <Input {...err("tag")} defaultValue={flight?.tag ?? "Available"} placeholder="Popular" />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" disabled={busy} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create flight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
