"use client";

import { motion } from "motion/react";
import { CalendarSearch, CreditCard, PlaneTakeoff, TicketCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Search your route",
    description: "Choose your origin, destination, travel date, and passenger count.",
    icon: CalendarSearch,
  },
  {
    number: "02",
    title: "Select a flight",
    description: "Compare curated fares, flight details, class options, and schedules.",
    icon: PlaneTakeoff,
  },
  {
    number: "03",
    title: "Book your seat",
    description: "Complete passenger details through a smooth booking experience.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Manage booking",
    description: "Track booking status, review flight details, and manage your trip.",
    icon: TicketCheck,
  },
];

export default function HowJetourWorks() {
  return (
    <section className="relative overflow-hidden bg-[#050706] px-4 py-24 text-white sm:px-6">
      <div className="absolute left-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-white/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/40">
            How it works
          </p>

          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            From search to boarding, built to feel effortless.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.65,
                  ease: "easeOut",
                }}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:bg-white/[0.07]"
              >
                <div className="mb-10 flex items-center justify-between">
                  <span className="text-sm text-white/35">{step.number}</span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/50">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}