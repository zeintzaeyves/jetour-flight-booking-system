"use client";

import Link from "next/link";
import { ArrowLeft, Search, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdminTopbarProps = {
  title: string;
  description: string;
};

export default function AdminTopbar({ title, description }: AdminTopbarProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-xl md:flex-row md:items-center">
      <div>
        <Button
          asChild
          variant="outline"
          className="mb-5 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to site
          </Link>
        </Button>

        <p className="text-xs uppercase tracking-[0.32em] text-white/40">
          Jetour Console
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Search className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <UserRound className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}