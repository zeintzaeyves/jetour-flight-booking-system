import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container, Section } from "@/components/layout/Container";
import { formatPeso } from "@/lib/format";
import type { NetworkSummary } from "@/lib/flights/service";

// Photography we have; any other destination gets a plain card.
const PHOTOS: Record<string, string> = {
  NRT: "/images/tokyo.jpg",
  HND: "/images/tokyo.jpg",
  ICN: "/images/seoul.jpg",
  SIN: "/images/singapore.jpg",
  BKK: "/images/bangkok.jpg",
};

const FALLBACK = [
  { code: "NRT", city: "Tokyo" },
  { code: "ICN", city: "Seoul" },
  { code: "SIN", city: "Singapore" },
  { code: "BKK", city: "Bangkok" },
];

export default function PopularRoutes({
  network,
}: {
  network: NetworkSummary;
}) {
  // Only destinations we have photography for, first three.
  const places = (network.destinations.length ? network.destinations : FALLBACK)
    .filter((p) => PHOTOS[p.code])
    .slice(0, 3);

  return (
    <Section id="destinations" className="scroll-mt-20">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow mb-3 text-brand-ink">Destinations</p>
            <h2 className="text-headline">Where to next</h2>
          </div>
          <Link
            href="/flights"
            className="hidden text-sm font-medium text-brand-ink hover:underline sm:block"
          >
            All flights
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {places.map((p) => {
            const photo = PHOTOS[p.code];
            const price = network.fromPrice[p.code];
            return (
              <li key={p.code}>
                <Link
                  href={`/flights?to=${p.code}`}
                  className="group relative block aspect-[4/3] overflow-hidden sm:aspect-[4/5] rounded-[1.75rem] bg-muted shadow-card ring-1 ring-border transition-shadow hover:shadow-pop"
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="absolute inset-0 flex items-start justify-end bg-gradient-to-br from-brand/25 via-white/[0.06] to-white/[0.02] p-4 text-6xl font-semibold tracking-tighter text-white/15"
                    >
                      {p.code}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                    <div>
                      <p className="text-lg font-semibold leading-tight">
                        {p.city}
                      </p>
                      <p className="mt-0.5 text-sm text-white/80">
                        {price !== undefined
                          ? `From ${formatPeso(price)}`
                          : "View flights"}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="size-5 opacity-80 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                  <span className="sr-only">Flights to {p.city}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
