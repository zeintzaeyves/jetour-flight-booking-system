"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Luggage,
  Plane,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RecommendedRoute() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16, duration: 0.7, ease: "easeOut" }}
      className="relative mb-5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-4 text-white shadow-xl shadow-black/30 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative grid gap-4 lg:grid-cols-[1fr_190px] lg:items-center">
        <div>
          <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/70 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Recommended for this trip
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-black/20">
              <Plane className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                Jetour Airways JT-118
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-white/50">
                Manila to Seoul · balanced fare, duration, and baggage
                allowance.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/60">
              <Clock3 className="h-3.5 w-3.5" />
              3h 55m
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/60">
              <Luggage className="h-3.5 w-3.5" />
              20kg included
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/60">
              <BadgeCheck className="h-3.5 w-3.5" />
              Economy
            </span>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl">
          <p className="text-xs text-white/40">Starts at</p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.05em]">
            ₱9,899
          </p>

          <Button asChild className="mt-3 h-11 w-full rounded-full text-sm">
            <Link href="/booking/jt-118">
              Book
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}