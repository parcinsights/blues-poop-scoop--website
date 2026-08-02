import type { Metadata } from "next";

import {
  CtaBand,
  FeatureGrid,
  HowItWorks,
  PhotoBand,
  PricingBand,
  ReviewWall,
  ServiceZips,
} from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { servicedZips } from "@/content/cities";
import { home } from "@/content/pages/home";
import { pricingPage } from "@/content/pages/standing";
import { reviews } from "@/content/reviews";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Pricing", path: routes.pricing() },
];

export const metadata: Metadata = buildMetadata({ ...pricingPage.seo, path: routes.pricing() });

/**
 * Prices are published rather than gated behind a quote form. What this costs is one of the
 * highest-volume searches in the trade, and answering it plainly is both the best conversion move
 * and the clearest way to look more legitimate than the franchises, which hide it.
 *
 * THE BANDS BELOW THE PRICES ARE THE HOMEPAGE'S. `PricingBand`, `ReviewWall` and `HowItWorks` are
 * the same components running the same content — someone who lands here from a "how much does
 * poop scooping cost" search gets the landing page's whole argument without having to go and find
 * the landing page. Nothing is retyped: the plans come from content/pricing.ts, the steps from
 * `home.howItWorks`, the quotes from content/reviews.ts.
 *
 * It used to close on `PriceTable` plus a pricing FAQ. The table is gone because this page now
 * shows the same three tiers as cards, and printing them twice on one page is not a second look
 * at the prices, it is a reason to doubt which set is real. The table still runs on the location
 * pages, which have no cards.
 *
 * The order is a buyer's own order: what it costs → why the money is safe → do you come to my
 * street → has anyone else done this → what happens when I click.
 *
 * NO `PageShell`. This is the one inner page that opens on a photograph rather than on an h1: the
 * van, the two owners and the phone number on the door are directly under the header, and the
 * first words are the prices. A title and a paragraph above the picture would be a page introducing
 * itself before showing anything, and what this page has to say is a number.
 *
 * The h1 is therefore the pricing band's own title, and the breadcrumb trail rides in with it —
 * both are `PricingBand` props for exactly this. It is the same string the homepage band uses, so
 * the two cannot end up naming the same three plans differently, and it is what the structured
 * data calls the page.
 */
export default function PricingPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.pricing(),
          name: home.pricing.heading,
          description: pricingPage.seo.description,
          crumbs,
        })}
      />

      {/* The first thing on the page, directly under the header. The LCP element, hence
          `priority`. See `PhotoBand` for why it carries no words. */}
      <PhotoBand image="pricingBanner" priority />

      {/* `sm`: the photograph directly above is the air over this title, so the band's own full
          top padding would read as a gap rather than as breathing room. */}
      <PricingBand
        level={1}
        crumbs={crumbs}
        spacing="sm"
        heading={home.pricing.heading}
        assurances={home.pricing.assurances}
        promise={home.pricing.promise}
        cta={home.pricing.cta}
      />

      {/* White and centred, unlike /about/'s run of the same block: three promises with a
          medallion each are a row of equals, and the white band is what separates the guarantee
          from the cream prices above and the cream zip list below. */}
      <FeatureGrid
        tone="raised"
        align="center"
        heading={pricingPage.guarantee.heading}
        intro={pricingPage.guarantee.intro}
        features={pricingPage.guarantee.points}
      />

      <ServiceZips
        heading={pricingPage.serviceArea.heading}
        intro={pricingPage.serviceArea.intro}
        zips={servicedZips}
        note={pricingPage.serviceArea.note}
      />

      <ReviewWall heading={pricingPage.reviews.heading} reviews={reviews} />

      {/* Both bands are white, so nothing marks the seam between them. This is that mark — a
          hairline on the container line rather than a change of colour. See `SectionDivider`. */}
      <SectionDivider tone="raised" />

      <HowItWorks heading={home.howItWorks.heading} steps={home.howItWorks.steps} />

      {/* `canvas`, not the default navy: on the dark band the navy buttons disappear into it,
          because --color-surface-dark and --color-brand are the same hex. See CtaBand. */}
      <CtaBand heading="Get an exact quote for your yard" tone="canvas" />
    </>
  );
}
