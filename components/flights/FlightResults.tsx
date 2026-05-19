"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import FlightCard from "./FlightCard";

type ApiFlight = {
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

export default function FlightResults() {
  const [flights, setFlights] = useState<ApiFlight[]>([]);
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

  useEffect(() => {
    fetchFlights();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full min-w-0 rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-8 text-center text-sm text-white/45 shadow-xl shadow-black/25 backdrop-blur-xl">
        Loading available routes...
      </section>
    );
  }

  if (flights.length === 0) {
    return (
      <section className="w-full min-w-0 rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-8 text-center shadow-xl shadow-black/25 backdrop-blur-xl">
        <p className="text-sm text-white/45">No flights available yet.</p>

        <Button
          onClick={fetchFlights}
          variant="outline"
          className="mt-4 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0 space-y-5">
      {flights.map((flight, index) => (
        <FlightCard
          key={flight._id}
          index={index}
          flight={{
            id: flight.flightNo,
            airline: flight.airline,
            flightNo: flight.flightNo,
            from: flight.origin,
            to: flight.destination,
            codeFrom: flight.originCode,
            codeTo: flight.destinationCode,
            date: flight.departureDate,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            duration: flight.duration,
            classType: flight.classType,
            baggage: flight.baggage,
            price: `₱${flight.price.toLocaleString()}`,
            tag: flight.tag,
          }}
        />
      ))}
    </section>
  );
}