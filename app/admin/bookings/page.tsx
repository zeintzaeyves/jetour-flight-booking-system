import Link from "next/link";
import { connection } from "next/server";

import AdminBookingsTable from "@/components/admin/bookings/AdminBookingsTable";
import AdminShell from "@/components/admin/layout/AdminShell";
import { getAdminBookings } from "@/lib/admin/stats";
import { assertAdminPage } from "@/lib/auth/admin";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Pending", "Confirmed", "Cancelled"] as const;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await connection();
  await assertAdminPage();
  const { status } = await searchParams;
  const active = FILTERS.find((f) => f === status) ?? "All";
  const bookings = await getAdminBookings(active === "All" ? undefined : active);

  return (
    <AdminShell
      title="Bookings"
      description="Confirm or cancel reservations. Cancelling returns the seats to the flight."
    >
      <nav aria-label="Filter by status" className="mb-4 flex w-fit gap-1 rounded-xl bg-muted p-1">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "All" ? "/admin/bookings" : `/admin/bookings?status=${f}`}
            aria-current={active === f ? "true" : undefined}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
              active === f && "bg-card text-foreground shadow-xs"
            )}
          >
            {f}
          </Link>
        ))}
      </nav>
      <AdminBookingsTable bookings={bookings} />
      {bookings.length >= 500 ? (
        <p className="mt-3 text-sm text-muted-foreground">Showing the 500 most recent bookings.</p>
      ) : null}
    </AdminShell>
  );
}
