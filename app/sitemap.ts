import type { MetadataRoute } from "next";

import { absoluteUrl, isIndexable, publishedRoutes } from "@/lib/routes";

/**
 * The sitemap, generated from the route registry — never hand-maintained.
 *
 * Two rules it enforces:
 *
 *  · Only pages that actually exist are listed. A sitemap full of 404s trains Google to distrust
 *    it, which is the opposite of the job.
 *  · A non-production deployment publishes an EMPTY sitemap. Combined with robots.ts, that keeps
 *    Vercel preview URLs out of the index, where they would otherwise compete with the real site.
 *
 * `lastModified` is deliberately absent. Google ignores lastmod entirely once it notices every URL
 * claiming to change on every deploy — which is what a build timestamp does. It goes back in when
 * content carries real edit dates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];

  return publishedRoutes().map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
