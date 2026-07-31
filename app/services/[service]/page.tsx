import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlockRenderer, CtaBand, PriceTable, ServiceAreaList } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { cities } from "@/content/cities";
import { serviceBySlug, services } from "@/content/services";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { servicePageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

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
      <PageShell crumbs={crumbs} heading={service.heading} intro={service.summary} />
      <BlockRenderer blocks={service.body} />
      <PriceTable heading="What it costs" />
      <ServiceAreaList heading="Where we offer it" cities={cities} />
      <CtaBand heading="Ready to get started?" />
    </>
  );
}
