import type { Metadata, Viewport } from "next";
import { Chivo_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import AssistantFab from "@/components/ai/AssistantFab";
import Navbar from "@/components/layout/Navbar";
import SplashScreen, { splashScript } from "@/components/layout/SplashScreen";
import { Toaster } from "@/components/ui/sonner";
import { CREATOR, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Timetable-style type, used by the departures board.
const board = Chivo_Mono({ subsets: ["latin"], variable: "--font-board", display: "swap" });

// Link previews (LinkedIn, Messenger, X, Slack) read these tags. The preview image
// itself comes from app/opengraph-image.tsx, which Next wires in automatically.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: CREATOR.name, url: CREATOR.linkedin }],
  creator: CREATOR.name,
  keywords: ["flight booking", "Next.js", "React", "TypeScript", "MongoDB", "case study"],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#050706" },
    { media: "(prefers-color-scheme: dark)", color: "#050706" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${board.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
        <SplashScreen />
        {/* The site is dark-only (the original Jetour look). */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <a
            href="#main-content"
            className="sr-only z-[100] rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <Navbar />
          <div id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <AssistantFab />
          <Toaster richColors position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
