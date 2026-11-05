import { handleError, ok } from "@/lib/api/response";
import { toPublicBooking } from "@/lib/bookings/serialize";
import { enforceRateLimit } from "@/lib/rateLimit";
import { lookupBooking } from "@/lib/bookings/service";
import { bookingLookupSchema } from "@/lib/validation/booking";

export async function POST(request: Request) {
  try {
    // Reference enumeration guard: 30 lookups per IP per 10 minutes.
    await enforceRateLimit(request, "lookup", 30, 10 * 60);
    const { reference, email } = bookingLookupSchema.parse(
      await request.json()
    );
    const booking = await lookupBooking(reference, email);
    return ok(toPublicBooking(booking));
  } catch (error) {
    return handleError(error, "LOOKUP_BOOKING_ERROR");
  }
}
