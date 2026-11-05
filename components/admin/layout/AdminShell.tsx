import Link from "next/link";
import { ExternalLink } from "lucide-react";

import AdminNav from "./AdminNav";
import LogoutButton from "./LogoutButton";

export default function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Soft colour behind the glass so the blur has something to refract. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(50rem_36rem_at_8%_-8%,oklch(0.76_0.13_235/0.20),transparent_70%),radial-gradient(44rem_34rem_at_100%_100%,oklch(0.7_0.1_190/0.12),transparent_70%)]"
      />

      <aside className="relative z-10 border-b border-white/10 bg-black/35 backdrop-blur-2xl backdrop-saturate-150 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:h-full lg:flex-col lg:items-stretch lg:justify-start lg:gap-8 lg:p-5">
          <Link
            href="/admin"
            className="flex items-baseline gap-2 rounded-md lg:px-3 lg:pt-1"
          >
            <span className="text-xl font-semibold leading-none tracking-[-0.04em]">Jetour</span>
            <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
              Admin
            </span>
          </Link>
          <AdminNav />
          <div className="hidden flex-col gap-1 border-t border-white/10 pt-4 lg:mt-auto lg:flex">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground"
            >
              <ExternalLink className="size-4" aria-hidden />
              View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="relative z-0 min-w-0">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-headline">{title}</h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {actions}
          </header>
          {children}
          <div className="mt-10 flex gap-2 border-t border-white/10 pt-6 lg:hidden">
            <LogoutButton />
          </div>
        </main>
      </div>
    </div>
  );
}
