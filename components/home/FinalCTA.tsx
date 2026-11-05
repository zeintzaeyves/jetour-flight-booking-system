import Link from "next/link";

import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <Section className="pt-0 sm:pt-0 lg:pt-0">
      <Container>
        <div className="rounded-[2rem] border border-border bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
          <h2 className="text-headline text-balance">Ready when you are</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
            See every upcoming flight, or jump to a booking you already made.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link href="/flights">Browse flights</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/my-bookings">Manage booking</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
