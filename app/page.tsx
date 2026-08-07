import type { Metadata } from "next";

import {
  CtaBand,
  CtaBanner,
  FaqBand,
  Hero,
  HowItWorks,
  PricingBand,
  ReviewWall,
  ServiceAreaMap,
  WhyUs,
} from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { cities } from "@/content/cities";
import { home } from "@/content/pages/home";
import { ratingSummary, reviews } from "@/content/reviews";
import { routes } from "@/lib/routes";
import { homeGraph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ ...home.seo, path: routes.home() });

/**
 * The homepage. Note what it does NOT do: no colour, no font size, no URL string, and no English
 * sentence is written here. It assembles blocks around `content/pages/home.ts`.
 *
 * It carries no breadcrumb — it is the root of the trail, and a one-item trail is noise.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd graph={homeGraph(home.seo.description)} />

      <Hero
        heading={home.hero.heading}
        subheading={home.hero.subheading}
        serviceLine={home.hero.serviceLine}
        image="landingHero"
        rating={ratingSummary}
        assurances={home.hero.assurances}
      />

      {/* ── THE ORDER OF THIS PAGE ────────────────────────────────────────────
          Set by the client on 2026-08-06: how it works, pricing, why your yard, reviews, Q+A.

          It is a better order than the one it replaced (reviews, why us, how it works, pricing),
          and the reason is what a visitor is holding when they arrive. Somebody who has just read
          "we visit your yard weekly" has a mechanical question — what actually happens, and what
          does it cost — not an emotional one. Answering those two first means the persuasion
          underneath is being read by somebody who already knows what they would be buying, and the
          reviews land as confirmation of a decision rather than as an argument for one.

          It also puts the price four screens earlier, which is the single most-searched fact in
          this trade. */}
      <HowItWorks heading={home.howItWorks.heading} steps={home.howItWorks.steps} />

      <PricingBand
        heading={home.pricing.heading}
        assurances={home.pricing.assurances}
        promise={home.pricing.promise}
        cta={home.pricing.cta}
      />

      {/* `tone="canvas"` matches the bands either side, so the ribbon floats inside the run rather
          than cutting it in two. It sits directly after the prices on purpose — the moment somebody
          has decided a number is acceptable is the moment they are most likely to act, and the band
          underneath is reassurance for the ones who have not. */}
      <CtaBanner heading={home.ctaBanner.heading} detail={home.ctaBanner.detail} tone="canvas" />

      {/* No `intro` — the client cut the paragraph on 2026-08-06. See the record. */}
      <WhyUs
        heading={home.whyUs.heading}
        points={home.whyUs.points}
        cta={home.whyUs.cta}
        image="whyUs"
      />

      <ReviewWall heading="See what our friends are saying about us" reviews={reviews} />

      {/* Both bands are white, so nothing marks the seam between them. This is that mark — a
          hairline on the container line rather than a change of colour. See `SectionDivider`. */}
      <SectionDivider tone="raised" />

      <FaqBand heading={home.faq.heading} items={home.faq.items} cta={home.faq.cta} />

      {/* `raised` matches the FAQ above rather than the map below, so the ribbon reads as the last
          line of the answers — you have finished asking, here is the button — instead of as an
          announcement stuck on the front of the coverage band. */}
      <CtaBanner
        heading={home.ctaAfterFaq.heading}
        detail={home.ctaAfterFaq.detail}
        tone="raised"
      />

      {/* The coverage map closes the page, and closing on it is the point: "do you come to my
          street?" is the one question a visitor cannot answer for themselves, and the last thing
          they should see is either their own town or an honest invitation to ask.

          Renders the map only when the Maps Static API is switched on — see lib/maps.ts. With it
          off the band still works: the town chips underneath are the actual answer, and the map
          was always the illustration. */}
      <ServiceAreaMap
        heading={home.serviceArea.heading}
        intro={home.serviceArea.intro}
        cities={cities}
        cta={home.serviceArea.cta}
      />

      {/* The close, under the map. `canvas` rather than the site-default navy: on the dark band the
          navy quote button disappears into it — --color-surface-dark and --color-brand are the same
          hex. See CtaBand. The map band above is `alt`, so the tone still changes at the seam. */}
      <CtaBand heading={home.cta.heading} detail={home.cta.detail} tone="canvas" />

      {/* REBUILD IN PROGRESS — the rest of the homepage is being redesigned one band at a time.
          The blocks that used to sit here (value props, services grid, CTA) still exist and still
          work; they come back as each is redrawn. */}
    </>
  );
}
