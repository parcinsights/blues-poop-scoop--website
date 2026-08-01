import type { Metadata } from "next";

import { BlockRenderer, CtaBanner } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { headerCta } from "@/content/nav";
import { opportunities } from "@/content/pages/standing";
import { site } from "@/content/site";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "About", path: routes.about() },
  { name: "Opportunities", path: routes.opportunities() },
];

export const metadata: Metadata = buildMetadata({
  ...opportunities.seo,
  path: routes.opportunities(),
  // Nothing authored yet, so it renders for review but stays out of the index — the same rule
  // every unwritten page on this site follows (lib/content.ts).
  noindex: !isPublishable(opportunities.body),
});

/**
 * Hiring.
 *
 * No `JobPosting` structured data, and that is deliberate rather than an omission. `JobPosting`
 * requires a real posting with a title, a location, a validity window and — for Google Jobs — a
 * salary, and it must be removed the day the role closes or the listing goes stale in a way
 * Search Console flags. None of those facts exist yet, and a JobPosting node describing a role
 * that is not actually open is worse than no markup. Add it when there is a dated vacancy behind
 * this page, not before.
 *
 * It closes on `CtaBanner`, not the site-standard `CtaBand`, purely because the CTA has to point
 * somewhere else. Every `CtaBand` on the site hands over to the quote form, and an applicant being
 * asked "how many dogs do you have?" is the wrong question at the wrong moment. `CtaBanner` is the
 * one block that takes a `cta` override, so this page ends on "get in touch" instead.
 */
export default function OpportunitiesPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.opportunities(),
          name: opportunities.heading,
          description: opportunities.seo.description,
          crumbs,
        })}
      />
      <PageShell
        crumbs={crumbs}
        heading={opportunities.heading}
        intro={opportunities.intro}
      />
      <BlockRenderer blocks={opportunities.body} />
      <CtaBanner
        heading="Think you'd be a good fit?"
        detail={`Call ${site.phone.display} — a real person picks up.`}
        cta={headerCta}
      />
    </>
  );
}
