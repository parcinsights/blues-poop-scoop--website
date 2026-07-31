import type { Metadata } from "next";

import { BlockRenderer } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container, Section, Stack } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { Definitions } from "@/components/ui/surfaces";
import { areaServedNames } from "@/content/cities";
import { contact } from "@/content/pages/standing";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Contact", path: routes.contact() },
];

export const metadata: Metadata = buildMetadata({ ...contact.seo, path: routes.contact() });

/**
 * The canonical NAP, rendered once. No street address: this is a service-area business, and the
 * site must stay consistent with the Google Business Profile's hidden-address setting.
 */
export default function ContactPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.contact(),
          name: contact.heading,
          description: contact.seo.description,
          type: "ContactPage",
          crumbs,
        })}
      />
      <PageShell crumbs={crumbs} heading={contact.heading} intro={contact.intro} />

      <Section tone="alt">
        <Container>
          <Stack gap={8}>
            <Definitions
              items={[
                {
                  term: "Phone",
                  detail: <Link href={`tel:${site.phone.e164}`}>{site.phone.display}</Link>,
                },
                { term: "Email", detail: <Link href={`mailto:${site.email}`}>{site.email}</Link> },
                { term: "Serving", detail: areaServedNames.join(" · ") },
                {
                  term: "Hours",
                  detail: site.hours
                    .map((slot) =>
                      slot.closed
                        ? `${slot.days.join(", ")}: Closed`
                        : `${slot.days.join(", ")}: ${slot.opens}–${slot.closes}`,
                    )
                    .join(" · "),
                },
              ]}
            />
          </Stack>
        </Container>
      </Section>

      <BlockRenderer blocks={contact.body} />
    </>
  );
}
