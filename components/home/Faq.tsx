import { Container, Section } from "@/components/layout/Container";
import { FAQ } from "@/lib/content/faq";

export default function Faq() {
  return (
    <Section id="faq" className="scroll-mt-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-eyebrow mb-3 text-brand-ink">FAQ</p>
          <h2 className="text-headline text-balance">Questions, answered</h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {FAQ.map(([q, a]) => (
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
