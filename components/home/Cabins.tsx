import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container, Section } from "@/components/layout/Container";

const CABINS = [
  {
    name: "Economy",
    baggage: "15–20kg",
    blurb: "Everything you need at the lowest fare, with a checked bag included.",
  },
  {
    name: "Premium Economy",
    baggage: "30kg",
    blurb: "More baggage and a calmer evening departure for a little extra.",
  },
  {
    name: "Business",
    baggage: "40kg",
    blurb: "Our top cabin on long-haul routes, with the largest baggage allowance.",
  },
] as const;

export default function Cabins() {
  return (
    <Section id="cabins" className="scroll-mt-20 bg-surface">
      <Container>
        <div className="mb-10">
          <p className="text-eyebrow mb-3 text-brand-ink">Cabins</p>
          <h2 className="text-headline">Pick how you fly</h2>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {CABINS.map((c) => (
            <li key={c.name}>
              <Link
                href={`/flights?cabin=${encodeURIComponent(c.name)}`}
                className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-6 transition-colors hover:border-white/25 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-title">{c.name}</h3>
                  <ArrowUpRight
                    className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{c.blurb}</p>
                <p className="mt-6 border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">Checked baggage </span>
                  <span className="font-medium">{c.baggage}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
