import type { Metadata } from "next";

import {
  CtaBand,
  CtaBanner,
  FaqBand,
  FeatureGrid,
  Hero,
  HowItWorks,
  PricingBand,
  ReviewWall,
  ServiceAreaMap,
  TrustBar,
} from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { cities } from "@/content/cities";
import { answeredResidentialFaqs } from "@/content/faq";
import { home } from "@/content/pages/home";
import { pricingPage, residential } from "@/content/pages/standing";
import { allReviewsCta, featuredReviews, ratingSummary } from "@/content/reviews";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * /residential/ — the homeowner's front door, and the twin of /commercial/.
 *
 * It is built like the homepage rather than like a service page, for the same reason /commercial/
 * is: it is read cold, by someone who searched "dog poop removal Philadelphia" and has never seen
 * the homepage. So it carries the full argument in one scroll — the claim, why us, what happens,
 * what it costs, what we promise, do you come to my street, the questions, and who says we are any
 * good.
 *
 * IT WILL LOOK LIKE THE HOMEPAGE, and it should: same bands, same order of argument. What differs
 * is the words at the top and the six reasons under them, which are the client's own residential
 * copy. Where the argument is the site's rather than this page's, THIS PAGE RENDERS THE SITE'S
 * RECORD — the three steps and the coverage sentence from `home`, the plans and the guarantee from
 * `pricingPage`, the questions from content/faq.ts. Nothing on this page is retyped, so nothing on
 * it can drift away from the page a visitor read first.
 *
 * The bands alternate canvas / alt / raised so no two touching sections share a surface. The one
 * seam tone cannot solve is the FAQ against the review wall — both are `raised` by definition — so a
 * `SectionDivider` marks it, the same device /commercial/ and /pricing/ use.
 *
 * Published from day one, unlike /commercial/: this is the service the business performs. There is
 * no `body` gate on the record because there is nothing outstanding to gate on.
 */

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Residential", path: routes.residential() },
];

export const metadata: Metadata = buildMetadata({
  ...residential.seo,
  path: routes.residential(),
});

export default function ResidentialPage() {
  return (
    <>
      {/* No FAQPage node. The five questions below are visible and would qualify, but they are five
          of the eight /faq/ already marks up — the same answers claimed twice on one site is the
          duplicate that structured data is worst at. The band links there instead. */}
      <JsonLd
        graph={standardPageGraph({
          path: routes.residential(),
          name: residential.heading,
          description: residential.seo.description,
          crumbs,
        })}
      />

      {/* Words left, photograph right, BOTH STOPPING AT THE CONTAINER — `contained` rather than the
          homepage's `split`, and the reason is the picture. `residentialHero` is a 2:3 portrait, and
          split hands its image a full half-viewport with a 40rem floor under it: a very tall band,
          before the page has said anything. This caps it at 30rem and rounds all four corners, which
          is what stops the shorter picture reading as a bleed that failed.

          /commercial/ stacks its hero instead, because its claim is one nobody has heard before and
          has to land whole. This page's claim is the one every visitor arrived expecting, so it can
          sit beside the picture.

          The rating rides in the hero rather than in the strip below — see `residential.trust`. */}
      <Hero
        heading={residential.heading}
        subheading={residential.intro}
        image="residentialHero"
        layout="contained"
        crumbs={crumbs}
        rating={ratingSummary}
        assurances={home.hero.assurances}
      />

      <TrustBar items={residential.trust} />

      {/* `canvas` rather than white: the band below is `raised` by definition, and two touching
          white bands need a divider between them. Left-hung at six items — see the record. */}
      <FeatureGrid
        eyebrow={residential.whyUs.eyebrow}
        heading={residential.whyUs.heading}
        features={residential.whyUs.features}
        tone="canvas"
      />

      <HowItWorks heading={home.howItWorks.heading} steps={home.howItWorks.steps} />

      {/* The homepage's own pricing band, plans and all. Someone who landed here from search gets
          the numbers without having to go and find /pricing/. Every price comes from
          content/pricing.ts; this page does not know what a plan costs. */}
      <PricingBand
        heading={home.pricing.heading}
        assurances={home.pricing.assurances}
        promise={home.pricing.promise}
        cta={home.pricing.cta}
      />

      {/* `canvas` matches the pricing band above, so the ribbon sits inside it rather than cutting
          it off — the same call the homepage makes. It catches the visitor at the moment the number
          has just landed. */}
      <CtaBanner
        heading={residential.ctaBanner.heading}
        detail={residential.ctaBanner.detail}
        tone="canvas"
      />

      {/* /pricing/'s guarantee band, verbatim: same heading, same intro, same three promises, and
          white and centred exactly as it is there — three promises with a medallion each are a row
          of equals. Directly after the prices on purpose, because a number is when doubt arrives and
          these are the three claims that cost the business money if they turn out to be false. */}
      <FeatureGrid
        eyebrow={residential.promise.eyebrow}
        heading={pricingPage.guarantee.heading}
        intro={pricingPage.guarantee.intro}
        features={pricingPage.guarantee.points}
        tone="raised"
        align="center"
      />

      {/* Towns rather than the zip list /pricing/ shows: a homeowner reading a landing page scans
          for the name of their neighbourhood, and the chips underneath are the actual answer
          whether or not the static map is switched on. See lib/maps.ts. */}
      <ServiceAreaMap
        heading={home.serviceArea.heading}
        intro={home.serviceArea.intro}
        cities={cities}
        cta={home.serviceArea.cta}
      />

      {/* Five of the eight, and the link out is what keeps this page from being /faq/ with a
          different header. `residentialFaqs` is ordered the way a homeowner's doubt arrives, so the
          first five are the earliest ones — do I need to be home, how often, what about my dog,
          where does it go, what does it cost. */}
      <FaqBand
        heading={residential.faq.heading}
        items={answeredResidentialFaqs.slice(0, 5)}
        cta={residential.faq.cta}
      />

      {/* Both bands are white and nothing marks the seam. This is that mark: a hairline on the
          container line, starting and stopping where the words above and below do. */}
      <SectionDivider tone="raised" />

      {/* The proof goes last, under the questions rather than above them: someone who has read the
          price and had their doubts answered is the reader a testimonial is worth most to. */}
      <ReviewWall
        heading={residential.reviews.heading}
        reviews={featuredReviews}
        viewAllLabel={allReviewsCta.label}
      />

      {/* `canvas`, not the site-default dark navy: on the dark band the navy buttons disappear into
          it, because --color-surface-dark and --color-brand are the same hex. See CtaBand. */}
      <CtaBand heading={residential.cta.heading} detail={residential.cta.detail} tone="canvas" />
    </>
  );
}
