import { notFound } from "next/navigation";

import BookingHero from "@/components/booking/BookingHero";
import PassengerForm from "@/components/booking/PassengerForm";
import BookingSummary from "@/components/booking/BookingSummary";
import Footer from "@/components/layout/Footer";
import { connectDB } from "@/lib/mongodb";
import FlightModel from "@/models/Flight";
import type { Flight } from "@/types/flight";

type BookingPageProps = {
  params: Promise<{
    flightId: string;
  }>;
};

async function getFlight(flightId: string): Promise<Flight | null> {
  await connectDB();

  const flight = await FlightModel.findOne({
    flightNo: flightId.toUpperCase(),
  }).lean();

  if (!flight) {
    return null;
  }

  return JSON.parse(JSON.stringify(flight));
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { flightId } = await params;
  const flight = await getFlight(flightId);

  if (!flight) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050706]">
      <BookingHero flight={flight} />

      <section className="relative overflow-hidden bg-[#050706] px-4 pb-28 pt-8 text-white sm:px-6">
        <div className="pointer-events-none absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-white/5 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <PassengerForm flightId={flight.flightNo} />
          <BookingSummary flight={flight} />
        </div>
      </section>

      <Footer />
    </main>
  );
}