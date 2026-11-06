"use client";

import * as React from "react";
import { Popover } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Shown when `value` matches no option (e.g. an empty "Select origin"). */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

/**
 * Dropdown that matches DatePicker: same pill trigger, same glass popup.
 * Picking an option applies immediately (there is nothing to confirm).
 */
export function SelectMenu({
  id,
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled,
  className,
  ...aria
}: Props) {
  const [open, setOpen] = React.useState(false);
  const listId = React.useId();
  const list = React.useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  function pick(next: string) {
    onChange(next);
    setOpen(false);
  }

  // Focus the chosen option (or the first) when the list opens.
  function onOpenAutoFocus(e: Event) {
    e.preventDefault();
    const items = list.current?.querySelectorAll<HTMLElement>('[role="option"]');
    const target =
      list.current?.querySelector<HTMLElement>('[aria-selected="true"]') ?? items?.[0];
    target?.focus();
    target?.scrollIntoView({ block: "nearest" });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const items = [...(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    const at = items.indexOf(document.activeElement as HTMLElement);
    const move = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    if (e.key === "ArrowDown") move(at + 1);
    else if (e.key === "ArrowUp") move(at - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(items.length - 1);
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      // Type-ahead: jump to the next option starting with the typed letter.
      const letter = e.key.toLowerCase();
      const from = items.slice(at + 1).concat(items.slice(0, at + 1));
      from.find((el) => el.textContent?.trim().toLowerCase().startsWith(letter))?.focus();
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          disabled={disabled}
          aria-invalid={aria["aria-invalid"]}
          aria-describedby={aria["aria-describedby"]}
          className={cn(
            "flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-full border border-input bg-white/10 px-5 text-left text-base shadow-xs outline-none transition-colors hover:bg-white/15 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
            className
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            aria-hidden
            className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={12}
          onOpenAutoFocus={onOpenAutoFocus}
          className="z-[100] w-(--radix-popover-trigger-width) min-w-48 rounded-[1.75rem] border border-border bg-popover p-2 text-popover-foreground shadow-pop outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div
            ref={list}
            id={listId}
            role="listbox"
            onKeyDown={onKeyDown}
            className="max-h-64 space-y-0.5 overflow-y-auto overscroll-contain"
          >
            {options.map((o) => {
              const isSelected = o.value === value;
              return (
                <button
                  key={o.value || "__empty"}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => pick(o.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-full px-4 py-2.5 text-left text-sm outline-none transition-colors hover:bg-white/10 focus-visible:bg-white/10",
                    isSelected && "bg-white/10 font-medium"
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {isSelected ? <Check aria-hidden className="size-4 shrink-0 text-brand-ink" /> : null}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
