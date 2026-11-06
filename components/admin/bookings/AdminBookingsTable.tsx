"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { adminRequest } from "@/components/admin/api";
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
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminBooking } from "@/lib/admin/stats";
import { formatPeso } from "@/lib/format";

type Pending = { booking: AdminBooking; action: "cancel" | "delete" } | null;

export default function AdminBookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  const router = useRouter();
  const [busyRef, setBusyRef] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  async function run(b: AdminBooking, action: "confirm" | "cancel" | "delete" | "paid") {
    setBusyRef(b.bookingReference);
    const url = `/api/bookings/${encodeURIComponent(b.bookingReference)}`;
    const result =
      action === "delete"
        ? await adminRequest(url, "DELETE")
        : action === "paid"
          ? await adminRequest(url, "PATCH", { paymentStatus: "Paid" })
          : await adminRequest(url, "PATCH", { status: action === "confirm" ? "Confirmed" : "Cancelled" });
    setBusyRef(null);
    setPending(null);
    if (result.ok) {
      toast.success(
        action === "delete" ? "Booking deleted." : action === "paid" ? "Payment recorded. E-ticket unlocked." : action === "confirm" ? "Booking confirmed." : "Booking cancelled. Seats released."
      );
      router.refresh();
    } else if (result.status === 401) {
      router.replace("/admin/login");
    } else {
      toast.error(result.message);
    }
  }

  if (bookings.length === 0) {
    return (
      <p className="rounded-[1.75rem] border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No bookings match this filter.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-[1.75rem] border border-border bg-card shadow-card">
        <Table className="min-w-[64rem]">
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Passenger</TableHead>
              <TableHead>Flight</TableHead>
              <TableHead className="text-right">Pax</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => {
              const busy = busyRef === b.bookingReference;
              return (
                <TableRow key={b._id}>
                  <TableCell className="font-medium tabular-nums">{b.bookingReference}</TableCell>
                  <TableCell>
                    <div className="font-medium">{b.fullName}</div>
                    <div className="text-xs text-muted-foreground">{b.email}</div>
                    {b.additionalPassengers?.length ? (
                      <div className="text-xs text-muted-foreground">
                        + {b.additionalPassengers.join(", ")}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <div>{b.flightNo} · {b.route}</div>
                    <div className="text-xs text-muted-foreground">{b.departureDate} {b.departureTime}</div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{b.passengers}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPeso(b.totalAmount)}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell>
                    <div className="text-sm">{b.paymentStatus === "Paid" ? "Paid" : "Pay later"}</div>
                    <div className="text-xs text-muted-foreground">{b.paymentMethod ?? "Airport counter"}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {b.status === "Pending" ? (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => run(b, "confirm")}>
                          Confirm
                        </Button>
                      ) : null}
                      {b.status !== "Cancelled" && b.paymentStatus !== "Paid" ? (
                        <Button size="sm" variant="brand" disabled={busy} onClick={() => run(b, "paid")}>
                          Mark paid
                        </Button>
                      ) : null}
                      {b.status !== "Cancelled" ? (
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => setPending({ booking: b, action: "cancel" })}>
                          Cancel
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => setPending({ booking: b, action: "delete" })}>
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pending?.action === "delete" ? "Delete this booking?" : "Cancel this booking?"}
            </DialogTitle>
            <DialogDescription>
              {pending?.action === "delete"
                ? `${pending.booking.bookingReference} will be permanently removed. Its seats were already released when it was cancelled.`
                : pending
                  ? `${pending.booking.bookingReference} will be cancelled and ${pending.booking.passengers} seat${pending.booking.passengers === 1 ? "" : "s"} returned to ${pending.booking.flightNo}.`
                  : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Keep</Button></DialogClose>
            <Button
              variant="destructive"
              disabled={busyRef !== null}
              onClick={() => pending && run(pending.booking, pending.action)}
            >
              {pending?.action === "delete" ? "Delete booking" : "Cancel booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
