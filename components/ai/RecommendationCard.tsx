import Link from "next/link";
import { Plane } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { normalizeDate } from "@/lib/flights/search";
import { formatDateShort, formatPeso, formatTime12 } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Flight } from "@/types/flight";

/** A compact flight card for AI surfaces. Every value shown is read from the flight record. */
export default function RecommendationCard({
  flight,
  labels = [],
  reason,
  passengers = 1,
  compact = false,
}: {
  flight: Flight;
  labels?: string[];
  reason?: string;
  passengers?: number;
  compact?: boolean;
}) {
  const date = normalizeDate(flight.departureDate);
  const stops = flight.stops ?? 0;
  return (
    <article
      aria-label={`${flight.airline} ${flight.flightNo}, ${flight.origin} to ${flight.destination}`}
      className={cn("rounded-[1.5rem] border border-white/10 bg-white/[0.04] text-left", compact ? "p-3.5" : "p-5")}
    >
      {labels.length ? (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {labels.map((l) => (
            <Badge key={l} variant="info">
              {l}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("flex items-center gap-2 font-semibold tracking-tight", compact ? "text-base" : "text-lg")}>
            {flight.originCode}
            <Plane aria-hidden className="size-3.5 rotate-90 text-muted-foreground" />
            {flight.destinationCode}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {flight.airline} · {flight.flightNo} · {flight.classType}
          </p>
        </div>
        <p className={cn("shrink-0 font-semibold tabular-nums", compact ? "text-base" : "text-lg")}>
          {formatPeso(flight.price)}
        </p>
      </div>

      <p className="mt-3 text-sm tabular-nums text-muted-foreground">
        {date ? `${formatDateShort(date)} · ` : ""}
        {formatTime12(flight.departureTime)} → {formatTime12(flight.arrivalTime)} · {flight.duration} ·{" "}
        {stops === 0 ? "Nonstop" : `${stops} stop${stops > 1 ? "s" : ""}`}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {flight.availableSeats} seat{flight.availableSeats === 1 ? "" : "s"} left · Baggage: {flight.baggage}
      </p>

      {reason ? <p className="mt-3 text-sm leading-6">{reason}</p> : null}

      <div className="mt-4 flex gap-2">
        <Button asChild size="sm" variant="brand">
          <Link href={`/booking/${encodeURIComponent(flight.flightNo)}?passengers=${passengers}`}>Select</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/flights/${encodeURIComponent(flight.flightNo)}`}>Details</Link>
        </Button>
      </div>
    </article>
  );
}
