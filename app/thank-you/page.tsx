import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

import { NextSteps } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { Button } from "@/components/ui/Button";
import { Cluster, Container, Section, Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
import { phoneCtaLabel } from "@/content/nav";
import { thankYou } from "@/content/pages/standing";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

/**
 * /thank-you/ — the one landing spot for every form on the site.
 *
 * NO BREADCRUMBS AND NO STRUCTURED DATA, unlike every other page here. Both describe where a page
 * sits in a site people browse, and this one is not browsed: there is exactly one way in, and it
 * is pressing a submit button. A trail back up to Home on a page nobody navigated down to is
 * furniture describing a journey that never happened.
 *
 * `noindex` for the reason spelled out on `thankYou` in content/pages/standing.ts, and it is why
 * this route is missing from `allRoutes()` — see the note there.
 */
export const metadata: Metadata = buildMetadata({
  ...thankYou.seo,
  path: routes.thankYou(),
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <>
      <PageShell crumbs={[]} heading={thankYou.heading} intro={thankYou.intro} />

      <Section tone="raised" spacing="md">
        <Container>
          {/* The steps take two thirds and the phone panel one, the same split /contact/ uses —
              this page is that page's second half, and a visitor who has just come from it should
              recognise the shape rather than land somewhere new. */}
          <div className="grid items-start gap-10 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2">
              <NextSteps heading={thankYou.stepsHeading} steps={thankYou.steps} />
            </div>

            <div>
              {/* Same cream panel as /contact/'s "prefer to talk?", and it earns its place here for
                  a different reason: this is the page where waiting starts, so the way to stop
                  waiting belongs on it. */}
              <Card tone="canvas">
                <Stack gap={4}>
                  <Stack gap={2}>
                    <Heading level={2} size="h4">
                      {thankYou.aside.heading}
                    </Heading>
                    <Text tone="muted">{thankYou.aside.detail}</Text>
                  </Stack>
                  <Cluster gap={3}>
                    {/* The shared phone label, with the number appended in the accessible name —
                        WCAG 2.5.3, as on every other phone button. See content/nav.ts. */}
                    <Button
                      href={`tel:${site.phone.e164}`}
                      variant="secondary"
                      icon={Phone}
                      ariaLabel={`${phoneCtaLabel} — ${site.phone.display}`}
                    >
                      {phoneCtaLabel}
                    </Button>
                    <Button href={`mailto:${site.email}`} variant="ghost" icon={Mail}>
                      Email us
                    </Button>
                  </Cluster>
                </Stack>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
