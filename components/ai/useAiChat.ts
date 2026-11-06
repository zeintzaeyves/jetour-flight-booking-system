"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ClientAction } from "@/lib/ai/chatActions";

export type ChatError = { code: string; message: string; supportEmail: string | null };
export type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: ClientAction;
  error?: ChatError;
};

const KEY = "jetour-ai-chat-v1";
const newId = () => Math.random().toString(36).slice(2, 10);

function load(): UiMessage[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as UiMessage[]) : [];
    return Array.isArray(parsed) ? parsed.slice(-40) : [];
  } catch {
    return [];
  }
}

/** Conversation state for the floating panel and the /assistant page. History lives in sessionStorage only. */
export function useAiChat() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Hydrating from sessionStorage has to happen after mount (the server render has no storage).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(load());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* storage unavailable: the chat still works, it just won't survive a reload */
    }
  }, [messages, loaded]);

  const patch = useCallback((id: string, fn: (m: UiMessage) => UiMessage) => {
    setMessages((all) => all.map((m) => (m.id === id ? fn(m) : m)));
  }, []);

  const send = useCallback(
    async (text: string, context?: { flightNo?: string }) => {
      const content = text.trim().slice(0, 1200);
      if (!content || busy) return;
      const userMsg: UiMessage = { id: newId(), role: "user", content };
      const replyId = newId();
      const history = [...messages, userMsg]
        .filter((m) => m.content && !m.error)
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));
      setMessages((all) => [...all, userMsg, { id: replyId, role: "assistant", content: "" }]);
      setBusy(true);
      abort.current = new AbortController();

      const fail = (e: ChatError) => patch(replyId, (m) => ({ ...m, error: e }));
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, context }),
          signal: abort.current.signal,
        });
        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => null);
          fail({
            code: body?.code ?? "UNKNOWN",
            message: body?.message ?? "Something went wrong. Please try again.",
            supportEmail: body?.details?.supportEmail ?? null,
          });
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let cut: number;
          while ((cut = buffer.indexOf("\n\n")) !== -1) {
            const line = buffer.slice(0, cut).split("\n").find((l) => l.startsWith("data:"));
            buffer = buffer.slice(cut + 2);
            if (!line) continue;
            let evt: { type: string; text?: string; action?: ClientAction } & Partial<ChatError>;
            try {
              evt = JSON.parse(line.slice(5));
            } catch {
              continue;
            }
            if (evt.type === "text" && evt.text) patch(replyId, (m) => ({ ...m, content: m.content + evt.text }));
            else if (evt.type === "action" && evt.action) patch(replyId, (m) => ({ ...m, action: evt.action }));
            else if (evt.type === "error")
              fail({ code: evt.code ?? "UNKNOWN", message: evt.message ?? "Something went wrong.", supportEmail: evt.supportEmail ?? null });
          }
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          fail({ code: "NETWORK", message: "Network problem. Please check your connection and try again.", supportEmail: null });
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, patch]
  );

  /** Re-read the stored conversation (another view, such as the /assistant page, may have changed it). */
  const reload = useCallback(() => setMessages(load()), []);
  const stop = useCallback(() => abort.current?.abort(), []);
  const reset = useCallback(() => {
    abort.current?.abort();
    setMessages([]);
    setBusy(false);
  }, []);

  return { messages, busy, send, stop, reset, reload };
}
