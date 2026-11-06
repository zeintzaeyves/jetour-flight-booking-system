import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { CREATOR, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// The picture shown when the link is shared (LinkedIn, Messenger, X, Slack…).
// Generated once at build time; Next adds the og:image tags for every page.
export const alt = `${SITE_NAME}: ${SITE_TAGLINE} A flight booking app by ${CREATOR.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hex versions of the design tokens (the image renderer has no oklch support).
const CANVAS = "#050706";
const SKY = "#5cb9ee";

const STACK = ["Next.js 16", "React 19", "TypeScript", "MongoDB", "Tailwind 4"];

export default async function Image() {
  const bg = await readFile(join(process.cwd(), "public/images/bg.jpg"));
  const bgSrc = `data:image/jpeg;base64,${bg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: CANVAS,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={bgSrc}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover", opacity: 0.5 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `linear-gradient(100deg, ${CANVAS} 20%, rgba(5,7,6,0.75) 55%, rgba(5,7,6,0.35) 100%)`,
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.5 }}>{SITE_NAME}</div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: SKY,
                border: `1px solid ${SKY}66`,
                background: `${SKY}1f`,
                borderRadius: 999,
                padding: "6px 16px",
              }}
            >
              Flight booking app
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
              Book. Fly. Explore.
            </div>
            <div style={{ marginTop: 24, fontSize: 30, color: "rgba(255,255,255,0.68)", maxWidth: 760 }}>
              Search flights, compare fares and reserve seats in a few steps. No account needed.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {STACK.map((s) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    fontSize: 20,
                    color: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 999,
                    padding: "8px 18px",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.6)" }}>
              Designed &amp; built by&nbsp;<span style={{ color: "white" }}>{CREATOR.name}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
