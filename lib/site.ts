// Site-wide identity: used by metadata, the link-preview image, the footer credit
// and the "How it's built" page. Change links here, not in each component.

export const SITE_URL = "https://jetour-flight-booking-system.vercel.app";
export const SITE_NAME = "Jetour";
export const SITE_TAGLINE = "Book. Fly. Explore.";
export const SITE_DESCRIPTION =
  "A flight search and booking app for Asia-Pacific routes: search, compare fares, reserve seats and manage bookings without an account. Demo project with sample flights.";

export const CREATOR = {
  name: "Zein Khalid",
  role: "Design and full-stack development",
  linkedin: "https://www.linkedin.com/in/zeinkhalid/",
  github: "https://github.com/zeintzaeyves",
  // Make sure this repo is public before sharing, or visitors will get a 404.
  source: "https://github.com/zeintzaeyves/jetour-flight-booking-system",
} as const;
