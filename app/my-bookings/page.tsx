import type { Metadata } from "next";

import { Container, PageHeader } from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import ManageBooking from "@/components/my-bookings/ManageBooking";

export const metadata: Metadata = {
  title: "Manage booking",
  robots: { index: false },
};

type PageProps = { searchParams: Promise<{ ref?: string }> };

export default async function MyBookingsPage({ searchParams }: PageProps) {
  const { ref } = await searchParams;
  // Only the reference is ever prefilled from the URL, never the email.
  const initialReference = (typeof ref === "string" ? ref : "").slice(0, 30).toUpperCase();

  return (
    <>
      <main className="min-h-screen bg-surface pb-20 pt-28">
        <Container className="max-w-3xl space-y-8">
          <PageHeader
            eyebrow="Manage booking"
            title="Find your reservation"
            description="Enter your booking reference and the email you booked with to view details or cancel."
          />
          <ManageBooking initialReference={initialReference} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
