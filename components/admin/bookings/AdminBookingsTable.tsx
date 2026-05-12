"use client";

import {
  CalendarCheck,
  Eye,
  MoreHorizontal,
  TicketCheck,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const bookings = [
  {
    id: "jt-bkg-2401",
    reference: "JT-BKG-2401",
    passenger: "Andrea Cruz",
    email: "andrea.cruz@example.com",
    route: "MNL → NRT",
    flightNo: "JT-204",
    departureDate: "May 24, 2026",
    guests: 1,
    amount: "₱12,499",
    status: "Confirmed",
  },
  {
    id: "jt-bkg-2402",
    reference: "JT-BKG-2402",
    passenger: "Marcus Lee",
    email: "marcus.lee@example.com",
    route: "CEB → SIN",
    flightNo: "JT-332",
    departureDate: "June 02, 2026",
    guests: 2,
    amount: "₱18,499",
    status: "Pending",
  },
  {
    id: "jt-bkg-2403",
    reference: "JT-BKG-2403",
    passenger: "Sofia Reyes",
    email: "sofia.reyes@example.com",
    route: "MNL → ICN",
    flightNo: "JT-118",
    departureDate: "May 28, 2026",
    guests: 1,
    amount: "₱9,899",
    status: "Confirmed",
  },
  {
    id: "jt-bkg-2404",
    reference: "JT-BKG-2404",
    passenger: "Daniel Tan",
    email: "daniel.tan@example.com",
    route: "CRK → BKK",
    flightNo: "SM-409",
    departureDate: "June 07, 2026",
    guests: 3,
    amount: "₱6,999",
    status: "Cancelled",
  },
];

export default function AdminBookingsTable() {
  const handleAction = (message: string) => {
    toast.success(message);
  };

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
      <div className="hidden grid-cols-[1.15fr_1fr_0.9fr_0.8fr_0.8fr_0.8fr_auto] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/35 xl:grid">
        <span>Passenger</span>
        <span>Route</span>
        <span>Flight</span>
        <span>Guests</span>
        <span>Status</span>
        <span>Amount</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-white/10">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="grid gap-4 px-5 py-5 text-sm xl:grid-cols-[1.15fr_1fr_0.9fr_0.8fr_0.8fr_0.8fr_auto] xl:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
                <UserRound className="h-4 w-4" />
              </div>

              <div>
                <p className="font-medium text-white">{booking.passenger}</p>
                <p className="mt-1 text-xs text-white/40">{booking.email}</p>
                <p className="mt-1 text-xs text-white/30">
                  {booking.reference}
                </p>
              </div>
            </div>

            <div>
              <p className="font-medium text-white">{booking.route}</p>
              <p className="mt-1 text-xs text-white/40">
                {booking.departureDate}
              </p>
            </div>

            <div>
              <p className="text-white/80">{booking.flightNo}</p>
              <p className="mt-1 text-xs text-white/40">Jetour route</p>
            </div>

            <div>
              <p className="font-medium text-white">{booking.guests}</p>
              <p className="mt-1 text-xs text-white/40">
                {booking.guests > 1 ? "guests" : "guest"}
              </p>
            </div>

            <div>
              <StatusBadge status={booking.status} />
            </div>

            <div>
              <p className="font-medium text-white">{booking.amount}</p>
              <p className="mt-1 text-xs text-white/40">total fare</p>
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
                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`Viewing ${booking.reference}`)
                    }
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`${booking.reference} marked confirmed`)
                    }
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <TicketCheck className="mr-2 h-4 w-4" />
                    Confirm booking
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`${booking.reference} marked pending`)
                    }
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Mark pending
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`${booking.reference} cancelled`)
                    }
                    className="cursor-pointer text-amber-200 focus:bg-amber-400/10 focus:text-amber-100"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel booking
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`${booking.reference} deleted`)
                    }
                    className="cursor-pointer text-red-300 focus:bg-red-400/10 focus:text-red-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete booking
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
    status === "Confirmed"
      ? "border-emerald-300/10 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10"
      : status === "Pending"
      ? "border-amber-300/10 bg-amber-400/10 text-amber-200 hover:bg-amber-400/10"
      : "border-red-300/10 bg-red-400/10 text-red-200 hover:bg-red-400/10";

  return (
    <Badge className={`rounded-full border px-3 py-1 ${statusClass}`}>
      {status}
    </Badge>
  );
}