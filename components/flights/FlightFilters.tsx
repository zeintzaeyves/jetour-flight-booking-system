"use client";

import { SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const airlines = ["Jetour Airways", "Sky Manila", "Pacific Air"];
const classes = ["Economy", "Premium Economy", "Business"];
const stops = ["Direct", "1 Stop", "2 Stops"];

export default function FlightFilters() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
      className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-xl lg:sticky lg:top-28"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.1] via-white/[0.025] to-transparent" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-lg font-medium tracking-[-0.03em]">Filters</p>
            <p className="mt-1 text-sm text-white/40">Refine your search</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10">
            <SlidersHorizontal className="h-4 w-4 text-white/70" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium text-white/80">Sort by</p>

            <Select defaultValue="recommended">
              <SelectTrigger className="rounded-full border-white/10 bg-white/10 text-white">
                <SelectValue placeholder="Sort flights" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="lowest">Lowest price</SelectItem>
                <SelectItem value="fastest">Fastest flight</SelectItem>
                <SelectItem value="earliest">Earliest departure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <p className="mb-3 text-sm font-medium text-white/80">Airline</p>

            <div className="space-y-3">
              {airlines.map((airline) => (
                <label
                  key={airline}
                  className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/55 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Checkbox className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                  {airline}
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <p className="mb-3 text-sm font-medium text-white/80">Class</p>

            <div className="space-y-3">
              {classes.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/55 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Checkbox className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <p className="mb-3 text-sm font-medium text-white/80">Stops</p>

            <div className="space-y-3">
              {stops.map((stop) => (
                <label
                  key={stop}
                  className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/55 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Checkbox className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                  {stop}
                </label>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            Reset filters
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}