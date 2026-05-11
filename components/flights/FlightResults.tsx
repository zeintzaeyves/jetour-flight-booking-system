"use client";

import FlightCard from "./FlightCard";

const flights = [
  {
    id: "jt-204",
    airline: "Jetour Airways",
    flightNo: "JT-204",
    from: "Manila",
    to: "Tokyo",
    codeFrom: "MNL",
    codeTo: "NRT",
    date: "May 24, 2026",
    departureTime: "08:30 AM",
    arrivalTime: "12:50 PM",
    duration: "4h 20m",
    classType: "Economy",
    baggage: "20kg",
    price: "₱12,499",
    tag: "Popular",
  },
  {
    id: "jt-118",
    airline: "Jetour Airways",
    flightNo: "JT-118",
    from: "Manila",
    to: "Seoul",
    codeFrom: "MNL",
    codeTo: "ICN",
    date: "May 28, 2026",
    departureTime: "10:15 AM",
    arrivalTime: "02:10 PM",
    duration: "3h 55m",
    classType: "Economy",
    baggage: "20kg",
    price: "₱9,899",
    tag: "Best fare",
  },
  {
    id: "jt-332",
    airline: "Jetour Airways",
    flightNo: "JT-332",
    from: "Cebu",
    to: "Singapore",
    codeFrom: "CEB",
    codeTo: "SIN",
    date: "June 02, 2026",
    departureTime: "06:20 PM",
    arrivalTime: "09:55 PM",
    duration: "3h 35m",
    classType: "Business",
    baggage: "30kg",
    price: "₱18,499",
    tag: "Premium",
  },
  {
    id: "jt-409",
    airline: "Sky Manila",
    flightNo: "SM-409",
    from: "Clark",
    to: "Bangkok",
    codeFrom: "CRK",
    codeTo: "BKK",
    date: "June 07, 2026",
    departureTime: "07:45 AM",
    arrivalTime: "10:50 AM",
    duration: "3h 05m",
    classType: "Economy",
    baggage: "15kg",
    price: "₱6,999",
    tag: "Limited",
  },
];

export default function FlightResults() {
  return (
    <section className="w-full min-w-0 space-y-5">
      {flights.map((flight, index) => (
        <FlightCard key={flight.id} flight={flight} index={index} />
      ))}
    </section>
  );
}