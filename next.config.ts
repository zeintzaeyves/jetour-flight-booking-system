import type { NextConfig } from "next";

// Baseline hardening headers. A Content-Security-Policy is intentionally not set
// here: Next injects inline scripts, so a correct CSP needs per-request nonces and
// should be added deliberately and tested.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Opt-in: on low-memory machines run `BUILD_CPUS=3 npm run build` to cap build worker parallelism.
  ...(process.env.BUILD_CPUS
    ? { experimental: { cpus: Number(process.env.BUILD_CPUS) } }
    : {}),
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Personal data / session endpoints must never be cached by shared caches.
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
