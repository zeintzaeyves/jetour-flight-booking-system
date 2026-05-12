"use client";

import type React from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  CalendarDays,
  Luggage,
  Plane,
  TicketCheck,
  UserRound,
} from "lucide-react";

const booking = {
  reference: "JT-BKG-2401",
  status: "Confirmed",
  passenger: "Andrea Cruz",
  route: "MNL → NRT",
  flight: "JT-204",
  date: "May 24, 2026",
  time: "08:30 AM",
  cabinClass: "Economy",
  baggage: "20kg included",
};

export default function BookingStatusPreview() {
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
            <p className="text-sm text-white/45">Booking preview</p>

            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
              Reservation status
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
            <BadgeCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
          <p className="text-xs text-white/40">Booking reference</p>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold tracking-[-0.04em]">
                {booking.reference}
              </p>

              <p className="mt-1 text-sm text-white/45">
                {booking.passenger}
              </p>
            </div>

            <div className="rounded-full border border-emerald-300/10 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200">
              {booking.status}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
          <PreviewItem icon={Plane} label="Route" value={booking.route} />
          <PreviewItem
            icon={TicketCheck}
            label="Flight"
            value={booking.flight}
          />
          <PreviewItem
            icon={CalendarDays}
            label="Departure"
            value={`${booking.date} · ${booking.time}`}
          />
          <PreviewItem
            icon={UserRound}
            label="Cabin"
            value={booking.cabinClass}
          />
          <PreviewItem icon={Luggage} label="Baggage" value={booking.baggage} />
        </div>

        <div className="mt-5 rounded-[1.25rem] border border-emerald-300/10 bg-emerald-400/10 p-4">
          <p className="text-xs leading-6 text-emerald-100/75">
            This is a static booking status preview. Backend lookup will be
            connected during the MongoDB phase.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.aside>
  );
}

type PreviewItemProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function PreviewItem({ icon: Icon, label, value }: PreviewItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-[1.1rem] border border-white/10 bg-white/[0.04] px-4 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/45" />

      <div>
        <p className="text-xs text-white/35">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-white/80">{value}</p>
      </div>
    </div>
  );
}