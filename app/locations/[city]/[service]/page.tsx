import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlockRenderer, CtaBand, PriceTable } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Cluster, Container, Section, Stack } from "@/components/ui/layout";
import { cities, cityBySlug } from "@/content/cities";
import { moneyPage } from "@/content/money-pages";
import { cityPageServices, serviceBySlug } from "@/content/services";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { servicePageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ city: string; service: string }> };

/**
 * Only services flagged `hasCityPages` are crossed with cities. Generating every service × every
 * city is how a doorway network appears by accident.
 */
export function generateStaticParams() {
  return cities.flatMap((city) =>
    cityPageServices.map((service) => ({ city: city.slug, service: service.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = cityBySlug.get(citySlug);
  const service = serviceBySlug.get(serviceSlug);
  if (!city || !service) return {};

  const authored = moneyPage(citySlug, serviceSlug);
  return buildMetadata({
    title: authored?.seo.title ?? `${service.name} in ${city.name}, ${city.region}`,
    description: authored?.seo.description ?? service.seo.description,
    path: routes.cityService(citySlug, serviceSlug),
    // The important one. Twenty of these pages exist; until someone writes genuinely local copy
    // for a given pair, it is a near-duplicate of nineteen others and must not be indexed.
    noindex: !isPublishable(authored?.body ?? []),
  });
}

export default async function CityServicePage({ params }: Params) {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = cityBySlug.get(citySlug);
  const service = serviceBySlug.get(serviceSlug);
  if (!city || !service || !service.hasCityPages) notFound();

  const path = routes.cityService(citySlug, serviceSlug);
  const authored = moneyPage(citySlug, serviceSlug);
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home() },
    { name: "Areas We Serve", path: routes.locations() },
    { name: city.name, path: routes.city(citySlug) },
    { name: service.name, path },
  ];

  return (
    <>
      <JsonLd
        graph={servicePageGraph({
          path,
          service,
          crumbs,
          // This page claims ONE city. The city-agnostic service page claims the whole coverage
          // area. Two Service nodes must never assert the same offering in the same place.
          areaNames: [`${city.name}, ${city.region}`],
        })}
      />
      <PageShell
        crumbs={crumbs}
        heading={authored?.heading ?? `${service.heading} in ${city.name}, ${city.region}`}
        intro={service.summary}
      />

      <BlockRenderer blocks={authored?.body ?? []} />
      <PriceTable heading="Pricing" />

      <Section tone="alt">
        <Container>
          <Stack gap={6}>
            <h2>Other options in {city.name}</h2>
            <Cluster gap={3}>
              {cityPageServices
                .filter((other) => other.slug !== service.slug)
                .map((other) => (
                  <Button
                    key={other.slug}
                    href={routes.cityService(city.slug, other.slug)}
                    variant="ghost"
                  >
                    {other.name}
                  </Button>
                ))}
              <Button href={routes.service(service.slug)} variant="ghost">
                About {service.name}
              </Button>
            </Cluster>
          </Stack>
        </Container>
      </Section>

      <CtaBand heading={`Get a quote in ${city.name}`} />
    </>
  );
}
