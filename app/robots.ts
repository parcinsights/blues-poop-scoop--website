import type { MetadataRoute } from "next";

import { absoluteUrl, isIndexable } from "@/lib/routes";

/**
 * robots.txt.
 *
 * The important half is the `else`: every non-production deployment serves `Disallow: /`.
 * Vercel gives every branch and every pull request a public URL, and those URLs get discovered —
 * via links, via Chrome telemetry, via anyone who pastes one. An indexed preview is a duplicate
 * of the real site that competes with it and dilutes it. One condition prevents the whole class
 * of problem.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing user-facing lives under /api; there is no reason to spend crawl budget there.
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
