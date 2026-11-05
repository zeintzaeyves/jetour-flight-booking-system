import FlightCard from "@/components/flights/FlightCard";
import { Container, Section } from "@/components/layout/Container";
import type { Flight } from "@/types/flight";

export default function FeaturedFares({ flights }: { flights: Flight[] }) {
  if (flights.length === 0) return null;
  return (
    <Section className="bg-surface">
      <Container>
        <div className="mb-8">
          <p className="text-eyebrow mb-3 text-brand-ink">Fares</p>
          <h2 className="text-headline">Lowest fares right now</h2>
        </div>
        <div className="space-y-4">
          {flights.slice(0, 3).map((f) => (
            <FlightCard key={f._id} flight={f} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
