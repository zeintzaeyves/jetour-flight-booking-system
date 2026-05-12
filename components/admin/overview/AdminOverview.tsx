"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgePercent,
  CalendarCheck,
  Clock3,
  MapPinned,
  Plane,
  TicketCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Active flights",
    value: "128",
    meta: "+12 this month",
    icon: Plane,
  },
  {
    label: "Bookings",
    value: "342",
    meta: "24 today",
    icon: TicketCheck,
  },
  {
    label: "Destinations",
    value: "18",
    meta: "4 featured",
    icon: MapPinned,
  },
  {
    label: "Promos",
    value: "7",
    meta: "3 published",
    icon: BadgePercent,
  },
];

const recentBookings = [
  {
    ref: "JT-BKG-2401",
    guest: "Andrea Cruz",
    route: "MNL → NRT",
    flight: "JT-204",
    status: "Confirmed",
    amount: "₱12,499",
  },
  {
    ref: "JT-BKG-2402",
    guest: "Marcus Lee",
    route: "CEB → SIN",
    flight: "JT-332",
    status: "Pending",
    amount: "₱18,499",
  },
  {
    ref: "JT-BKG-2403",
    guest: "Sofia Reyes",
    route: "MNL → ICN",
    flight: "JT-118",
    status: "Confirmed",
    amount: "₱9,899",
  },
  {
    ref: "JT-BKG-2404",
    guest: "Daniel Tan",
    route: "CRK → BKK",
    flight: "SM-409",
    status: "Pending",
    amount: "₱6,999",
  },
];

const quickActions = [
  {
    title: "Add new flight",
    description: "Create route schedules, fares, class type, and seat availability.",
    href: "/admin/flights",
    icon: Plane,
  },
  {
    title: "Review bookings",
    description: "Confirm, cancel, or update customer booking reservations.",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Manage destinations",
    description: "Update destination cards, airport codes, and featured routes.",
    href: "/admin/destinations",
    icon: MapPinned,
  },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.06,
                duration: 0.65,
                ease: "easeOut",
              }}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/45">{item.label}</p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
                    {item.value}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/55">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {item.meta}
                  </div>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />

          <div className="relative mb-5 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-white/45">Latest activity</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                Recent bookings
              </h2>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-fit rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/admin/bookings">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
            <div className="hidden grid-cols-[1.1fr_1fr_0.8fr_0.8fr_auto] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/35 md:grid">
              <span>Reference</span>
              <span>Route</span>
              <span>Flight</span>
              <span>Status</span>
              <span className="text-right">Amount</span>
            </div>

            <div className="divide-y divide-white/10">
              {recentBookings.map((booking) => (
                <div
                  key={booking.ref}
                  className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1.1fr_1fr_0.8fr_0.8fr_auto] md:items-center md:gap-4"
                >
                  <div>
                    <p className="font-medium text-white">{booking.ref}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {booking.guest}
                    </p>
                  </div>

                  <p className="text-white/70">{booking.route}</p>
                  <p className="text-white/50">{booking.flight}</p>

                  <div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <p className="font-medium text-white md:text-right">
                    {booking.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">Admin shortcuts</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                  Quick actions
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group block rounded-[1.5rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition group-hover:bg-white group-hover:text-black">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {action.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-white/45">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-emerald-300/10 bg-emerald-400/10 p-4">
              <div className="flex items-start gap-3">
                <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" />
                <p className="text-xs leading-6 text-emerald-100/75">
                  This admin console is currently using static data. In the
                  backend phase, these cards will connect to MongoDB collections.
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        </motion.div>
      </div>
    </div>
  );
}

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const isConfirmed = status === "Confirmed";

  return (
    <Badge
      className={
        isConfirmed
          ? "rounded-full border border-emerald-300/10 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10"
          : "rounded-full border border-amber-300/10 bg-amber-400/10 text-amber-200 hover:bg-amber-400/10"
      }
    >
      {status}
    </Badge>
  );
}