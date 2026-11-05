import Link from "next/link";
import { Plane } from "lucide-react";

import { Container } from "@/components/layout/Container";

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/zeintzaeyves/" },
  { label: "Facebook", href: "https://www.facebook.com/zeintzaeyves" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zeinkhalid/" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 text-foreground backdrop-blur-xl">
      <Container className="py-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-white text-black">
                <Plane className="size-4" aria-hidden />
              </span>
              Jetour
            </Link>
            <p className="mt-4 text-sm leading-6 text-foreground/65">
              Search flights, compare fares and reserve in a few steps.
            </p>
          </div>

          <nav aria-label="Footer" className="flex gap-12 text-sm">
            <ul className="space-y-3">
              <li className="text-eyebrow text-foreground/50">Travel</li>
              <li>
                <Link href="/flights" className="text-foreground/80 hover:text-foreground">
                  Flights
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="text-foreground/80 hover:text-foreground">
                  Manage booking
                </Link>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="text-eyebrow text-foreground/50">Follow</li>
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-foreground/55 sm:flex-row sm:justify-between">
          <p>© 2026 Zein Khalid Bulaclac. All rights reserved.</p>
          <p>A concept designed and developed by Zein Khalid.</p>
        </div>
      </Container>
    </footer>
  );
}
