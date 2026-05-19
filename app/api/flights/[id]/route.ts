import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Flight from "@/models/Flight";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function buildFlightQuery(id: string) {
  const normalizedId = id.toUpperCase();

  if (mongoose.Types.ObjectId.isValid(id)) {
    return {
      $or: [{ _id: id }, { flightNo: normalizedId }],
    };
  }

  return {
    flightNo: normalizedId,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const flight = await Flight.findOne(buildFlightQuery(id));

    if (!flight) {
      return NextResponse.json(
        {
          success: false,
          message: "Flight not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: flight,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_FLIGHT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch flight.",
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

    const flight = await Flight.findOneAndUpdate(buildFlightQuery(id), body, {
      new: true,
      runValidators: true,
    });

    if (!flight) {
      return NextResponse.json(
        {
          success: false,
          message: "Flight not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Flight updated successfully.",
        data: flight,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE_FLIGHT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update flight.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const flight = await Flight.findOneAndDelete(buildFlightQuery(id));

    if (!flight) {
      return NextResponse.json(
        {
          success: false,
          message: "Flight not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Flight deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE_FLIGHT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete flight.",
      },
      { status: 500 }
    );
  }
}