import { handleError, ok } from "@/lib/api/response";
import { toPublicBooking } from "@/lib/bookings/serialize";
import { enforceRateLimit } from "@/lib/rateLimit";
import { changeBookingStatus } from "@/lib/bookings/service";
import { bookingLookupSchema } from "@/lib/validation/booking";

// Guest self-service cancellation: requires BOTH reference and email, like lookup.
// Releases the booked seats back to the flight. There is no payment, so no refund logic.
export async function POST(request: Request) {
  try {
    await enforceRateLimit(request, "cancel", 10, 10 * 60);
    const { reference, email } = bookingLookupSchema.parse(
      await request.json()
    );
    const booking = await changeBookingStatus(reference, "Cancelled", { email });
    return ok(toPublicBooking(booking), 200, "Booking cancelled.");
  } catch (error) {
    return handleError(error, "CANCEL_BOOKING_ERROR");
  }
}
