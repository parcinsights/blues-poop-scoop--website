import type { Metadata } from "next";

import { CtaBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
import { addOnServices, coreServices } from "@/content/services";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const seo = {
  title: "Our Services",
  description:
    "Weekly and every-other-week dog waste removal across Philadelphia and the Main Line, plus one-time yard cleanups.",
};

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Services", path: routes.services() },
];

export const metadata: Metadata = buildMetadata({ ...seo, path: routes.services() });

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.services(),
          name: "Our Services",
          description: seo.description,
          type: "CollectionPage",
          crumbs,
        })}
      />
      <PageShell crumbs={crumbs} heading="Our services" intro={seo.description} />

      {/* Two bands, not one grid. The core plans are what someone chooses BETWEEN; the add-ons are
          things they choose AS WELL, and mixing the two in a single grid of identical cards asks
          the visitor to compare a scooping plan against a deodorizer. Separating them makes the
          relationship obvious without a word of explanation. */}
      <Section tone="alt">
        <Container>
          <Stack gap={8}>
            <Heading level={2} align="center-mobile">
              What we do
            </Heading>
            <Grid columns={3}>
              {coreServices.map((service) => (
                <Card key={service.slug}>
                  <Stack gap={3}>
                    {/* Level 3 under the band's h2 — these are subsections of it. Sized down
                        because a grid of cards at full heading size shouts. Exactly the split
                        `Heading`'s separate `level` and `size` exist for. */}
                    <Heading level={3} size="h4">
                      {service.name}
                    </Heading>
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

      <Section>
        <Container>
          <Stack gap={8}>
            <Stack gap={3}>
              <Heading level={2} align="center-mobile">
                Add these to any plan
              </Heading>
              <Text tone="muted" measure>
                Extras you can bolt onto a scooping plan — or book on their own.
              </Text>
            </Stack>
            <Grid columns={3}>
              {addOnServices.map((service) => (
                <Card key={service.slug}>
                  <Stack gap={3}>
                    <Heading level={3} size="h4">
                      {service.name}
                    </Heading>
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

      <CtaBand heading="Ready for a clean yard?" />
    </>
  );
}
