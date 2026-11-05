"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";

import BookingDetails from "@/components/my-bookings/BookingDetails";
import { Button } from "@/components/ui/button";
import {
  parseConfirmation,
  readConfirmationRaw,
  subscribe,
} from "@/lib/bookings/clientStore";

export default function SuccessView() {
  const reference = (useSearchParams().get("ref") ?? "").toUpperCase();
  const raw = useSyncExternalStore(
    subscribe,
    () => readConfirmationRaw(reference),
    () => null
  );
  const booking = parseConfirmation(raw);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the reference is visible and selectable */
    }
  }

  if (!reference) {
    return (
      <div className="text-center">
        <h1 className="text-headline">No booking to show</h1>
        <p className="mt-3 text-muted-foreground">
          Start a search to book a flight, or look up an existing booking.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="brand"><Link href="/flights">Search flights</Link></Button>
          <Button asChild variant="outline"><Link href="/my-bookings">Manage booking</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-success-soft text-success-ink">
          <Check className="size-7" aria-hidden />
        </span>
        <h1 className="text-headline" tabIndex={-1}>You&apos;re booked</h1>
        <p className="mt-3 text-muted-foreground">
          Keep your booking reference. You&apos;ll need it with your email to view or cancel this booking.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-[1.75rem] border border-border bg-card px-5 py-3 shadow-card">
          <span className="text-2xl font-semibold tracking-wider tabular-nums">{reference}</span>
          <Button variant="outline" size="sm" onClick={copy} aria-label="Copy booking reference">
            {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <p className="sr-only" role="status">{copied ? "Booking reference copied" : ""}</p>
      </div>

      {booking ? (
        <BookingDetails booking={booking} />
      ) : (
        <p className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          Full details aren&apos;t available in this browser session. Use Manage booking with your reference and email to see them.
        </p>
      )}

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild variant="brand" size="lg">
          <Link href={`/my-bookings?ref=${encodeURIComponent(reference)}`}>Manage this booking</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/flights">Book another flight</Link>
        </Button>
      </div>
    </div>
  );
}
