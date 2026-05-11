"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHoveringTop, setIsHoveringTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 40) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY <= 80) {
        setIsHoveringTop(true);
        setIsVisible(true);
      } else {
        setIsHoveringTop(false);

        if (window.scrollY > 80) {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  const shouldShowNavbar = isVisible || isHoveringTop;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full px-4 pt-4 transition-all duration-500 ease-out sm:px-6 ${
        shouldShowNavbar
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/45 px-4 text-white shadow-2xl shadow-black/20 backdrop-blur-xl md:px-5">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-semibold tracking-[-0.06em] text-white">
            Jetour
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/55 md:flex">
          <Link href="/flights" className="transition hover:text-white">
            Flights
          </Link>
          <Link href="/my-bookings" className="transition hover:text-white">
            My Bookings
          </Link>
          <Link href="/admin" className="transition hover:text-white">
            Admin CMS
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="hidden rounded-full text-white/70 hover:bg-white/10 hover:text-white md:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <UserRound className="h-4 w-4" />
          </Button>

          <Button asChild className="hidden rounded-full px-5 md:inline-flex">
            <Link href="/flights">Book</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
