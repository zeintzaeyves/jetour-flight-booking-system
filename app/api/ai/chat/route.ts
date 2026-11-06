import { ApiError, handleError } from "@/lib/api/response";
import { buildAssistantSystem, runAssistant } from "@/lib/ai/assistant";
import { resolveAction } from "@/lib/ai/chatActions";
import { manilaToday } from "@/lib/ai/dates";
import { guardAi } from "@/lib/ai/guard";
import { readBody } from "@/lib/ai/http";
import { chatRequestSchema } from "@/lib/ai/schemas";
import { looksLikeInjection } from "@/lib/ai/text";
import { getFlightByNo, getNetworkSummary } from "@/lib/flights/service";
import type { Usage } from "@/lib/ai/client";

export const maxDuration = 45;

const sse = (data: unknown) => `data: ${JSON.stringify(data)}\n\n`;

/**
 * POST { messages, context? } -> server-sent events:
 *   {type:"text",text} ... {type:"action",action} | {type:"error",code,message} ... {type:"done"}
 * Errors before the stream starts (validation, rate limit, budget) are ordinary JSON responses.
 */
export async function POST(request: Request) {
  try {
    const body = await readBody(request, chatRequestSchema);
    const network = await getNetworkSummary();
    const airports = [...new Map([...network.origins, ...network.destinations].map((a) => [a.code, a])).values()];
    const today = manilaToday();

    let flight = null;
    if (body.context?.flightNo) flight = await getFlightByNo(body.context.flightNo).catch(() => null);

    const last = body.messages[body.messages.length - 1].content;
    if (looksLikeInjection(last)) console.warn("AI_CHAT_INJECTION_SUSPECTED"); // logged only; defences are structural

    const probe = buildAssistantSystem({ airports, today, flight, supportConfigured: true });
    const ticket = await guardAi(request, {
      name: "chat",
      limit: 30,
      windowSeconds: 600,
      maxOutputTokens: 450,
      inputChars: probe.length + body.messages.reduce((n, m) => n + m.content.length, 0),
    });
    const system = buildAssistantSystem({ airports, today, flight, supportConfigured: ticket.config.supportEmail !== null });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (d: unknown) => controller.enqueue(encoder.encode(sse(d)));
        let usage: Usage | null = null;
        try {
          for await (const e of runAssistant({ messages: body.messages, system, config: ticket.config, signal: request.signal })) {
            if (e.type === "text") send(e);
            else if (e.type === "usage") usage = e.usage;
            else {
              const resolved = await resolveAction(e.action, { airports, today, supportEmail: ticket.config.supportEmail });
              if (resolved) send({ type: "action", action: resolved });
            }
          }
        } catch (error) {
          const api = error instanceof ApiError ? error : new ApiError(500, "INTERNAL_ERROR", "Something went wrong.");
          if (!(error instanceof ApiError)) console.error("AI_CHAT_STREAM_ERROR:", error);
          send({ type: "error", code: api.code, message: api.message, supportEmail: ticket.config.supportEmail });
        } finally {
          send({ type: "done" });
          controller.close();
          await ticket.settle(usage);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store, no-transform", "X-Accel-Buffering": "no" },
    });
  } catch (error) {
    return handleError(error, "AI_CHAT_ERROR");
  }
}
