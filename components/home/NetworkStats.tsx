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
    [String(network.flightCount), "Upcoming flights"],
    [formatPeso(Math.min(...fares)), "Lowest fare"],
  ] as const;

  return (
    <section aria-label="Network at a glance" className="border-y border-border bg-surface">
      <Container>
        <dl className="grid grid-cols-2 gap-y-6 py-8 sm:py-10 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="px-2 text-center lg:border-l lg:border-border lg:first:border-l-0"
            >
              <dd className="text-headline tabular-nums">{value}</dd>
              <dt className="mt-1.5 text-sm text-muted-foreground">{label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
