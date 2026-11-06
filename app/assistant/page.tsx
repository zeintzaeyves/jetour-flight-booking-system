import type { Metadata } from "next";

import AssistantExperience from "@/components/ai/AssistantExperience";
import { Container } from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Assistant",
  description: "Ask Jetour about flights, check a booking, or plan a trip.",
};

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AssistantPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tab = first(sp.tab) === "plan" ? "plan" : "ask";
  const q = (first(sp.q) ?? "").slice(0, 400);

  return (
    <>
      <main className="min-h-screen bg-surface pb-20 pt-28">
        <Container className="space-y-8">
          <header className="max-w-2xl">
            <p className="text-eyebrow mb-3 text-brand-ink">Assistant</p>
            <h1 className="text-headline text-balance">Ask, search or plan, in your own words</h1>
            <p className="mt-3 text-muted-foreground">
              Find flights, check a booking, or get trip ideas tied to real Jetour fares. It can&apos;t book or change anything for you.
            </p>
          </header>
          <AssistantExperience initialTab={tab} initialQuery={q} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
