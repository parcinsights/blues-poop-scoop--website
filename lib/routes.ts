/**
 * THE ROUTE REGISTRY. Every URL on this site is built here and nowhere else.
 *
 * Two things follow from that, and both are the reason it exists:
 *
 *  · `sitemap.ts` is generated from `allRoutes()`, so a new page cannot be orphaned by someone
 *    forgetting to add it to a list. Add the content, get the sitemap entry.
 *  · No component ever writes a URL string. A path change happens in one file, and TypeScript
 *    finds every caller.
 *
 * Trailing slashes are ON, matching the existing WordPress site's URLs. That is a deliberate
 * migration choice: the pages we keep then need no redirect hop at all. It is pinned in
 * next.config.mjs and must never change after launch — it is a full URL migration if it does.
 */

import { cities } from "@/content/cities";
import { cityPageServices, services } from "@/content/services";

/**
 * The one origin this build knows about. Every canonical, OG url, sitemap entry and schema @id
 * derives from it. Hardcoding a URL anywhere else is how a staging host ends up in production
 * structured data.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bluespoopscoop.com").replace(
  /\/$/,
  "",
);

/**
 * True only on the real production deployment. Preview and development builds serve
 * `Disallow: /` and `noindex` — otherwise Vercel preview URLs get indexed and compete with the
 * real site, which is a genuinely common and entirely avoidable leak.
 */
export const isIndexable = process.env.VERCEL_ENV === "production";

export const routes = {
  home: () => "/",
  services: () => "/services/",
  service: (slug: string) => `/services/${slug}/`,
  locations: () => "/locations/",
  city: (slug: string) => `/locations/${slug}/`,
  cityService: (citySlug: string, serviceSlug: string) => `/locations/${citySlug}/${serviceSlug}/`,
  pricing: () => "/pricing/",
  commercial: () => "/commercial/",
  about: () => "/about/",
  contact: () => "/contact/",
  faq: () => "/faq/",
  getStarted: () => "/get-started/",
} as const;

/** Turn a site-relative path into the absolute URL used in canonical, OG, sitemap and schema. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export type RouteEntry = {
  path: string;
  /** Sitemap hint. Relative importance within this site only — not a ranking factor. */
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  /**
   * Whether the route file exists yet. Only `true` entries reach the sitemap.
   *
   * A sitemap that lists URLs returning 404 teaches Google the sitemap is unreliable, and it is
   * the single most common self-inflicted crawl problem on a phased launch. Flip a flag when the
   * page ships; `routes.test.ts` fails if a flag claims a page that has no route file.
   */
  implemented: boolean;
};

/**
 * Every page on the site — planned and built — derived from content. `app/sitemap.ts` reads the
 * implemented subset. A page that exists in the app but not here is a bug; routes.test.ts checks
 * both directions against the filesystem.
 */
export function allRoutes(): RouteEntry[] {
  const entries: RouteEntry[] = [
    { path: routes.home(), priority: 1.0, changeFrequency: "weekly", implemented: true },
    { path: routes.services(), priority: 0.8, changeFrequency: "monthly", implemented: false },
    { path: routes.locations(), priority: 0.8, changeFrequency: "monthly", implemented: false },
    { path: routes.pricing(), priority: 0.9, changeFrequency: "monthly", implemented: false },
    { path: routes.commercial(), priority: 0.7, changeFrequency: "monthly", implemented: false },
    { path: routes.about(), priority: 0.5, changeFrequency: "yearly", implemented: false },
    { path: routes.contact(), priority: 0.7, changeFrequency: "yearly", implemented: false },
    { path: routes.faq(), priority: 0.6, changeFrequency: "monthly", implemented: false },
    { path: routes.getStarted(), priority: 0.9, changeFrequency: "monthly", implemented: false },
  ];

  for (const service of services) {
    entries.push({
      path: routes.service(service.slug),
      priority: 0.8,
      changeFrequency: "monthly",
      implemented: false,
    });
  }

  for (const city of cities) {
    entries.push({
      path: routes.city(city.slug),
      priority: 0.7,
      changeFrequency: "monthly",
      implemented: false,
    });
  }

  // The money pages: only services flagged for city pages, so the URL count stays deliberate.
  for (const city of cities) {
    for (const service of cityPageServices) {
      entries.push({
        path: routes.cityService(city.slug, service.slug),
        priority: 0.9,
        changeFrequency: "monthly",
        implemented: false,
      });
    }
  }

  return entries;
}

/** What actually goes in the sitemap. */
export function publishedRoutes(): RouteEntry[] {
  return allRoutes().filter((entry) => entry.implemented);
}
