"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Luggage,
  Plane,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type FlightFareSummaryProps = {
  flightId: string;
};

const fareDetails = {
  baseFare: "₱10,999",
  taxes: "₱1,500",
  serviceFee: "Included",
  total: "₱12,499",
};

const fareBenefits = [
  {
    label: "20kg baggage",
    icon: Luggage,
  },
  {
    label: "Secure booking",
    icon: ShieldCheck,
  },
  {
    label: "Instant reservation",
    icon: TicketCheck,
  },
];

export default function FlightFareSummary({ flightId }: FlightFareSummaryProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
      className="relative h-fit overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/35 backdrop-blur-xl lg:sticky lg:top-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-0 h-52 w-52 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/45">Fare summary</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
              Review your trip
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
            <Plane className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
          <p className="text-xs text-white/40">Selected flight</p>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em]">
                MNL → NRT
              </p>
              <p className="mt-1 text-sm text-white/45">Jetour Airways</p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/70">
              {flightId.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
          <FareRow label="Base fare" value={fareDetails.baseFare} />
          <FareRow label="Taxes & fees" value={fareDetails.taxes} />
          <FareRow label="Service fee" value={fareDetails.serviceFee} />

          <div className="h-px bg-white/10" />

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-white/45">Total</p>
              <p className="mt-1 text-xs text-white/35">1 guest · one-way</p>
            </div>

            <p className="text-3xl font-semibold tracking-[-0.05em]">
              {fareDetails.total}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {fareBenefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.label}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/65 backdrop-blur-xl"
              >
                <Icon className="h-4 w-4 text-white/50" />
                {benefit.label}
              </div>
            );
          })}
        </div>

        <Button asChild className="mt-5 h-13 w-full rounded-full text-sm">
          <Link href={`/booking/${flightId}`}>
            Continue booking
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button
          variant="outline"
          className="mt-3 h-12 w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Hold fare
        </Button>

        <div className="mt-5 flex items-start gap-3 rounded-[1.25rem] border border-emerald-300/10 bg-emerald-400/10 p-4 text-emerald-100">
          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />

          <p className="text-xs leading-6 text-emerald-100/75">
            This is a portfolio booking flow. Payment integration will be added
            later during backend phase.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.aside>
  );
}

type FareRowProps = {
  label: string;
  value: string;
};

function FareRow({ label, value }: FareRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-white/45">{label}</span>
      <span className="font-medium text-white/85">{value}</span>
    </div>
  );
}