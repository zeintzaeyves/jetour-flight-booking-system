import Link from "next/link";

import { Container } from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <main className="min-h-[70vh] bg-surface pt-36">
        <Container className="max-w-xl text-center">
          <p className="text-eyebrow text-brand-ink">404</p>
          <h1 className="text-headline mt-3">We couldn&apos;t find that page</h1>
          <p className="mt-4 text-muted-foreground">
            The page may have moved, or the flight may no longer exist.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link href="/flights">Search flights</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
