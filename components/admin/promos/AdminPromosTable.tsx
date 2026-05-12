"use client";

import {
  Eye,
  EyeOff,
  Gift,
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

const promos = [
  {
    id: "spring-escape",
    title: "Spring Escape",
    code: "JETOUR12",
    discount: "12% off",
    targetRoute: "MNL → NRT",
    validity: "May 01 - May 31, 2026",
    status: "Published",
    featured: true,
  },
  {
    id: "seoul-weekend",
    title: "Seoul Weekend",
    code: "SEOUL999",
    discount: "₱999 off",
    targetRoute: "MNL → ICN",
    validity: "May 15 - June 15, 2026",
    status: "Published",
    featured: true,
  },
  {
    id: "business-upgrade",
    title: "Business Upgrade",
    code: "BIZPLUS",
    discount: "15% off",
    targetRoute: "CEB → SIN",
    validity: "June 01 - June 30, 2026",
    status: "Draft",
    featured: false,
  },
  {
    id: "bangkok-lite",
    title: "Bangkok Lite",
    code: "BKKGO",
    discount: "₱750 off",
    targetRoute: "CRK → BKK",
    validity: "June 07 - July 07, 2026",
    status: "Hidden",
    featured: false,
  },
];

export default function AdminPromosTable() {
  const handleAction = (message: string) => {
    toast.success(message);
  };

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
      <div className="hidden grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr_0.8fr_auto] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/35 xl:grid">
        <span>Promo</span>
        <span>Code</span>
        <span>Discount</span>
        <span>Route</span>
        <span>Validity</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-white/10">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="grid gap-4 px-5 py-5 text-sm xl:grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr_0.8fr_auto] xl:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/20">
                <Gift className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{promo.title}</p>

                  {promo.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-300/10 bg-yellow-400/10 px-2 py-0.5 text-[11px] text-yellow-100">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-white/40">Campaign promo</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-white">{promo.code}</p>
              <p className="mt-1 text-xs text-white/40">voucher code</p>
            </div>

            <div>
              <p className="font-medium text-white">{promo.discount}</p>
              <p className="mt-1 text-xs text-white/40">fare discount</p>
            </div>

            <div>
              <p className="font-medium text-white">{promo.targetRoute}</p>
              <p className="mt-1 text-xs text-white/40">target route</p>
            </div>

            <div>
              <p className="text-white/80">{promo.validity}</p>
              <p className="mt-1 text-xs text-white/40">campaign period</p>
            </div>

            <div>
              <StatusBadge status={promo.status} />
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
                    onClick={() => handleAction(`Editing ${promo.title}`)}
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit promo
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleAction(`${promo.title} marked featured`)
                    }
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Toggle featured
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleAction(`${promo.title} published`)}
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Publish
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleAction(`${promo.title} hidden`)}
                    className="cursor-pointer text-amber-200 focus:bg-amber-400/10 focus:text-amber-100"
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleAction(`${promo.title} deleted`)}
                    className="cursor-pointer text-red-300 focus:bg-red-400/10 focus:text-red-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete promo
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
      : status === "Draft"
        ? "border-amber-300/10 bg-amber-400/10 text-amber-200 hover:bg-amber-400/10"
        : "border-red-300/10 bg-red-400/10 text-red-200 hover:bg-red-400/10";

  return (
    <Badge className={`rounded-full border px-3 py-1 ${statusClass}`}>
      {status}
    </Badge>
  );
}