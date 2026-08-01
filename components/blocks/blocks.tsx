import { BadgeCheck, Dog, MapPin, MessageCircleHeart, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";
import { Cluster, Container, Grid, Section, Split, Stack } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { Rating } from "@/components/ui/Rating";
import { Card, Callout } from "@/components/ui/surfaces";
import { Heading, InlineList, List, Quote, Text } from "@/components/ui/typography";
import type { AssetKey } from "@/content/assets";
import { priceTiers, pricing } from "@/content/pricing";
import { phoneCtaLabel, primaryCta } from "@/content/nav";
import { site } from "@/content/site";
import type { ContentBlock, FaqItem, WhyUsPoint } from "@/content/types";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/routes";

/**
 * The composed sections. Each takes content and renders it — none of them contains an English
 * sentence about the business, and none picks a colour or a type size. They arrange primitives.
 */

// ── Hero ─────────────────────────────────────────────────────────────────────

/**
 * Pass `image` and the hero becomes the split treatment: words on the page gutter, photograph
 * bleeding off the right edge of the screen. Without it, the plain centred-column hero every
 * other page uses.
 */
export function Hero({
  heading,
  subheading,
  image,
  rating,
  assurances,
  showPhone = true,
}: {
  heading: string;
  subheading?: string;
  /** A key into the image registry. See content/assets.ts. */
  image?: AssetKey;
  rating?: { stars: number; label: string };
  /** The reassurance strip under the buttons — "No contracts", "Cancel anytime". */
  assurances?: readonly string[];
  showPhone?: boolean;
}) {
  const body = (
    <Stack gap={6}>
      {rating && <Rating stars={rating.stars} label={rating.label} />}
      {/* `display` is the oversized treatment, and this is the one h1 on the site that gets it. */}
      <Heading level={1} size={image ? "display" : "h1"}>
        {heading}
      </Heading>
      {subheading && (
        <Text size="lead" tone="muted" measure>
          {subheading}
        </Text>
      )}
      {/* The strip sits tighter to the buttons than the Stack's own rhythm — it is a footnote on
          them, not the next thing down the page. */}
      <Stack gap={4}>
        <Cluster gap={4}>
          <Button href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
          {showPhone && (
            <Button
              href={`tel:${site.phone.e164}`}
              variant="secondary"
              size="lg"
              // The visible words are not the whole story — a screen reader gets the number.
              ariaLabel={`Call ${site.phone.display}`}
            >
              {phoneCtaLabel}
            </Button>
          )}
        </Cluster>
        {assurances && <InlineList items={assurances} />}
      </Stack>
    </Stack>
  );

  return (
    <Section tone="canvas" spacing={image ? "hero-media" : "hero"}>
      {image ? (
        <Split
          media={
            <Image
              asset={image}
              // The LCP element of the homepage. Exactly one image per page gets this.
              priority
              sizes="(min-width: 64rem) 50vw, 100vw"
              className="h-96 w-full object-cover sm:h-120 lg:h-full lg:rounded-l-lg"
            />
          }
        >
          {body}
        </Split>
      ) : (
        <Container>{body}</Container>
      )}
    </Section>
  );
}

// ── Why us ───────────────────────────────────────────────────────────────────

/**
 * The medallion behind a point's glyph or a step's number. Four hues that are NOT the brand
 * palette — see the accent block in theme.css for why. They cycle in source order, so an item's
 * colour is a property of its position in the band rather than of what it says: nothing here means
 * "green equals safe", and a fifth item would simply start the cycle again.
 *
 * Shared by "why us" and "how it works" on purpose — two bands of the same page using two different
 * sets of circles would read as two unrelated things.
 *
 * `edge` is the same hue as a card outline. It is only ever a BORDER: these fills are pastels and
 * carry accent ink at 4.5:1, but nothing else — muted body text on one of them lands around 4.2:1,
 * so a step card stays white and wears its colour on the rim.
 */
const medallionAccents = [
  { fill: "bg-accent-mint text-accent-mint-ink", edge: "border-accent-mint" },
  { fill: "bg-accent-peach text-accent-peach-ink", edge: "border-accent-peach" },
  { fill: "bg-accent-lilac text-accent-lilac-ink", edge: "border-accent-lilac" },
  { fill: "bg-accent-lemon text-accent-lemon-ink", edge: "border-accent-lemon" },
] as const;

/** The cycle. The modulo cannot miss, but a number index is still `| undefined` to the compiler. */
function medallion(index: number) {
  return medallionAccents[index % medallionAccents.length] ?? medallionAccents[0];
}

/** Content names an icon by key; this is the only place that turns one into a picture. */
const whyUsIcons = {
  guarantee: BadgeCheck,
  safety: Dog,
  local: MapPin,
  flexible: MessageCircleHeart,
} as const;

export function WhyUs({
  heading,
  intro,
  points,
  cta,
  image,
}: {
  heading: string;
  intro: string;
  points: readonly WhyUsPoint[];
  /** The label on the button through to the about page. */
  cta: string;
  image: AssetKey;
}) {
  return (
    <Section tone="canvas" spacing="lg-tight-top">
      <Container>
        {/* Picture first in the DOM as well as on the left, so the reading order on a phone is
            face-then-argument — the photograph is what earns the four claims underneath it. */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* The photograph is portrait, and at full height a 2:3 frame is most of a phone screen
              before a single word of the argument appears. So it is cropped to a band and never
              shown whole: `object-cover` with the default centre anchor, which is where the two
              faces and the dog are. The top of this frame is tree, so `object-top` would crop to
              foliage — if the picture is ever swapped for a landscape one, revisit this line. */}
          <Image
            asset={image}
            sizes="(min-width: 64rem) 50vw, 100vw"
            className="h-96 w-full rounded-lg object-cover sm:h-120 lg:h-160"
          />

          <Stack gap={6}>
            <Stack gap={4}>
              <Heading level={2} align="center-mobile">
                {heading}
              </Heading>
              <Text tone="muted">{intro}</Text>
            </Stack>

            {/* A real list: four parallel claims are a list, and a screen reader saying "four
                items" up front is the summary a sighted reader gets from the medallions. */}
            <ul className="list-none pl-0 flex flex-col gap-5">
              {points.map((point, index) => {
                const Icon = whyUsIcons[point.icon];
                return (
                  <li key={point.title} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className={cx(
                        // `shrink-0` or the circle squashes into an oval as the text wraps.
                        "flex size-11 shrink-0 items-center justify-center rounded-pill",
                        medallion(index).fill,
                      )}
                    >
                      <Icon size={22} />
                    </span>
                    <div>
                      <Heading level={3} size="h5">
                        {point.title}
                      </Heading>
                      <Text tone="muted" size="small">
                        {point.detail}
                      </Text>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Cluster gap={4}>
              <Button href={routes.about()} variant="secondary" size="md">
                {cta}
              </Button>
            </Cluster>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}

// ── How it works ─────────────────────────────────────────────────────────────

/**
 * The three steps from "interested" to "scooped". Centred throughout — at three short items this
 * band is a row of equals, and a centred row says that where left-hung text would read as a list
 * you work down.
 *
 * A real `<ol>`: the order is the meaning. The drawn numerals are therefore decoration and hidden
 * from assistive tech, which announces the ordering itself — otherwise a screen reader says "one"
 * twice per step.
 *
 * White band, with each step on an outlined card. Not `Card`: its tones are all white-on-cream, and
 * this band is white, so a step card inverts the idea — white fill, a fat pastel rim, and the
 * numeral straddling the rim like a sticker. That is deliberately the opposite of a review card
 * (filled, borderless, paw stamped in the corner) so the two never blur into one house card look.
 */
export function HowItWorks({
  heading,
  steps,
}: {
  heading: string;
  steps: readonly { title: string; detail: string }[];
}) {
  return (
    <Section tone="raised">
      <Container>
        <Stack gap={10} align="center">
          {/* Centred at every width, not `center-mobile`: the whole band is centred, so a title
              that snapped left at `md` would be the only thing in it that did. */}
          <Heading level={2} align="center">
            {heading}
          </Heading>

          {/* One column, then three — never two. Three steps in a two-column grid leaves the last
              one hanging alone under the other two, which reads as an afterthought rather than as
              the payoff.

              `mt-7` gives back the numeral's overhang — half of `size-14` — so the first card's
              badge does not crowd the heading above it. The row gap is a step wider than the
              column gap for the same reason, once the cards are stacked on a phone. */}
          <ol className="mt-7 grid w-full list-none grid-cols-1 gap-x-6 gap-y-14 pl-0 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={cx(
                  // `h-full` keeps the three rims level when one step's words wrap further.
                  "relative flex h-full flex-col items-center gap-3 rounded-lg border-2 bg-surface-raised px-6 pb-8 pt-12 text-center shadow-sm",
                  medallion(index).edge,
                )}
              >
                {/* Straddles the top rim: `-top-7` is half the circle, so the border cuts it
                    exactly in half, and the fill is opaque so the rim runs behind rather than
                    through it. Decoration — the `<ol>` is what tells assistive tech this is step
                    two of three, and reading the numeral out loud says the number twice. */}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute -top-7 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-pill font-display text-h4 font-bold",
                    medallion(index).fill,
                  )}
                >
                  {index + 1}
                </span>
                <Heading level={3} size="h5">
                  {step.title}
                </Heading>
                <Text tone="muted" size="small">
                  {step.detail}
                </Text>
              </li>
            ))}
          </ol>
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
          <Heading level={2} align="center-mobile">{heading}</Heading>
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
          <Heading level={2} align="center-mobile">{heading}</Heading>
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
          <Heading level={2} align="center-mobile">{heading}</Heading>
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
          <Heading level={2} align="center-mobile">{heading}</Heading>
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
 *
 * The layout is CSS multi-column, not `Grid`. A grid would put every card in a row on the tallest
 * card's height, which on quotes of wildly different lengths is a page of half-empty boxes; here
 * each card is exactly as tall as its own words and the next one starts `mb-6` below it, so the
 * heights stagger while the spacing stays constant. `break-inside-avoid` is what stops a column
 * splitting a card down the middle.
 *
 * The trade: multi-column reads top-of-column to bottom-of-column, so the visual order is not the
 * source order. For an unranked set of testimonials that costs nothing — nobody reads review four
 * expecting it to follow review three.
 *
 * A white band with cream cards, which is the inverse of every other section. Reviews are the one
 * place on the page where the content should feel like it came from outside the brand.
 */
export function ReviewWall({
  heading,
  reviews,
}: {
  heading: string;
  reviews: readonly { quote: string; name: string; city?: string }[];
}) {
  if (reviews.length === 0) return null;
  return (
    <Section tone="raised">
      <Container>
        <Stack gap={8}>
          <Heading level={2} align="center-mobile">{heading}</Heading>
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {reviews.map((review) => (
              <div key={review.quote} className="mb-6 break-inside-avoid">
                <Card tone="canvas">
                  <Stack gap={4}>
                    {/* Five filled stars on every card: these are the five-star reviews, and the
                        row is the same one the hero uses, so the claim up there and the evidence
                        down here are visibly the same thing. */}
                    <Rating stars={5} />
                    <Quote attribution={review.name} detail={review.city}>
                      <Text>{review.quote}</Text>
                    </Quote>
                  </Stack>
                  {/* The house stamp, bottom-right. Decoration only: hidden from assistive tech,
                      untouchable by the pointer, and faint enough that the words stay the thing
                      you read. It sits in the card's padding, so no text ever runs under it. */}
                  <PawPrint
                    size={40}
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-4 right-4 -rotate-12 text-brand opacity-15"
                  />
                </Card>
              </div>
            ))}
          </div>
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
