import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaneTakeoff } from "lucide-react";

import BookingForm from "@/components/booking/BookingForm";
import { Container } from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { isBookable } from "@/lib/flights/search";
import { getFlightByNo } from "@/lib/flights/service";

type PageProps = {
  params: Promise<{ flightId: string }>;
  searchParams: Promise<{ passengers?: string }>;
};

export const metadata: Metadata = { title: "Book your flight" };

export default async function BookingPage({ params, searchParams }: PageProps) {
  const { flightId } = await params;
  const { passengers } = await searchParams;
  const flight = await getFlightByNo(decodeURIComponent(flightId));
  if (!flight) notFound();

  const requested = Math.floor(Number(passengers)) || 1;
  const bookable = isBookable(flight, 1);

  return (
    <>
      <main className="min-h-screen bg-surface pb-20 pt-24">
        <Container className="space-y-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/flights" className="hover:text-foreground">Flights</Link>
            <span aria-hidden> / </span>
            <Link href={`/flights/${flight.flightNo}`} className="hover:text-foreground">
              {flight.flightNo}
            </Link>
            <span aria-hidden> / </span>
            <span aria-current="page" className="text-foreground">Book</span>
          </nav>

          <h1 className="text-headline">Complete your booking</h1>

          {bookable ? (
            <BookingForm flight={flight} defaultPassengers={requested} />
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-card px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
                <PlaneTakeoff className="size-5 text-muted-foreground" aria-hidden />
              </div>
              <h2 className="text-title">This flight can&apos;t be booked</h2>
              <p className="mx-auto mt-2 mb-6 max-w-md text-sm leading-6 text-muted-foreground">
                {flight.status !== "Scheduled"
                  ? `${flight.flightNo} is ${flight.status.toLowerCase()}.`
                  : `${flight.flightNo} has no seats left.`}{" "}
                Search for another flight on this route.
              </p>
              <Button asChild>
                <Link href={`/flights?from=${flight.originCode}&to=${flight.destinationCode}`}>
                  See other flights
                </Link>
              </Button>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
