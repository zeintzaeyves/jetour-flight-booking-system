"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { PublicBooking } from "@/lib/bookings/serialize";
import { normalizeDate } from "@/lib/flights/search";
import { formatTime12 } from "@/lib/format";

// One SVG is both the on-screen ticket and the saved image, so they can never drift apart.
// Everything is drawn with literal colours and system fonts: an SVG rendered to an image
// can't see CSS variables or web fonts.
const W = 440;
const H = 860;
const FONT = "Helvetica, Arial, sans-serif";
const MONO = '"Courier New", Courier, monospace';

// Two quiet glass pieces with a notch at the top and bottom, like a torn stub.
const TOP =
  "M68 40H202A18 18 0 0 0 238 40H372A28 28 0 0 1 400 68V452A28 28 0 0 1 372 480H68A28 28 0 0 1 40 452V68A28 28 0 0 1 68 40Z";
const BOTTOM =
  "M68 492H372A28 28 0 0 1 400 520V792A28 28 0 0 1 372 820H238A18 18 0 0 0 202 820H68A28 28 0 0 1 40 792V520A28 28 0 0 1 68 492Z";

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

function splitRoute(route: string): { code: string; city: string }[] {
  return route.split(/→|->|\bto\b/i).map((part) => {
    const p = part.trim();
    const paren = p.match(/^(.*?)\s*\(([A-Za-z]{3})\)$/);
    if (paren) return { code: paren[2].toUpperCase(), city: paren[1] };
    if (/^[A-Za-z]{3}$/.test(p)) return { code: p.toUpperCase(), city: "" };
    return { code: p.slice(0, 3).toUpperCase(), city: p };
  });
}

function shortDay(iso: string): string {
  const d = normalizeDate(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", timeZone: "UTC" })
    .format(new Date(`${d}T00:00:00Z`))
    .toUpperCase();
}

function Field({ x, y, label, value }: { x: number; y: number; label: string; value: string }) {
  return (
    <g fontFamily={FONT}>
      <text x={x} y={y} fontSize="11" letterSpacing="1.6" fill="#ffffff" fillOpacity="0.5">
        {label}
      </text>
      <text x={x} y={y + 25} fontSize="18" fontWeight="500" fill="#ffffff">
        {value}
      </text>
    </g>
  );
}

export default function BookingTicket({ booking }: { booking: PublicBooking }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState(false);

  const [from, to] = splitRoute(booking.route);
  const ref = booking.bookingReference;
  const seat = booking.seatPreference.replace(/ seat$/i, "").replace(/^Any available$/i, "Any");

  async function toPng(): Promise<Blob> {
    const svg = svgRef.current;
    if (!svg) throw new Error("Ticket not ready");
    const xml = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not render the ticket"));
        img.src = url;
      });
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), "image/png")
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function save() {
    setBusy(true);
    try {
      const blob = await toPng();
      const name = `jetour-ticket-${ref}.png`;
      const file = new File([blob], name, { type: "image/png" });
      // On phones the share sheet offers "Save Image"; elsewhere a normal download.
      if (
        window.matchMedia("(pointer: coarse)").matches &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({ files: [file], title: `Jetour ticket ${ref}` });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        toast.success("Ticket saved as an image.");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return; // closed the share sheet
      toast.error("Couldn't save the ticket. Try a screenshot instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label="Your ticket" className="mx-auto w-full max-w-sm">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={`Ticket ${ref}: ${from?.code} to ${to?.code}, flight ${booking.flightNo}, ${shortDay(booking.departureDate)} at ${formatTime12(booking.departureTime)}`}
        className="h-auto w-full overflow-hidden rounded-[2rem]"
      >
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.09" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill="#0a0b0c" />

        {/* Glass pieces */}
        <path d={TOP} fill="url(#glass)" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1" />
        <path d={BOTTOM} fill="url(#glass)" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1" />
        <line x1="54" y1="486" x2="386" y2="486" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 5" />

        {/* Top: route */}
        <text x="220" y="92" textAnchor="middle" fontFamily={FONT} fontSize="11" letterSpacing="4" fill="#ffffff" fillOpacity="0.45">
          JETOUR
        </text>

        <g fontFamily={FONT} textAnchor="middle" fontWeight="500" fontSize="56" letterSpacing="-1.5" fill="#ffffff">
          <text x="108" y="250">{from?.code}</text>
          <text x="332" y="250">{to?.code}</text>
        </g>
        <path d="M190 234H250M241 225L250 234L241 243" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <g fontFamily={FONT} textAnchor="middle" fontSize="14" fill="#ffffff" fillOpacity="0.55">
          <text x="108" y="280">{clip(from?.city ?? "", 14)}</text>
          <text x="332" y="280">{clip(to?.city ?? "", 14)}</text>
        </g>

        <text x="220" y="372" textAnchor="middle" fontFamily={FONT} fontSize="14" fill="#ffffff" fillOpacity="0.8">
          {booking.flightNo} · {booking.classType}
        </text>

        <circle cx="170" cy="424" r="3" fill="#5fd397" />
        <text x="182" y="428" fontFamily={FONT} fontSize="11" letterSpacing="3" fill="#ffffff" fillOpacity="0.7">
          CONFIRMED
        </text>

        {/* Bottom: details */}
        <Field x={68} y={548} label="DATE" value={shortDay(booking.departureDate)} />
        <Field x={170} y={548} label="DEPARTS" value={formatTime12(booking.departureTime)} />
        <Field x={298} y={548} label="PAX" value={String(booking.passengers)} />
        <Field x={68} y={616} label="PASSENGER" value={clip(booking.fullName, 17)} />
        <Field x={298} y={616} label="SEAT" value={clip(seat, 9)} />

        <line x1="68" y1="690" x2="372" y2="690" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="68" y="730" fontFamily={FONT} fontSize="11" letterSpacing="1.6" fill="#ffffff" fillOpacity="0.5">
          BOOKING REFERENCE
        </text>
        <text
          x="68"
          y="772"
          fontFamily={MONO}
          fontWeight="700"
          fontSize={Math.min(30, 300 / (ref.length * 0.64))}
          letterSpacing="3"
          fill="#ffffff"
        >
          {ref}
        </text>
      </svg>

      <Button
        type="button"
        variant="brand"
        size="lg"
        className="mt-4 w-full"
        onClick={save}
        disabled={busy}
      >
        <Download aria-hidden />
        {busy ? "Preparing…" : "Save ticket as image"}
      </Button>
    </section>
  );
}
