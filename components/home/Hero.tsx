import Image from "next/image";

import { Container } from "@/components/layout/Container";
import FlightSearchForm from "@/components/search/FlightSearchForm";
import type { Airport } from "@/lib/flights/service";

export default function Hero({ airports }: { airports: Airport[] }) {
  return (
    <section className="relative isolate overflow-hidden pb-12 pt-28 sm:pb-16 sm:pt-36">
      <Image
        src="/images/bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover opacity-45"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-[#050706]/40 via-[#050706]/70 to-[#050706]" />
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-display text-balance">
            Jetour
            <span className="block text-foreground/60">Book. Fly. Explore.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground text-pretty">
            Curated journeys. Effortless booking.
          </p>
        </div>
        <FlightSearchForm airports={airports} className="mt-10 sm:mt-12" />
      </Container>
    </section>
  );
}
