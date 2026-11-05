import mongoose from "mongoose";

import { requireAdmin } from "@/lib/auth/admin";
import { ApiError, handleError, ok } from "@/lib/api/response";
import { connectDB } from "@/lib/mongodb";
import { flightPatchSchema } from "@/lib/validation/flight";
import Booking from "@/models/Booking";
import Flight from "@/models/Flight";

type RouteContext = { params: Promise<{ id: string }> };

function buildFlightQuery(id: string) {
  const flightNo = id.toUpperCase();
  return mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ _id: id }, { flightNo }] }
    : { flightNo };
}

const notFound = () =>
  new ApiError(404, "FLIGHT_NOT_FOUND", "Flight not found.");

export async function GET(_request: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const flight = await Flight.findOne(buildFlightQuery(id));
    if (!flight) throw notFound();
    return ok(flight);
  } catch (error) {
    return handleError(error, "GET_FLIGHT_ERROR");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const patch = flightPatchSchema.parse(await request.json());
    await connectDB();
    const flight = await Flight.findOneAndUpdate(buildFlightQuery(id), patch, {
      new: true,
      runValidators: true,
    });
    if (!flight) throw notFound();
    return ok(flight, 200, "Flight updated successfully.");
  } catch (error) {
    return handleError(error, "UPDATE_FLIGHT_ERROR");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const existing = await Flight.findOne(buildFlightQuery(id));
    if (!existing) throw notFound();
    // Never orphan live reservations.
    const active = await Booking.countDocuments({
      flightNo: existing.flightNo,
      status: { $ne: "Cancelled" },
    });
    if (active > 0) {
      throw new ApiError(
        409,
        "FLIGHT_HAS_BOOKINGS",
        `This flight has ${active} active booking${active === 1 ? "" : "s"}. Cancel them first, or mark the flight Cancelled instead of deleting it.`
      );
    }
    const flight = await Flight.findOneAndDelete({ _id: existing._id });
    if (!flight) throw notFound();
    return ok(null, 200, "Flight deleted successfully.");
  } catch (error) {
    return handleError(error, "DELETE_FLIGHT_ERROR");
  }
}
