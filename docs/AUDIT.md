# Engineering audit: findings and outcomes

Initial audit of the existing app (Phase 1) and what happened to each finding.
"Verified" means demonstrated by a test or a real run, not just implemented.

## Critical
| # | Finding | Outcome |
|---|---|---|
| 1 | No authentication: admin pages, flight writes, booking list/edit/delete all public | **Fixed.** Signed-cookie admin login; every route handler and admin page re-checks the session. Verified (e2e + unauthenticated 401/redirect checks). |
| 2 | Mass assignment: `PATCH` passed the raw body to `findOneAndUpdate` | **Fixed.** Strict Zod schemas; booking PATCH accepts only `status`. A bug introduced mid-fix (Zod `.partial()` keeping defaults) was caught by a test. |
| 3 | No seat inventory: unlimited overbooking, cancelled flights bookable | **Fixed.** Atomic conditional reserve. Verified on real MongoDB: 6 parallel requests for 2 seats → 2 booked, 4 refused. |
| 4 | Weak booking references (4 digits, no collision handling) | **Fixed.** 8 random chars from a 31-symbol alphabet, unique index, retry on collision. |
| 5 | No server-side validation | **Fixed.** Zod on every input (bookings, flights, lookup, login, search params). |
| 6 | No duplicate-booking protection | **Fixed.** Idempotency key. Verified on real MongoDB. |
| 7 | Client-influenced / inconsistent pricing | **Fixed.** Total computed server-side; fabricated "12% tax" breakdown removed. |
| 8 | Instant `Confirmed`, any status transition allowed | **Partly fixed.** State machine enforced. Bookings are still recorded `Confirmed` immediately because there is no payment step. |

## Important
| Finding | Outcome |
|---|---|
| `/my-bookings` was a fake `setTimeout` preview | **Fixed.** Real lookup, cancel with confirmation, device-local recent list. |
| Admin bookings/destinations/promos were hardcoded mock tables | **Resolved.** Dashboard and bookings are real. Destinations and Promos were **removed** (no backend, nothing consumed them). |
| Search and filters were UI only | **Fixed.** Server-side search/filter/sort with shareable URLs; 29 unit tests + browser-verified. |
| Dates/times stored as free-form strings | **Mitigated.** Tolerant parsers + optional `departureAt` migration (tested; not yet run on production data). |
| Duplicated types and two data-fetching patterns | **Fixed.** One flight service shared by pages and APIs. |
| Generic 500s for all errors | **Fixed.** Consistent `{success, code, message, details}` with 400/401/404/409/429/500. |
| Missing indexes | **Fixed.** Route/date, email/reference, flightId, idempotency key, TTL. Verified on real MongoDB. |
| Connection helper cached failures forever, 30 s timeout | **Fixed.** Retries next request; 8 s timeout. |
| Misleading dev copy in production UI | **Fixed.** Rewritten. |
| No tests | **Fixed.** 93 unit tests + browser e2e + axe + perf suites. |
| Lint failures (2 errors) | **Fixed.** 0 problems. |
| Hidden-on-scroll navbar, no mobile menu, unlabeled icon buttons | **Fixed.** |
| Public personal documents in `public/images/` (resume, thesis, contracts) | **Fixed in the working tree** (moved to git-ignored `private-docs/`, untracked). **They remain in git history and on any already-deployed site until you redeploy and, ideally, rewrite history.** |
| 26 production vulnerabilities (mostly the `shadcn` CLI in `dependencies`) + Next.js advisories | **Fixed.** `shadcn` moved to devDependencies, 5 unused packages removed, Next upgraded 16.2.6 → 16.4.5. `npm audit --omit=dev`: 0. |

## Added in the final phase
Rate limiting, security headers, robots.txt, custom 404/error pages, CI workflow, README, axe + perf
suites, strict deterministic migration script.

## Known gaps (not fixed)
- No payments, email, or real airline inventory (by design: not simulated).
- No Content-Security-Policy.
- Single shared admin password, no per-user accounts or audit trail.
- Cancelling a *flight* does not cancel its bookings.
- Past-dated flights are not hidden from search (needs the date migration to be run first).
- Keyboard-only and screen-reader testing not done; automated axe only.
- Unused assets remain in `public/` (`bg.jpg`, `footer.jpg`, a 24 MB `bgvid.mp4`).
- Search filters in JavaScript over all bookable flights; needs pagination/query pushdown at scale.
- Git history still contains the removed personal files.
