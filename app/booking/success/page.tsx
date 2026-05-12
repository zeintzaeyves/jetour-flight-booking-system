import BookingSuccessCard from "@/components/booking/BookingSuccessCard";
import Footer from "@/components/layout/Footer";

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-[#050706]">
      <section className="relative overflow-hidden bg-[#050706] px-4 pb-28 pt-32 text-white sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[160px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-sky-500/10 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl">
          <BookingSuccessCard />
        </div>
      </section>

      <Footer />
    </main>
  );
}