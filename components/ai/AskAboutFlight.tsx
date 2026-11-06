"use client";

import { MessageCircle } from "lucide-react";

import { OPEN_ASSISTANT_EVENT, type OpenAssistantDetail } from "@/components/ai/AssistantFab";

/** Opens the floating assistant with this flight as context. Its facts are loaded server-side from the flight record. */
export default function AskAboutFlight({ flightNo }: { flightNo: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent<OpenAssistantDetail>(OPEN_ASSISTANT_EVENT, {
            detail: { flightNo, prompt: "What should I know before booking this flight?" },
          })
        )
      }
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
    >
      <MessageCircle aria-hidden className="size-4" />
      Ask about this flight
    </button>
  );
}
