import type { Metadata } from "next";

import {
  AudienceBand,
  CtaBand,
  FaqBand,
  FeatureGrid,
  Hero,
  HowItWorks,
  ReviewWall,
  TrustBar,
} from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { consultationCta } from "@/content/nav";
import { commercial } from "@/content/pages/standing";
import { ratingSummary, reviews } from "@/content/reviews";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * /commercial/ — THE SECOND FRONT DOOR.
 *
 * It is built like the homepage rather than like a service page, and that is the whole design. A
 * service page is read by somebody already inside the funnel who wants one question answered; this
 * is read cold, by a property manager who has never heard of us and is deciding in one scroll
 * whether we are a real option for a 200-unit community. So it carries the full argument — what it
 * is, who it is for, what happens, who says we are any good, what we promise, and the questions
 * that stop a manager booking — in the homepage's own bands.
 *
 * It is also the only page besides the homepage that gets the full-bleed `Hero`, for the same
 * reason: it is a front door. See the note on `ServiceHero`.
 *
 * The bands alternate canvas / alt / raised so no two touching sections share a surface. The one
 * place that could not be solved by tone is the seam between the three steps and the review wall —
 * both are `raised` by definition — so a `SectionDivider` marks it, the same device the service
 * template uses between its two white bands.
 *
 * NOT PUBLISHED. `commercial.body` is empty, so `isPublishable` is false, the page carries noindex,
 * and lib/routes.ts keeps it out of the sitemap. That gate answers a business question — does this
 * client actually take commercial work — and not a design one, so a finished-looking page does not
 * flip it. See the note at the top of the content record.
 */

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Commercial", path: routes.commercial() },
];

export const metadata: Metadata = buildMetadata({
  ...commercial.seo,
  path: routes.commercial(),
  noindex: !isPublishable(commercial.body),
});

export default function CommercialPage() {
  return (
    <>
      {/* No FAQPage node, even though this page's five questions ARE visible and would qualify.
          `standardPageGraph` does not carry one, and adding a builder for markup on a noindexed
          page buys nothing — it is worth doing in the same commit that publishes the page. */}
      <JsonLd
        graph={standardPageGraph({
          path: routes.commercial(),
          name: commercial.heading,
          description: commercial.seo.description,
          crumbs,
        })}
      />

      {/* `stacked` — the claim centred across the full measure, the photograph underneath it at the
          container width. The homepage's split treatment is deliberately not reused here; see the
          note on `Hero` for why this page's sentence has to land whole before the picture arrives.

          White, not the house canvas: the photograph is the only thing in this band carrying
          colour, and on cream its rounded corners sit on a tone barely different from their own.
          The strip below is the yellow, which is what gives the two bands their edge.

          `cta` overrides the site-wide quote CTA: it asks for a zip code and a number of dogs,
          which is not a question a property manager can answer. See `consultationCta`. */}
      <Hero
        heading={commercial.heading}
        subheading={commercial.intro}
        image="commercialHero"
        crumbs={crumbs}
        cta={consultationCta}
        assurances={commercial.assurances}
        layout="stacked"
        tone="raised"
      />

      <TrustBar rating={ratingSummary} items={commercial.trust} />

      {/* `raised` — plain white, so the three cards can carry the cream. A cream card on the cream
          band is an invisible card. `center` because three items with a medallion each are a row of
          equals, not a list you work down. */}
      <FeatureGrid
        heading={commercial.services.heading}
        intro={commercial.services.intro}
        features={commercial.services.features}
        tone="raised"
        align="center"
      />

      <AudienceBand
        eyebrow={commercial.audiences.eyebrow}
        heading={commercial.audiences.heading}
        intro={commercial.audiences.intro}
        audiences={commercial.audiences.items}
      />

      <HowItWorks heading={commercial.howItWorks.heading} steps={commercial.howItWorks.steps} />

      {/* Both neighbours are white and nothing marks the seam between them. This is that mark: a
          hairline on the container line, starting and stopping where the words above and below do.
          A full-bleed rule would cut the page in two instead. See `SectionDivider`. */}
      <SectionDivider tone="raised" />

      {/* Residential quotes, on a commercial page, deliberately. They are the reviews that exist,
          they are real, and what they evidence — thoroughness, showing up, texting you — is what a
          property manager is buying too. The heading is worded so nothing here claims a commercial
          client left one. See the note in the content record. */}
      <ReviewWall heading={commercial.reviews.heading} reviews={reviews} />

      {/* `alt`, the deeper cream: six white cards on it, and it separates the promises from the
          white band above without a border. Left-hung, unlike the services band — six items is a
          list you read down rather than a row of equals. */}
      <FeatureGrid
        eyebrow={commercial.promise.eyebrow}
        heading={commercial.promise.heading}
        features={commercial.promise.points}
        tone="alt"
      />

      {/* `canvas`, not the site-default dark navy: on the dark band the navy buttons disappear into
          it, because --color-surface-dark and --color-brand are the same hex. See CtaBand. */}
      <CtaBand
        heading={commercial.cta.heading}
        detail={commercial.cta.detail}
        tone="canvas"
        cta={consultationCta}
      />

      {/* The page closes on the questions rather than on the CTA above them, and the band carries
          its own way forward so it is not a dead end. The link goes to /contact/, NOT to /faq/ —
          the site FAQ answers "do I need to be home?", which is a homeowner's question. */}
      <FaqBand
        heading={commercial.faq.heading}
        items={commercial.faq.items}
        cta="Talk to us about your property"
        ctaHref={routes.contact()}
      />
    </>
  );
}
