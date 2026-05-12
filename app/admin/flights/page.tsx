import AdminShell from "@/components/admin/layout/AdminShell";
import AdminFlightsTable from "@/components/admin/flights/AdminFlightsTable";
import AdminFlightFormDialog from "@/components/admin/flights/AdminFlightFormDialog";
import {
  CalendarClock,
  CircleAlert,
  Plane,
  TicketCheck,
} from "lucide-react";

const flightStats = [
  {
    label: "Total flights",
    value: "128",
    meta: "Across all routes",
    icon: Plane,
  },
  {
    label: "Scheduled",
    value: "112",
    meta: "Ready for booking",
    icon: TicketCheck,
  },
  {
    label: "Delayed",
    value: "9",
    meta: "Needs attention",
    icon: CalendarClock,
  },
  {
    label: "Cancelled",
    value: "7",
    meta: "Inactive routes",
    icon: CircleAlert,
  },
];

export default function AdminFlightsPage() {
  return (
    <AdminShell
      title="Flights"
      description="Create, update, and manage Jetour flight schedules, fares, seat availability, and route status."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {flightStats.map((item) => {
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
              <p className="text-sm text-white/45">Flight records</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                Manage flight schedules
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                Static CRUD interface for now. Later, this table will connect to
                MongoDB through the flights API routes.
              </p>
            </div>

            <AdminFlightFormDialog />
          </div>

          <div className="relative">
            <AdminFlightsTable />
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        </div>
      </div>
    </AdminShell>
  );
}