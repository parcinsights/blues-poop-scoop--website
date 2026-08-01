import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BlockRenderer,
  CtaBand,
  FaqBand,
  Hero,
  HowItWorks,
  PricingBand,
  ServiceAreaList,
  ServiceIncludes,
  WhyUs,
} from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { cities } from "@/content/cities";
import { servicePage } from "@/content/pages/service-page";
import { serviceBySlug, services } from "@/content/services";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { servicePageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * THE service page. Singular on purpose: every service — the scooping plan, each add-on,
 * commercial — renders through this one file, in the same band order, with the same styling. Only
 * the words and the photographs change, and both of those come from `content/services.ts`.
 *
 * So: never fork this template for one service. If a band has to vary, it varies as optional DATA
 * on the `Service` type — an absent field drops its band — not as a second layout. A service page
 * that looks different from its siblings is a bug.
 *
 * The band order, and why:
 *
 *   Hero            what this is, with the trail and the two buttons.
 *   What's included the only genuinely per-service band, so it goes first while attention is high.
 *   Authored body   long-form copy when there is any. Usually empty — see the publish gate below.
 *   Why us          the guarantee and the safety policy. Shared, from content/pages/service-page.ts.
 *   How it works    the three steps. Shared.
 *   Prices          the real grid. Shared — a frequency is a price decision, not a page.
 *   Coverage        "do you come to my street", asked after the price rather than before it.
 *   FAQ             the service's own questions, falling back to the site-wide four.
 *   CTA             the closing band.
 *
 * The homepage runs the same rhythm (hero → argument → steps → prices → questions → CTA), which is
 * the point: someone who lands here from a search and then clicks through to the homepage should
 * not feel they have changed sites.
 *
 * The services INDEX at /services/ is a different design and is not governed by this note.
 */

type Params = { params: Promise<{ service: string }> };

/** Every service is a real route; publication is decided by content, not by existence. */
export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

function crumbsFor(name: string, path: string): Crumb[] {
  return [
    { name: "Home", path: routes.home() },
    { name: "Services", path: routes.services() },
    { name, path },
  ];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { service: slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) return {};
  return buildMetadata({
    ...service.seo,
    path: routes.service(slug),
    // No authored body yet — render it for review, but keep it out of the index.
    noindex: !isPublishable(service.body),
  });
}

export default async function ServicePage({ params }: Params) {
  const { service: slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) notFound();

  const path = routes.service(slug);
  const crumbs = crumbsFor(service.name, path);

  return (
    <>
      <JsonLd graph={servicePageGraph({ path, service, crumbs })} />

      {/* This hero replaces `PageShell`, which is why it carries the crumbs. A service page is
          where a search lands, so it gets the same treatment as the homepage rather than the
          plain heading strip the standing pages use. */}
      <Hero
        heading={service.heading}
        subheading={service.summary}
        image={service.image}
        crumbs={crumbs}
        assurances={service.assurances}
      />

      {service.includes && <ServiceIncludes {...service.includes} />}

      <BlockRenderer blocks={service.body} />

      {/* Shared from here down. The photograph is the owners-and-dog shot on every service page on
          purpose: these four claims are about the business, not about the service, and swapping in
          a picture of the work would make the band look like it is arguing something it isn't. */}
      <WhyUs
        heading={servicePage.whyUs.heading}
        intro={servicePage.whyUs.intro}
        points={servicePage.whyUs.points}
        cta={servicePage.whyUs.cta}
        image="whyUs"
      />

      <HowItWorks heading={servicePage.howItWorks.heading} steps={servicePage.howItWorks.steps} />

      <PricingBand
        heading={servicePage.pricing.heading}
        assurances={servicePage.pricing.assurances}
        promise={servicePage.pricing.promise}
        cta={servicePage.pricing.cta}
      />

      <ServiceAreaList heading={servicePage.area.heading} cities={cities} />

      <FaqBand
        heading={servicePage.faq.heading}
        items={service.faq ?? servicePage.faq.items}
        cta={servicePage.faq.cta}
      />

      <CtaBand heading={servicePage.cta.heading} detail={servicePage.cta.detail} />
    </>
  );
}
