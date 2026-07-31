import type { ContentBlock, Seo } from "./types";

/**
 * The city × service pages — /locations/[city]/[service]/.
 *
 * These are the highest-value pages on the site: "dog poop removal ardmore pa" is the query with
 * buying intent behind it. They are also the most dangerous, because 10 cities × 2 services is
 * 20 pages that would be identical apart from a swapped place name — which is the doorway-page
 * pattern, and Google treats it as manipulation rather than laziness.
 *
 * So they are authored ONE AT A TIME, keyed here, and a pair with no entry is not published: the
 * route renders for review but carries noindex and stays out of the sitemap (see lib/content.ts).
 *
 * What makes one of these pages real: the route day for that town, the yards and gates and fences
 * actually found there, parking, how the neighbourhood is laid out, jobs genuinely done there.
 * If the copy would be true of any town, it should not be written.
 *
 * Key format: `<city-slug>/<service-slug>`.
 */
export const moneyPages: Record<string, { seo: Seo; heading: string; body: ContentBlock[] }> = {
  // Start with the single busiest town × the weekly plan. Prove one, then repeat.
};

export function moneyPage(citySlug: string, serviceSlug: string) {
  return moneyPages[`${citySlug}/${serviceSlug}`];
}
