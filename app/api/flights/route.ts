import { requireAdmin } from "@/lib/auth/admin";
import { handleError, ok } from "@/lib/api/response";
import { connectDB } from "@/lib/mongodb";
import { flightInputSchema } from "@/lib/validation/flight";
import Flight from "@/models/Flight";

export async function GET() {
  try {
    await connectDB();
    const flights = await Flight.find().sort({ createdAt: -1 });
    return ok(flights);
  } catch (error) {
    return handleError(error, "GET_FLIGHTS_ERROR");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = flightInputSchema.parse(await request.json());
    await connectDB();
    const flight = await Flight.create(input);
    return ok(flight, 201, "Flight created successfully.");
  } catch (error) {
    return handleError(error, "CREATE_FLIGHT_ERROR");
  }
}
