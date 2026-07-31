import type { Metadata } from "next";

import { CtaBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
import { cities } from "@/content/cities";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const seo = {
  title: "Areas We Serve",
  description:
    "Pet waste removal in Chestnut Hill, Mt. Airy, Roxborough, East Falls, Ardmore, Bryn Mawr, Haverford, Narberth, Gladwyne and Glenside.",
};

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Areas We Serve", path: routes.locations() },
];

export const metadata: Metadata = buildMetadata({ ...seo, path: routes.locations() });

export default function LocationsIndexPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.locations(),
          name: "Areas We Serve",
          description: seo.description,
          type: "CollectionPage",
          crumbs,
        })}
      />
      <PageShell
        crumbs={crumbs}
        heading="Areas we serve"
        intro="We cover Northwest Philadelphia and the Main Line. If you're nearby but not listed, ask — we'll tell you honestly whether we can reach you."
      />

      <Section tone="alt">
        <Container>
          <Grid columns={3}>
            {cities.map((city) => (
              <Card key={city.slug}>
                <Stack gap={3}>
                  <Heading level={2} size="h4">
                    {city.name}, {city.region}
                  </Heading>
                  <Text size="small" tone="muted">
                    {city.neighborhoods
                      ? city.neighborhoods.join(" · ")
                      : `${city.county} · ${city.zips.join(", ")}`}
                  </Text>
                  <Button href={routes.city(city.slug)} variant="link">
                    {city.name} service
                  </Button>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <CtaBand heading="Not sure if we reach you?" detail="Send us your zip code and we'll confirm." />
    </>
  );
}
