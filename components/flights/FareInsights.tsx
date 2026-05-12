"use client";

import { motion } from "motion/react";
import { BadgeCheck, Clock3, Luggage, TicketPercent } from "lucide-react";

const insights = [
  {
    label: "Lowest fare",
    value: "₱6,999",
    icon: TicketPercent,
  },
  {
    label: "Fastest flight",
    value: "3h 05m",
    icon: Clock3,
  },
  {
    label: "Best value",
    value: "JT-118",
    icon: BadgeCheck,
  },
  {
    label: "Baggage",
    value: "20kg incl.",
    icon: Luggage,
  },
];

export default function FareInsights() {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {insights.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.12 + index * 0.05,
              duration: 0.65,
              ease: "easeOut",
            }}
            className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4 text-white shadow-xl shadow-black/20 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.1] via-white/[0.02] to-transparent" />

            <div className="relative flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-white/40">{item.label}</p>
                <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
                  {item.value}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-black/20">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/10" />
          </motion.div>
        );
      })}
    </div>
  );
}