"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  UsersRound,
} from "lucide-react";

export default function FlightsHero() {
  return (
    <section className="relative overflow-hidden bg-[#050706] px-4 pb-10 pt-32 text-white sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[150px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[360px] w-[360px] rounded-full bg-white/5 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/50 backdrop-blur-xl">
                <Search className="h-3.5 w-3.5" />
                Flight Search
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-white md:text-7xl">
                Select your route.
                <span className="block text-white/45">Fly with ease.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
                Browse selected Jetour routes, compare fares, and continue to a
                refined booking flow.
              </p>
            </div>

            <div className="w-full rounded-[2rem] border border-white/10 bg-black/25 p-3 shadow-2xl shadow-black/20 backdrop-blur-2xl lg:min-w-[560px]">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs text-white/45">
                    <MapPin className="h-3.5 w-3.5" />
                    Route
                  </div>

                  <p className="mt-1 text-sm font-medium text-white">
                    Manila{" "}
                    <ArrowRight className="mx-1 inline h-3.5 w-3.5 text-white/45" />{" "}
                    Tokyo
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs text-white/45">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Departure
                  </div>

                  <p className="mt-1 text-sm font-medium text-white">
                    May 24, 2026
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs text-white/45">
                    <UsersRound className="h-3.5 w-3.5" />
                    Guest
                  </div>

                  <p className="mt-1 text-sm font-medium text-white">1 Guest</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10" />
        </motion.div>
      </div>
    </section>
  );
}