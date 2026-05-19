import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Flight from "@/models/Flight";

export async function GET() {
  try {
    await connectDB();

    const flights = await Flight.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: flights,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_FLIGHTS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch flights.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const flight = await Flight.create({
      flightNo: body.flightNo,
      airline: body.airline || "Jetour Airways",
      origin: body.origin,
      destination: body.destination,
      originCode: body.originCode,
      destinationCode: body.destinationCode,
      departureDate: body.departureDate,
      departureTime: body.departureTime,
      arrivalTime: body.arrivalTime,
      duration: body.duration,
      classType: body.classType || "Economy",
      baggage: body.baggage || "20kg",
      price: body.price,
      availableSeats: body.availableSeats,
      status: body.status || "Scheduled",
      tag: body.tag || "Available",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Flight created successfully.",
        data: flight,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_FLIGHT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create flight.",
      },
      { status: 500 }
    );
  }
}