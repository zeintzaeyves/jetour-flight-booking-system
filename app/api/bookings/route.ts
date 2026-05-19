import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Flight from "@/models/Flight";

function generateBookingReference() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `JT-BKG-${randomNumber}`;
}

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_BOOKINGS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookings.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const flight = await Flight.findOne({
      flightNo: String(body.flightNo).toUpperCase(),
    });

    if (!flight) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected flight was not found.",
        },
        { status: 404 }
      );
    }

    const passengers = Number(body.passengers || 1);
    const totalAmount = flight.price * passengers;

    const booking = await Booking.create({
      bookingReference: generateBookingReference(),
      flightNo: flight.flightNo,
      flightId: flight._id,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      passengers,
      classType: body.classType || flight.classType,
      seatPreference: body.seatPreference || "Window seat",
      specialRequest: body.specialRequest || "",
      route: `${flight.originCode} → ${flight.destinationCode}`,
      departureDate: flight.departureDate,
      departureTime: flight.departureTime,
      totalAmount,
      status: "Confirmed",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully.",
        data: booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_BOOKING_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create booking.",
      },
      { status: 500 }
    );
  }
}