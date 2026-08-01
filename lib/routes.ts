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

import { posts } from "@/content/blog";
import { cities } from "@/content/cities";
import { moneyPage } from "@/content/money-pages";
import { opportunities } from "@/content/pages/standing";
import { cityPageServices, services } from "@/content/services";
import { isPublishable } from "./content";

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
  reviews: () => "/reviews/",
  opportunities: () => "/opportunities/",
  blog: () => "/blog/",
  blogPost: (slug: string) => `/blog/${slug}/`,
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
    { path: routes.services(), priority: 0.8, changeFrequency: "monthly", implemented: true },
    { path: routes.locations(), priority: 0.8, changeFrequency: "monthly", implemented: true },
    { path: routes.pricing(), priority: 0.9, changeFrequency: "monthly", implemented: true },
    { path: routes.faq(), priority: 0.6, changeFrequency: "monthly", implemented: true },
    { path: routes.about(), priority: 0.5, changeFrequency: "yearly", implemented: true },
    { path: routes.contact(), priority: 0.7, changeFrequency: "yearly", implemented: true },
    { path: routes.getStarted(), priority: 0.9, changeFrequency: "monthly", implemented: true },
    // Real content from day one — the quotes already exist. Priority sits above /about/ because a
    // review page is a page people look for by name.
    { path: routes.reviews(), priority: 0.6, changeFrequency: "monthly", implemented: true },
    // Hiring. Low priority and yearly: it matters to the handful of people looking for it and to
    // nobody else, and treating it as a ranking target is how a careers page ends up outranking
    // the service pages for the business's own name. Unpublished until the role is written up —
    // the page carries `noindex` while its body is empty, and a sitemap entry for a noindexed URL
    // is the contradiction this flag exists to prevent.
    {
      path: routes.opportunities(),
      priority: 0.4,
      changeFrequency: "yearly",
      implemented: isPublishable(opportunities.body),
    },
    // Commercial stays unpublished until the client confirms they actually sell it — their
    // current site says "Coming Soon", and a page offering a service nobody performs is worse
    // than no page.
    { path: routes.commercial(), priority: 0.7, changeFrequency: "monthly", implemented: false },
    // The blog index is only worth submitting once it indexes something. An empty archive page in
    // the sitemap is a soft-404 invitation, and it stays that way for as long as nobody writes a
    // post — which, on a site this size, can be a long time. See content/blog.ts.
    {
      path: routes.blog(),
      priority: 0.5,
      changeFrequency: "weekly",
      implemented: posts.length > 0,
    },
  ];

  for (const post of posts) {
    entries.push({
      path: routes.blogPost(post.slug),
      priority: 0.5,
      changeFrequency: "yearly",
      implemented: isPublishable(post.body),
    });
  }

  /**
   * From here down, CONTENT decides publication, not a developer's memory. A page whose body has
   * never been authored renders (so it can be reviewed and linked) but is noindexed and absent
   * from the sitemap — see lib/content.ts for why that matters on a site shaped like this one.
   */
  for (const service of services) {
    entries.push({
      path: routes.service(service.slug),
      priority: 0.8,
      changeFrequency: "monthly",
      implemented: isPublishable(service.body),
    });
  }

  for (const city of cities) {
    entries.push({
      path: routes.city(city.slug),
      priority: 0.7,
      changeFrequency: "monthly",
      implemented: isPublishable(city.body),
    });
  }

  // The money pages: only services flagged for city pages, so the URL count stays deliberate.
  for (const city of cities) {
    for (const service of cityPageServices) {
      entries.push({
        path: routes.cityService(city.slug, service.slug),
        priority: 0.9,
        changeFrequency: "monthly",
        implemented: isPublishable(moneyPage(city.slug, service.slug)?.body ?? []),
      });
    }
  }

  return entries;
}

/** What actually goes in the sitemap. */
export function publishedRoutes(): RouteEntry[] {
  return allRoutes().filter((entry) => entry.implemented);
}
