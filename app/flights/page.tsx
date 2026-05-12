import FareInsights from "@/components/flights/FareInsights";
import FlightFilters from "@/components/flights/FlightFilters";
import FlightResults from "@/components/flights/FlightResults";
import FlightResultsHeader from "@/components/flights/FlightResultsHeader";
import FlightsHero from "@/components/flights/FlightsHero";
import ModifySearchBar from "@/components/flights/ModifySearchBar";
import RecommendedRoute from "@/components/flights/RecommendedRoute";
import Footer from "@/components/layout/Footer";

export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-[#050706]">
      <FlightsHero />

      <section className="relative overflow-hidden bg-[#050706] px-4 pb-24 pt-6 text-white sm:px-6">
        <div className="pointer-events-none absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-white/5 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">
          <ModifySearchBar />
          <FareInsights />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              <RecommendedRoute />
              <FlightResultsHeader />
              <FlightResults />
            </div>

            <FlightFilters />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}