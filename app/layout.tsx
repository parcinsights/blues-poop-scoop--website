import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";

import { Analytics } from "@/components/analytics/Analytics";
import { Footer } from "@/components/blocks/Footer";
import { Header } from "@/components/blocks/Header";
import { site } from "@/content/site";
import { metadataBase } from "@/lib/seo";
import { BRAND_HEX } from "@/lib/tokens";

import "./theme.css";
import "./base.css";

/**
 * Fredoka, one face for the whole site — headings and body differ by weight and size, not by
 * family. Rounded terminals and a wide, friendly bowl: the tone a neighbourhood pet-waste service
 * wants, where the previous grotesque read corporate.
 *
 * `next/font/google` still self-hosts. The face is fetched once at BUILD time and emitted into our
 * own /_next/static output, so the browser never touches fonts.googleapis.com — no render-blocking
 * third-party request, no privacy hop, and a stable fallback metric so nothing shifts on swap.
 *
 * VARIABLE, and `weight` is deliberately omitted so the whole axis ships in one file. That axis is
 * 300–700, which is the one thing to know before adding a rule here: `font-extrabold` (800) has no
 * design to resolve to and CLAMPS to 700 — it renders identically to `font-bold`, with no synthetic
 * emboldening. Button labels ask for 800 and get Fredoka's Bold; that is the intended top of the
 * ramp, not a bug. Anything wanting more weight than that needs a different face, not a heavier
 * number.
 *
 * Licensed under the SIL Open Font License 1.1 — free for commercial use and web embedding.
 *
 * Changing the font is this one call and nothing else — every rule reads --font-display and
 * --font-body from theme.css.
 */
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${site.name} — ${site.tagline}`,
    // Every page supplies its own title; this appends the brand consistently.
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  applicationName: site.name,
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: BRAND_HEX,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={fredoka.variable}>
      <body>
        {/* First focusable element on the page — lets keyboard users skip the nav. */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* The ad tags. Last in the body and deferred — see the component. */}
        <Analytics />
      </body>
    </html>
  );
}
