import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-surface pb-20 pt-24"
      aria-busy="true"
      aria-label="Loading flights"
    >
      <Container className="space-y-6">
        <Skeleton className="h-44 rounded-[1.75rem]" />
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <Skeleton className="hidden h-96 rounded-[1.75rem] lg:block" />
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-44 rounded-[1.75rem]" />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
