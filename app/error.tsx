"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-[70vh] bg-surface pt-36">
      <Container className="max-w-xl text-center">
        <h1 className="text-headline">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">
          We hit an unexpected problem. Please try again.
        </p>
        <Button onClick={reset} size="lg" className="mt-8">
          Try again
        </Button>
      </Container>
    </main>
  );
}
