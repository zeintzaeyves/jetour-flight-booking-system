import FlightDetailsHero from "@/components/flights/FlightDetailsHero";
import FlightDetailsCard from "@/components/flights/FlightDetailsCard";
import FlightFareSummary from "@/components/flights/FlightFareSummary";
import Footer from "@/components/layout/Footer";

type FlightDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FlightDetailsPage({
  params,
}: FlightDetailsPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#050706]">
      <FlightDetailsHero flightId={id} />

      <section className="relative overflow-hidden bg-[#050706] px-4 pb-28 pt-8 text-white sm:px-6">
        <div className="pointer-events-none absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-white/5 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <FlightDetailsCard flightId={id} />
          <FlightFareSummary flightId={id} />
        </div>
      </section>

      <Footer />
    </main>
  );
}