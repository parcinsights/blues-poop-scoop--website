import type { Metadata } from "next";

import {
  CtaBand,
  FeatureGrid,
  Hero,
  PriceTable,
  ReviewWall,
  ServiceAreaList,
} from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
import { cities } from "@/content/cities";
import { home } from "@/content/pages/home";
import { ratingSummary, reviews } from "@/content/reviews";
import { residentialServices } from "@/content/services";
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

      <FeatureGrid heading="More than just a poop scoop service" features={home.valueProps} />

      <Section>
        <Container>
          <Stack gap={8}>
            <Heading level={2}>What we do</Heading>
            <Grid columns={3}>
              {residentialServices.map((service) => (
                <Card key={service.slug}>
                  <Stack gap={3}>
                    <Heading level={3}>{service.name}</Heading>
                    <Text tone="muted">{service.summary}</Text>
                    <Button href={routes.service(service.slug)} variant="link">
                      Learn more
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>

      <PriceTable heading="Straightforward pricing" />

      {/* Renders nothing until real quotes exist. */}
      <ReviewWall heading="What customers say" reviews={reviews} />

      {/* Links down to the coverage area — city hubs only, never every city × service leaf. */}
      <ServiceAreaList heading="Where we scoop" cities={cities} />

      <CtaBand heading="Ready for a clean yard?" />
    </>
  );
}
