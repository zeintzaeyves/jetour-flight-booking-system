import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plane } from "lucide-react";

import { Container } from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { isBookable, normalizeDate } from "@/lib/flights/search";
import { getFlightByNo } from "@/lib/flights/service";
import { formatDateShort, formatPeso, formatTime12 } from "@/lib/format";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const flight = await getFlightByNo(decodeURIComponent((await params).id));
  return {
    title: flight
      ? `${flight.origin} to ${flight.destination} · ${flight.flightNo}`
      : "Flight not found",
  };
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{children}</dd>
    </div>
  );
}

export default async function FlightDetailsPage({ params }: PageProps) {
  const flight = await getFlightByNo(decodeURIComponent((await params).id));
  if (!flight) notFound();

  const stops = flight.stops ?? 0;
  const date = normalizeDate(flight.departureDate);
  const bookable = isBookable(flight, 1);

  return (
    <>
      <main className="min-h-screen bg-surface pb-20 pt-24">
        <Container className="space-y-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/flights" className="hover:text-foreground">Flights</Link>
            <span aria-hidden> / </span>
            <span aria-current="page" className="text-foreground">{flight.flightNo}</span>
          </nav>

          <header>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={flight.status} />
              <span className="text-sm text-muted-foreground">
                {flight.airline} · {flight.flightNo}
              </span>
            </div>
            <h1 className="text-headline">
              {flight.origin} to {flight.destination}
            </h1>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-6">
              <section aria-label="Itinerary" className="rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-8">
                <p className="mb-6 text-sm text-muted-foreground">
                  {date ? formatDateShort(date) : flight.departureDate}
                </p>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-8">
                  <div>
                    <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
                      {formatTime12(flight.departureTime)}
                    </p>
                    <p className="mt-1.5 text-sm font-medium">{flight.originCode}</p>
                    <p className="text-sm text-muted-foreground">{flight.origin}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5" aria-hidden>
                    <span className="text-xs tabular-nums text-muted-foreground">{flight.duration}</span>
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
                    <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
                      {formatTime12(flight.arrivalTime)}
                    </p>
                    <p className="mt-1.5 text-sm font-medium">{flight.destinationCode}</p>
                    <p className="text-sm text-muted-foreground">{flight.destination}</p>
                  </div>
                </div>
                <p className="sr-only">
                  {flight.duration}, {stops === 0 ? "nonstop" : `${stops} stops`}
                </p>
              </section>

              <section aria-label="Flight details" className="rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-8">
                <h2 className="text-title mb-2">Flight details</h2>
                <dl className="grid divide-y divide-border sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0">
                  <Spec label="Airline">{flight.airline}</Spec>
                  <Spec label="Flight number">{flight.flightNo}</Spec>
                  <Spec label="Cabin">{flight.classType}</Spec>
                  <Spec label="Baggage">{flight.baggage} per passenger</Spec>
                  <Spec label="Duration">{flight.duration}</Spec>
                  <Spec label="Seats">
                    {flight.availableSeats === 0
                      ? "Sold out"
                      : flight.availableSeats <= 5
                        ? `Only ${flight.availableSeats} left`
                        : "Available"}
                  </Spec>
                </dl>
              </section>
            </div>

            <aside aria-label="Fare" className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-card">
                <p className="text-eyebrow text-muted-foreground">Fare</p>
                <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight">
                  {formatPeso(flight.price)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  per passenger · all-inclusive
                </p>
                {bookable ? (
                  <Button asChild variant="brand" size="lg" className="mt-6 w-full">
                    <Link href={`/booking/${encodeURIComponent(flight.flightNo)}`}>
                      Book this flight
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="mt-6 w-full" disabled>
                      Not available to book
                    </Button>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {flight.status !== "Scheduled"
                        ? `This flight is ${flight.status.toLowerCase()}.`
                        : "This flight has no seats left."}
                    </p>
                  </>
                )}
                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  Pay online or in person (demo payment, nothing is charged). Seats are reserved under a booking reference.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
