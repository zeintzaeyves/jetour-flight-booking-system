import { connection } from "next/server";
import { Plus } from "lucide-react";

import AdminFlightsTable from "@/components/admin/flights/AdminFlightsTable";
import FlightFormDialog from "@/components/admin/flights/FlightFormDialog";
import AdminShell from "@/components/admin/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { getAdminFlights } from "@/lib/admin/stats";
import { assertAdminPage } from "@/lib/auth/admin";

export default async function AdminFlightsPage() {
  await connection();
  await assertAdminPage();
  const flights = await getAdminFlights();

  return (
    <AdminShell
      title="Flights"
      description="Create and manage flights. Changes appear on the public site within minutes."
      actions={
        <FlightFormDialog>
          <Button variant="brand">
            <Plus aria-hidden />
            Add flight
          </Button>
        </FlightFormDialog>
      }
    >
      <AdminFlightsTable flights={flights} />
    </AdminShell>
  );
}
