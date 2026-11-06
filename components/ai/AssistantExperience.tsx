"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { ChatComposer, ChatThread, SUGGESTIONS } from "@/components/ai/ChatThread";
import PlannerView from "@/components/ai/PlannerView";
import { useAiChat } from "@/components/ai/useAiChat";
import { cn } from "@/lib/utils";

type Tab = "ask" | "plan";

const TABS: { id: Tab; label: string }[] = [
  { id: "ask", label: "Ask Jetour" },
  { id: "plan", label: "Plan a trip" },
];

export default function AssistantExperience({ initialTab, initialQuery }: { initialTab: Tab; initialQuery: string }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const { messages, busy, send, stop, reset } = useAiChat();

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Assistant mode" className="inline-flex gap-1 rounded-full bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
              tab === t.id && "bg-card text-foreground shadow-xs"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ask" ? (
        <section
          role="tabpanel"
          id="panel-ask"
          aria-labelledby="tab-ask"
          className="flex h-[min(42rem,calc(100dvh-16rem))] min-h-[26rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-card shadow-card"
        >
          <ChatThread
            messages={messages}
            busy={busy}
            onAsk={(t) => send(t)}
            className="flex-1 px-5 py-6 sm:px-8"
            empty={
              <div className="mx-auto max-w-xl space-y-5 py-6 text-center">
                <p className="text-lg">What can I help you with?</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
          <div className="border-t border-white/10 p-3 sm:p-4">
            <div className="mx-auto max-w-3xl">
              <ChatComposer busy={busy} onSend={(t) => send(t)} onStop={stop} autoFocus />
              <div className="mt-2 flex items-center justify-between px-2 text-[0.6875rem] text-muted-foreground">
                <span>The assistant can make mistakes. Fares and availability always come from Jetour&apos;s flight records.</span>
                {messages.length ? (
                  <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:text-foreground">
                    <RotateCcw aria-hidden className="size-3" /> New chat
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section role="tabpanel" id="panel-plan" aria-labelledby="tab-plan">
          <PlannerView initialQuery={initialTab === "plan" ? initialQuery : ""} />
        </section>
      )}
    </div>
  );
}
