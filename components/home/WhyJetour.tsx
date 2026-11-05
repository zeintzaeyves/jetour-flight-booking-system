import { Container, Section } from "@/components/layout/Container";

const REASONS = [
  [
    "Clear fares",
    "The price on the card is the price you reserve at. Per-passenger and total fares are always shown together.",
  ],
  [
    "Honest availability",
    "Only flights with enough seats for your party appear, and seats are held the moment you reserve.",
  ],
  [
    "Filters that help",
    "Narrow by price, stops, airline and departure time without losing your search.",
  ],
  [
    "Self-service booking",
    "Look up or cancel any reservation with your reference and email. No account needed.",
  ],
] as const;

export default function WhyJetour() {
  return (
    <Section>
      <Container>
        <div className="mb-10 max-w-2xl">
          <p className="text-eyebrow mb-3 text-brand-ink">Why Jetour</p>
          <h2 className="text-headline text-balance">Booking that stays out of your way</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground text-pretty">
            A focused flight search built around what you actually compare: price, timing and
            stops.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {REASONS.map(([title, body]) => (
            <li
              key={title}
              className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-8"
            >
              <h3 className="text-title">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
