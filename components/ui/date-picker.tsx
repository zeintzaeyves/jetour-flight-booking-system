"use client";

import * as React from "react";
import { Popover } from "radix-ui";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* Dates are plain "YYYY-MM-DD" strings in the visitor's local calendar. */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const todayIso = () => {
  const d = new Date();
  return toIso(d.getFullYear(), d.getMonth(), d.getDate());
};
function parse(iso: string | undefined): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  return match ? { y: +match[1], m: +match[2] - 1, d: +match[3] } : null;
}
function label(iso: string | undefined) {
  const p = parse(iso);
  if (!p) return "";
  return new Date(p.y, p.m, p.d).toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Props = {
  id?: string;
  /** Controlled value ("YYYY-MM-DD" or ""). Omit for an uncontrolled picker. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Earliest selectable date, or "today". */
  min?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Renders a hidden input so the picker works inside a native <form>. */
  name?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function DatePicker({
  id,
  value,
  defaultValue = "",
  onChange,
  min,
  placeholder = "Select date",
  disabled,
  name,
  className,
  ...aria
}: Props) {
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const current = controlled ? value : inner;

  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(current);
  const [view, setView] = React.useState({ y: 0, m: 0 });
  const grid = React.useRef<HTMLDivElement>(null);

  const today = open ? todayIso() : "";
  const floor = min === "today" ? today : min || "";

  function onOpenChange(next: boolean) {
    if (next) {
      const start = parse(current) ?? parse(floor) ?? parse(todayIso())!;
      setDraft(current);
      setView({ y: start.y, m: start.m });
    }
    setOpen(next);
  }

  function confirm() {
    if (!controlled) setInner(draft);
    onChange?.(draft);
    setOpen(false);
  }

  const shift = (delta: number) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const first = new Date(view.y, view.m, 1).getDay();
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  const floorParts = parse(floor);
  const prevDisabled = !!floorParts && view.y * 12 + view.m <= floorParts.y * 12 + floorParts.m;

  // Arrow keys move between days; Enter/Space (native button) selects.
  function onGridKey(e: React.KeyboardEvent) {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    const el = document.activeElement as HTMLElement | null;
    const iso = el?.dataset.iso;
    const p = parse(iso);
    if (!p) return;
    e.preventDefault();
    const next = new Date(p.y, p.m, p.d + step);
    const nextIso = toIso(next.getFullYear(), next.getMonth(), next.getDate());
    if (floor && nextIso < floor) return;
    setView({ y: next.getFullYear(), m: next.getMonth() });
    requestAnimationFrame(() =>
      grid.current?.querySelector<HTMLElement>(`[data-iso="${nextIso}"]`)?.focus()
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      {name ? <input type="hidden" name={name} value={current} /> : null}
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={aria["aria-invalid"]}
          aria-describedby={aria["aria-describedby"]}
          className={cn(
            "flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-full border border-input bg-white/10 px-5 text-left text-base shadow-xs outline-none transition-colors hover:bg-white/15 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
            className
          )}
        >
          <span className={cn("truncate", !current && "text-muted-foreground")}>
            {label(current) || placeholder}
          </span>
          <CalendarDays aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={12}
          aria-label="Choose a date"
          className="z-[100] w-[min(20rem,calc(100vw-1.5rem))] rounded-[1.75rem] border border-border bg-popover p-4 text-popover-foreground shadow-pop outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shift(-1)}
              disabled={prevDisabled}
              aria-label="Previous month"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <p className="text-sm font-semibold" aria-live="polite">
              {MONTHS[view.m]} {view.y}
            </p>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label="Next month"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center text-xs text-muted-foreground">
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1">{d}</span>
            ))}
          </div>

          <div ref={grid} role="grid" onKeyDown={onGridKey} className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (day === null) return <span key={`b${i}`} />;
              const iso = toIso(view.y, view.m, day);
              const off = !!floor && iso < floor;
              const selected = iso === draft;
              return (
                <button
                  key={iso}
                  type="button"
                  data-iso={iso}
                  disabled={off}
                  aria-pressed={selected}
                  aria-label={label(iso)}
                  onClick={() => setDraft(iso)}
                  onDoubleClick={() => {
                    setDraft(iso);
                    if (!controlled) setInner(iso);
                    onChange?.(iso);
                    setOpen(false);
                  }}
                  className={cn(
                    "mx-auto flex size-9 items-center justify-center rounded-full text-sm tabular-nums outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    off && "pointer-events-none opacity-30",
                    !off && !selected && "hover:bg-white/10",
                    iso === today && !selected && "border border-brand/60 text-brand-ink",
                    selected && "bg-brand font-semibold text-brand-foreground"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
            <p className="min-w-0 truncate text-xs text-muted-foreground">
              {draft ? label(draft) : "No date selected"}
            </p>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="brand" size="sm" onClick={confirm} disabled={!draft}>
                Confirm
              </Button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
