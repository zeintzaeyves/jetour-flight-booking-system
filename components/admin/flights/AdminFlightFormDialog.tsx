"use client";

import type React from "react";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Plane,
  Plus,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminFlightFormDialog() {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      flightNo: String(formData.get("flightNo") || "").trim().toUpperCase(),
      airline: String(formData.get("airline") || "Jetour Airways").trim(),
      origin: String(formData.get("origin") || "").trim(),
      destination: String(formData.get("destination") || "").trim(),
      originCode: String(formData.get("originCode") || "").trim().toUpperCase(),
      destinationCode: String(formData.get("destinationCode") || "")
        .trim()
        .toUpperCase(),
      departureDate: String(formData.get("departureDate") || ""),
      departureTime: String(formData.get("departureTime") || ""),
      arrivalTime: String(formData.get("arrivalTime") || ""),
      duration: String(formData.get("duration") || "").trim(),
      classType: String(formData.get("classType") || "Economy"),
      baggage: String(formData.get("baggage") || "20kg").trim(),
      price: Number(formData.get("price")),
      availableSeats: Number(formData.get("availableSeats")),
      status: String(formData.get("status") || "Scheduled"),
      tag: String(formData.get("tag") || "Available").trim(),
    };

    if (
      !payload.flightNo ||
      !payload.origin ||
      !payload.destination ||
      !payload.originCode ||
      !payload.destinationCode ||
      !payload.departureDate ||
      !payload.departureTime ||
      !payload.arrivalTime ||
      !payload.duration ||
      !payload.price ||
      Number.isNaN(payload.price) ||
      Number.isNaN(payload.availableSeats)
    ) {
      toast.error("Please complete all required flight fields.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create flight.");
      }

      toast.success(`${payload.flightNo} created successfully.`);
      setOpen(false);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create flight."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-full px-6">
          <Plus className="mr-2 h-4 w-4" />
          Add Flight
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#080b0d]/95 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold tracking-[-0.05em]">
            Add new flight
          </DialogTitle>

          <DialogDescription className="text-white/45">
            Create a new flight record and save it directly to the Jetour
            database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                <Plane className="h-4 w-4" />
              </div>

              <div>
                <h3 className="font-medium text-white">Flight identity</h3>
                <p className="text-sm text-white/40">
                  Airline, flight number, tag, and current status.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Flight number" htmlFor="flightNo">
                <Input
                  id="flightNo"
                  name="flightNo"
                  required
                  placeholder="JT-520"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Airline" htmlFor="airline">
                <Input
                  id="airline"
                  name="airline"
                  required
                  defaultValue="Jetour Airways"
                  placeholder="Jetour Airways"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Tag" htmlFor="tag">
                <Input
                  id="tag"
                  name="tag"
                  defaultValue="Available"
                  placeholder="Popular"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Status" htmlFor="status">
                <Select name="status" defaultValue="Scheduled">
                  <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                <MapPin className="h-4 w-4" />
              </div>

              <div>
                <h3 className="font-medium text-white">Route details</h3>
                <p className="text-sm text-white/40">
                  Origin and destination information.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Origin city" htmlFor="origin">
                <Input
                  id="origin"
                  name="origin"
                  required
                  placeholder="Manila"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Destination city" htmlFor="destination">
                <Input
                  id="destination"
                  name="destination"
                  required
                  placeholder="Tokyo"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Origin code" htmlFor="originCode">
                <Input
                  id="originCode"
                  name="originCode"
                  required
                  placeholder="MNL"
                  maxLength={3}
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Destination code" htmlFor="destinationCode">
                <Input
                  id="destinationCode"
                  name="destinationCode"
                  required
                  placeholder="NRT"
                  maxLength={3}
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div>
                <h3 className="font-medium text-white">Schedule</h3>
                <p className="text-sm text-white/40">
                  Flight date, time, and duration.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Departure date" htmlFor="departureDate">
                <Input
                  id="departureDate"
                  name="departureDate"
                  type="date"
                  required
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Departure time" htmlFor="departureTime">
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="time"
                  required
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Arrival time" htmlFor="arrivalTime">
                <Input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="time"
                  required
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Duration" htmlFor="duration">
                <Input
                  id="duration"
                  name="duration"
                  required
                  placeholder="4h 20m"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                <Ticket className="h-4 w-4" />
              </div>

              <div>
                <h3 className="font-medium text-white">Fare and seats</h3>
                <p className="text-sm text-white/40">
                  Manage price, class type, baggage, and seat availability.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Price" htmlFor="price">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min={1}
                  placeholder="12499"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Available seats" htmlFor="availableSeats">
                <Input
                  id="availableSeats"
                  name="availableSeats"
                  type="number"
                  required
                  min={0}
                  placeholder="42"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Class type" htmlFor="classType">
                <Select name="classType" defaultValue="Economy">
                  <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Premium Economy">
                      Premium Economy
                    </SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Baggage" htmlFor="baggage">
                <Input
                  id="baggage"
                  name="baggage"
                  defaultValue="20kg"
                  placeholder="20kg"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              disabled={isSaving}
              onClick={() => setOpen(false)}
              variant="outline"
              className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving} className="h-12 rounded-full px-6">
              {isSaving ? "Saving..." : "Save Flight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="mb-2 block text-sm text-white/65">
        {label}
      </Label>
      {children}
    </div>
  );
}