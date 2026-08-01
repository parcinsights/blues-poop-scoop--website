import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand, ServiceDetails, ServiceHero } from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { servicePage } from "@/content/pages/service-page";
import { serviceBySlug, services } from "@/content/services";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { servicePageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * THE service page. Singular on purpose: every service — the scooping plan, each add-on,
 * commercial — renders through this one file, in the same three bands, with the same styling. Only
 * the words and the photograph change, and both come from `content/services.ts`.
 *
 * So: never fork this template for one service. If something has to vary, it varies as optional
 * DATA on the `Service` type — an absent field drops its chips, its photo or its tab content — not
 * as a second layout. A service page that looks different from its siblings is a bug.
 *
 * Three bands, and that is the whole page:
 *
 *   Hero      chips, the h1, the summary, price and quote buttons, and the service's photograph.
 *   Details   About / Includes / Benefits behind chip toggles, with the quote form beside them.
 *   CTA       the closing band, on the light surface.
 *
 * The first two are BOTH white and are separated by a rule on the container line rather than by a
 * change of tone — see `SectionDivider`. The page therefore runs one colour from the header down to
 * the closing band, which is what lets the photograph and the chips carry it instead.
 *
 * IT USED TO BE NINE. Under the old template the hero was followed by what's included, the authored
 * body, the guarantee band, the three steps, the price grid, the coverage list and the FAQ — of
 * which everything from the guarantee down was identical on all four services. That is most of the
 * homepage, re-served to someone who had already clicked past it to ask about one specific job.
 * The bands still exist and still run on the homepage; this page stopped repeating them.
 *
 * The three questions that survived — what is it, what happens, what do I get — are now the three
 * tabs, so the copy that genuinely differs is the first thing under the h1 and the page ends one
 * screen later instead of six.
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
    // No authored body yet — render it for review, but keep it out of the index. That body is the
    // About tab, so the gate and the page's first panel are now the same fact.
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
      {/* No `faqs` argument: the FAQ band is gone from this page, and FAQPage markup for questions
          a visitor cannot see is what Google's structured-data guidelines call out. The service's
          own questions are still on the record — see `Service.faq`. */}
      <JsonLd graph={servicePageGraph({ path, service, crumbs })} />

      <ServiceHero
        heading={service.heading}
        summary={service.summary}
        tags={service.tags}
        image={service.image}
        crumbs={crumbs}
        pricingLabel={servicePage.hero.pricingCta}
      />

      {/* Both bands are white, so nothing marks the seam between them. This is that mark: a
          hairline on the container line, so it starts and stops where the h1 above and the chips
          below do. A full-bleed rule would cut the page in two instead. */}
      <SectionDivider tone="raised" />

      <ServiceDetails
        labels={servicePage.tabs}
        body={service.body}
        includes={service.includes}
        benefits={service.benefits}
        pending={servicePage.pending}
        form={servicePage.form}
      />

      {/* `canvas`, not the site-default dark navy: on the dark band the navy buttons disappear into
          it, because --color-surface-dark and --color-brand are the same hex. See CtaBand. */}
      <CtaBand heading={servicePage.cta.heading} detail={servicePage.cta.detail} tone="canvas" />
    </>
  );
}
