import type { Metadata } from "next";

import {
  BlockRenderer,
  CtaBanner,
  FeatureGrid,
  HowItWorks,
  PhotoBand,
} from "@/components/blocks/blocks";
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
 * The page is built the way a job ad should be read: the picture, then the reasons to want it,
 * then the terms, then how to apply. The terms band sits BELOW the perks and not above them,
 * which is the one ordering choice worth defending — somebody who has not yet been given a reason
 * to care reads a list of hours and requirements as a hurdle, and the same list two screens later
 * reads as the straight answer they were hoping for.
 *
 * WHITE AND CREAM ONLY. No navy anywhere, including the close: every other page on the site ends
 * on a dark band, and the reason this one does not is that the dark band is where we sell. An
 * applicant is not a customer, and a careers page that closes with the same full-bleed block as
 * the pricing page tells them they are reading marketing.
 *
 * The order runs white — white — white — cream — white — cream. The top three are one unbroken
 * white run: the h1, the photograph and the perks are a single opening statement, and a tone
 * change under the picture would cut it into a header and a body. The photograph is what marks
 * the seam instead, which it does harder than a colour or a rule could. Everything below it
 * alternates, so nothing on the page needs a divider.
 *
 * `opportunitiesHero` carries `priority`: it is the largest thing above the fold here, and the
 * only image on the page.
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
        tone="raised"
      />

      {/* White, matching the bands either side of it, so the picture reads as sitting inside the
          page rather than on a strip of its own. The band's own colour only ever shows in the
          rounded corners and the gutters, and a cream sliver there is the whole tell. */}
      <PhotoBand image="opportunitiesHero" priority tone="raised" />

      {/* White, so the three cards carry the cream. Centred: three reasons with a medallion each
          are a row of equals, not a list you work down. */}
      <FeatureGrid
        eyebrow={opportunities.perks.eyebrow}
        heading={opportunities.perks.heading}
        features={opportunities.perks.points}
        tone="raised"
        align="center"
      />

      {/* `canvas`, the page's first visible cream — it is what gives the perks above and the
          steps below their edges. Left-hung and without medallions, unlike the band above: six
          plain answers are a list you read down, and a medallion on "Pay" would dress up a fact
          that should be stated flat. */}
      <FeatureGrid
        eyebrow={opportunities.role.eyebrow}
        heading={opportunities.role.heading}
        intro={opportunities.role.intro}
        features={opportunities.role.points}
        tone="canvas"
      />

      <HowItWorks
        heading={opportunities.apply.heading}
        steps={opportunities.apply.steps}
      />

      {/* Authored blocks, if there are ever any. Empty today — see the record. */}
      <BlockRenderer blocks={opportunities.body} />

      <CtaBanner
        heading="Think you'd be a good fit?"
        detail={`Call ${site.phone.display} — a real person picks up.`}
        cta={headerCta}
      />
    </>
  );
}
