"use client";

import { useState, useSyncExternalStore } from "react";
import { History, Search, X } from "lucide-react";
import { toast } from "sonner";

import BookingDetails from "@/components/my-bookings/BookingDetails";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgetBooking,
  parseRecent,
  readRecentRaw,
  rememberBooking,
  subscribe,
} from "@/lib/bookings/clientStore";
import type { PublicBooking } from "@/lib/bookings/serialize";

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

export default function ManageBooking({ initialReference }: { initialReference: string }) {
  const [reference, setReference] = useState(initialReference);
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const recent = parseRecent(
    useSyncExternalStore(subscribe, readRecentRaw, () => null)
  );

  async function lookup(ref: string, mail: string) {
    setBusy(true);
    setError(null);
    setBooking(null);
    try {
      const { ok, json } = await post("/api/bookings/lookup", { reference: ref, email: mail });
      if (!ok) {
        setError(
          json?.code === "BOOKING_NOT_FOUND"
            ? "We couldn't find a booking with that reference and email. Check both and try again."
            : json?.code === "VALIDATION_ERROR"
              ? "Enter your booking reference and the email used when booking."
              : json?.message || "Something went wrong. Please try again."
        );
        return;
      }
      const found = json.data as PublicBooking;
      setBooking(found);
      rememberBooking({ reference: found.bookingReference, email: found.email });
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!booking) return;
    setCancelling(true);
    try {
      const { ok, json } = await post("/api/bookings/cancel", {
        reference: booking.bookingReference,
        email: booking.email,
      });
      if (!ok) {
        toast.error(json?.message || "We couldn't cancel this booking.");
        return;
      }
      setBooking(json.data as PublicBooking);
      setConfirmOpen(false);
      toast.success("Booking cancelled. Your seats have been released.");
    } catch {
      toast.error("Network problem. The booking was not cancelled.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void lookup(reference, email);
        }}
        noValidate
        aria-label="Find your booking"
        className="rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="mb-ref" className="mb-1.5">Booking reference</Label>
            <Input
              id="mb-ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="JT-ABCD2345"
              autoCapitalize="characters"
              autoComplete="off"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "mb-error" : undefined}
            />
          </div>
          <div>
            <Label htmlFor="mb-email" className="mb-1.5">Email used to book</Label>
            <Input
              id="mb-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "mb-error" : undefined}
            />
          </div>
        </div>
        {error ? (
          <p id="mb-error" role="alert" className="mt-3 text-sm text-danger-ink">{error}</p>
        ) : null}
        <Button type="submit" variant="brand" size="lg" disabled={busy} className="mt-5 w-full sm:w-auto">
          <Search aria-hidden />
          {busy ? "Searching…" : "Find booking"}
        </Button>
      </form>

      {recent.length > 0 && !booking ? (
        <section aria-label="Recent bookings on this device" className="rounded-[1.75rem] border border-border bg-card p-5 shadow-card">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium">
            <History className="size-4 text-muted-foreground" aria-hidden />
            Recent on this device
          </h2>
          <ul className="divide-y divide-border">
            {recent.map((r) => (
              <li key={r.reference} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-sm font-medium tabular-nums">{r.reference}</span>
                <span className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={busy} onClick={() => {
                    setReference(r.reference);
                    setEmail(r.email);
                    void lookup(r.reference, r.email);
                  }}>
                    View
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label={`Remove ${r.reference} from this device`} onClick={() => forgetBooking(r.reference)}>
                    <X aria-hidden />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Saved only in this browser. Clear it any time with the × buttons.
          </p>
        </section>
      ) : null}

      {booking ? (
        <div aria-live="polite" className="space-y-4">
          <BookingDetails
            booking={booking}
            actions={
              booking.status !== "Cancelled" ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Need to change passengers or dates? Changes aren&apos;t supported yet. Cancel this
                    booking and book again.
                  </p>
                  <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                    Cancel booking
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This booking is cancelled and its seats were released.
                </p>
              )
            }
          />
        </div>
      ) : null}

      <Dialog open={confirmOpen} onOpenChange={(o) => !cancelling && setConfirmOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this booking?</DialogTitle>
            <DialogDescription>
              {booking
                ? `${booking.bookingReference} (${booking.route}) will be cancelled and ${booking.passengers} seat${booking.passengers === 1 ? "" : "s"} released. This can't be undone.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={cancelling}>Keep booking</Button>
            </DialogClose>
            <Button variant="destructive" onClick={cancel} disabled={cancelling}>
              {cancelling ? "Cancelling…" : "Yes, cancel booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
