import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { Footer } from "@/components/blocks/Footer";
import { Header } from "@/components/blocks/Header";
import { site } from "@/content/site";
import { metadataBase } from "@/lib/seo";
import { BRAND_HEX } from "@/lib/tokens";

import "./theme.css";
import "./base.css";

/**
 * LINE Seed Sans, one face for the whole site — headings and body differ by weight and size, not
 * by family. Self-hosted through next/font/local: the .woff2 files in app/fonts are served from
 * our own origin, preloaded, and given a stable fallback metric, so there is no render-blocking
 * request to a font CDN and no layout shift when the face swaps in.
 *
 * The Latin family ships Regular / Bold / ExtraBold (plus Thin and Heavy, unused). CSS weight
 * matching covers the gaps on its own: rules asking for 500 resolve to Regular, 600 to Bold. No
 * synthetic emboldening happens, so nothing in base.css needs to change.
 *
 * Licensed under the LINE Seed font license — free for commercial use and web embedding; see
 * app/fonts/LICENSE.md.
 *
 * Changing the font is this one call and nothing else — every rule reads --font-display and
 * --font-body from theme.css.
 */
const lineSeedSans = localFont({
  src: [
    { path: "./fonts/LINESeedSans_Rg.woff2", weight: "400", style: "normal" },
    { path: "./fonts/LINESeedSans_Bd.woff2", weight: "700", style: "normal" },
    { path: "./fonts/LINESeedSans_XBd.woff2", weight: "800", style: "normal" },
  ],
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
    <html lang="en-US" className={lineSeedSans.variable}>
      <body>
        {/* First focusable element on the page — lets keyboard users skip the nav. */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
