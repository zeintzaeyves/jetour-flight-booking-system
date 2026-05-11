"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import FlightSearchCard from "./FlightSearchCard";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#050706] px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl"
        >
          <Image
            src="/images/bg.jpg"
            alt="Airplane cabin interior"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

          <div className="relative z-10 flex min-h-[620px] items-start px-6 py-14 sm:px-10 lg:px-20">
            <div className="max-w-3xl pt-2 md:pt-5">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="text-6xl font-semibold tracking-[-0.06em] text-white md:text-8xl"
              >
                Jetour
                <span className="block text-4xl font-normal tracking-[-0.05em] text-white/70 md:text-6xl">
                  Book. Fly. Explore.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                className="mt-6 text-lg text-white/65 md:text-xl"
              >
                Curated journeys. Effortless booking.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button asChild size="lg" className="rounded-full px-7">
                  <Link href="/flights">
                    Explore Flights
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/10 px-7 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                >
                  <Link href="/admin">Admin CMS</Link>
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70 backdrop-blur-md md:flex"
          >
            <span>Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown className="h-4 w-4" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.75, ease: "easeOut" }}
          className="relative z-20 mx-auto -mt-24 max-w-6xl px-4"
        >
          <FlightSearchCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.75, ease: "easeOut" }}
          className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 md:grid-cols-3"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Globe2 className="h-5 w-5 text-white/80" />
            </div>
            <h3 className="text-lg font-medium">Global routes</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Explore selected destinations across Asia and beyond.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <ShieldCheck className="h-5 w-5 text-white/80" />
            </div>
            <h3 className="text-lg font-medium">Secure booking</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              A clean booking flow with organized flight details.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Sparkles className="h-5 w-5 text-white/80" />
            </div>
            <h3 className="text-lg font-medium">Admin CMS</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Manage flights, destinations, promos, and bookings.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
