"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgePercent,
  CalendarClock,
  LayoutDashboard,
  MapPinned,
  Plane,
  Settings2,
  TicketCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const cmsFeatures = [
  {
    title: "Flights CRUD",
    description: "Create, update, schedule, and manage available flights.",
    icon: Plane,
  },
  {
    title: "Booking Management",
    description: "Track booking status from pending to confirmed.",
    icon: TicketCheck,
  },
  {
    title: "Destination CMS",
    description: "Manage featured cities, airport codes, and travel content.",
    icon: MapPinned,
  },
  {
    title: "Promo Control",
    description: "Publish seasonal deals and homepage promo banners.",
    icon: BadgePercent,
  },
];

const recentBookings = [
  {
    ref: "JT-2401",
    route: "MNL → NRT",
    guest: "Andrea Cruz",
    status: "Confirmed",
  },
  {
    ref: "JT-2402",
    route: "CEB → SIN",
    guest: "Marcus Lee",
    status: "Pending",
  },
  {
    ref: "JT-2403",
    route: "MNL → ICN",
    guest: "Sofia Reyes",
    status: "Confirmed",
  },
];

export default function AdminCMSPreview() {
  return (
    <section className="relative overflow-hidden bg-[#050706] px-4 py-28 text-white sm:px-6">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[480px] w-[480px] rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute left-0 bottom-10 h-[380px] w-[380px] rounded-full bg-white/5 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex h-full flex-col"
        >
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/40">
              Admin CMS
            </p>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              Manage the travel system from one refined console.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/55">
              Jetour includes a dedicated admin experience for managing flights,
              bookings, destinations, and promotional content.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link href="/admin">
                  Open Admin CMS
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/flights">Explore Flights</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid flex-1 gap-4 sm:grid-cols-2">
            {cmsFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: index * 0.07,
                    duration: 0.55,
                    ease: "easeOut",
                  }}
                  className="group flex min-h-[220px] flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-500 hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.03em]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/45">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                <LayoutDashboard className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-medium">Jetour Console</p>
                <p className="text-xs text-white/45">Admin overview</p>
              </div>
            </div>

            <Badge className="rounded-full border border-emerald-300/15 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10">
              Live System
            </Badge>
          </div>

          <div className="flex h-[calc(100%-88px)] flex-col p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <Plane className="h-4 w-4 text-white/75" />
                </div>
                <p className="text-3xl font-semibold tracking-[-0.04em]">128</p>
                <p className="mt-2 text-xs text-white/45">Active flights</p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <TicketCheck className="h-4 w-4 text-white/75" />
                </div>
                <p className="text-3xl font-semibold tracking-[-0.04em]">342</p>
                <p className="mt-2 text-xs text-white/45">Bookings</p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <CalendarClock className="h-4 w-4 text-white/75" />
                </div>
                <p className="text-3xl font-semibold tracking-[-0.04em]">24</p>
                <p className="mt-2 text-xs text-white/45">Today</p>
              </div>
            </div>

            <div className="mt-6 flex-1 rounded-[1.75rem] border border-white/10 bg-black/20">
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <p className="text-sm font-medium">Recent bookings</p>
                  <p className="mt-1 text-xs text-white/45">
                    Latest customer reservations
                  </p>
                </div>

                <Settings2 className="h-4 w-4 text-white/40" />
              </div>

              <div className="divide-y divide-white/10">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.ref}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 p-5"
                  >
                    <div>
                      <p className="text-sm font-medium">{booking.route}</p>
                      <p className="mt-1 text-xs text-white/45">
                        {booking.ref} • {booking.guest}
                      </p>
                    </div>

                    <Badge
                      className={
                        booking.status === "Confirmed"
                          ? "rounded-full border border-emerald-300/10 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10"
                          : "rounded-full border border-amber-300/10 bg-amber-400/10 text-amber-200 hover:bg-amber-400/10"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        </motion.div>
      </div>
    </section>
  );
}