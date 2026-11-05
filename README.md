# Jetour

A flight search and reservation web app: search and filter flights, book for one or more
passengers, look up and cancel a booking with a reference + email, and manage flights and
bookings from an admin console.

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind 4 · MongoDB (Mongoose) · Zod

## What is real and what is not

| Area | Status |
|---|---|
| Flight search, filters, sorting (server-side) | Implemented |
| Booking with per-passenger names, seat reservation, idempotency | Implemented |
| Guest lookup and cancellation (reference + email) | Implemented |
| Admin: dashboard, flights CRUD, booking confirm/cancel/delete | Implemented, behind a password login |
| Rate limiting (login, lookup, cancel, booking) | Implemented (MongoDB-backed) |
| **Payments** | **Not implemented.** No payment is collected. Bookings are reservation records. |
| **Airline inventory / ticketing** | **Not integrated.** Seats are counted only in this app's own database. |
| Changing an existing booking | Not supported (cancel and rebook) |
| Round-trip as one booking | Not supported: each leg is a separate booking |
| Email confirmations | Not implemented |
| Light theme | Not provided. The site is dark-only (the original look) |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string (database name is fixed to `jetour`) |
| `ADMIN_PASSWORD` | Password for `/admin/login` |
| `ADMIN_SESSION_SECRET` | 32+ random characters used to sign the admin session cookie |

**Empty database?** `npm run seed:demo` adds sample flights (idempotent: re-running adds nothing new; demo flights are marked `isDemo`).

If `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is missing the admin login **fails closed**
(nobody can sign in). Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Standard Next.js |
| `npm run lint` · `npm run typecheck` | ESLint · `tsc --noEmit` |
| `npm test` | 90+ unit tests (Vitest): validation, pricing, references, state machine, search, rate limiting, serialization |
| `npm run test:e2e` | Real-browser journey: search → book → confirm → look up → cancel → admin, plus integrity guards and rate limits |
| `npm run test:a11y` | axe-core audit of every page and key state, desktop and 390px mobile |
| `npm run test:perf` | LCP / CLS / transferred bytes per page (regression guard) |

On a low-memory machine run `BUILD_CPUS=3 npm run build` to cap build parallelism.

### Running the browser suites safely

`e2e`, `a11y` and `perf` create and cancel bookings. **Run them only against a throwaway database.**

```bash
mongod --dbpath ./.tmp-db --port 27099 &                       # a local, disposable MongoDB
mongosh mongodb://127.0.0.1:27099 e2e/seed.js                   # seeds 8 flights, clears bookings
export MONGODB_URI=mongodb://127.0.0.1:27099 ADMIN_PASSWORD=test-pass-123 \
       ADMIN_SESSION_SECRET=0123456789abcdef0123456789abcdef0123
npm run build && npm start &                                    # production build on :3000
export CHROME_PATH="/path/to/chrome"                            # any Chrome/Chromium
npm run test:e2e && npm run test:a11y && npm run test:perf
```

Never build with your production `MONGODB_URI` set: Mongoose creates its indexes on first
connect, and the homepage queries the database while building.

## Architecture

```
app/                 Routes (pages + route handlers). Server components by default.
  api/               REST-ish JSON API: { success, data | code, message, details }
components/          UI by feature (booking, flights, search, my-bookings, admin, layout, ui)
lib/
  validation/        Zod schemas shared by API and forms (single source of truth)
  bookings/          Pricing, reference generation, status state machine, service, serializer
  flights/           Search/filter/sort logic (pure), data service, search-form helpers
  auth/              Signed-cookie admin session (Web Crypto), page + route guards
  rateLimit.ts       MongoDB-backed fixed-window limiter
models/              Mongoose models (Flight, Booking, RateLimit)
e2e/ tests/          Browser suites · unit tests
docs/                DESIGN.md (design system) · AUDIT.md (engineering audit + outcomes)
scripts/             migrate-additive.mjs
proxy.ts             Optimistic gate for /admin pages (routes and pages re-check the session)
```

Key decisions

- **Seat inventory is never read-then-written.** A booking reserves seats with one conditional
  `findOneAndUpdate` (`availableSeats >= n`, flight `Scheduled`), so concurrent requests cannot
  oversell. Seats are released if the insert fails or the booking is cancelled.
- **Prices are computed on the server** from the flight; clients cannot send a price, class or status.
- **Booking status is a state machine** (`Pending → Confirmed → Cancelled`, no reversals) and every
  change is a compare-and-set on the previous status.
- **Bookings are idempotent** via a client-generated key; double-clicks and retries return the same booking.
- **Guest lookup requires reference + email** (a ~40-bit random reference). Responses never include
  internal ids.
- **Admin writes are guarded in every route handler**, not only in `proxy.ts`.
- Only bookings that are already cancelled can be deleted, and flights with active bookings cannot be
  deleted, so inventory cannot drift.

## Data and migrations

`scripts/migrate-additive.mjs` adds `stops` and `departureAt` to existing flights. It is a **dry run
by default**, never rewrites existing fields, and is safe to re-run. **Back up first**, then:

```bash
node --env-file=.env.local scripts/migrate-additive.mjs           # report only
node --env-file=.env.local scripts/migrate-additive.mjs --apply   # write
```

Mongoose creates new indexes automatically on the first connection after deploy (additive; includes a
sparse unique index on `idempotencyKey` and a TTL index on `ratelimits`).

## Security notes

- Admin: single shared password, HMAC-signed httpOnly `SameSite=Lax` cookie, 8-hour lifetime.
  There are no per-user accounts or audit log.
- Rate limits (per IP): login 10 / 15 min, lookup 30 / 10 min, cancel 10 / 10 min, booking 20 / hour.
  The IP comes from `x-forwarded-for`, which is trustworthy only behind a proxy such as Vercel.
  The limiter fails open if its own storage errors.
- Baseline security headers are set in `next.config.ts`. **A Content-Security-Policy is not set** (Next
  inlines scripts, so a correct CSP needs nonces and deliberate testing).
- No CSRF token: state-changing requests use JSON bodies and a `SameSite=Lax` cookie.
- Guest data (name, email, phone) is stored in plain text in MongoDB.

## Accessibility

Automated: zero axe-core violations (WCAG 2.0/2.1/2.2 A+AA and best practices) on every page and key
state at desktop and 390px. Automated tools find only part of the problems; keyboard-only and
screen-reader testing have **not** been done.

## Deploying

Set the three environment variables on your host (Vercel: Project → Settings → Environment Variables)
and make sure the MongoDB network access list allows the host. CI (`.github/workflows/ci.yml`) runs
lint, typecheck, unit tests and a production build on every push and pull request.

> The project path lives in OneDrive on the author's machine; OneDrive sync can briefly lock files in
> `.next/` and fail local builds with `errno -4094`. Retrying, or keeping the repo outside OneDrive, fixes it.
