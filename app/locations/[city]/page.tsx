import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlockRenderer, CtaBand, PriceTable } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Cluster, Container, Section, Stack } from "@/components/ui/layout";
import { Heading } from "@/components/ui/typography";
import { cities, cityBySlug } from "@/content/cities";
import { cityPageServices } from "@/content/services";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city: slug } = await params;
  const city = cityBySlug.get(slug);
  if (!city) return {};
  return buildMetadata({
    ...city.seo,
    path: routes.city(slug),
    noindex: !isPublishable(city.body),
  });
}

export default async function CityPage({ params }: Params) {
  const { city: slug } = await params;
  const city = cityBySlug.get(slug);
  if (!city) notFound();

  const path = routes.city(slug);
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home() },
    { name: "Areas We Serve", path: routes.locations() },
    { name: city.name, path },
  ];

  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path,
          name: `${city.name}, ${city.region}`,
          description: city.seo.description,
          crumbs,
        })}
      />
      <PageShell
        crumbs={crumbs}
        heading={`Dog poop removal in ${city.name}, ${city.region}`}
        intro={
          city.neighborhoods
            ? `Serving ${city.neighborhoods.join(", ")}.`
            : `Serving ${city.name} and the surrounding ${city.county} area.`
        }
      />

      <BlockRenderer blocks={city.body} />

      <Section tone="alt">
        <Container>
          <Stack gap={6}>
            <Heading level={2}>Plans available in {city.name}</Heading>
            <Cluster gap={3}>
              {cityPageServices.map((service) => (
                <Button
                  key={service.slug}
                  href={routes.cityService(city.slug, service.slug)}
                  variant="ghost"
                >
                  {service.name}
                </Button>
              ))}
            </Cluster>
          </Stack>
        </Container>
      </Section>

      <PriceTable heading="Pricing" />
      <CtaBand heading={`Get a quote for your ${city.name} yard`} />
    </>
  );
}
