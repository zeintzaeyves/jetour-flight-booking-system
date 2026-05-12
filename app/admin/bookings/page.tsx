import AdminBookingsTable from "@/components/admin/bookings/AdminBookingsTable";
import AdminShell from "@/components/admin/layout/AdminShell";
import {
  CalendarCheck,
  CircleAlert,
  Clock3,
  TicketCheck,
} from "lucide-react";

const bookingStats = [
  {
    label: "Total bookings",
    value: "342",
    meta: "All reservations",
    icon: TicketCheck,
  },
  {
    label: "Confirmed",
    value: "286",
    meta: "Ready for travel",
    icon: CalendarCheck,
  },
  {
    label: "Pending",
    value: "42",
    meta: "Needs review",
    icon: Clock3,
  },
  {
    label: "Cancelled",
    value: "14",
    meta: "Inactive bookings",
    icon: CircleAlert,
  },
];

export default function AdminBookingsPage() {
  return (
    <AdminShell
      title="Bookings"
      description="Review customer reservations, update booking status, and manage Jetour flight reservations."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bookingStats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/45">{item.label}</p>
                    <p className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
                      {item.value}
                    </p>
                    <p className="mt-3 text-xs text-white/40">{item.meta}</p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
              </div>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative mb-5 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-white/45">Booking records</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                Manage reservations
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                Static booking management interface for now. Later, this table
                will connect to MongoDB through the bookings API routes.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/60 backdrop-blur-xl">
              Latest reservations
            </div>
          </div>

          <div className="relative">
            <AdminBookingsTable />
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        </div>
      </div>
    </AdminShell>
  );
}