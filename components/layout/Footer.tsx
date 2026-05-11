"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Our Team", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Flights", href: "/flights" },
      { label: "Payment", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Our Blog", href: "#" },
      { label: "Help", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "+63 917 123 4567", href: "tel:+639171234567" },
    ],
  },
];

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#050706] px-4 pb-10 pt-8 text-white sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-white/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-[url('/images/footer.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/55" />

          <div className="relative px-6 py-20 text-center sm:px-10 md:px-16 md:py-24">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/45">
              Private access
            </p>

            <h2 className="mx-auto max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">
              Refined routes and exclusive fares, delivered first.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              Subscribe to receive curated flight updates, limited offers, and
              premium destination releases from Jetour.
            </p>

            <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-full border border-white/10 bg-black/35 p-2 backdrop-blur-2xl sm:flex-row">
              <Input
                type="email"
                placeholder="Your email address"
                className="h-12 border-0 bg-transparent px-5 text-white placeholder:text-white/35 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <Button className="h-12 rounded-full px-6">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,0.8fr)]">
            <div>
              <Link
                href="/"
                className="text-2xl font-semibold tracking-[-0.06em] text-white"
              >
                Jetour
              </Link>

              <p className="mt-4 max-w-xs text-sm leading-7 text-white/45">
                A refined travel platform for booking flights, managing
                journeys, and exploring curated routes with ease.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <Link
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  FB
                </Link>

                <Link
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  X
                </Link>

                <Link
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  IG
                </Link>
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-medium text-white">
                  {column.title}
                </h3>

                <div className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-white/45 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/35">
              Copyright © 2026 Jetour. All rights reserved.
            </p>

            <button
              onClick={handleScrollTop}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}