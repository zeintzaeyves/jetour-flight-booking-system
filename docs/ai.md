# Jetour AI features

The model plans and words things. Jetour's own code decides what is true: every flight, fare, seat count
and link comes from the database through the existing search code.

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `AI_API_KEY` | yes | Provider key. Server-side only. |
| `AI_MODEL` | yes | Model id. No default is hardcoded. |
| `AI_DAILY_BUDGET` | yes | Hard stop, USD per UTC day. Unset or `0` turns AI off (fails closed). |
| `AI_BASE_URL` | no | Provider endpoint. Defaults to the Anthropic Messages API. |
| `AI_PRICE_IN_PER_MTOK`, `AI_PRICE_OUT_PER_MTOK` | no | USD per million tokens, used to estimate spend. Defaults are deliberately high (5 / 25). **Set your model's real prices.** |
| `SUPPORT_EMAIL` | no | Target of "Email support". Unset: the assistant says human support isn't set up. |

Without the first three, every AI endpoint answers `503 AI_NOT_CONFIGURED`; search, booking and the
ranked picks keep working, and the chat panel shows the verified FAQ instead.

## Endpoints (all `POST`, JSON)

| Endpoint | Body | Returns |
|---|---|---|
| `/api/ai/search` | `{ query }` | `{ params, queryString, notes, question, count, preview, airports }` |
| `/api/ai/recommend` | `{ params, preferences? }` | `{ total, passengers, aiAvailable, picks[{ flight, labels, facts, reason, explained }] }` |
| `/api/ai/chat` | `{ messages[1..12], context?: { flightNo } }` | Server-sent events: `text`, `action`, `error`, `done` |
| `/api/ai/plan` | `{ query }` | `{ intro, question, origin, budget, destinations[], notes }` |

Errors use the normal envelope `{ success:false, code, message, details }`:
`VALIDATION_ERROR` 400, `PAYLOAD_TOO_LARGE` 413, `RATE_LIMITED` 429 (with `Retry-After`),
`AI_NOT_CONFIGURED` / `AI_UNAVAILABLE` / `AI_BUDGET_EXHAUSTED` 503, `AI_PROVIDER_ERROR` / `AI_BAD_OUTPUT` 502.

## Layout

```
lib/ai/client.ts      only file that talks to the provider (swap providers here)
lib/ai/guard.ts       per-IP limits + daily budget, fail-closed, reserve-then-settle
lib/ai/schemas.ts     Zod for requests and for model output (untrusted)
lib/ai/nlSearch.ts    text -> SearchParams, validated against the real network
lib/ai/recommend.ts   deterministic ranking + grounded explanations
lib/ai/assistant.ts   prompt, streaming action splitter
lib/ai/chatActions.ts resolves allowed actions against real data
lib/ai/planner.ts     model suggestions -> real routes, fares and links
lib/ai/policies.ts    the only policy facts the assistant may state
lib/content/faq.ts    FAQ shared by the landing page and the assistant
```

## Safety model

- **No write access.** The assistant can only request: `search`, `lookup_booking`, `escalate`, `plan`, or nothing.
  Anything else the model emits is discarded.
- **Booking privacy.** Booking status uses a form that calls the existing lookup endpoint (reference **and** email,
  rate-limited). Booking details never pass through the model, and the prompt forbids collecting them in chat.
  A test asserts no AI module imports booking data access.
- **Grounding.** Flights shown are database rows. AI wording is accepted only if its peso amounts, times and seat
  counts match the flight exactly and it claims no perk the data lacks; otherwise a sentence built from the data is shown.
  The planner drops routes Jetour doesn't fly and enforces the budget against real fares.
- **Cost.** A worst-case cost is reserved before each call and settled to real usage after. Limits fail closed.
- **Injection.** User text is only ever sent as the user turn, never in the system prompt; output is schema-validated.

## Known limits

- Policies are limited to `lib/content/faq.ts` plus the lines in `lib/ai/policies.ts`. Refunds, fees, check-in and
  baggage limits beyond what a flight card lists are deliberately unanswered and escalate to a human.
- Recommendation ranking uses the search filters (time, price, airline, cabin); free-text preferences only
  influence the wording.
- Budget and rate-limit counters live in the existing `ratelimits` collection (no schema change).
- Flights have no stops data for most records (`stops` defaults to nonstop).
