"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function FlightsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-surface pt-32">
      <Container className="max-w-xl text-center">
        <h1 className="text-headline">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t show this page. Please try again.
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </Container>
    </main>
  );
}
