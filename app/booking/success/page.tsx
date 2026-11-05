import type { Metadata } from "next";
import { Suspense } from "react";

import SuccessView from "@/components/booking/SuccessView";
import { Container } from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false },
};

export default function BookingSuccessPage() {
  return (
    <>
      <main className="min-h-screen bg-surface pb-20 pt-28">
        <Container className="max-w-3xl">
          <Suspense fallback={null}>
            <SuccessView />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
}
