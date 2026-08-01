import { Button } from "@/components/ui/Button";
import { Cluster, Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { Card, Callout } from "@/components/ui/surfaces";
import { Heading, List, Quote, Text } from "@/components/ui/typography";
import { priceTiers, pricing } from "@/content/pricing";
import { primaryCta } from "@/content/nav";
import { site } from "@/content/site";
import type { ContentBlock, FaqItem } from "@/content/types";
import { routes } from "@/lib/routes";

/**
 * The composed sections. Each takes content and renders it — none of them contains an English
 * sentence about the business, and none picks a colour or a type size. They arrange primitives.
 */

// ── Hero ─────────────────────────────────────────────────────────────────────

export function Hero({
  heading,
  subheading,
  showPhone = true,
}: {
  heading: string;
  subheading?: string;
  showPhone?: boolean;
}) {
  return (
    <Section tone="canvas" spacing="lg">
      <Container>
        <Stack gap={6}>
          <Heading level={1}>{heading}</Heading>
          {subheading && (
            <Text size="lead" tone="muted" measure>
              {subheading}
            </Text>
          )}
          <Cluster gap={4}>
            <Button href={primaryCta.href} size="lg">
              {primaryCta.label}
            </Button>
            {showPhone && (
              <Button href={`tel:${site.phone.e164}`} variant="ghost" size="lg">
                Call {site.phone.display}
              </Button>
            )}
          </Cluster>
        </Stack>
      </Container>
    </Section>
  );
}

// ── Feature grid ─────────────────────────────────────────────────────────────

export function FeatureGrid({
  heading,
  features,
}: {
  heading: string;
  features: readonly { title: string; detail: string }[];
}) {
  return (
    <Section tone="alt">
      <Container>
        <Stack gap={8}>
          <Heading level={2}>{heading}</Heading>
          <Grid columns={3}>
            {features.map((feature) => (
              <Card key={feature.title}>
                <Stack gap={2}>
                  <Heading level={3}>{feature.title}</Heading>
                  <Text tone="muted">{feature.detail}</Text>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

// ── Price table ──────────────────────────────────────────────────────────────

/**
 * The real price grid. Rendered as a proper `<table>` with scoped headers, because it is tabular
 * data — a grid of divs would be unreadable to anyone using a screen reader, and this is the page
 * a buyer is most likely to be scrutinising.
 */
export function PriceTable({ heading }: { heading: string }) {
  return (
    <Section>
      <Container>
        <Stack gap={8}>
          <Heading level={2}>{heading}</Heading>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-body">
              <caption className="sr-only">
                Monthly pricing by number of dogs and visit frequency
              </caption>
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Dogs
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Weekly
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    Every other week
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceTiers.map((tier) => (
                  <tr key={tier.id} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 font-semibold text-ink">
                      {tier.dogs}
                    </th>
                    <td className="py-4 pr-4">
                      ${tier.weekly}
                      <Text as="span" size="small" tone="muted">
                        {` ${pricing.unit}`}
                      </Text>
                    </td>
                    <td className="py-4">
                      ${tier.biweekly}
                      <Text as="span" size="small" tone="muted">
                        {` ${pricing.unit}`}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Stack>
      </Container>
    </Section>
  );
}

// ── Service area list ────────────────────────────────────────────────────────

export function ServiceAreaList({
  heading,
  cities,
}: {
  heading: string;
  cities: readonly { slug: string; name: string }[];
}) {
  return (
    <Section tone="alt">
      <Container>
        <Stack gap={6}>
          <Heading level={2}>{heading}</Heading>
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
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────

/**
 * `<details>` rather than React state: the answers are in the DOM and readable before any
 * JavaScript runs, which is what makes them indexable and what makes the page work on a slow
 * connection. It is also keyboard-operable for free.
 */
export function FaqAccordion({ heading, items }: { heading: string; items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section>
      <Container width="prose">
        <Stack gap={6}>
          <Heading level={2}>{heading}</Heading>
          <div className="flex flex-col">
            {items.map((item) => (
              <details key={item.question} className="border-b border-line py-4">
                <summary className="cursor-pointer font-display font-semibold text-h5 text-ink">
                  {item.question}
                </summary>
                <div className="pt-3">
                  <Text tone="muted">{item.answer}</Text>
                </div>
              </details>
            ))}
          </div>
        </Stack>
      </Container>
    </Section>
  );
}

// ── Reviews ──────────────────────────────────────────────────────────────────

/**
 * Real quotes, rendered as visible content and deliberately NOT marked up as review structured
 * data — self-serving review markup on your own domain is against Google's guidelines.
 */
export function ReviewWall({
  heading,
  reviews,
}: {
  heading: string;
  reviews: readonly { quote: string; name: string; city: string }[];
}) {
  if (reviews.length === 0) return null;
  return (
    <Section tone="alt">
      <Container>
        <Stack gap={8}>
          <Heading level={2}>{heading}</Heading>
          <Grid columns={3}>
            {reviews.map((review) => (
              <Card key={review.quote}>
                <Quote attribution={review.name} detail={review.city}>
                  {review.quote}
                </Quote>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

// ── CTA band ─────────────────────────────────────────────────────────────────

export function CtaBand({ heading, detail }: { heading: string; detail?: string }) {
  return (
    <Section tone="dark" spacing="md">
      <Container>
        <Stack gap={5} align="center">
          <Heading level={2} tone="inverse">
            {heading}
          </Heading>
          {detail && (
            <Text tone="inverse" measure>
              {detail}
            </Text>
          )}
          <Cluster gap={4} justify="center">
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
  );
}

// ── Authored block renderer ──────────────────────────────────────────────────

/** Renders a page's authored body. One branch per block kind; no HTML is ever authored. */
export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (blocks.length === 0) return null;

  return (
    <Section>
      <Container width="prose">
        <div className="prose">
          {blocks.map((block, index) => {
            switch (block.kind) {
              case "prose":
                return (
                  <div key={index}>
                    {block.heading && <Heading level={2}>{block.heading}</Heading>}
                    {block.paragraphs.map((paragraph) => (
                      <Text key={paragraph}>{paragraph}</Text>
                    ))}
                  </div>
                );
              case "list":
                return (
                  <div key={index}>
                    {block.heading && <Heading level={2}>{block.heading}</Heading>}
                    {block.intro && <Text>{block.intro}</Text>}
                    <List items={block.items} />
                  </div>
                );
              case "steps":
                return (
                  <div key={index}>
                    {block.heading && <Heading level={2}>{block.heading}</Heading>}
                    <List
                      variant="number"
                      items={block.steps.map((step) => (
                        <span key={step.title}>
                          <strong>{step.title}</strong>
                          {` — ${step.detail}`}
                        </span>
                      ))}
                    />
                  </div>
                );
              case "faq":
                return (
                  <div key={index}>
                    {block.heading && <Heading level={2}>{block.heading}</Heading>}
                    {block.items.map((item) => (
                      <details key={item.question} className="border-b border-line py-3">
                        <summary className="cursor-pointer font-semibold">{item.question}</summary>
                        <Text>{item.answer}</Text>
                      </details>
                    ))}
                  </div>
                );
              case "cta":
                return (
                  <Callout key={index}>
                    <Stack gap={3}>
                      <strong>{block.heading}</strong>
                      {block.detail && <Text>{block.detail}</Text>}
                      <Link href={block.href}>{block.buttonLabel}</Link>
                    </Stack>
                  </Callout>
                );
            }
          })}
        </div>
      </Container>
    </Section>
  );
}
