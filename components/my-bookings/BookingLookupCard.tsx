"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Mail,
  Search,
  TicketCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BookingLookupCard() {
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      toast.success("Static booking preview loaded.");
    }, 700);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
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
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/60 backdrop-blur-xl">
              <Search className="h-3.5 w-3.5" />
              Booking lookup
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.05em]">
              Find your reservation
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Enter your booking reference and email address. Later, this will
              search the MongoDB bookings collection.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
            <TicketCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label
              htmlFor="bookingReference"
              className="mb-2 flex items-center gap-2 text-sm text-white/70"
            >
              <TicketCheck className="h-4 w-4 text-white/40" />
              Booking reference
            </Label>

            <Input
              id="bookingReference"
              name="bookingReference"
              placeholder="JT-BKG-2401"
              required
              className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 text-sm text-white/70"
            >
              <Mail className="h-4 w-4 text-white/40" />
              Email address
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
            />
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-white/45" />
            <p className="text-sm leading-6 text-white/45">
              For portfolio phase, this lookup shows a static preview. Once the
              backend is connected, it will return the user&apos;s actual booking
              record.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSearching}
          className="mt-6 h-12 rounded-full px-7"
        >
          {isSearching ? "Searching..." : "Search booking"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.form>
  );
}