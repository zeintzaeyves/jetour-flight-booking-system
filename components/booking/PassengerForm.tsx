"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Mail,
  MessageSquareText,
  Phone,
  Plane,
  UserRound,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PassengerFormProps = {
  flightId: string;
};

export default function PassengerForm({ flightId }: PassengerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      flightNo: flightId,
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      passengers: Number(formData.get("passengers") || 1),
      classType: String(formData.get("classType") || "Economy"),
      seatPreference: String(formData.get("seatPreference") || "Window seat"),
      specialRequest: String(formData.get("specialRequest") || "").trim(),
    };

    if (!payload.fullName || !payload.email || !payload.phone) {
      toast.error("Please complete your passenger details.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create booking.");
      }

      toast.success("Booking confirmed.");

      router.push(`/booking/success?ref=${result.data.bookingReference}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create booking."
      );
    } finally {
      setIsSubmitting(false);
    }
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
              <Plane className="h-3.5 w-3.5" />
              {flightId}
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.05em]">
              Passenger information
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Add your contact and passenger details. This will now save a real
              booking record in MongoDB.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
            <UserRound className="h-5 w-5" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField icon={UserRound} label="Full name" htmlFor="fullName">
            <Input
              id="fullName"
              name="fullName"
              required
              placeholder="Juan Dela Cruz"
              className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
            />
          </FormField>

          <FormField icon={Mail} label="Email address" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
            />
          </FormField>

          <FormField icon={Phone} label="Phone number" htmlFor="phone">
            <Input
              id="phone"
              name="phone"
              required
              placeholder="+63 917 123 4567"
              className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
            />
          </FormField>

          <FormField icon={UsersRound} label="Passengers" htmlFor="passengers">
            <Select name="passengers" defaultValue="1">
              <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                <SelectValue placeholder="Select passengers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Passenger</SelectItem>
                <SelectItem value="2">2 Passengers</SelectItem>
                <SelectItem value="3">3 Passengers</SelectItem>
                <SelectItem value="4">4 Passengers</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField icon={BadgeCheck} label="Cabin class" htmlFor="classType">
            <Select name="classType" defaultValue="Economy">
              <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                <SelectValue placeholder="Select cabin class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">Economy</SelectItem>
                <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField icon={Plane} label="Seat preference" htmlFor="seatPreference">
            <Select name="seatPreference" defaultValue="Window seat">
              <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                <SelectValue placeholder="Select seat preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Window seat">Window seat</SelectItem>
                <SelectItem value="Aisle seat">Aisle seat</SelectItem>
                <SelectItem value="Middle seat">Middle seat</SelectItem>
                <SelectItem value="Any available seat">
                  Any available seat
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="mt-5">
          <FormField
            icon={MessageSquareText}
            label="Special request"
            htmlFor="specialRequest"
          >
            <Textarea
              id="specialRequest"
              name="specialRequest"
              placeholder="Meal preference, assistance request, or other notes..."
              className="min-h-32 rounded-[1.5rem] border-white/10 bg-white/10 px-5 py-4 text-white placeholder:text-white/35 focus-visible:ring-white/20"
            />
          </FormField>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-white/40">
            Your booking will be saved as a confirmed reservation.
          </p>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-full px-7"
          >
            {isSubmitting ? "Confirming booking..." : "Confirm booking"}
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.form>
  );
}

type FormFieldProps = {
  icon: React.ElementType;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

function FormField({ icon: Icon, label, htmlFor, children }: FormFieldProps) {
  return (
    <div>
      <Label
        htmlFor={htmlFor}
        className="mb-2 flex items-center gap-2 text-sm text-white/70"
      >
        <Icon className="h-4 w-4 text-white/40" />
        {label}
      </Label>

      {children}
    </div>
  );
}