"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  hint: string;
  /** Hidden in the bar below lg (always present in the mobile menu). */
  wide?: boolean;
};

// Explore: where you go. Account: what you do with a booking you already have.
const EXPLORE: NavLink[] = [
  { href: "/flights", label: "Flights", hint: "Search and compare every departure" },
  { href: "/#destinations", label: "Destinations", hint: "Where Jetour flies, with fares from" },
  { href: "/#cabins", label: "Cabins", hint: "Economy, Premium Economy and Business", wide: true },
  { href: "/#faq", label: "FAQ", hint: "Payments, changes and cancellations", wide: true },
];
const ACCOUNT: NavLink[] = [
  { href: "/my-bookings", label: "Manage booking", hint: "Look up or cancel with your reference" },
  { href: "/admin/login", label: "Admin", hint: "Staff sign-in for flights and bookings", wide: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Nearly clear over the hero, then a firmer glass once content scrolls beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The admin console has its own chrome.
  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  // Full-height links so the active/hover underline sits on the bar's bottom edge.
  const barLink = (l: NavLink, muted = false) => (
    <Link
      key={l.href}
      href={l.href}
      aria-current={isActive(l.href) ? "page" : undefined}
      className={cn(
        "relative flex h-full items-center px-3.5 text-sm font-medium transition-colors hover:text-foreground",
        "after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100",
        isActive(l.href) ? "text-foreground" : muted ? "text-muted-foreground/80" : "text-muted-foreground",
        l.wide && "hidden lg:flex"
      )}
    >
      {l.label}
    </Link>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-2xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-white/12 bg-black/65 shadow-card"
          : "border-white/8 bg-black/25"
      )}
    >
      <Container className="flex h-16 items-center">
        <Link
          href="/"
          aria-label="Jetour home"
          className="rounded-md text-xl font-semibold leading-none tracking-[-0.04em] transition-opacity hover:opacity-80"
        >
          Jetour
        </Link>

        <span aria-hidden className="mx-6 hidden h-5 w-px bg-white/15 md:block" />

        <nav aria-label="Main" className="hidden h-full md:flex">
          {EXPLORE.map((l) => barLink(l))}
        </nav>

        <div className="ml-auto flex h-full items-center">
          <nav aria-label="Account" className="hidden h-full md:flex">
            {ACCOUNT.map((l) => barLink(l, true))}
          </nav>
          <Button asChild variant="brand" size="sm" className="ml-3 hidden md:inline-flex">
            <Link href="/flights">Book a flight</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,90vw)]">
              <SheetTitle className="px-6 pt-6 text-2xl font-semibold tracking-[-0.04em]">
                Jetour
              </SheetTitle>
              <p className="px-6 text-sm text-muted-foreground">Book. Fly. Explore.</p>
              <nav aria-label="Mobile" className="flex flex-col p-4">
                {[
                  ["Explore", EXPLORE],
                  ["Your booking", ACCOUNT],
                ].map(([title, links]) => (
                  <div key={title as string} className="mt-3 first:mt-0">
                    <p className="text-eyebrow px-3 pb-1 pt-2 text-muted-foreground">
                      {title as string}
                    </p>
                    {(links as NavLink[]).map((l) => (
                      <SheetClose asChild key={l.href}>
                        <Link
                          href={l.href}
                          aria-current={isActive(l.href) ? "page" : undefined}
                          className={cn(
                            "block rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted",
                            isActive(l.href) && "bg-muted"
                          )}
                        >
                          <span className="block text-base font-medium text-foreground">
                            {l.label}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted-foreground">
                            {l.hint}
                          </span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                ))}
                <SheetClose asChild>
                  <Button asChild variant="brand" size="lg" className="mt-5">
                    <Link href="/flights">Book a flight</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
