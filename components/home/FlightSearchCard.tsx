"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeftRight,
  CalendarIcon,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FlightSearchCard() {
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();

  const tabClass =
    "relative rounded-none border-0 border-b border-transparent bg-transparent px-0 pb-4 text-sm font-medium text-white/45 shadow-none outline-none ring-0 transition hover:text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none";

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] text-white shadow-2xl shadow-black/50 backdrop-blur-3xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.16] via-white/[0.045] to-white/[0.02]" />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute -left-24 top-0 h-40 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-40 w-80 rounded-full bg-sky-500/15 blur-3xl" />

      <div className="relative">
        <div className="px-5 pt-5 md:px-8">
          <Tabs defaultValue="flights">
            <TabsList className="h-auto gap-9 rounded-none bg-transparent p-0 text-white/45 shadow-none">
              <TabsTrigger value="flights" className={tabClass}>
                Flights
              </TabsTrigger>

              <TabsTrigger value="hotels" className={tabClass}>
                Hotels
              </TabsTrigger>

              <TabsTrigger value="cars" className={tabClass}>
                Rent a car
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="grid gap-0 p-4 md:grid-cols-[1fr_auto_1fr_1fr_1fr_1fr_auto] md:items-center md:p-6">
          <div className="group flex items-center gap-4 rounded-2xl px-3 py-4 transition hover:bg-white/[0.05] md:rounded-none md:px-4">
            <MapPin className="h-5 w-5 shrink-0 text-white/45 transition group-hover:text-white/70" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/38">From</p>
              <Select defaultValue="manila">
                <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-base font-medium text-white shadow-none outline-none ring-0 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manila">Manila</SelectItem>
                  <SelectItem value="cebu">Cebu</SelectItem>
                  <SelectItem value="davao">Davao</SelectItem>
                  <SelectItem value="clark">Clark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden justify-center md:flex">
            <Button
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full bg-white text-black shadow-lg shadow-black/20 hover:bg-white/90"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl px-3 py-4 transition hover:bg-white/[0.05] md:rounded-none md:border-l md:border-white/10 md:px-4">
            <MapPin className="h-5 w-5 shrink-0 text-white/45 transition group-hover:text-white/70" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/38">To</p>
              <Select defaultValue="tokyo">
                <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-base font-medium text-white shadow-none outline-none ring-0 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                  <SelectItem value="seoul">Seoul</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="bangkok">Bangkok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl px-3 py-4 transition hover:bg-white/[0.05] md:rounded-none md:border-l md:border-white/10 md:px-4">
            <CalendarIcon className="h-5 w-5 shrink-0 text-white/45 transition group-hover:text-white/70" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/38">Check in</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-left text-base font-medium text-white outline-none ring-0 transition hover:text-white/80 focus:outline-none">
                    {departureDate
                      ? format(departureDate, "MMM dd")
                      : "Add Date"}
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl px-3 py-4 transition hover:bg-white/[0.05] md:rounded-none md:border-l md:border-white/10 md:px-4">
            <CalendarIcon className="h-5 w-5 shrink-0 text-white/45 transition group-hover:text-white/70" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/38">Check out</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-left text-base font-medium text-white outline-none ring-0 transition hover:text-white/80 focus:outline-none">
                    {returnDate ? format(returnDate, "MMM dd") : "Add Date"}
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl px-3 py-4 transition hover:bg-white/[0.05] md:rounded-none md:border-l md:border-white/10 md:px-4">
            <UserRound className="h-5 w-5 shrink-0 text-white/45 transition group-hover:text-white/70" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/38">Guest</p>
              <Select defaultValue="1">
                <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-base font-medium text-white shadow-none outline-none ring-0 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
                  <SelectValue placeholder="Add Guest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4 Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 md:mt-0 md:flex md:justify-end md:pl-4">
            <Button
              size="icon"
              className="h-14 w-full rounded-2xl bg-sky-500 text-white shadow-xl shadow-sky-500/20 transition hover:scale-105 hover:bg-sky-400 md:w-14 md:rounded-full"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}