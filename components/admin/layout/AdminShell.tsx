import Link from "next/link";
import { ExternalLink, Plane } from "lucide-react";

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
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-border bg-card lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-6 lg:p-5">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Plane className="size-4" aria-hidden />
            </span>
            Jetour
            <span className="text-sm font-normal text-muted-foreground">Admin</span>
          </Link>
          <AdminNav />
          <div className="hidden flex-col gap-1 lg:flex">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="size-4" aria-hidden />
              View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
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
          <div className="mt-10 flex gap-2 border-t border-border pt-6 lg:hidden">
            <LogoutButton />
          </div>
        </main>
      </div>
    </div>
  );
}
