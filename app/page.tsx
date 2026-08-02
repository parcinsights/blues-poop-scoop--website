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
        image="landingHero"
        rating={ratingSummary}
        assurances={home.hero.assurances}
      />

      <ReviewWall heading="See what our friends are saying about us" reviews={reviews} />

      <WhyUs
        heading={home.whyUs.heading}
        intro={home.whyUs.intro}
        points={home.whyUs.points}
        cta={home.whyUs.cta}
        image="whyUs"
      />

      {/* `tone="canvas"` matches the band above, so the "why us" section reads as running on
          through the ribbon rather than being cut off by it. */}
      <CtaBanner heading={home.ctaBanner.heading} detail={home.ctaBanner.detail} tone="canvas" />

      <HowItWorks heading={home.howItWorks.heading} steps={home.howItWorks.steps} />

      <PricingBand
        heading={home.pricing.heading}
        assurances={home.pricing.assurances}
        promise={home.pricing.promise}
        cta={home.pricing.cta}
      />

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
