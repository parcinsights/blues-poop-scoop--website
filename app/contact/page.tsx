import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

import { BlockRenderer, FormCard, NextSteps } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Cluster, Container, Section, Stack } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { Card, Definitions } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
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
 * /contact/ — the form first, the phone number second.
 *
 * The form is the page. A contact page whose top half is an address block and whose bottom half is
 * a form asks the visitor to scroll past the answer to reach the question; this one opens on the
 * six fields that get them a price, and the ways to reach a human sit beside and below them for
 * the people who would rather do that.
 *
 * The NAP is still rendered ONCE, in the band under the form. No street address: this is a
 * service-area business, and the site must stay consistent with the Google Business Profile's
 * hidden-address setting.
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

      <Section tone="raised" spacing="md">
        <Container>
          {/* TWO THIRDS TO THE FORM. On /locations/ this card is the sidebar to a list of towns
              and takes two fifths; here it is the reason the page exists, so the ratio flips and
              the steps beside it become the sidebar. The width is not just emphasis — it is what
              lets the fields run two to a row (see ContactForm), which is what makes six questions
              read as three lines instead of a column you have to scroll.

              `items-start` so the card keeps its own height instead of stretching to the column
              next to it. */}
          <div className="grid items-start gap-10 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2">
              {/* The same card the service pages and /locations/ carry, without the mark — see
                  `FormCard`. The fields inside it are the only difference.

                  `sky` is the exception this page gets and no other: on every other page the form
                  is a panel beside an argument and the quiet cream is right, but here it is the
                  whole point of the visit, and a cream card on a white band was something a visitor
                  had to go looking for. The sky wash and rim make it the first object found. */}
              <FormCard
                heading={contact.form.heading}
                intro={contact.form.intro}
                mark={false}
                tone="sky"
              >
                <ContactForm />
              </FormCard>
            </div>

            <div>
              <Stack gap={10}>
                <NextSteps
                  heading={contact.aside.stepsHeading}
                  steps={contact.aside.steps}
                />

                {/* The alternative to the form, given its own cream panel rather than left as a
                    line of text under the steps: on a page whose main object is a form, "you can
                    just phone us" has to look like an offer or nobody takes it. Cream, so it reads
                    as kin to the form card across the gutter rather than as a fourth step. */}
                <Card tone="canvas">
                  <Stack gap={4}>
                    <Stack gap={2}>
                      <Heading level={2} size="h4">
                        {contact.aside.heading}
                      </Heading>
                      <Text tone="muted">{contact.aside.detail}</Text>
                    </Stack>
                    {/* The number IS the button. `ariaLabel` because the visible words are the
                        digits and "call" is the part a screen reader has to be told. It comes from
                        `site`, like every other printing of it — see the NAP note above. */}
                    <Cluster gap={3}>
                      <Button
                        href={`tel:${site.phone.e164}`}
                        variant="secondary"
                        icon={Phone}
                        ariaLabel={`Call ${site.phone.display}`}
                      >
                        {site.phone.display}
                      </Button>
                      <Button href={`mailto:${site.email}`} variant="ghost" icon={Mail}>
                        Email us
                      </Button>
                    </Cluster>
                  </Stack>
                </Card>
              </Stack>
            </div>
          </div>
        </Container>
      </Section>

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
