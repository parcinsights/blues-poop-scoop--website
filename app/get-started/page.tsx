import type { Metadata } from "next";

import { PageShell } from "@/components/blocks/PageShell";
import { QuickLeadForm } from "@/components/forms/QuickLeadForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { Card } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
import { getStarted } from "@/content/pages/standing";
import { priceTiers, pricing } from "@/content/pricing";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Get a quote", path: routes.getStarted() },
];

export const metadata: Metadata = buildMetadata({ ...getStarted.seo, path: routes.getStarted() });

/**
 * The conversion page. The price grid sits beside the form on purpose — someone filling this in
 * wants to know what they are committing to, and making them navigate away to find out is where
 * quote forms lose people.
 *
 * PHASE 5: the full Sweep&Go onboarding flow (address, frequency, initial cleanup, live zip check
 * against their API) replaces or sits alongside this short form. This one posts to GHL only.
 */
export default function GetStartedPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.getStarted(),
          name: getStarted.heading,
          description: getStarted.seo.description,
          type: "ContactPage",
          crumbs,
        })}
      />
      <PageShell crumbs={crumbs} heading={getStarted.heading} intro={getStarted.intro} />

      <Section spacing="md">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card>
              <QuickLeadForm />
            </Card>

            <Stack gap={6}>
              <Heading level={2}>What it costs</Heading>
              <Grid columns={2} gap={4}>
                {priceTiers.map((tier) => (
                  <Card key={tier.id} tone={tier.featured ? "featured" : "default"}>
                    <Stack gap={2}>
                      <Heading level={3} size="h5">
                        {tier.dogs}
                      </Heading>
                      <Text size="small" tone="muted">
                        Weekly — ${tier.weekly} {pricing.unit}
                      </Text>
                      <Text size="small" tone="muted">
                        Every other week — ${tier.biweekly} {pricing.unit}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Grid>
              <Text tone="muted">
                Prefer to talk? Call <Link href={`tel:${site.phone.e164}`}>{site.phone.display}</Link>.
              </Text>
            </Stack>
          </div>
        </Container>
      </Section>
    </>
  );
}
