// Automated accessibility audit (axe-core, WCAG 2.0/2.1/2.2 A + AA and best practices)
// across every page and key UI state, at desktop and a real 390px mobile viewport.
// Automated tools catch roughly a third of accessibility problems: a clean run is
// necessary, not sufficient. Manual keyboard / screen-reader testing is still needed.
import fs from "node:fs";
import { createRequire } from "node:module";

import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const BASE = process.env.BASE ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH;
if (!CHROME) throw new Error("Set CHROME_PATH to a Chrome/Chromium executable.");
if (!process.env.ADMIN_PASSWORD) throw new Error("Set ADMIN_PASSWORD (must match the server).");

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
let blocking = 0;
let advisory = 0;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();

async function audit(name) {
  await page.evaluate(axeSource);
  const result = await page.evaluate((tags) => axe.run(document, { runOnly: { type: "tag", values: tags } }), TAGS);
  const v = result.violations;
  if (v.length === 0) {
    console.log(`PASS  ${name}  (${result.passes.length} rules passed${result.incomplete.length ? `, ${result.incomplete.length} need manual review` : ""})`);
    return;
  }
  for (const x of v) {
    const isBlocking = x.impact === "serious" || x.impact === "critical";
    if (isBlocking) blocking++;
    else advisory++;
    console.log(`${isBlocking ? "FAIL" : "WARN"}  ${name}  [${x.impact}] ${x.id}: ${x.help}  (${x.nodes.length} node${x.nodes.length > 1 ? "s" : ""})`);
    for (const n of x.nodes.slice(0, 3)) {
      console.log(`        ${n.target.join(" ")}  ::  ${(n.failureSummary || "").split("\n").slice(1, 2).join("").trim()}`);
    }
  }
}

const go = async (path) => {
  await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
};

async function suite(label) {
  await go("/");
  await audit(`${label} home`);
  await go("/flights?from=MNL&to=NRT&date=2026-12-01&passengers=2");
  await page.waitForSelector("article[aria-label]");
  await audit(`${label} results`);
  await go("/flights?from=MNL&to=NRT&date=2026-12-01&stops=1&depart=morning");
  await audit(`${label} results (empty state)`);
  await go("/flights/JT-101");
  await audit(`${label} flight details`);
  await go("/booking/JT-101?passengers=2");
  await audit(`${label} booking form`);
  await page.click('button[type="submit"]');
  await page.waitForSelector('[role="alert"]');
  await audit(`${label} booking form (validation errors)`);
  await go("/booking/JT-104");
  await audit(`${label} booking (unavailable)`);
  await go("/booking/success?ref=JT-ABCD2345");
  await audit(`${label} confirmation (no session data)`);
  await go("/my-bookings");
  await audit(`${label} manage booking`);
  await page.type("#mb-ref", "JT-NOPE0000");
  await page.type("#mb-email", "nobody@example.com");
  await page.click('button[type="submit"]');
  await page.waitForSelector("#mb-error");
  await audit(`${label} manage booking (error)`);
  await go("/this-page-does-not-exist");
  await audit(`${label} 404`);
}

// ---- desktop
await page.setViewport({ width: 1280, height: 900 });
await suite("desktop");
await go("/styleguide");
await audit("desktop styleguide");

// ---- admin (desktop)
await go("/admin/login");
await audit("desktop admin login");
await page.type("#password", process.env.ADMIN_PASSWORD);
await page.click('button[type="submit"]');
await page.waitForFunction(() => location.pathname === "/admin" && /Scheduled flights/.test(document.body.innerText), { timeout: 20000 });
await audit("desktop admin dashboard");
await go("/admin/flights");
await audit("desktop admin flights");
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => /Add flight/.test(b.textContent)).click());
await page.waitForSelector('[role="dialog"]');
await new Promise((r) => setTimeout(r, 700)); // let the open animation finish before measuring colour
await audit("desktop admin flight dialog");
await page.keyboard.press("Escape");
await go("/admin/bookings");
await audit("desktop admin bookings");

// ---- real 390px mobile
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await suite("mobile");
await go("/flights?from=MNL&to=NRT&date=2026-12-01");
await page.click('button[aria-label="Open menu"]');
await page.waitForSelector('[role="dialog"]');
await new Promise((r) => setTimeout(r, 700)); // let the slide-in finish before measuring colour
await audit("mobile menu open");

await browser.close();
console.log(`\n${blocking} blocking (serious/critical), ${advisory} advisory violation(s)`);
process.exit(blocking ? 1 : 0);
