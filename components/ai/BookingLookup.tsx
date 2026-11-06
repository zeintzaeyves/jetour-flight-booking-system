"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PublicBooking } from "@/lib/bookings/serialize";
import { formatDateShort, formatPeso, formatTime12 } from "@/lib/format";
import { normalizeDate } from "@/lib/flights/search";

/**
 * Booking status inside the assistant. The details never pass through the AI: this form talks to
 * the existing, rate-limited lookup endpoint, which requires BOTH the reference and the email.
 */
export default function BookingLookup() {
  const id = useId();
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<PublicBooking | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) {
        setError(res.status === 429 ? body?.message : body?.message || "We couldn't find a booking with those details.");
        return;
      }
      setBooking(body.data as PublicBooking);
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (booking) {
    const date = normalizeDate(booking.departureDate);
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-left" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-sm font-semibold tracking-wider">{booking.bookingReference}</p>
          <StatusBadge status={booking.status} />
        </div>
        <p className="mt-3 text-sm">{booking.route}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {booking.flightNo} · {date ? formatDateShort(date) : booking.departureDate} · {formatTime12(booking.departureTime)}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {booking.passengers} passenger{booking.passengers === 1 ? "" : "s"} · {booking.classType} · {formatPeso(booking.totalAmount)}
        </p>
        <Button asChild size="sm" variant="outline" className="mt-4">
          <Link href="/my-bookings">Manage or cancel</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-left">
      <p className="text-sm text-muted-foreground">Enter both to look up your booking. Your details are looked up directly and are never shared with the assistant.</p>
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-ref`}>Booking reference</Label>
        <Input id={`${id}-ref`} value={reference} onChange={(e) => setReference(e.target.value)} autoComplete="off" required maxLength={30} className="h-10 uppercase" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-email`}>Email used for the booking</Label>
        <Input id={`${id}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required maxLength={254} className="h-10" />
      </div>
      {error ? <p role="alert" className="text-sm text-danger-ink">{error}</p> : null}
      <Button type="submit" size="sm" variant="brand" disabled={busy || reference.trim().length < 4 || !email.includes("@")}>
        {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {busy ? "Looking up…" : "Check status"}
      </Button>
    </form>
  );
}
