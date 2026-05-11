"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpDown,
  CalendarDays,
  MapPin,
  PlaneTakeoff,
  UsersRound,
} from "lucide-react";

export default function FlightResultsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.7, ease: "easeOut" }}
      className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 text-white shadow-2xl shadow-black/25 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/45">
            <PlaneTakeoff className="h-4 w-4" />
            Available flights
          </div>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white md:text-4xl">
            4 curated routes found
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
              <MapPin className="h-3.5 w-3.5" />
              Manila
              <ArrowRight className="h-3.5 w-3.5 text-white/35" />
              Tokyo
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
              <CalendarDays className="h-3.5 w-3.5" />
              May 24, 2026
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
              <UsersRound className="h-3.5 w-3.5" />
              1 Guest
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/65 backdrop-blur-xl">
            Direct & selected fares
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/65 backdrop-blur-xl">
            <ArrowUpDown className="h-4 w-4" />
            Recommended first
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}