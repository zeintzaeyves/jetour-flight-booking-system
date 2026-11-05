import Link from "next/link";
import { Luggage, Plane } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { computeTotal } from "@/lib/bookings/pricing";
import { formatDateShort, formatPeso, formatTime12 } from "@/lib/format";
import { normalizeDate } from "@/lib/flights/search";
import type { Flight } from "@/types/flight";

const LOW_SEATS = 5;

export default function FlightCard({
  flight,
  passengers = 1,
}: {
  flight: Flight;
  passengers?: number;
}) {
  const stops = flight.stops ?? 0;
  const date = normalizeDate(flight.departureDate);
  const href = `/booking/${encodeURIComponent(flight.flightNo)}?passengers=${passengers}`;

  return (
    <article
      aria-label={`${flight.airline} ${flight.flightNo}, ${flight.origin} to ${flight.destination}`}
      className="grid overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card transition-shadow hover:shadow-pop md:grid-cols-[1fr_15rem]"
    >
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="font-medium">{flight.airline}</span>
          <span className="text-muted-foreground">{flight.flightNo}</span>
          <Badge variant="neutral">{flight.classType}</Badge>
          {flight.tag && flight.tag !== "Available" ? (
            <Badge variant="info">{flight.tag}</Badge>
          ) : null}
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
          <div>
            <p className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
              {formatTime12(flight.departureTime)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{flight.originCode}</span>{" "}
              {flight.origin}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 px-1" aria-hidden>
            <span className="text-xs tabular-nums text-muted-foreground">
              {flight.duration}
            </span>
            <div className="flex w-full items-center gap-1.5 text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <Plane className="size-4 rotate-90" />
              <span className="h-px flex-1 bg-border" />
            </div>
            <span className="text-xs text-muted-foreground">
              {stops === 0 ? "Nonstop" : `${stops} stop${stops > 1 ? "s" : ""}`}
            </span>
          </div>

          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
              {formatTime12(flight.arrivalTime)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{flight.destinationCode}</span>{" "}
              {flight.destination}
            </p>
          </div>
        </div>
        <p className="sr-only">
          {flight.duration}, {stops === 0 ? "nonstop" : `${stops} stops`}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {date ? <span>{formatDateShort(date)}</span> : null}
          <span className="inline-flex items-center gap-1.5">
            <Luggage className="size-4" aria-hidden />
            {flight.baggage} baggage
          </span>
          {flight.availableSeats <= LOW_SEATS ? (
            <span className="font-medium text-warning-ink">
              Only {flight.availableSeats} seat{flight.availableSeats === 1 ? "" : "s"} left
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-4 border-t border-border bg-surface p-5 md:flex-col md:items-stretch md:justify-center md:border-l md:border-t-0">
        <div className="md:text-right">
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {formatPeso(flight.price)}
          </p>
          <p className="text-sm text-muted-foreground">per passenger</p>
          {passengers > 1 ? (
            <p className="mt-1 text-sm font-medium tabular-nums">
              {formatPeso(computeTotal(flight.price, passengers))} for {passengers}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild variant="brand">
            <Link href={href}>Select</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href={`/flights/${encodeURIComponent(flight.flightNo)}`}>
              Flight details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
