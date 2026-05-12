import MyBookingsHero from "@/components/my-bookings/MyBookingsHero";
import BookingLookupCard from "@/components/my-bookings/BookingLookupCard";
import BookingStatusPreview from "@/components/my-bookings/BookingStatusPreview";
import Footer from "@/components/layout/Footer";

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-[#050706]">
      <MyBookingsHero />

      <section className="relative overflow-hidden bg-[#050706] px-4 pb-28 pt-8 text-white sm:px-6">
        <div className="pointer-events-none absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-white/5 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <BookingLookupCard />
          <BookingStatusPreview />
        </div>
      </section>

      <Footer />
    </main>
  );
}