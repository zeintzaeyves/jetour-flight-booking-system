import { cn } from "@/lib/utils";

/** Page-width wrapper: 16px gutter on mobile, 24px from sm. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", className)}
      {...props}
    />
  );
}

/** Vertical rhythm for page sections. */
export function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return <section className={cn("py-12 sm:py-16 lg:py-24", className)} {...props} />;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="text-eyebrow mb-3 text-brand-ink">{eyebrow}</p>
      ) : null}
      <h1 className="text-headline text-balance">{title}</h1>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}
