import type { Metadata } from "next";
import Link from "next/link";

import { Container, PageHeader, Section } from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CREATOR } from "@/lib/site";

// Static case-study page: no database calls, so it is prerendered at build time.
export const metadata: Metadata = {
  title: "How it's built",
  description:
    "Case study: how Jetour handles seat inventory, pricing, booking status and AI safely, and how it is tested.",
};

const FACTS = [
  ["Role", CREATOR.role],
  ["Stack", "Next.js 16 · React 19 · TypeScript · Tailwind 4 · MongoDB · Zod"],
  ["Scope", "Customer site, booking flow, guest self-service, admin console, AI assistant"],
] as const;

const FEATURES = [
  ["Search that runs on the server", "Filter and sort by price, stops, airline and time. Results live in the URL, so a search can be shared."],
  ["Booking for a whole party", "Names for each passenger, seats held at the moment of booking, and a reference you can look up later."],
  ["Self-service without accounts", "Find or cancel a booking with the reference plus the email used. No sign-up."],
  ["Admin console", "Dashboard, flight create/edit/delete, and booking confirm/cancel behind a signed-cookie login."],
  ["AI assistant that can't make things up", "It turns plain text into searches and explains picks, but every flight, fare and seat count shown comes from the database."],
] as const;

const DECISIONS = [
  {
    title: "Seats can't be oversold",
    body: "Seats are never read and then written. One conditional update reserves them only if enough are left and the flight is still scheduled. In a test on real MongoDB, 6 parallel requests for 2 seats gave 2 bookings and 4 refusals.",
    code: `Flight.findOneAndUpdate(
  { flightNo, status: "Scheduled",
    availableSeats: { $gte: passengers } },
  { $inc: { availableSeats: -passengers } }
)`,
  },
  {
    title: "The server decides the price",
    body: "The total is computed from the flight record. The client can't send a price, cabin or status, and every input is checked with shared Zod schemas.",
  },
  {
    title: "Booking status is a state machine",
    body: "Pending → Confirmed → Cancelled, with no going back. Each change is a compare-and-set on the previous status, so two requests at once can't both win.",
  },
  {
    title: "Double-clicks don't double-book",
    body: "Each booking carries a client-generated idempotency key. A retry or a second click returns the same booking instead of making a new one.",
  },
  {
    title: "Admin is checked everywhere",
    body: "The proxy only does a quick first check. Every admin route handler checks the session again, and logins, lookups, cancels and bookings are rate-limited per IP.",
  },
  {
    title: "AI is grounded and capped",
    body: "The model can only ask for a fixed set of actions. Its wording is shown only if its prices, times and seat counts match the data exactly. A daily spending cap stops it when reached.",
  },
] as const;

const QUALITY = [
  ["90+", "unit tests (Vitest) for validation, pricing, references, status, search and rate limits"],
  ["1", "real-browser journey test: search → book → look up → cancel → admin"],
  ["0", "axe-core accessibility violations on every page, desktop and 390px mobile"],
  ["CI", "lint, typecheck, unit tests and a production build on every push"],
] as const;

const LIMITS = [
  "Payments are simulated. Nothing is charged and no card details are stored.",
  "Flights and fares are sample data, not a real airline's seats.",
  "No email confirmations yet, and round trips are booked as two one-way bookings.",
  "Accessibility was checked with automated tools; manual screen-reader testing is still to do.",
] as const;

const card = "rounded-[1.75rem] border border-border bg-card p-6 sm:p-8";

export default function HowItsBuiltPage() {
  return (
    <>
      <main className="bg-surface pt-28">
        <Section className="pt-8 sm:pt-12 lg:pt-16">
          <Container>
            <PageHeader
              eyebrow="Case study"
              title="How Jetour is built"
              description="Jetour is a full-stack flight booking app I designed and built end to end. This page covers the decisions that make it hold up under real use, and what is still out of scope."
            >
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="brand" size="lg">
                  <Link href="/flights">Try a booking</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={CREATOR.source} target="_blank" rel="noopener noreferrer">
                    View source on GitHub
                  </a>
                </Button>
              </div>
            </PageHeader>

            <dl className="mt-14 grid gap-4 md:grid-cols-3">
              {FACTS.map(([term, value]) => (
                <div key={term} className="border-t border-border pt-5">
                  <dt className="text-eyebrow text-foreground/50">{term}</dt>
                  <dd className="mt-3 text-sm leading-6 text-foreground/85">{value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        <Section className="pt-0 sm:pt-0 lg:pt-0">
          <Container>
            <h2 className="text-headline mb-10">What it does</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(([title, body]) => (
                <li key={title} className={card}>
                  <h3 className="text-title">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <Section className="pt-0 sm:pt-0 lg:pt-0">
          <Container>
            <div className="mb-10 max-w-2xl">
              <p className="text-eyebrow mb-3 text-brand-ink">Engineering</p>
              <h2 className="text-headline text-balance">Decisions that keep the data honest</h2>
            </div>
            <ol className="grid gap-4 lg:grid-cols-2">
              {DECISIONS.map((d, i) => (
                <li key={d.title} className={card}>
                  <p className="text-sm font-medium tabular-nums text-brand-ink">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-title mt-3">{d.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{d.body}</p>
                  {"code" in d ? (
                    <pre
                      className="mt-5 overflow-x-auto rounded-2xl border border-border bg-black/40 p-4 text-xs leading-5 text-foreground/85"
                      style={{ fontFamily: 'var(--font-board), "Courier New", monospace' }}
                    >
                      <code>{d.code}</code>
                    </pre>
                  ) : null}
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        <Section className="pt-0 sm:pt-0 lg:pt-0">
          <Container>
            <h2 className="text-headline mb-10">How it&apos;s tested</h2>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {QUALITY.map(([stat, label]) => (
                <li key={label} className="border-t border-border pt-5">
                  <p className="text-headline tabular-nums">{stat}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{label}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <Section className="pt-0 sm:pt-0 lg:pt-0">
          <Container>
            <div className={`${card} grid gap-8 lg:grid-cols-[1fr_1.4fr]`}>
              <div>
                <p className="text-eyebrow mb-3 text-brand-ink">Scope</p>
                <h2 className="text-headline text-balance">What isn&apos;t real (yet)</h2>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {LIMITS.map((l) => (
                  <li key={l} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
