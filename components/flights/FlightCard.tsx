"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Luggage,
  Plane,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FlightCardProps = {
  flight: {
    id: string;
    airline: string;
    flightNo: string;
    from: string;
    to: string;
    codeFrom: string;
    codeTo: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    classType: string;
    baggage: string;
    price: string;
    tag: string;
  };
  index: number;
};

export default function FlightCard({ flight, index }: FlightCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/flights/${flight.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleCardClick();
        }
      }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.7,
        ease: "easeOut",
      }}
      className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/35 backdrop-blur-xl transition duration-500 hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl transition duration-700 group-hover:bg-sky-400/15" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-52 w-52 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
              <Plane className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">{flight.airline}</p>
              <p className="mt-0.5 text-xs text-white/45">
                Flight {flight.flightNo}
              </p>
            </div>
          </div>

          <Badge className="w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-white backdrop-blur-xl hover:bg-white/10">
            <Sparkles className="mr-1.5 h-3 w-3" />
            {flight.tag}
          </Badge>
        </div>

        <div className="grid gap-5 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-sm text-white/45">{flight.from}</p>
                <h3 className="mt-1 text-5xl font-semibold tracking-[-0.06em] text-white">
                  {flight.codeFrom}
                </h3>
                <p className="mt-2 text-sm text-white/55">
                  {flight.departureTime}
                </p>
              </div>

              <div className="relative flex flex-1 items-center justify-center">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className="absolute flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-500 group-hover:scale-105">
                  <Plane className="h-4 w-4 rotate-90 text-white/75" />
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-white/45">{flight.to}</p>
                <h3 className="mt-1 text-5xl font-semibold tracking-[-0.06em] text-white">
                  {flight.codeTo}
                </h3>
                <p className="mt-2 text-sm text-white/55">
                  {flight.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/45">
                <CalendarDays className="h-4 w-4" />
                Departure
              </div>
              <span className="font-medium text-white/85">{flight.date}</span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/45">
                <Clock3 className="h-4 w-4" />
                Duration
              </div>
              <span className="font-medium text-white/85">
                {flight.duration}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-white/45">Class</span>
              <span className="font-medium text-white/85">
                {flight.classType}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/45">
                <Luggage className="h-4 w-4" />
                Baggage
              </div>
              <span className="font-medium text-white/85">
                {flight.baggage}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl sm:flex-1">
            <p className="text-xs text-white/45">Starts at</p>
            <p className="text-2xl font-semibold tracking-[-0.04em] text-white">
              {flight.price}
            </p>
          </div>

          <div
            className="flex gap-2.5"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={`/flights/${flight.id}`}>View details</Link>
            </Button>

            <Button
              asChild
              className="h-14 rounded-full bg-white px-5 text-black shadow-xl shadow-black/30 transition duration-300 hover:bg-white/90"
            >
              <Link href={`/booking/${flight.id}`}>
                Book
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}