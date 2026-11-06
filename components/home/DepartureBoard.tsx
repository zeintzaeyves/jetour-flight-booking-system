"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { normalizeDate } from "@/lib/flights/search";
import type { Flight } from "@/types/flight";

const FONT = { fontFamily: 'var(--font-board), "Courier New", monospace' } as const;

/** One split-flap tile per character, like the boards in a terminal. */
function Flaps({ text, row, start = 0, className = "" }: { text: string; row: number; start?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-[3px] ${className}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          data-flap
          aria-hidden
          style={{ "--i": start + i, "--row": row } as React.CSSProperties}
          className="relative flex h-8 w-[1.3rem] items-center justify-center rounded-[3px] bg-[#0b0d0c] text-[1.05rem] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/80 sm:h-10 sm:w-[1.65rem] sm:text-[1.3rem]"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

const STATUS: Record<Flight["status"], string> = {
  Scheduled: "ON TIME",
  Delayed: "DELAYED",
  Cancelled: "CANCELLED",
  Completed: "DEPARTED",
};

function dayLabel(iso: string) {
  const d = normalizeDate(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat("en-PH", { day: "2-digit", month: "short", timeZone: "UTC" })
    .format(new Date(`${d}T00:00:00Z`))
    .toUpperCase();
}

/** Next departures, straight from the flight catalog. Hidden when there are none. */
export default function DepartureBoard({ flights }: { flights: Flight[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  // Start the flip animation when the board scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (flights.length === 0) return null;

  return (
    <section aria-label="Upcoming departures" className="pb-14 sm:pb-20">
      <Container>
        <div
          ref={ref}
          data-live={live}
          style={FONT}
          className="board overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#060807] shadow-pop"
        >
          <div className="flex items-end justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8 sm:py-5">
            <h2 className="text-lg font-semibold uppercase tracking-[0.25em] sm:text-xl">Departures</h2>
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">Next flights</p>
          </div>

          <div className="hidden grid-cols-[9.5rem_11.5rem_1fr_5rem_8rem] gap-4 px-8 py-3 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground md:grid">
            <span>Time</span>
            <span>Flight</span>
            <span>Destination</span>
            <span>Date</span>
            <span className="text-right">Status</span>
          </div>

          <ul>
            {flights.map((f, row) => {
              const status = STATUS[f.status] ?? f.status.toUpperCase();
              const trouble = f.status === "Delayed" || f.status === "Cancelled";
              return (
                <li key={f._id} className="border-t border-white/[0.07]">
                  <Link
                    href={`/flights/${f.flightNo}`}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-3 transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.06] focus-visible:outline-none sm:px-8 md:grid-cols-[9.5rem_11.5rem_1fr_5rem_8rem]"
                  >
                    <Flaps text={f.departureTime.replace(":", "").padEnd(4, "0").replace(/^(\d\d)(\d\d)$/, "$1:$2")} row={row} className="md:w-auto" />
                    <span className="hidden md:block">
                      <Flaps text={f.flightNo.replace("-", "").toUpperCase().slice(0, 5)} row={row} start={5} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-base font-medium uppercase tracking-wide sm:text-lg">
                        {f.destination}
                      </span>
                      <span className="block text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                        {f.originCode} → {f.destinationCode}
                        <span className="md:hidden"> · {f.flightNo} · {dayLabel(f.departureDate)}</span>
                      </span>
                    </span>
                    <span className="hidden text-sm tabular-nums md:block">{dayLabel(f.departureDate)}</span>
                    <span
                      className={`text-right text-xs font-semibold uppercase tracking-[0.15em] sm:text-sm ${
                        trouble ? "text-amber-300" : "text-foreground"
                      }`}
                    >
                      {status}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
