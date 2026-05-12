"use client";

import {
  MoreHorizontal,
  Pencil,
  Plane,
  Trash2,
  TicketCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const flights = [
  {
    id: "jt-204",
    flightNo: "JT-204",
    airline: "Jetour Airways",
    route: "MNL → NRT",
    origin: "Manila",
    destination: "Tokyo",
    departureDate: "May 24, 2026",
    departureTime: "08:30 AM",
    arrivalTime: "12:50 PM",
    price: "₱12,499",
    seats: 42,
    status: "Scheduled",
  },
  {
    id: "jt-118",
    flightNo: "JT-118",
    airline: "Jetour Airways",
    route: "MNL → ICN",
    origin: "Manila",
    destination: "Seoul",
    departureDate: "May 28, 2026",
    departureTime: "10:15 AM",
    arrivalTime: "02:10 PM",
    price: "₱9,899",
    seats: 36,
    status: "Scheduled",
  },
  {
    id: "jt-332",
    flightNo: "JT-332",
    airline: "Jetour Airways",
    route: "CEB → SIN",
    origin: "Cebu",
    destination: "Singapore",
    departureDate: "June 02, 2026",
    departureTime: "06:20 PM",
    arrivalTime: "09:55 PM",
    price: "₱18,499",
    seats: 18,
    status: "Delayed",
  },
  {
    id: "sm-409",
    flightNo: "SM-409",
    airline: "Sky Manila",
    route: "CRK → BKK",
    origin: "Clark",
    destination: "Bangkok",
    departureDate: "June 07, 2026",
    departureTime: "07:45 AM",
    arrivalTime: "10:50 AM",
    price: "₱6,999",
    seats: 12,
    status: "Cancelled",
  },
];

export default function AdminFlightsTable() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
      <div className="hidden grid-cols-[1fr_1fr_1fr_0.8fr_0.7fr_0.8fr_auto] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/35 xl:grid">
        <span>Flight</span>
        <span>Route</span>
        <span>Departure</span>
        <span>Arrival</span>
        <span>Seats</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-white/10">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="grid gap-4 px-5 py-5 text-sm xl:grid-cols-[1fr_1fr_1fr_0.8fr_0.7fr_0.8fr_auto] xl:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
                <Plane className="h-4 w-4" />
              </div>

              <div>
                <p className="font-medium text-white">{flight.flightNo}</p>
                <p className="mt-1 text-xs text-white/40">{flight.airline}</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-white">{flight.route}</p>
              <p className="mt-1 text-xs text-white/40">
                {flight.origin} to {flight.destination}
              </p>
            </div>

            <div>
              <p className="text-white/80">{flight.departureDate}</p>
              <p className="mt-1 text-xs text-white/40">
                {flight.departureTime}
              </p>
            </div>

            <div>
              <p className="text-white/80">{flight.arrivalTime}</p>
              <p className="mt-1 text-xs text-white/40">{flight.price}</p>
            </div>

            <div>
              <p className="font-medium text-white">{flight.seats}</p>
              <p className="mt-1 text-xs text-white/40">available</p>
            </div>

            <div>
              <StatusBadge status={flight.status} />
            </div>

            <div className="flex justify-start xl:justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="border-white/10 bg-[#0b0f13] text-white"
                >
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit flight
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <TicketCheck className="mr-2 h-4 w-4" />
                    Mark scheduled
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer text-red-300 focus:bg-red-400/10 focus:text-red-200">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete flight
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const statusClass =
    status === "Scheduled"
      ? "border-emerald-300/10 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10"
      : status === "Delayed"
      ? "border-amber-300/10 bg-amber-400/10 text-amber-200 hover:bg-amber-400/10"
      : "border-red-300/10 bg-red-400/10 text-red-200 hover:bg-red-400/10";

  return (
    <Badge className={`rounded-full border px-3 py-1 ${statusClass}`}>
      {status}
    </Badge>
  );
}