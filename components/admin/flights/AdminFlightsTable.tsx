"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Plane,
  RefreshCcw,
  Trash2,
  TicketCheck,
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

type Flight = {
  _id: string;
  flightNo: string;
  airline: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classType: string;
  baggage: string;
  price: number;
  availableSeats: number;
  status: "Scheduled" | "Delayed" | "Cancelled" | "Completed";
  tag: string;
};

export default function AdminFlightsTable() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlights = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/flights", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch flights.");
      }

      setFlights(result.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load flights.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (flightNo: string) => {
    try {
      const response = await fetch(`/api/flights/${flightNo}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete flight.");
      }

      toast.success(`${flightNo} deleted successfully.`);
      fetchFlights();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete flight.");
    }
  };

  const handleMarkScheduled = async (flightNo: string) => {
    try {
      const response = await fetch(`/api/flights/${flightNo}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Scheduled",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update flight.");
      }

      toast.success(`${flightNo} marked as scheduled.`);
      fetchFlights();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update flight.");
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-8 text-center text-sm text-white/45">
        Loading flight records...
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-8 text-center">
        <p className="text-sm text-white/45">No flights found yet.</p>

        <Button
          onClick={fetchFlights}
          variant="outline"
          className="mt-4 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

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
            key={flight._id}
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
              <p className="font-medium text-white">
                {flight.originCode} → {flight.destinationCode}
              </p>
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
              <p className="mt-1 text-xs text-white/40">
                ₱{flight.price.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="font-medium text-white">{flight.availableSeats}</p>
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

                  <DropdownMenuItem
                    onClick={() => handleMarkScheduled(flight.flightNo)}
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <TicketCheck className="mr-2 h-4 w-4" />
                    Mark scheduled
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleDelete(flight.flightNo)}
                    className="cursor-pointer text-red-300 focus:bg-red-400/10 focus:text-red-200"
                  >
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
        : status === "Completed"
          ? "border-sky-300/10 bg-sky-400/10 text-sky-200 hover:bg-sky-400/10"
          : "border-red-300/10 bg-red-400/10 text-red-200 hover:bg-red-400/10";

  return (
    <Badge className={`rounded-full border px-3 py-1 ${statusClass}`}>
      {status}
    </Badge>
  );
}