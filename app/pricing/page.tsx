import type { Metadata } from "next";

import { BlockRenderer, CtaBand, FaqAccordion, PriceTable } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { answeredFaqs } from "@/content/faq";
import { pricingPage } from "@/content/pages/standing";
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
 */
export default function PricingPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.pricing(),
          name: pricingPage.heading,
          description: pricingPage.seo.description,
          crumbs,
        })}
      />
      <PageShell crumbs={crumbs} heading={pricingPage.heading} intro={pricingPage.intro} />
      <PriceTable heading="Monthly plans" />
      <BlockRenderer blocks={pricingPage.body} />
      <FaqAccordion heading="Common questions about pricing" items={answeredFaqs.slice(0, 3)} />
      <CtaBand heading="Get an exact quote for your yard" />
    </>
  );
}
