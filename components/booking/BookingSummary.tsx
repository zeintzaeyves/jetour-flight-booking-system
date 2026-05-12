"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Luggage,
  Plane,
  ShieldCheck,
  TicketCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type BookingSummaryProps = {
  flightId: string;
};

const bookingSummary = {
  route: "MNL → NRT",
  airline: "Jetour Airways",
  flightNo: "JT-204",
  departureDate: "May 24, 2026",
  departureTime: "08:30 AM",
  passenger: "1 Guest",
  cabinClass: "Economy",
  baggage: "20kg included",
  baseFare: "₱10,999",
  taxes: "₱1,500",
  serviceFee: "Included",
  total: "₱12,499",
};

const inclusions = [
  {
    label: "Secure reservation",
    icon: ShieldCheck,
  },
  {
    label: "20kg baggage",
    icon: Luggage,
  },
  {
    label: "Pending confirmation",
    icon: TicketCheck,
  },
];

export default function BookingSummary({ flightId }: BookingSummaryProps) {
  const handleConfirm = () => {
    toast.success("Booking confirmed. Redirecting to success page...");
  };

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
            <p className="text-sm text-white/45">Booking summary</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
              Review fare
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/40">Selected flight</p>
              <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                {bookingSummary.route}
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/70">
              {flightId.toUpperCase()}
            </div>
          </div>

          <div className="grid gap-3 text-sm">
            <SummaryItem
              icon={Plane}
              label="Airline"
              value={`${bookingSummary.airline} · ${bookingSummary.flightNo}`}
            />
            <SummaryItem
              icon={CalendarDays}
              label="Departure"
              value={`${bookingSummary.departureDate} · ${bookingSummary.departureTime}`}
            />
            <SummaryItem
              icon={UserRound}
              label="Passenger"
              value={`${bookingSummary.passenger} · ${bookingSummary.cabinClass}`}
            />
            <SummaryItem
              icon={Luggage}
              label="Baggage"
              value={bookingSummary.baggage}
            />
          </div>
        </div>

        <div className="mt-4 space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
          <FareRow label="Base fare" value={bookingSummary.baseFare} />
          <FareRow label="Taxes & fees" value={bookingSummary.taxes} />
          <FareRow label="Service fee" value={bookingSummary.serviceFee} />

          <div className="h-px bg-white/10" />

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-white/45">Total amount</p>
              <p className="mt-1 text-xs text-white/35">Mock payment phase</p>
            </div>

            <p className="text-3xl font-semibold tracking-[-0.05em]">
              {bookingSummary.total}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {inclusions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/65 backdrop-blur-xl"
              >
                <Icon className="h-4 w-4 text-white/50" />
                {item.label}
              </div>
            );
          })}
        </div>

        <Button
          onClick={handleConfirm}
          asChild
          className="mt-5 h-12 w-full rounded-full text-sm"
        >
          <Link href="/booking/success">
            Confirm booking
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button
          variant="outline"
          className="mt-3 h-12 w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <BadgeCheck className="mr-2 h-4 w-4" />
          Save as pending
        </Button>

        <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
          <p className="text-xs leading-6 text-white/40">
            This booking form is currently using static data. In the backend
            phase, confirmation will create a booking document in MongoDB.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.aside>
  );
}

type SummaryItemProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function SummaryItem({ icon: Icon, label, value }: SummaryItemProps) {
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