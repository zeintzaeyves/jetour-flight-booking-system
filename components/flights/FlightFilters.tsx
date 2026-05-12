"use client";

import { motion } from "motion/react";
import {
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Plane,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

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
      className="relative h-fit overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-xl lg:sticky lg:top-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.025] to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-0 h-52 w-52 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold tracking-[-0.04em]">Filters</p>
            <p className="mt-1 text-sm text-white/40">Refine your route</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-xl shadow-black/20 backdrop-blur-xl">
            <SlidersHorizontal className="h-4 w-4 text-white/70" />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <CircleDollarSign className="h-4 w-4 text-white/70" />
            </div>
            <p className="text-xs text-white/40">Lowest fare</p>
            <p className="mt-1 text-sm font-medium text-white">₱6,999</p>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Clock3 className="h-4 w-4 text-white/70" />
            </div>
            <p className="text-xs text-white/40">Fastest</p>
            <p className="mt-1 text-sm font-medium text-white">3h 05m</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium text-white/80">Sort by</p>

            <Select defaultValue="recommended">
              <SelectTrigger className="rounded-full border-white/10 bg-white/10 text-white shadow-none focus:ring-0 focus:ring-offset-0">
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

          <FilterGroup title="Airline" icon={Plane} items={airlines} />

          <div className="h-px bg-white/10" />

          <FilterGroup title="Class" icon={BadgeCheck} items={classes} />

          <div className="h-px bg-white/10" />

          <FilterGroup title="Stops" icon={Plane} items={stops} />

          <Button
            variant="outline"
            className="h-12 w-full rounded-full border-white/15 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset filters
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </motion.aside>
  );
}

type FilterGroupProps = {
  title: string;
  icon: React.ElementType;
  items: string[];
};

function FilterGroup({ title, icon: Icon, items }: FilterGroupProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-white/45" />
        <p className="text-sm font-medium text-white/80">{title}</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item}
            className="group flex cursor-pointer items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/55 transition duration-300 hover:bg-white/[0.08] hover:text-white"
          >
            <span>{item}</span>

            <Checkbox className="border-white/20 bg-transparent data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-black" />
          </label>
        ))}
      </div>
    </div>
  );
}