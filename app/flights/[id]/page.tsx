import { notFound } from "next/navigation";

import FlightDetailsHero from "@/components/flights/FlightDetailsHero";
import FlightDetailsCard from "@/components/flights/FlightDetailsCard";
import FlightFareSummary from "@/components/flights/FlightFareSummary";
import Footer from "@/components/layout/Footer";
import { connectDB } from "@/lib/mongodb";
import FlightModel from "@/models/Flight";
import type { Flight } from "@/types/flight";

type FlightDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getFlight(id: string): Promise<Flight | null> {
  await connectDB();

  const flight = await FlightModel.findOne({
    flightNo: id.toUpperCase(),
  }).lean();

  if (!flight) {
    return null;
  }

  return JSON.parse(JSON.stringify(flight));
}

export default async function FlightDetailsPage({
  params,
}: FlightDetailsPageProps) {
  const { id } = await params;
  const flight = await getFlight(id);

  if (!flight) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050706]">
      <FlightDetailsHero flight={flight} />

      <section className="relative overflow-hidden bg-[#050706] px-4 pb-28 pt-8 text-white sm:px-6">
        <div className="pointer-events-none absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-white/5 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <FlightDetailsCard flight={flight} />
          <FlightFareSummary flight={flight} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
