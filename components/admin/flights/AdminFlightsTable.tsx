"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { adminRequest } from "@/components/admin/api";
import FlightFormDialog from "@/components/admin/flights/FlightFormDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPeso } from "@/lib/format";
import { FLIGHT_STATUSES } from "@/lib/validation/flight";
import type { Flight } from "@/types/flight";

export default function AdminFlightsTable({ flights }: { flights: Flight[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Flight | null>(null);

  async function setStatus(f: Flight, status: string) {
    setBusy(f.flightNo);
    const r = await adminRequest(`/api/flights/${encodeURIComponent(f.flightNo)}`, "PATCH", { status });
    setBusy(null);
    if (r.ok) {
      toast.success(
        status === "Cancelled"
          ? `${f.flightNo} marked Cancelled. Existing bookings are not cancelled automatically.`
          : `${f.flightNo} is now ${status}.`
      );
      router.refresh();
    } else if (r.status === 401) router.replace("/admin/login");
    else toast.error(r.message);
  }

  async function remove(f: Flight) {
    setBusy(f.flightNo);
    const r = await adminRequest(`/api/flights/${encodeURIComponent(f.flightNo)}`, "DELETE");
    setBusy(null);
    setToDelete(null);
    if (r.ok) {
      toast.success(`${f.flightNo} deleted.`);
      router.refresh();
    } else if (r.status === 401) router.replace("/admin/login");
    else toast.error(r.message);
  }

  if (flights.length === 0) {
    return (
      <p className="rounded-[1.75rem] border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No flights yet. Add your first flight to start taking bookings.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-[1.75rem] border border-border bg-card shadow-card">
        <Table className="min-w-[56rem]">
          <TableHeader>
            <TableRow>
              <TableHead>Flight</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead className="text-right">Seats</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights.map((f) => (
              <TableRow key={f._id}>
                <TableCell>
                  <div className="font-medium">{f.flightNo}</div>
                  <div className="text-xs text-muted-foreground">{f.airline} · {f.classType}</div>
                </TableCell>
                <TableCell>{f.originCode} → {f.destinationCode}</TableCell>
                <TableCell>
                  <div>{f.departureDate}</div>
                  <div className="text-xs text-muted-foreground">{f.departureTime} → {f.arrivalTime}</div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{f.availableSeats}</TableCell>
                <TableCell className="text-right tabular-nums">{formatPeso(f.price)}</TableCell>
                <TableCell className="w-40">
                  <NativeSelect
                    aria-label={`Status of ${f.flightNo}`}
                    value={f.status}
                    disabled={busy === f.flightNo}
                    onChange={(e) => setStatus(f, e.target.value)}
                    className="h-9 text-sm"
                  >
                    {FLIGHT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </NativeSelect>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <FlightFormDialog flight={f}>
                      <Button variant="ghost" size="icon-sm" aria-label={`Edit ${f.flightNo}`}>
                        <Pencil aria-hidden />
                      </Button>
                    </FlightFormDialog>
                    <Button variant="ghost" size="icon-sm" aria-label={`Delete ${f.flightNo}`} onClick={() => setToDelete(f)}>
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={toDelete !== null} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {toDelete?.flightNo}?</DialogTitle>
            <DialogDescription>
              This permanently removes the flight. Flights with active bookings can&apos;t be deleted. Mark them
              Cancelled instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Keep</Button></DialogClose>
            <Button variant="destructive" disabled={busy !== null} onClick={() => toDelete && remove(toDelete)}>
              Delete flight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
