"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Download,
  Home,
  Plane,
  TicketCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BookingSuccessCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-xl md:p-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative text-center">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/15 text-emerald-100 shadow-2xl shadow-emerald-500/10">
          <Check className="h-8 w-8" />
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.35em] text-white/40">
          Booking confirmed
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.07em] text-white md:text-7xl">
          Your Jetour trip is reserved.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/50">
          Your booking request has been recorded as a confirmed reservation for
          this portfolio flow.
        </p>
      </div>

      <div className="relative mt-10 rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
        <div className="mb-5 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-white/45">Booking reference</p>
            <p className="mt-1 text-3xl font-semibold tracking-[-0.05em]">
              JT-BKG-2401
            </p>
          </div>

          <div className="w-fit rounded-full border border-emerald-300/10 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
            Confirmed
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <SummaryTile
            icon={Plane}
            label="Route"
            value="Manila to Tokyo"
            meta="MNL → NRT"
          />
          <SummaryTile
            icon={CalendarDays}
            label="Departure"
            value="May 24, 2026"
            meta="08:30 AM"
          />
          <SummaryTile
            icon={UserRound}
            label="Passenger"
            value="1 Guest"
            meta="Economy · Window seat"
          />
          <SummaryTile
            icon={TicketCheck}
            label="Flight"
            value="Jetour Airways"
            meta="JT-204"
          />
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
        <MiniInfo
          icon={BadgeCheck}
          label="Status"
          value="Reservation confirmed"
        />
        <MiniInfo icon={Download} label="Ticket" value="PDF soon" />
        <MiniInfo icon={Plane} label="Baggage" value="20kg included" />
      </div>

      <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="rounded-full px-7">
          <Link href="/flights">
            Browse more flights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back home
          </Link>
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}

type SummaryTileProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  meta: string;
};

function SummaryTile({ icon: Icon, label, value, meta }: SummaryTileProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-white/45">{meta}</p>
    </div>
  );
}

type MiniInfoProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function MiniInfo({ icon: Icon, label, value }: MiniInfoProps) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm backdrop-blur-xl">
      <Icon className="h-4 w-4 text-white/45" />
      <div>
        <p className="text-xs text-white/35">{label}</p>
        <p className="text-sm font-medium text-white/80">{value}</p>
      </div>
    </div>
  );
}