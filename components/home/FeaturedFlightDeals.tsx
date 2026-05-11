"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Plane,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const flightDeals = [
  {
    airline: "Jetour Airways",
    flightNo: "JT-204",
    from: "Manila",
    to: "Tokyo",
    codeFrom: "MNL",
    codeTo: "NRT",
    date: "May 24, 2026",
    duration: "4h 20m",
    classType: "Economy",
    price: "₱12,499",
    tag: "Popular",
  },
  {
    airline: "Jetour Airways",
    flightNo: "JT-118",
    from: "Manila",
    to: "Seoul",
    codeFrom: "MNL",
    codeTo: "ICN",
    date: "May 28, 2026",
    duration: "3h 55m",
    classType: "Economy",
    price: "₱9,899",
    tag: "Best fare",
  },
  {
    airline: "Jetour Airways",
    flightNo: "JT-332",
    from: "Cebu",
    to: "Singapore",
    codeFrom: "CEB",
    codeTo: "SIN",
    date: "June 02, 2026",
    duration: "3h 35m",
    classType: "Business",
    price: "₱18,499",
    tag: "Premium",
  },
];

export default function FeaturedFlightDeals() {
  return (
    <section className="relative overflow-hidden bg-[#050706] px-4 py-24 text-white sm:px-6">
      <div className="absolute right-0 top-20 h-[420px] w-[420px] rounded-full bg-white/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/40">
              Selected fares
            </p>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              Handpicked routes for effortless travel.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          >
            <Button
              asChild
              variant="outline"
              className="w-fit rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/flights">
                Browse all flights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {flightDeals.map((deal, index) => (
            <motion.div
              key={deal.flightNo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: index * 0.08,
                duration: 0.65,
                ease: "easeOut",
              }}
            >
              <Card className="group overflow-hidden rounded-[2rem] border-white/10 bg-white/[0.04] text-white shadow-2xl shadow-black/20 transition duration-300 hover:bg-white/[0.07]">
                <CardContent className="p-6">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
                        <Plane className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {deal.airline}
                        </p>
                        <p className="text-xs text-white/45">
                          Flight {deal.flightNo}
                        </p>
                      </div>
                    </div>

                    <Badge className="rounded-full border-white/10 bg-white/10 text-white hover:bg-white/10">
                      <Sparkles className="mr-1.5 h-3 w-3" />
                      {deal.tag}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-sm text-white/45">{deal.from}</p>
                      <h3 className="mt-1 text-4xl font-semibold tracking-[-0.05em]">
                        {deal.codeFrom}
                      </h3>
                    </div>

                    <div className="relative flex flex-1 items-center justify-center">
                      <div className="h-px w-full bg-white/15" />
                      <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#101311]">
                        <Plane className="h-4 w-4 rotate-90 text-white/70" />
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-white/45">{deal.to}</p>
                      <h3 className="mt-1 text-4xl font-semibold tracking-[-0.05em]">
                        {deal.codeTo}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-2 text-white/50">
                        <CalendarDays className="h-4 w-4" />
                        Departure
                      </div>
                      <span className="font-medium text-white/80">
                        {deal.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-2 text-white/50">
                        <Clock3 className="h-4 w-4" />
                        Duration
                      </div>
                      <span className="font-medium text-white/80">
                        {deal.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-white/50">Class</span>
                      <span className="font-medium text-white/80">
                        {deal.classType}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/45">Starts at</p>
                      <p className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
                        {deal.price}
                      </p>
                    </div>

                    <Button
                      asChild
                      className="rounded-full px-5 transition group-hover:translate-x-1"
                    >
                      <Link href="/flights">
                        Book now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}