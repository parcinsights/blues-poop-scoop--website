import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Cluster, Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
import { cities } from "@/content/cities";
import { primaryCta } from "@/content/nav";
import { home } from "@/content/pages/home";
import { residentialServices } from "@/content/services";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { homeGraph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  ...home.seo,
  path: routes.home(),
});

/**
 * The homepage. Note what it does NOT do: no color, no font size, no URL string, and no English
 * sentence is written here. It assembles primitives around `content/pages/home.ts`.
 *
 * It also carries no breadcrumb — it is the root of the trail, and a one-item trail is noise.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd graph={homeGraph(home.seo.description)} />

      <Section spacing="lg">
        <Container>
          <Stack gap={6}>
            <h1>{home.hero.heading}</h1>
            <p className="text-lead text-ink-muted max-w-prose">{home.hero.subheading}</p>
            <Cluster gap={4}>
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
              </Button>
              <Button href={`tel:${site.phone.e164}`} variant="ghost" size="lg">
                Call {site.phone.display}
              </Button>
            </Cluster>
          </Stack>
        </Container>
      </Section>

      <Section tone="alt">
        <Container>
          <Stack gap={8}>
            <h2>Why homeowners here use us</h2>
            <Grid columns={3}>
              {home.valueProps.map((prop) => (
                <Card key={prop.title}>
                  <Stack gap={2}>
                    <h3>{prop.title}</h3>
                    <p className="text-ink-muted">{prop.detail}</p>
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
            <h2>What we do</h2>
            <Grid columns={3}>
              {residentialServices.map((service) => (
                <Card key={service.slug}>
                  <Stack gap={3}>
                    <h3>{service.name}</h3>
                    <p className="text-ink-muted">{service.summary}</p>
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

      {/* Links down to the coverage area — city hubs only, never every city × service leaf. */}
      <Section tone="alt">
        <Container>
          <Stack gap={6}>
            <h2>Where we scoop</h2>
            <Cluster gap={3}>
              {cities.map((city) => (
                <Button key={city.slug} href={routes.city(city.slug)} variant="ghost" size="sm">
                  {city.name}
                </Button>
              ))}
            </Cluster>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
