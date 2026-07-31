import type { Metadata } from "next";

import { BlockRenderer, CtaBand, FeatureGrid, ReviewWall } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { about } from "@/content/pages/standing";
import { home } from "@/content/pages/home";
import { reviews } from "@/content/reviews";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "About", path: routes.about() },
];

export const metadata: Metadata = buildMetadata({ ...about.seo, path: routes.about() });

export default function AboutPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.about(),
          name: about.heading,
          description: about.seo.description,
          type: "AboutPage",
          crumbs,
        })}
      />
      <PageShell crumbs={crumbs} heading={about.heading} intro={about.intro} />
      <BlockRenderer blocks={about.body} />
      <FeatureGrid heading="How we work" features={home.valueProps} />
      {/* Renders nothing until real quotes exist — never a fabricated testimonial. */}
      <ReviewWall heading="What customers say" reviews={reviews} />
      <CtaBand heading="Let's get your yard sorted" />
    </>
  );
}
