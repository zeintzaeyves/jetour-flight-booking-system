"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Mail, Square } from "lucide-react";

import BookingLookup from "@/components/ai/BookingLookup";
import RecommendationCard from "@/components/ai/RecommendationCard";
import type { ChatError, UiMessage } from "@/components/ai/useAiChat";
import { UNAVAILABLE_CODES } from "@/components/ai/api";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/lib/content/faq";
import { cn } from "@/lib/utils";
import type { ClientAction } from "@/lib/ai/chatActions";

export const SUGGESTIONS = [
  "Find the cheapest flight from Manila to Cebu next weekend",
  "Where can I go for under ₱6,000?",
  "Check my booking status",
  "How do I cancel a booking?",
];

function Dots() {
  return (
    <span role="status" aria-label="Jetour is typing" className="inline-flex items-center gap-1 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </span>
  );
}

function Handoff({ reason, supportEmail }: { reason: string | null; supportEmail: string | null }) {
  const href = supportEmail
    ? `mailto:${supportEmail}?subject=${encodeURIComponent("Jetour support request")}&body=${encodeURIComponent(reason ? `${reason}\n\n` : "")}`
    : null;
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-left">
      <p className="text-sm font-medium">Talk to a person</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {href
          ? "A member of the team can look into this properly."
          : "Human support isn't set up for this demo yet, so I can't hand you over. The FAQ on the home page covers what Jetour has verified."}
      </p>
      {href ? (
        <Button asChild size="sm" variant="brand" className="mt-3">
          <a href={href}>
            <Mail aria-hidden /> Email support
          </a>
        </Button>
      ) : (
        <Button asChild size="sm" variant="outline" className="mt-3">
          <Link href="/#faq">Read the FAQ</Link>
        </Button>
      )}
    </div>
  );
}

function ActionView({ action }: { action: ClientAction }) {
  switch (action.type) {
    case "cards":
      return (
        <div className="space-y-3">
          {action.notes.map((n) => (
            <p key={n} className="text-sm text-warning-ink">{n}</p>
          ))}
          {action.question ? <p className="text-sm font-medium">{action.question}</p> : null}
          {action.picks.map((p) => (
            <RecommendationCard key={p.flight.flightNo} compact flight={p.flight} labels={p.labels} reason={p.reason} passengers={action.passengers} />
          ))}
          {action.count === 0 ? (
            <p className="text-sm text-muted-foreground">No flights match that right now. Try different dates or a nearby route.</p>
          ) : null}
          {action.count !== null && action.count > 0 ? (
            <Button asChild size="sm" variant="outline">
              <Link href={action.href}>See all {action.count} flight{action.count === 1 ? "" : "s"}</Link>
            </Button>
          ) : null}
        </div>
      );
    case "lookup":
      return <BookingLookup />;
    case "escalate":
      return <Handoff reason={action.reason} supportEmail={action.supportEmail} />;
    case "plan":
      return (
        <Button asChild size="sm" variant="brand">
          <Link href={`/assistant?tab=plan&q=${encodeURIComponent(action.query)}`}>Plan this trip</Link>
        </Button>
      );
  }
}

function ErrorView({ error }: { error: ChatError }) {
  const off = UNAVAILABLE_CODES.has(error.code);
  return (
    <div role="alert" className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-left">
      <p className="text-sm">{error.message}</p>
      {off ? (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-brand-ink">Quick answers while the assistant is away</summary>
          <dl className="mt-3 space-y-3">
            {FAQ.map(([q, a]) => (
              <div key={q}>
                <dt className="font-medium">{q}</dt>
                <dd className="text-muted-foreground">{a}</dd>
              </div>
            ))}
          </dl>
        </details>
      ) : null}
      {off && error.supportEmail ? (
        <Button asChild size="sm" variant="outline" className="mt-3">
          <a href={`mailto:${error.supportEmail}`}><Mail aria-hidden /> Email support</a>
        </Button>
      ) : null}
    </div>
  );
}

export function ChatThread({
  messages,
  busy,
  onAsk,
  empty,
  className,
}: {
  messages: UiMessage[];
  busy: boolean;
  onAsk: (text: string) => void;
  empty?: React.ReactNode;
  className?: string;
}) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, busy]);

  return (
    <div className={cn("space-y-5 overflow-y-auto overscroll-contain", className)} role="log" aria-live="polite" aria-label="Conversation">
      {messages.length === 0 ? (
        (empty ?? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Hi, I can help you find flights, check a booking, or answer questions about Jetour.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onAsk(s)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))
      ) : null}

      {messages.map((m, i) =>
        m.role === "user" ? (
          <div key={m.id} className="flex justify-end">
            <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-white/10 px-3.5 py-2 text-sm">{m.content}</p>
          </div>
        ) : (
          <div key={m.id} className="space-y-3">
            {m.content ? <p className="whitespace-pre-wrap break-words text-sm leading-6">{m.content.trimEnd()}</p> : null}
            {!m.content && !m.error && !m.action && busy && i === messages.length - 1 ? <Dots /> : null}
            {m.action ? <ActionView action={m.action} /> : null}
            {m.error ? <ErrorView error={m.error} /> : null}
          </div>
        )
      )}
      <div ref={end} />
    </div>
  );
}

export function ChatComposer({
  busy,
  onSend,
  onStop,
  placeholder = "Ask about flights, bookings or Jetour",
  autoFocus,
}: {
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  function submit() {
    if (busy || !value.trim()) return;
    onSend(value);
    setValue("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-end gap-2 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-2 focus-within:border-ring"
    >
      <label htmlFor="ai-composer" className="sr-only">Message Jetour</label>
      <textarea
        id="ai-composer"
        ref={ref}
        rows={1}
        value={value}
        maxLength={1200}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground md:text-sm"
      />
      {busy ? (
        <Button type="button" size="icon" variant="outline" onClick={onStop} aria-label="Stop generating" className="rounded-full">
          <Square aria-hidden className="size-3.5 fill-current" />
        </Button>
      ) : (
        <Button type="submit" size="icon" variant="brand" aria-label="Send message" disabled={!value.trim()} className="rounded-full">
          <ArrowUp aria-hidden />
        </Button>
      )}
    </form>
  );
}
