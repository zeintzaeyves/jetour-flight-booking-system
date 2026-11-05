import { requireAdmin } from "@/lib/auth/admin";
import { ApiError, handleError, ok } from "@/lib/api/response";
import { changeBookingStatus } from "@/lib/bookings/service";
import { connectDB } from "@/lib/mongodb";
import { bookingStatusPatchSchema } from "@/lib/validation/booking";
import Booking from "@/models/Booking";

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () =>
  new ApiError(404, "BOOKING_NOT_FOUND", "Booking not found.");

// `id` is the booking reference (e.g. JT-7K3QX9PM or legacy JT-BKG-1234).
export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const booking = await Booking.findOne({
      bookingReference: id.toUpperCase(),
    });
    if (!booking) throw notFound();
    return ok(booking);
  } catch (error) {
    return handleError(error, "GET_BOOKING_ERROR");
  }
}

// Only `status` may change, and only along valid transitions.
export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const { status } = bookingStatusPatchSchema.parse(await request.json());
    const booking = await changeBookingStatus(id.toUpperCase(), status);
    return ok(booking, 200, "Booking updated successfully.");
  } catch (error) {
    return handleError(error, "UPDATE_BOOKING_ERROR");
  }
}

// Deleting would not return seats to the flight, so only cancelled bookings
// (whose seats were already released) may be removed.
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const reference = id.toUpperCase();
    const booking = await Booking.findOne({ bookingReference: reference });
    if (!booking) throw notFound();
    if (booking.status !== "Cancelled") {
      throw new ApiError(
        409,
        "BOOKING_ACTIVE",
        "Cancel this booking before deleting it, so its seats are released."
      );
    }
    await Booking.deleteOne({ _id: booking._id, status: "Cancelled" });
    return ok(null, 200, "Booking deleted successfully.");
  } catch (error) {
    return handleError(error, "DELETE_BOOKING_ERROR");
  }
}
