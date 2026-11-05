import { Container, Section } from "@/components/layout/Container";

const STEPS = [
  ["Search", "Pick your route, dates and passengers."],
  ["Compare", "Sort and filter by price, time, stops and airline."],
  [
    "Reserve",
    "Add passenger details and get a booking reference you can look up any time.",
  ],
] as const;

export default function HowItWorks() {
  return (
    <Section>
      <Container>
        <h2 className="text-headline mb-10">How it works</h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="border-t border-border pt-5">
              <p className="text-sm font-medium tabular-nums text-brand-ink">
                0{i + 1}
              </p>
              <h3 className="text-title mt-3">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
