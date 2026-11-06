import DepartureBoard from "@/components/home/DepartureBoard";
import Cabins from "@/components/home/Cabins";
import Faq from "@/components/home/Faq";
import FeaturedFares from "@/components/home/FeaturedFares";
import FinalCta from "@/components/home/FinalCta";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import NetworkStats from "@/components/home/NetworkStats";
import PopularRoutes from "@/components/home/PopularRoutes";
import WhyJetour from "@/components/home/WhyJetour";
import Footer from "@/components/layout/Footer";
import { getNetworkSummary } from "@/lib/flights/service";

// Refresh live fares and routes at most every 5 minutes.
export const revalidate = 300;

export default async function Home() {
  const network = await getNetworkSummary();
  const airports = [
    ...new Map(
      [...network.origins, ...network.destinations].map((a) => [a.code, a])
    ).values(),
  ].sort((a, b) => a.city.localeCompare(b.city));

  return (
    <>
      <main>
        <Hero airports={airports} />
        <NetworkStats network={network} />
        <DepartureBoard flights={network.upcoming} />
        <PopularRoutes network={network} />
        <FeaturedFares flights={network.cheapest} />
        <WhyJetour />
        <Cabins />
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
