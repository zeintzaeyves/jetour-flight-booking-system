"use client";

import { motion } from "motion/react";
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  Luggage,
  Plane,
  ShieldCheck,
  Ticket,
  UsersRound,
} from "lucide-react";

type FlightDetailsCardProps = {
  flightId: string;
};

const flightDetails = {
  airline: "Jetour Airways",
  flightNo: "JT-204",
  origin: "Manila",
  destination: "Tokyo",
  originCode: "MNL",
  destinationCode: "NRT",
  departureDate: "May 24, 2026",
  departureTime: "08:30 AM",
  arrivalTime: "12:50 PM",
  duration: "4h 20m",
  classType: "Economy",
  baggage: "20kg checked baggage",
  passengers: "1 Guest",
  aircraft: "Airbus A321neo",
  status: "Available",
};

const timeline = [
  {
    label: "Departure",
    airport: "Ninoy Aquino International Airport",
    code: "MNL",
    time: "08:30 AM",
    date: "May 24, 2026",
  },
  {
    label: "Arrival",
    airport: "Narita International Airport",
    code: "NRT",
    time: "12:50 PM",
    date: "May 24, 2026",
  },
];

const inclusions = [
  {
    title: "Baggage included",
    description: "20kg checked baggage with 7kg cabin allowance.",
    icon: Luggage,
  },
  {
    title: "Secure booking",
    description: "Protected booking flow with organized reservation details.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible support",
    description: "Booking status and trip details can be managed after checkout.",
    icon: BadgeCheck,
  },
];

export default function FlightDetailsCard({ flightId }: FlightDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/35 backdrop-blur-xl md:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
              <Plane className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                {flightDetails.originCode} to {flightDetails.destinationCode}
              </h2>
              <p className="mt-1 text-sm text-white/45">
                {flightDetails.airline} · {flightDetails.flightNo} · Ref{" "}
                {flightId.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="w-fit rounded-full border border-emerald-300/10 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
            {flightDetails.status}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-sm text-white/45">{flightDetails.origin}</p>
              <h3 className="mt-1 text-5xl font-semibold tracking-[-0.06em]">
                {flightDetails.originCode}
              </h3>
              <p className="mt-2 text-sm text-white/55">
                {flightDetails.departureTime}
              </p>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-xl shadow-black/20 backdrop-blur-xl">
                <Plane className="h-4 w-4 rotate-90 text-white/75" />
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-white/45">
                {flightDetails.destination}
              </p>
              <h3 className="mt-1 text-5xl font-semibold tracking-[-0.06em]">
                {flightDetails.destinationCode}
              </h3>
              <p className="mt-2 text-sm text-white/55">
                {flightDetails.arrivalTime}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoPill
            icon={CalendarDays}
            label="Departure"
            value={flightDetails.departureDate}
          />
          <InfoPill
            icon={Clock3}
            label="Duration"
            value={flightDetails.duration}
          />
          <InfoPill
            icon={Ticket}
            label="Class"
            value={flightDetails.classType}
          />
          <InfoPill
            icon={UsersRound}
            label="Guest"
            value={flightDetails.passengers}
          />
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/45">Flight timeline</p>
              <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                Schedule overview
              </h3>
            </div>

            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/60">
              {flightDetails.aircraft}
            </div>
          </div>

          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div
                key={item.label}
                className="grid gap-4 rounded-[1.35rem] border border-white/10 bg-black/20 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                    {item.code}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    {item.airport}
                  </p>
                  <p className="mt-1 text-xs text-white/45">{item.date}</p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {inclusions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                  <Icon className="h-4 w-4" />
                </div>

                <h4 className="text-sm font-medium text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}

type InfoPillProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function InfoPill({ icon: Icon, label, value }: InfoPillProps) {
  return (
    <div className="rounded-full border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <p className="mt-1 truncate text-sm font-medium text-white">{value}</p>
    </div>
  );
}