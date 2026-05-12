"use client";

import { motion } from "motion/react";
import {
  ArrowLeftRight,
  CalendarDays,
  MapPin,
  Search,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ModifySearchBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.7, ease: "easeOut" }}
      className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 text-white shadow-2xl shadow-black/25 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative grid gap-3 lg:grid-cols-[1.1fr_1fr_1fr_0.9fr_auto] lg:items-center">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
          <MapPin className="h-4 w-4 text-white/45" />
          <div>
            <p className="text-xs text-white/40">Route</p>
            <p className="text-sm font-medium text-white">
              Manila <ArrowLeftRight className="mx-1 inline h-3.5 w-3.5 text-white/45" /> Tokyo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
          <CalendarDays className="h-4 w-4 text-white/45" />
          <div>
            <p className="text-xs text-white/40">Departure</p>
            <p className="text-sm font-medium text-white">May 24, 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
          <UsersRound className="h-4 w-4 text-white/45" />
          <div>
            <p className="text-xs text-white/40">Guest</p>
            <p className="text-sm font-medium text-white">1 Guest</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
          <Search className="h-4 w-4 text-white/45" />
          <div>
            <p className="text-xs text-white/40">Cabin</p>
            <p className="text-sm font-medium text-white">Economy</p>
          </div>
        </div>

        <Button className="h-14 rounded-full px-7">
          Modify Search
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}