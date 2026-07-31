import type { Metadata, Viewport } from "next";
import { Bitter, Montserrat } from "next/font/google";

import { Footer } from "@/components/blocks/Footer";
import { Header } from "@/components/blocks/Header";
import { site } from "@/content/site";
import { metadataBase } from "@/lib/seo";
import { BRAND_HEX } from "@/lib/tokens";

import "./theme.css";
import "./base.css";

/**
 * The client's brand faces: Bitter (the slab serif in the logo wordmark) for headings, Montserrat
 * for body. Using the logo's own typeface for headings is what ties the page to the mark — a
 * different heading face would read as a different company's site with their logo pasted on.
 *
 * Both are self-hosted through next/font: files served from our own origin, preloaded, and
 * subset, so there is no render-blocking request to fonts.googleapis.com and no layout shift when
 * the face swaps in. Both are open-licensed, so there is no web-embedding question to resolve.
 *
 * Changing the fonts is these two calls and nothing else — every rule reads --font-display and
 * --font-body from theme.css.
 */
const display = Bitter({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display-face",
  display: "swap",
});

const body = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-face",
  display: "swap",
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
    <html lang="en-US" className={`${display.variable} ${body.variable}`}>
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
