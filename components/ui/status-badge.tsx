import { Badge } from "@/components/ui/badge";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

// Single source of truth for how domain statuses look everywhere.
const TONES: Record<string, Tone> = {
  // Booking
  Pending: "warning",
  Confirmed: "success",
  Cancelled: "danger",
  // Flight
  Scheduled: "success",
  Delayed: "warning",
  Completed: "neutral",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge variant={TONES[status] ?? "neutral"} className={className}>
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-current opacity-70"
      />
      {status}
    </Badge>
  );
}
