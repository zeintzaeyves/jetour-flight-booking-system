// Lightweight performance check: Core Web Vitals (LCP, CLS) and transferred bytes per page,
// measured in real Chrome against a locally running PRODUCTION build (`npm run build && npm start`).
// Local numbers exclude real-network latency, so treat them as a regression guard, not as
// field data. Budgets: LCP < 2500ms, CLS < 0.1.
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH;
if (!CHROME) throw new Error("Set CHROME_PATH to a Chrome/Chromium executable.");

const PAGES = [
  ["home", "/"],
  ["results", "/flights?from=MNL&to=NRT&date=2026-12-01"],
  ["flight details", "/flights/JT-101"],
  ["booking form", "/booking/JT-101"],
  ["manage booking", "/my-bookings"],
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
let failed = 0;

for (const [label, viewport] of [
  ["desktop", { width: 1280, height: 800 }],
  ["mobile", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
]) {
  for (const [name, path] of PAGES) {
    // Fresh context per page = cold cache, so byte counts are what a first-time visitor downloads.
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport(viewport);
    const client = await page.createCDPSession();
    await client.send("Network.enable");
    if (label === "mobile") {
      // Roughly "fast 4G" so the numbers are not flattering.
      await client.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
      await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    let bytes = 0;
    let jsBytes = 0;
    const isScript = new Set();
    client.on("Network.responseReceived", (e) => {
      if (e.type === "Script") isScript.add(e.requestId);
    });
    client.on("Network.loadingFinished", (e) => {
      bytes += e.encodedDataLength;
      if (isScript.has(e.requestId)) jsBytes += e.encodedDataLength;
    });
    await page.evaluateOnNewDocument(() => {
      window.__lcp = 0;
      window.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 1000));
    const { lcp, cls } = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
    const ok = lcp < 2500 && cls < 0.1;
    if (!ok) failed++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${label.padEnd(7)} ${name.padEnd(15)} LCP ${String(Math.round(lcp)).padStart(5)}ms  CLS ${cls.toFixed(3)}  transferred ${(bytes / 1024).toFixed(0).padStart(5)} KB  (JS ~${(jsBytes / 1024).toFixed(0)} KB)`
    );
    await context.close();
  }
}

await browser.close();
console.log(failed ? `\n${failed} page(s) over budget` : "\nAll pages within budget");
process.exit(failed ? 1 : 0);
