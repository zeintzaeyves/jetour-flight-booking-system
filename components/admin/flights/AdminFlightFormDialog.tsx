"use client";

import { Plus, Plane, CalendarDays, Clock3, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.success("Flight saved. Backend connection will be added later.");
  };

  return (
    <Dialog>
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
            Create a static flight record for now. Later, this form will submit
            to the MongoDB flights collection.
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
                  Airline, flight number, and current status.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Flight number" htmlFor="flightNo">
                <Input
                  id="flightNo"
                  name="flightNo"
                  placeholder="JT-204"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Airline" htmlFor="airline">
                <Input
                  id="airline"
                  name="airline"
                  placeholder="Jetour Airways"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Status" htmlFor="status">
                <Select name="status" defaultValue="scheduled">
                  <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
                  placeholder="Manila"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Destination city" htmlFor="destination">
                <Input
                  id="destination"
                  name="destination"
                  placeholder="Tokyo"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Origin code" htmlFor="originCode">
                <Input
                  id="originCode"
                  name="originCode"
                  placeholder="MNL"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Destination code" htmlFor="destinationCode">
                <Input
                  id="destinationCode"
                  name="destinationCode"
                  placeholder="NRT"
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
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Departure time" htmlFor="departureTime">
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="time"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Arrival time" htmlFor="arrivalTime">
                <Input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="time"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Duration" htmlFor="duration">
                <Input
                  id="duration"
                  name="duration"
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
                  placeholder="₱12,499"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Available seats" htmlFor="availableSeats">
                <Input
                  id="availableSeats"
                  name="availableSeats"
                  type="number"
                  placeholder="42"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Class type" htmlFor="classType">
                <Select name="classType" defaultValue="economy">
                  <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium-economy">
                      Premium Economy
                    </SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Baggage" htmlFor="baggage">
                <Input
                  id="baggage"
                  name="baggage"
                  placeholder="20kg"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>

            <Button type="submit" className="h-12 rounded-full px-6">
              Save Flight
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