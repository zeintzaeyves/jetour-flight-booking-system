import HeroSection from "@/components/home/HeroSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedFlightDeals from "@/components/home/FeaturedFlightDeals";
import HowJetourWorks from "@/components/home/HowJetourWorks";
import AdminCMSPreview from "@/components/home/AdminCMSPreview";
import FinalCTA from "@/components/home/FinalCTA";
import CreatorCredit from "@/components/home/CreatorCredit";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050706]">
      <HeroSection />
      <PopularDestinations />
      <FeaturedFlightDeals />
      <HowJetourWorks />
      <AdminCMSPreview />
      <FinalCTA />
      <CreatorCredit />
      <Footer />
    </main>
  );
}