import type { Metadata } from "next";

import { Hero, ReviewWall, WhyUs } from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
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

      {/* REBUILD IN PROGRESS — the rest of the homepage is being redesigned one band at a time.
          The blocks that used to sit here (value props, services grid, pricing, service area, CTA)
          still exist and still work; they come back as each is redrawn. */}
    </>
  );
}
