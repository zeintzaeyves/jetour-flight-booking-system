import { StatusBadge } from "@/components/ui/status-badge";
import type { PublicBooking } from "@/lib/bookings/serialize";
import { normalizeDate } from "@/lib/flights/search";
import { formatDateShort, formatPeso, formatTime12 } from "@/lib/format";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

/** Read-only booking summary shared by the confirmation page and Manage booking. */
export default function BookingDetails({
  booking,
  actions,
}: {
  booking: PublicBooking;
  actions?: React.ReactNode;
}) {
  const date = normalizeDate(booking.departureDate);
  const travellers = [booking.fullName, ...booking.additionalPassengers];
  const cancelled = booking.status === "Cancelled";

  return (
    <section
      aria-label={`Booking ${booking.bookingReference}`}
      className="rounded-[1.75rem] border border-border bg-card shadow-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
        <div>
          <p className="text-eyebrow text-muted-foreground">Booking reference</p>
          <p className="mt-1.5 text-xl font-semibold tracking-wider tabular-nums">
            {booking.bookingReference}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
          <p className="text-2xl font-semibold tracking-tight">{booking.route}</p>
          <p className="text-sm text-muted-foreground">
            {booking.flightNo} · {booking.classType}
          </p>
        </div>

        <dl className="divide-y divide-border">
          <Row label="Departure">
            {date ? formatDateShort(date) : booking.departureDate} ·{" "}
            {formatTime12(booking.departureTime)}
          </Row>
          <Row label={`Passenger${travellers.length > 1 ? "s" : ""}`}>
            <ul className="space-y-0.5">
              {travellers.map((name, i) => (
                <li key={`${name}-${i}`}>
                  {name}
                  {i === 0 ? <span className="text-muted-foreground"> (lead)</span> : null}
                </li>
              ))}
            </ul>
          </Row>
          <Row label="Contact">
            {booking.email}
            <br />
            <span className="text-muted-foreground">{booking.phone}</span>
          </Row>
          <Row label="Seat preference">{booking.seatPreference}</Row>
          {booking.specialRequest ? (
            <Row label="Special request">{booking.specialRequest}</Row>
          ) : null}
          <Row label={cancelled ? "Amount (cancelled)" : "Total"}>
            <span className={`font-semibold tabular-nums ${cancelled ? "line-through" : ""}`}>
              {formatPeso(booking.totalAmount, true)}
            </span>
            <span className="ml-2 text-muted-foreground">No online payment collected</span>
          </Row>
        </dl>
      </div>

      {actions ? <div className="border-t border-border p-5 sm:p-6">{actions}</div> : null}
    </section>
  );
}
