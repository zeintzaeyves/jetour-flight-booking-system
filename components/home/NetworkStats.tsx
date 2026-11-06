import { Container } from "@/components/layout/Container";
import { formatPeso } from "@/lib/format";
import type { NetworkSummary } from "@/lib/flights/service";

/** Live numbers from the flight catalog. Hidden when there is no data, never invented. */
export default function NetworkStats({ network }: { network: NetworkSummary }) {
  const fares = Object.values(network.fromPrice);
  if (network.flightCount === 0 || fares.length === 0) return null;
  const stats = [
    [String(network.destinations.length), "Destinations"],
    [String(network.routeCount), "Routes"],
    [String(network.flightCount), "Flights"],
    [formatPeso(Math.min(...fares)), "Lowest fare"],
  ] as const;

  return (
    <section aria-label="Network at a glance" className="py-14 sm:py-20">
      <Container>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map(([value, label], i) => (
            <div key={label} className="border-t border-white/25 pt-4">
              <dt className="flex items-baseline justify-between text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {label}
                <span aria-hidden className="tabular-nums">0{i + 1}</span>
              </dt>
              <dd className="mt-6 text-5xl font-light leading-none tracking-tighter tabular-nums sm:text-6xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
