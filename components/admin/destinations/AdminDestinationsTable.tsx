"use client";

import Image from "next/image";
import {
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const destinations = [
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    code: "NRT",
    image: "/images/tokyo.jpg",
    price: "from ₱12,499",
    status: "Published",
    featured: true,
    routes: 8,
  },
  {
    id: "seoul",
    city: "Seoul",
    country: "South Korea",
    code: "ICN",
    image: "/images/seoul.jpg",
    price: "from ₱9,899",
    status: "Published",
    featured: true,
    routes: 6,
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    image: "/images/singapore.jpg",
    price: "from ₱7,499",
    status: "Published",
    featured: true,
    routes: 7,
  },
  {
    id: "bangkok",
    city: "Bangkok",
    country: "Thailand",
    code: "BKK",
    image: "/images/bangkok.jpg",
    price: "from ₱6,999",
    status: "Draft",
    featured: false,
    routes: 4,
  },
];

export default function AdminDestinationsTable() {
  const handleAction = (message: string) => {
    toast.success(message);
  };

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
      <div className="hidden grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr_auto] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/35 xl:grid">
        <span>Destination</span>
        <span>Airport</span>
        <span>Starting fare</span>
        <span>Routes</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-white/10">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="grid gap-4 px-5 py-5 text-sm xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr_auto] xl:items-center"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5">
                <Image
                  src={destination.image}
                  alt={`${destination.city}, ${destination.country}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{destination.city}</p>

                  {destination.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-300/10 bg-yellow-400/10 px-2 py-0.5 text-[11px] text-yellow-100">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-white/40">
                  {destination.country}
                </p>
              </div>
            </div>

            <div>
              <p className="font-medium text-white">{destination.code}</p>
              <p className="mt-1 text-xs text-white/40">airport code</p>
            </div>

            <div>
              <p className="font-medium text-white">{destination.price}</p>
              <p className="mt-1 text-xs text-white/40">one-way fare</p>
            </div>

            <div>
              <p className="font-medium text-white">{destination.routes}</p>
              <p className="mt-1 text-xs text-white/40">linked routes</p>
            </div>

            <div>
              <StatusBadge status={destination.status} />
            </div>

            <div className="flex justify-start xl:justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="border-white/10 bg-[#0b0f13] text-white"
                >
                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`Editing ${destination.city}`)
                    }
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit destination
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`${destination.city} marked featured`)
                    }
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Toggle featured
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`${destination.city} published`)
                    }
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Publish
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleAction(`${destination.city} hidden`)}
                    className="cursor-pointer text-amber-200 focus:bg-amber-400/10 focus:text-amber-100"
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`${destination.city} deleted`)
                    }
                    className="cursor-pointer text-red-300 focus:bg-red-400/10 focus:text-red-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete destination
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const statusClass =
    status === "Published"
      ? "border-emerald-300/10 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10"
      : "border-amber-300/10 bg-amber-400/10 text-amber-200 hover:bg-amber-400/10";

  return (
    <Badge className={`rounded-full border px-3 py-1 ${statusClass}`}>
      {status}
    </Badge>
  );
}