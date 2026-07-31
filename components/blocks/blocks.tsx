import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Cluster, Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Card, Callout } from "@/components/ui/surfaces";
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
    <Section spacing="lg">
      <Container>
        <Stack gap={6}>
          <h1>{heading}</h1>
          {subheading && <p className="text-lead text-ink-muted max-w-prose">{subheading}</p>}
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
          <h2>{heading}</h2>
          <Grid columns={3}>
            {features.map((feature) => (
              <Card key={feature.title}>
                <Stack gap={2}>
                  <h3>{feature.title}</h3>
                  <p className="text-ink-muted">{feature.detail}</p>
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
          <h2>{heading}</h2>
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
                      <span className="text-ink-muted text-small"> {pricing.unit}</span>
                    </td>
                    <td className="py-4">
                      ${tier.biweekly}
                      <span className="text-ink-muted text-small"> {pricing.unit}</span>
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
          <h2>{heading}</h2>
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
          <h2>{heading}</h2>
          <div className="flex flex-col">
            {items.map((item) => (
              <details key={item.question} className="border-b border-line py-4">
                <summary className="cursor-pointer font-display font-semibold text-h5 text-ink">
                  {item.question}
                </summary>
                <p className="pt-3 text-ink-muted">{item.answer}</p>
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
          <h2>{heading}</h2>
          <Grid columns={3}>
            {reviews.map((review) => (
              <Card key={review.quote}>
                <figure className="flex flex-col gap-3 h-full">
                  <blockquote className="grow">{review.quote}</blockquote>
                  <figcaption className="text-small font-semibold text-ink">
                    {review.name}
                    <span className="font-normal text-ink-muted"> — {review.city}</span>
                  </figcaption>
                </figure>
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
          <h2 className="text-ink-inverse">{heading}</h2>
          {detail && <p className="text-ink-inverse max-w-prose">{detail}</p>}
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
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                );
              case "list":
                return (
                  <div key={index}>
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.intro && <p>{block.intro}</p>}
                    <ul>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              case "steps":
                return (
                  <div key={index}>
                    {block.heading && <h2>{block.heading}</h2>}
                    <ol>
                      {block.steps.map((step) => (
                        <li key={step.title}>
                          <strong>{step.title}</strong> — {step.detail}
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              case "faq":
                return (
                  <div key={index}>
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.items.map((item) => (
                      <details key={item.question} className="border-b border-line py-3">
                        <summary className="cursor-pointer font-semibold">{item.question}</summary>
                        <p>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                );
              case "cta":
                return (
                  <Callout key={index}>
                    <Stack gap={3}>
                      <strong>{block.heading}</strong>
                      {block.detail && <p>{block.detail}</p>}
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
