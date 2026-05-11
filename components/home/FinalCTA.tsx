"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Compass, PlaneTakeoff } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#050706] px-4 py-28 text-white sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-white/5 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] px-6 py-24 text-center shadow-2xl shadow-black/40 backdrop-blur-xl sm:px-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/55 backdrop-blur-xl">
            <Compass className="h-3.5 w-3.5" />
            Jetour Travel System
          </div>

          <h2 className="mx-auto max-w-5xl text-5xl font-semibold tracking-[-0.07em] text-white md:text-7xl lg:text-8xl">
            Book. Fly. Explore.
            <span className="block text-white/45">All in one flow.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
            A refined booking experience for curated routes, flight management,
            and seamless travel planning.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/flights">
                Explore Flights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 px-7 text-white backdrop-blur-xl hover:bg-white/10 hover:text-white"
            >
              <Link href="/admin">
                Open Console
                <PlaneTakeoff className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10" />
      </motion.div>
    </section>
  );
}