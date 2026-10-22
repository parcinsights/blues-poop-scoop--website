import type { Metadata } from "next";

import { ThankYou } from "@/components/blocks/ThankYou";
import { thankYou } from "@/content/pages/standing";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

/**
 * /thank-you/ — where every form on the main site lands. The ad landing pages' form lands on its
 * own copy of this page instead, so Google Ads does not count those leads; see `ThankYou`.
 *
 * NO BREADCRUMBS AND NO STRUCTURED DATA, unlike every other page here. Both describe where a page
 * sits in a site people browse, and this one is not browsed: there is exactly one way in, and it
 * is pressing a submit button. A trail back up to Home on a page nobody navigated down to is
 * furniture describing a journey that never happened.
 *
 * `noindex` for the reason spelled out on `thankYou` in content/pages/standing.ts, and it is why
 * this route is missing from `allRoutes()` — see the note there.
 */
export const metadata: Metadata = buildMetadata({
  ...thankYou.seo,
  path: routes.thankYou(),
  noindex: true,
});

export default function ThankYouPage() {
  return <ThankYou />;
}
