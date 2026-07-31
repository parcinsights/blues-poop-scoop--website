import type { Metadata } from "next";

import { CtaBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
import { residentialServices } from "@/content/services";
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

      <Section tone="alt">
        <Container>
          <Grid columns={3}>
            {residentialServices.map((service) => (
              <Card key={service.slug}>
                <Stack gap={3}>
                  <h2 className="text-h4">{service.name}</h2>
                  <p className="text-ink-muted">{service.summary}</p>
                  <Button href={routes.service(service.slug)} variant="link">
                    Learn more
                  </Button>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <CtaBand heading="Ready for a clean yard?" />
    </>
  );
}
