import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/zeintzaeyves/" },
  { label: "Facebook", href: "https://www.facebook.com/zeintzaeyves" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zeinkhalid/" },
];

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Flights", href: "/flights" },
      { label: "Destinations", href: "/#destinations" },
      { label: "Cabins", href: "/#cabins" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Your booking",
    links: [
      { label: "Manage booking", href: "/my-bookings" },
      { label: "Admin sign-in", href: "/admin/login" },
    ],
  },
];

const linkClass =
  "text-foreground/70 transition-colors hover:text-foreground";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black/40 text-foreground backdrop-blur-xl">
      <Container className="relative z-10 pt-14 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Jetour home"
              className="inline-block rounded-md text-2xl font-semibold leading-none tracking-[-0.04em]"
            >
              Jetour
            </Link>
            <p className="mt-4 text-sm leading-6 text-foreground/65">
              Search flights, compare fares and reserve in a few steps. No account needed.
            </p>
            <Button asChild variant="brand" size="sm" className="mt-6">
              <Link href="/flights">Book a flight</Link>
            </Button>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3"
          >
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="text-eyebrow text-foreground/50">{col.title}</h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="text-eyebrow text-foreground/50">Follow</h2>
              <ul className="mt-4 space-y-3">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-foreground/55 sm:flex-row sm:justify-between">
          <p>© 2026 Zein Khalid Bulaclac. All rights reserved.</p>
          <p>Demo project: sample flights and fares. Payments are simulated.</p>
        </div>
      </Container>

      {/* Oversized wordmark, cropped by the bottom edge and faded out. */}
      <div
        aria-hidden
        className="pointer-events-none relative -mb-[0.1em] mt-4 select-none text-center text-[clamp(5rem,23vw,20rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_oklch(1_0_0/0.22)] [mask-image:linear-gradient(to_bottom,black_35%,transparent_100%)]"
      >
        Jetour
      </div>
    </footer>
  );
}
