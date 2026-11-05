import { Container, Section } from "@/components/layout/Container";

const QUESTIONS = [
  [
    "Do I need an account to book?",
    "No. Enter passenger details and you get a booking reference straight away.",
  ],
  [
    "Is payment taken when I reserve?",
    "No. Jetour is a reservation demo, so no payment is collected and no card details are asked for.",
  ],
  [
    "How do I find or cancel a booking?",
    "Open Manage booking and enter your reference and the email used. From there you can view or cancel it.",
  ],
  [
    "Can I change a booking?",
    "Not directly. Cancel the reservation and book the flight you want instead.",
  ],
  [
    "Can I book a round trip?",
    "Yes. Each direction is reserved as its own booking, so you can pick different times for each.",
  ],
  [
    "Are these real airline flights?",
    "No. The flights, carriers and fares on this site are sample data for demonstration.",
  ],
] as const;

export default function Faq() {
  return (
    <Section id="faq" className="scroll-mt-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-eyebrow mb-3 text-brand-ink">FAQ</p>
          <h2 className="text-headline text-balance">Questions, answered</h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {QUESTIONS.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <span
                  aria-hidden
                  className="text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-prose text-sm leading-6 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
