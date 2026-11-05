import puppeteer from "puppeteer-core";

// End-to-end journey against a running app + a SEEDED, THROWAWAY MongoDB (see e2e/README in the main README).
// Never run this against production data: it creates and cancels bookings.
import os from "node:os";
import fs from "node:fs";
const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? fs.mkdtempSync(os.tmpdir() + "/jetour-e2e-");
const CHROME = process.env.CHROME_PATH;
if (!CHROME) throw new Error("Set CHROME_PATH to a Chrome/Chromium executable.");
if (!process.env.ADMIN_PASSWORD) throw new Error("Set ADMIN_PASSWORD (must match the server).");
let failures = 0;
const check = (name, cond, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  -> " + extra : ""}`);
  if (!cond) failures++;
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));

const setValue = (sel, value) =>
  page.$eval(sel, (el, v) => {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
const shot = (n, full = true) => page.screenshot({ path: `${OUT}/${n}.png`, fullPage: full });
const text = () => page.evaluate(() => document.body.innerText);

/* ---------- 1. Home search ---------- */
await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
await page.select('select[id$="-from"]', "MNL");
await page.select('select[id$="-to"]', "NRT");
await setValue('input[id$="-date"]', "2026-12-01");
await setValue('input[id$="-return"]', "2026-12-08");
await shot("e1-home-filled", false);

// empty submit shows validation (separate fresh load)
await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
await page.click('button[type="submit"]');
const t1 = await text();
check("home: empty search shows inline errors", /Choose where you're flying from/.test(t1) && /Pick a departure date/.test(t1));
check("home: first invalid field focused", await page.evaluate(() => document.activeElement?.id?.endsWith("-from")));

await page.select('select[id$="-from"]', "MNL");
await page.select('select[id$="-to"]', "NRT");
await setValue('input[id$="-date"]', "2026-12-01");
await setValue('input[id$="-return"]', "2026-12-08");
await page.click('button[type="submit"]');
await page.waitForSelector("article[aria-label]", { timeout: 20000 });
check("search navigates with shareable URL", /\/flights\?from=MNL&to=NRT&date=2026-12-01&trip=round&return=2026-12-08/.test(page.url()), page.url());
const cards = await page.$$eval("article", (a) => a.map((x) => x.getAttribute("aria-label")));
check("results: 3 bookable outbound flights (cancelled one hidden)", cards.length === 3, cards.join(" | "));
check("results: cheapest first", /JT-102/.test(cards[0] ?? ""));
await shot("e2-results");

// return tab
await page.waitForSelector('a[href*="leg=ret"]', { timeout: 20000 });
await page.click('a[href*="leg=ret"]');
await page.waitForFunction(() => document.querySelector("article")?.getAttribute("aria-label")?.includes("JT-201"), { timeout: 20000 });
const ret = await page.$$eval("article", (a) => a.map((x) => x.getAttribute("aria-label")));
check("return leg shows NRT->MNL flight", ret.length === 1 && /JT-201/.test(ret[0]), ret.join(" | "));

/* ---------- 2. Book (validation, then success) ---------- */
await page.goto(`${BASE}/booking/JT-102?passengers=2`, { waitUntil: "networkidle2", timeout: 60000 });
check("booking: passengers prefilled from URL", (await page.$eval("#f-passengers", (e) => e.value)) === "2");
check("booking: extra passenger field shown", !!(await page.$("#f-additional-0")));
await page.click('button[type="submit"]');
const t2 = await text();
check("booking: validation messages shown", /full name/i.test(t2) && /valid email/i.test(t2) && /valid phone/i.test(t2));
check("booking: first invalid field focused + aria-invalid", await page.evaluate(() => document.activeElement?.id === "f-fullName" && document.activeElement.getAttribute("aria-invalid") === "true"));
await shot("e3-booking-errors");

await page.type("#f-fullName", "Juan Dela Cruz");
await page.type("#f-email", "Juan@Example.com");
await page.type("#f-phone", "+63 917 123 4567");
await page.type("#f-additional-0", "Maria Dela Cruz");
await shot("e4-booking-filled");
const [resp] = await Promise.all([
  page.waitForResponse((r) => r.url().endsWith("/api/bookings") && r.request().method() === "POST"),
  page.click('button[type="submit"]'),
]);
const created = await resp.json();
check("booking: API 201", resp.status() === 201, String(resp.status()));
check("booking: response hides internals", !("idempotencyKey" in created.data) && !("_id" in created.data));
await page.waitForFunction(() => location.pathname === "/booking/success", { timeout: 10000 });
await page.waitForSelector("dl", { timeout: 10000 });
const ref = new URL(page.url()).searchParams.get("ref");
check("success: reference in URL", /^JT-[A-Z2-9]{8}$/.test(ref ?? ""), ref);
const t3 = await text();
check("success: shows details (passengers, total)", /Maria Dela Cruz/.test(t3) && /₱17,998\.00/.test(t3), "total 2 x 8,999");
await shot("e5-success");

/* ---------- 3. Manage booking ---------- */
await page.click('a[href*="my-bookings?ref="]');
await page.waitForSelector("#mb-ref", { timeout: 20000 });
check("manage: reference prefilled from URL", (await page.$eval("#mb-ref", (e) => e.value)) === ref);
check("manage: email NOT prefilled", (await page.$eval("#mb-email", (e) => e.value)) === "");
await page.type("#mb-email", "wrong@example.com");
await page.click('button[type="submit"]');
await page.waitForSelector("#mb-error");
check("manage: wrong email -> generic error", /couldn't find a booking/.test(await text()));
await page.$eval("#mb-email", (e) => (e.value = ""));
await setValue("#mb-email", "JUAN@example.com");
await page.click('button[type="submit"]');
await page.waitForSelector("section[aria-label^='Booking']");
let t4 = await text();
check("manage: lookup works (case-insensitive email)", /Confirmed/.test(t4) && /Juan Dela Cruz/.test(t4));
await shot("e6-manage");

const seatsBefore = await (await fetch(`${BASE}/api/flights/JT-102`)).json();
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Cancel booking").click());
await page.waitForSelector('[role="dialog"]');
await shot("e7-cancel-dialog", false);
await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] button')].find((b) => /Yes, cancel/.test(b.textContent)).click());
await page.waitForFunction(() => /This booking is cancelled/.test(document.body.innerText), { timeout: 10000 });
check("manage: cancel flow completes", true);
const seatsAfter = await (await fetch(`${BASE}/api/flights/JT-102`)).json();
check("cancel released 2 seats", seatsAfter.data.availableSeats === seatsBefore.data.availableSeats + 2, `${seatsBefore.data.availableSeats} -> ${seatsAfter.data.availableSeats}`);
await shot("e8-cancelled");

/* ---------- 4. Details page + unavailable ---------- */
await page.goto(`${BASE}/flights/JT-101`, { waitUntil: "networkidle2", timeout: 60000 });
check("details: shows flight + book CTA", /Book this flight/.test(await text()));
await shot("e9-details");
await page.goto(`${BASE}/booking/JT-104`, { waitUntil: "networkidle2", timeout: 60000 });
check("booking: cancelled flight shows unavailable state", /can't be booked/.test(await text()));
await page.goto(`${BASE}/flights/NOPE-1`, { waitUntil: "networkidle2", timeout: 60000 });
check("details: unknown flight -> 404 page", /404|could not be found|not found/i.test(await text()));

/* ---------- 5. Admin ---------- */
await page.goto(`${BASE}/admin/bookings`, { waitUntil: "networkidle2", timeout: 60000 });
check("admin: unauthenticated -> login", page.url().endsWith("/admin/login"));
await page.type("#password", "wrong-password");
await page.click('button[type="submit"]');
await page.waitForSelector("#password-error");
check("admin: wrong password shows inline error", true);
await page.$eval("#password", (e) => (e.value = ""));
await setValue("#password", process.env.ADMIN_PASSWORD);
await page.click('button[type="submit"]');
await page.waitForFunction(() => location.pathname === "/admin" && /Scheduled flights/.test(document.body.innerText), { timeout: 20000 });
check("admin: login -> dashboard", page.url().endsWith("/admin"), page.url());
const dash = await text();
check("admin: dashboard shows real stats", /Scheduled flights/.test(dash) && /Recent bookings/.test(dash) && !/Andrea Cruz|Marcus Lee/.test(dash));
check("admin: public navbar hidden", !(await page.$('header a[href="/flights"]')));
await shot("e10-admin-dash");

await page.goto(`${BASE}/admin/bookings`, { waitUntil: "networkidle2", timeout: 60000 });
check("admin: bookings table shows the cancelled booking", new RegExp(ref).test(await text()));
await shot("e11-admin-bookings");
await page.goto(`${BASE}/admin/flights`, { waitUntil: "networkidle2", timeout: 60000 });
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => /Add flight/.test(b.textContent)).click());
await page.waitForSelector('[role="dialog"]');
await shot("e12-admin-flight-dialog", false);
await page.keyboard.press("Escape");

// integrity guards (admin cookie is on this page)
const api = (url, method, body) =>
  page.evaluate(async (url, method, body) => {
    const r = await fetch(url, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, json: await r.json() };
  }, url, method, body);
const mk = await page.evaluate(async () => {
  const r = await fetch("/api/bookings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ flightNo: "JT-101", fullName: "Guard Test", email: "guard@example.com", phone: "+63 917 123 4567", passengers: 1 }) });
  return (await r.json()).data.bookingReference;
});
const delFlight = await api("/api/flights/JT-101", "DELETE");
check("guard: cannot delete flight with active booking (409)", delFlight.status === 409 && delFlight.json.code === "FLIGHT_HAS_BOOKINGS", delFlight.json.message);
const delActive = await api(`/api/bookings/${mk}`, "DELETE");
check("guard: cannot delete an active booking (409)", delActive.status === 409 && delActive.json.code === "BOOKING_ACTIVE");
const cancelPub = await (await fetch(`${BASE}/api/bookings/cancel`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference: mk, email: "someone-else@example.com" }) })).status;
check("guard: public cancel needs matching email (404)", cancelPub === 404);
const okCancel = await (await fetch(`${BASE}/api/bookings/cancel`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference: mk, email: "guard@example.com" }) })).status;
check("public cancel with right email (200)", okCancel === 200);
const delOk = await api(`/api/bookings/${mk}`, "DELETE");
check("admin can delete a cancelled booking", delOk.status === 200);

/* ---------- 6. True 390px mobile ---------- */
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const overflow = async (name) => {
  const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`mobile: no horizontal overflow on ${name}`, o <= 0, `overflow ${o}px`);
};
for (const [name, url] of [
  ["home", "/"],
  ["results", "/flights?from=MNL&to=NRT&date=2026-12-01&passengers=2"],
  ["details", "/flights/JT-101"],
  ["booking", "/booking/JT-101?passengers=2"],
  ["manage", "/my-bookings"],
]) {
  await page.goto(BASE + url, { waitUntil: "networkidle2", timeout: 60000 });
  await overflow(name);
  await shot(`m-${name}`);
}
await page.goto(`${BASE}/flights?from=MNL&to=NRT&date=2026-12-01`, { waitUntil: "networkidle2", timeout: 60000 });
await page.click('button[aria-label="Open menu"]');
await page.waitForSelector('[role="dialog"]');
check("mobile: menu opens", /Manage booking/.test(await page.evaluate(() => document.querySelector('[role="dialog"]').innerText)));
await shot("m-menu", false);
await page.keyboard.press("Escape");
await page.goto(`${BASE}/admin`, { waitUntil: "networkidle2", timeout: 60000 });
await overflow("admin dashboard");
await shot("m-admin");
await page.goto(`${BASE}/admin/bookings`, { waitUntil: "networkidle2", timeout: 60000 });
await overflow("admin bookings (table scrolls inside its container)");

/* ---------- 7. Rate limiting (real MongoDB counters) ---------- */
const json = { "content-type": "application/json" };
const lookups = [];
for (let i = 0; i < 32; i++) {
  lookups.push(await fetch(`${BASE}/api/bookings/lookup`, { method: "POST", headers: json, body: JSON.stringify({ reference: "JT-NOPE0000", email: "x@example.com" }) }));
}
const lookupStatuses = lookups.map((x) => x.status);
const firstBlocked = lookupStatuses.indexOf(429);
check("rate limit: lookups allowed (404) before the cap", lookupStatuses.slice(0, 5).every((x) => x === 404));
check("rate limit: lookup blocked (429) once the cap is hit", firstBlocked > 0 && firstBlocked <= 30, `first 429 at request #${firstBlocked + 1}`);
const blocked = lookups[firstBlocked];
check("rate limit: 429 carries Retry-After + RATE_LIMITED code", Number(blocked?.headers.get("retry-after")) > 0 && (await blocked.json()).code === "RATE_LIMITED");

const logins = [];
for (let i = 0; i < 12; i++) {
  logins.push((await fetch(`${BASE}/api/auth/login`, { method: "POST", headers: json, body: JSON.stringify({ password: "definitely-wrong" }) })).status);
}
check("rate limit: admin login brute force blocked", logins.slice(0, 3).every((x) => x === 401) && logins.includes(429), logins.join(","));
const goodWhileBlocked = (await fetch(`${BASE}/api/auth/login`, { method: "POST", headers: json, body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }) })).status;
check("rate limit: even the right password is refused while blocked", goodWhileBlocked === 429);

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures ? 1 : 0);
