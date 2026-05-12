import AdminShell from "@/components/admin/layout/AdminShell";
import AdminOverview from "@/components/admin/overview/AdminOverview";

export default function AdminPage() {
  return (
    <AdminShell
      title="Dashboard"
      description="Monitor flights, bookings, destinations, and system activity from one refined admin console."
    >
      <AdminOverview />
    </AdminShell>
  );
}