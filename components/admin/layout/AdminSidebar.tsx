"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  CalendarCheck,
  LayoutDashboard,
  MapPinned,
  Plane,
} from "lucide-react";

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Flights",
    href: "/admin/flights",
    icon: Plane,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Destinations",
    href: "/admin/destinations",
    icon: MapPinned,
  },
  {
    label: "Promos",
    href: "/admin/promos",
    icon: BadgePercent,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-fit overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl lg:sticky lg:top-28 lg:block">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />

      <div className="relative">
        <Link href="/" className="block rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
          <p className="text-2xl font-semibold tracking-[-0.06em] text-white">
            Jetour
          </p>
          <p className="mt-1 text-sm text-white/40">Admin Console</p>
        </Link>

        <nav className="mt-5 space-y-2">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-full border px-4 py-3 text-sm transition duration-300 ${
                  isActive
                    ? "border-white/15 bg-white text-black"
                    : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </aside>
  );
}