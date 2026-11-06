import Link from "next/link";
import { connection } from "next/server";

import AdminShell from "@/components/admin/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminStats } from "@/lib/admin/stats";
import { assertAdminPage } from "@/lib/auth/admin";
import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";

const GLASS =
  "rounded-[1.75rem] border border-white/10 bg-card shadow-card";

function Stat({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn(GLASS, "relative overflow-hidden p-5")}>
      {accent ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-brand/20 blur-2xl"
        />
      ) : null}
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="relative mt-2 text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
      {note ? <p className="relative mt-1.5 text-xs leading-5 text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export default async function AdminPage() {
  await connection();
  await assertAdminPage();
  const s = await getAdminStats();

  const parts = [
    { label: "Confirmed", n: s.bookings.confirmed, bar: "bg-success", dot: "bg-success" },
    { label: "Pending", n: s.bookings.pending, bar: "bg-warning", dot: "bg-warning" },
    { label: "Cancelled", n: s.bookings.cancelled, bar: "bg-danger-ink/70", dot: "bg-danger-ink" },
  ];
  const today = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <AdminShell
      title="Dashboard"
      description={`${today}. Live numbers from your flights and bookings.`}
      actions={
        <div className="flex gap-2">
          <Button asChild variant="brand" size="sm">
            <Link href="/admin/flights">Manage flights</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/bookings">Review bookings</Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          accent
          label="Booked value"
          value={formatPeso(s.bookedValue)}
          note="Reservation value. Payments are simulated, no money is collected."
        />
        <Stat
          label="Bookings"
          value={String(s.bookings.total)}
          note={`${s.bookings.pending} waiting for review`}
        />
        <Stat
          label="Scheduled flights"
          value={String(s.flights.scheduled)}
          note={`${s.flights.total} in the catalog`}
        />
        <Stat
          label="Open seats"
          value={s.flights.openSeats.toLocaleString("en-PH")}
          note="across scheduled flights"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_21rem]">
        <section aria-labelledby="recent" className={GLASS}>
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <h2 id="recent" className="text-title">Recent bookings</h2>
            <Button asChild variant="ghost" size="sm"><Link href="/admin/bookings">View all</Link></Button>
          </div>
          {s.recent.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No bookings yet. They will show up here as soon as someone reserves a flight.
            </p>
          ) : (
            <ul className="divide-y divide-white/10">
              {s.recent.map((b) => (
                <li key={b._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-xs font-semibold uppercase"
                    >
                      {b.fullName.trim().charAt(0) || "?"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{b.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {b.bookingReference} · {b.route} · {b.passengers} pax
                      </p>
                    </div>
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

        <div className="space-y-6">
          <section aria-labelledby="status" className={cn(GLASS, "p-5")}>
            <h2 id="status" className="text-title">Booking status</h2>
            {s.bookings.total === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Nothing to chart yet.</p>
            ) : (
              <>
                <div
                  role="img"
                  aria-label={parts.map((p) => `${p.n} ${p.label.toLowerCase()}`).join(", ")}
                  className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-white/8"
                >
                  {parts.map((p) =>
                    p.n ? (
                      <span
                        key={p.label}
                        className={p.bar}
                        style={{ width: `${(p.n / s.bookings.total) * 100}%` }}
                      />
                    ) : null
                  )}
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {parts.map((p) => (
                    <li key={p.label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span aria-hidden className={cn("size-2 rounded-full", p.dot)} />
                        {p.label}
                      </span>
                      <span className="tabular-nums">
                        {p.n}
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {Math.round((p.n / s.bookings.total) * 100)}%
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section aria-labelledby="low" className={GLASS}>
            <div className="border-b border-white/10 p-5">
              <h2 id="low" className="text-title">Selling out</h2>
            </div>
            {s.lowSeats.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                No scheduled flight has 5 or fewer seats left.
              </p>
            ) : (
              <ul className="divide-y divide-white/10">
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
      </div>
    </AdminShell>
  );
}
