import { requireAdmin } from "@/lib/auth/admin";
import { handleError, ok } from "@/lib/api/response";
import { enforceRateLimit } from "@/lib/rateLimit";
import { toPublicBooking } from "@/lib/bookings/serialize";
import { createBooking } from "@/lib/bookings/service";
import { connectDB } from "@/lib/mongodb";
import { bookingInputSchema } from "@/lib/validation/booking";
import Booking from "@/models/Booking";

// Admin only: contains passenger personal data.
export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return ok(bookings);
  } catch (error) {
    return handleError(error, "GET_BOOKINGS_ERROR");
  }
}

export async function POST(request: Request) {
  try {
    // Abuse guard: 20 booking attempts per IP per hour.
    await enforceRateLimit(request, "booking", 20, 60 * 60);
    const input = bookingInputSchema.parse(await request.json());
    const { booking, created } = await createBooking(input);
    return ok(
      toPublicBooking(booking),
      created ? 201 : 200,
      created ? "Booking created successfully." : "Booking already exists."
    );
  } catch (error) {
    return handleError(error, "CREATE_BOOKING_ERROR");
  }
}
