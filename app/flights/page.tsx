import FlightsHero from "@/components/flights/FlightsHero";
import FlightFilters from "@/components/flights/FlightFilters";
import FlightResults from "@/components/flights/FlightResults";
import FlightResultsHeader from "@/components/flights/FlightResultsHeader";
import Footer from "@/components/layout/Footer";

export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-[#050706]">
      <FlightsHero />

      <section className="relative overflow-hidden bg-[#050706] px-4 pb-28 pt-8 text-white sm:px-6">
        <div className="pointer-events-none absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-white/5 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">
          <FlightResultsHeader />

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <FlightFilters />
            <FlightResults />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}