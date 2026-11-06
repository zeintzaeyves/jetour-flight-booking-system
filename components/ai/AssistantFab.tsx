"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Maximize2, Plane, RotateCcw, X } from "lucide-react";

import { ChatComposer, ChatThread } from "@/components/ai/ChatThread";
import { useAiChat } from "@/components/ai/useAiChat";
import { cn } from "@/lib/utils";

export const OPEN_ASSISTANT_EVENT = "jetour:assistant";
export type OpenAssistantDetail = { prompt?: string; flightNo?: string };

const NUDGE_KEY = "jetour:assistant-nudge-dismissed";
// Each line is something the assistant can really do.
const NUDGES = [
  "Hi! Looking for a flight? Just tell me where.",
  "Try: “Cheapest flight to Cebu next weekend”",
  "Lost your booking? I can look it up.",
  "Not sure where to go? Let's plan a trip.",
];

function Avatar({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground", className)}>
      <Plane aria-hidden className="size-1/2 -rotate-45" />
    </span>
  );
}

/** Floating entry point on every page except /assistant and /admin. */
export default function AssistantFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState<number | null>(null); // index of the visible greeting
  const [nudgeOff, setNudgeOff] = useState(false);
  const { messages, busy, send, stop, reset, reload } = useAiChat();
  const flightCtx = useRef<string | undefined>(undefined);
  const button = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    button.current?.focus();
  }, []);

  // Other parts of the site (e.g. the booking page) can open the panel with a question.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<OpenAssistantDetail>).detail ?? {};
      flightCtx.current = d.flightNo;
      setOpen(true);
      if (d.prompt) void send(d.prompt, d.flightNo ? { flightNo: d.flightNo } : undefined);
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, [send]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // A friendly greeting that rotates until it's dismissed or the chat is opened.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(NUDGE_KEY) === "1";
    } catch {
      /* storage unavailable: just show it */
    }
    if (dismissed) return;
    const first = setTimeout(() => setNudge(0), 2500);
    const rotate = setInterval(() => setNudge((n) => (n === null ? null : (n + 1) % NUDGES.length)), 7000);
    return () => {
      clearTimeout(first);
      clearInterval(rotate);
    };
  }, []);

  function dismissNudge() {
    setNudgeOff(true);
    try {
      sessionStorage.setItem(NUDGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  function openChat() {
    reload();
    setOpen(true);
    dismissNudge();
  }

  if (pathname.startsWith("/assistant") || pathname.startsWith("/admin")) return null;

  const ask = (text: string) => send(text, flightCtx.current ? { flightNo: flightCtx.current } : undefined);
  const showNudge = !open && !nudgeOff && nudge !== null;

  return (
    <>
      {!open ? (
        <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3">
          {showNudge ? (
            <div
              key={nudge}
              className="relative mb-1 max-w-[min(15rem,calc(100vw-7rem))] rounded-2xl rounded-br-sm border border-white/15 bg-popover py-3 pl-4 pr-9 text-sm shadow-pop animate-in fade-in slide-in-from-right-3 duration-300"
            >
              <button
                type="button"
                onClick={dismissNudge}
                aria-label="Dismiss"
                className="absolute right-1.5 top-1.5 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X aria-hidden className="size-3.5" />
              </button>
              <button type="button" onClick={openChat} className="text-left leading-snug">
                {NUDGES[nudge]}
              </button>
            </div>
          ) : null}

          <button
            ref={button}
            type="button"
            onClick={openChat}
            aria-label="Chat with Jetour AI"
            className="flex h-12 shrink-0 items-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold tracking-tight shadow-pop outline-none backdrop-blur-xl transition-[background-color,border-color,transform] hover:border-white/35 hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-ring/60 active:scale-95 animate-in fade-in zoom-in-95 duration-300"
          >
            Jetour AI
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-label="Jetour assistant"
          className={cn(
            "fixed z-[70] flex flex-col overflow-hidden border border-white/10 bg-card shadow-pop backdrop-blur-xl",
            "inset-x-0 bottom-0 h-[min(85dvh,44rem)] rounded-t-[1.75rem]",
            "sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[min(38rem,calc(100dvh-2.5rem))] sm:w-[25rem] sm:rounded-[1.75rem]",
            "animate-in fade-in slide-in-from-bottom-3 duration-200"
          )}
        >
          <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-brand-soft px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-10" />
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold leading-tight">Jetour AI</h2>
                <p className="truncate text-xs text-muted-foreground">Flights, bookings and trip ideas</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length ? (
                <button type="button" onClick={reset} aria-label="Start a new conversation" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                  <RotateCcw aria-hidden className="size-4" />
                </button>
              ) : null}
              <Link href="/assistant" onClick={() => setOpen(false)} aria-label="Open the full assistant page" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                <Maximize2 aria-hidden className="size-4" />
              </Link>
              <button type="button" onClick={close} aria-label="Close the assistant" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                <X aria-hidden className="size-4" />
              </button>
            </div>
          </header>

          <ChatThread messages={messages} busy={busy} onAsk={ask} className="flex-1 px-4 py-4" />

          <div className="border-t border-white/10 p-3">
            <ChatComposer busy={busy} onSend={ask} onStop={stop} autoFocus />
            <p className="mt-2 px-2 text-center text-[0.6875rem] text-muted-foreground">
              The assistant can make mistakes. Fares and availability always come from Jetour&apos;s flight records.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
