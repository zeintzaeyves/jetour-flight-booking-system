import Link from "next/link";
import { connection } from "next/server";

import AdminShell from "@/components/admin/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminStats } from "@/lib/admin/stats";
import { assertAdminPage } from "@/lib/auth/admin";
import { formatPeso } from "@/lib/format";

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
      {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export default async function AdminPage() {
  await connection();
  await assertAdminPage();
  const s = await getAdminStats();

  return (
    <AdminShell title="Dashboard" description="Live numbers from your flights and bookings.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Scheduled flights" value={String(s.flights.scheduled)} note={`${s.flights.total} total`} />
        <Stat label="Open seats" value={s.flights.openSeats.toLocaleString("en-PH")} note="on scheduled flights" />
        <Stat
          label="Bookings"
          value={String(s.bookings.total)}
          note={`${s.bookings.confirmed} confirmed · ${s.bookings.pending} pending · ${s.bookings.cancelled} cancelled`}
        />
        <Stat label="Booked value" value={formatPeso(s.bookedValue)} note="Reservations only. No payments are collected." />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="recent" className="rounded-[1.75rem] border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 id="recent" className="text-title">Recent bookings</h2>
            <Button asChild variant="ghost" size="sm"><Link href="/admin/bookings">View all</Link></Button>
          </div>
          {s.recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {s.recent.map((b) => (
                <li key={b._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.bookingReference} · {b.route} · {b.passengers} pax
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm tabular-nums">{formatPeso(b.totalAmount)}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="low" className="rounded-[1.75rem] border border-border bg-card shadow-card">
          <div className="border-b border-border p-5">
            <h2 id="low" className="text-title">Selling out</h2>
          </div>
          {s.lowSeats.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No scheduled flight has 5 or fewer seats left.</p>
          ) : (
            <ul className="divide-y divide-border">
              {s.lowSeats.map((f) => (
                <li key={f._id} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                  <span>
                    <span className="font-medium">{f.flightNo}</span>
                    <span className="text-muted-foreground"> {f.originCode} → {f.destinationCode}</span>
                  </span>
                  <span className="font-medium text-warning-ink">{f.availableSeats} left</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
