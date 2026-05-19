import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function buildBookingQuery(id: string) {
  const normalizedId = id.toUpperCase();

  if (mongoose.Types.ObjectId.isValid(id)) {
    return {
      $or: [{ _id: id }, { bookingReference: normalizedId }],
    };
  }

  return {
    bookingReference: normalizedId,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const booking = await Booking.findOne(buildBookingQuery(id));

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: booking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_BOOKING_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch booking.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    const booking = await Booking.findOneAndUpdate(buildBookingQuery(id), body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking updated successfully.",
        data: booking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE_BOOKING_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const booking = await Booking.findOneAndDelete(buildBookingQuery(id));

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE_BOOKING_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete booking.",
      },
      { status: 500 }
    );
  }
}