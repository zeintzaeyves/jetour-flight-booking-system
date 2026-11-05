"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, LayoutDashboard, Route } from "lucide-react";

import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Flights", href: "/admin/flights", icon: Route },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Admin"
      className="-mx-1 flex gap-1 overflow-x-auto lg:mx-0 lg:flex-col lg:overflow-visible"
    >
      {LINKS.map(({ label, href, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground",
              active &&
                "bg-white/10 text-foreground shadow-[inset_0_0_0_1px_oklch(1_0_0/0.08)] before:absolute before:inset-y-2 before:-left-1 before:hidden before:w-0.5 before:rounded-full before:bg-brand lg:before:block"
            )}
          >
            <Icon className={cn("size-4", active && "text-brand-ink")} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
