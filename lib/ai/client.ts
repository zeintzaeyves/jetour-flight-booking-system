import { ApiError } from "@/lib/api/response";

import { readAiConfig, type AiConfig } from "./config";

/**
 * The only file that talks to the model provider. Swap providers by changing this file.
 * Speaks the Anthropic Messages API, or any OpenAI-compatible chat API (AI_PROVIDER=openai),
 * over fetch (no SDK dependency).
 */
export type ChatTurn = { role: "user" | "assistant"; content: string };
export type Usage = { inputTokens: number; outputTokens: number };
export type CompleteInput = {
  system: string;
  messages: ChatTurn[];
  maxTokens: number;
  config?: AiConfig;
  signal?: AbortSignal;
};

const TIMEOUT_MS = 25_000;

export class AiError extends ApiError {}

const unavailable = () =>
  new AiError(502, "AI_PROVIDER_ERROR", "The AI service is unavailable right now. Please try again shortly.");

async function send(input: CompleteInput, stream: boolean): Promise<{ res: Response; openai: boolean }> {
  const config = input.config ?? readAiConfig();
  if (!config) throw new AiError(503, "AI_NOT_CONFIGURED", "The AI assistant isn't set up yet.");
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  let res: Response;
  try {
    const openai = config.provider === "openai";
    res = await fetch(openai ? `${config.baseUrl}/chat/completions` : `${config.baseUrl}/v1/messages`, {
      method: "POST",
      headers: openai
        ? { "content-type": "application/json", authorization: `Bearer ${config.apiKey}` }
        : { "content-type": "application/json", "x-api-key": config.apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(
        openai
          ? {
              model: config.model,
              max_tokens: input.maxTokens,
              messages: [{ role: "system", content: input.system }, ...input.messages],
              stream,
            }
          : {
              model: config.model,
              max_tokens: input.maxTokens,
              system: input.system,
              messages: input.messages,
              stream,
            }
      ),
      signal: input.signal ? AbortSignal.any([input.signal, timeout]) : timeout,
    });
  } catch (error) {
    console.error("AI_PROVIDER_FETCH_ERROR:", error instanceof Error ? error.message : error);
    throw unavailable();
  }
  if (!res.ok) {
    // Never log the key or the prompt; the status and provider message are enough.
    console.error("AI_PROVIDER_STATUS_ERROR:", res.status, (await res.text().catch(() => "")).slice(0, 300));
    throw res.status === 429
      ? new AiError(503, "AI_BUSY", "The AI service is busy. Please try again in a moment.")
      : unavailable();
  }
  return { res, openai: config.provider === "openai" };
}

/** One non-streaming completion. */
export async function complete(input: CompleteInput): Promise<{ text: string; usage: Usage }> {
  const { res, openai } = await send(input, false);
  try {
    if (openai) {
      const data = (await res.json()) as {
        choices?: { message?: { content?: string | null } }[];
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      return {
        text: data.choices?.[0]?.message?.content ?? "",
        usage: { inputTokens: data.usage?.prompt_tokens ?? 0, outputTokens: data.usage?.completion_tokens ?? 0 },
      };
    }
    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    const text = (data.content ?? []).map((c) => (c.type === "text" ? (c.text ?? "") : "")).join("");
    return {
      text,
      usage: { inputTokens: data.usage?.input_tokens ?? 0, outputTokens: data.usage?.output_tokens ?? 0 },
    };
  } catch {
    throw unavailable();
  }
}

export type StreamEvent = { type: "text"; text: string } | { type: "usage"; usage: Usage };

type SseEvent = {
  type?: string;
  delta?: { type?: string; text?: string };
  message?: { usage?: { input_tokens?: number } };
  usage?: { output_tokens?: number };
};

/** Streaming completion: yields text deltas, then one usage event. */
export async function* streamText(input: CompleteInput): AsyncGenerator<StreamEvent> {
  const { res, openai } = await send(input, true);
  if (!res.body) throw unavailable();
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const usage: Usage = { inputTokens: 0, outputTokens: 0 };
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let cut: number;
      while ((cut = buffer.indexOf("\n\n")) !== -1) {
        const raw = buffer.slice(0, cut);
        buffer = buffer.slice(cut + 2);
        const line = raw.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        if (openai) {
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const chunk = JSON.parse(payload) as {
              choices?: { delta?: { content?: string | null } }[];
              usage?: { prompt_tokens?: number; completion_tokens?: number };
            };
            const piece = chunk.choices?.[0]?.delta?.content;
            if (piece) yield { type: "text", text: piece };
            if (chunk.usage) {
              usage.inputTokens = chunk.usage.prompt_tokens ?? usage.inputTokens;
              usage.outputTokens = chunk.usage.completion_tokens ?? usage.outputTokens;
            }
          } catch {
            /* ignore a malformed chunk */
          }
          continue;
        }
        let evt: SseEvent;
        try {
          evt = JSON.parse(line.slice(5).trim());
        } catch {
          continue;
        }
        if (evt.type === "message_start") usage.inputTokens = evt.message?.usage?.input_tokens ?? 0;
        else if (evt.type === "message_delta") usage.outputTokens = evt.usage?.output_tokens ?? usage.outputTokens;
        else if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta" && evt.delta.text)
          yield { type: "text", text: evt.delta.text };
        else if (evt.type === "error") throw unavailable();
      }
    }
  } catch (error) {
    if (error instanceof AiError) throw error;
    throw unavailable();
  } finally {
    reader.releaseLock();
  }
  yield { type: "usage", usage };
}
