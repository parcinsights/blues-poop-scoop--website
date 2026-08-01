/**
 * THE 301 MAP. Every URL that exists on the current WordPress site must appear here.
 *
 * This is the highest-risk part of the launch and the easiest to under-do. An old URL that 404s
 * after cutover throws away every link and every ranking that URL had earned. A 301 keeps them.
 *
 * `permanent: true` emits a 308 (the method-preserving equivalent of a 301); search engines treat
 * it as a permanent move and pass signals through it identically.
 *
 * INCOMPLETE — Cloudflare bot protection blocked crawling bluespoopscoop.com, so this covers only
 * the URLs confirmed from search results. Before launch, get the full inventory from either:
 *   · https://bluespoopscoop.com/sitemap_index.xml opened in a browser, or
 *   · Search Console → Indexing → Pages → Export
 * and add every one. `redirects.test.ts` checks each destination is a real route, but it cannot
 * know about a source URL nobody told it exists.
 *
 * Rule: redirect to the closest equivalent PAGE. Never bulk-redirect old URLs to the homepage —
 * Google treats a mass homepage redirect as a soft 404 and drops the signals anyway.
 */

/** @type {{source: string, destination: string, permanent: boolean}[]} */
export const redirects = [
  // Confirmed live on the current site.
  // /residential was the old site's one recurring-service page. Its equivalent is now the Poop
  // Scoop page — it was pointed at /services/weekly-scooping/ until the frequency pages were
  // merged away on 2026-08-01. See content/services.ts.
  { source: "/residential", destination: "/services/poop-scoop/", permanent: true },
  { source: "/commercial-services", destination: "/commercial/", permanent: true },

  // WordPress leftovers that should not be reachable on the new site.
  { source: "/wp-admin/:path*", destination: "/", permanent: false },
  { source: "/feed", destination: "/", permanent: true },
  { source: "/category/:path*", destination: "/", permanent: true },
  { source: "/tag/:path*", destination: "/", permanent: true },

  // TODO: add every remaining URL from the sitemap export.
];
