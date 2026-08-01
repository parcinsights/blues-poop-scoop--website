import { ArrowRight, BadgeCheck, Dog, MapPin, MessageCircleHeart, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";
import { Cluster, Container, Grid, Section, Split, Stack } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { Rating } from "@/components/ui/Rating";
import { Badge, Card, Callout } from "@/components/ui/surfaces";
import { Heading, InlineList, List, Quote, Text } from "@/components/ui/typography";
import type { AssetKey } from "@/content/assets";
import { priceTiers, pricing } from "@/content/pricing";
import { phoneCtaLabel, primaryCta } from "@/content/nav";
import { site } from "@/content/site";
import type { ContentBlock, FaqItem, WhyUsPoint } from "@/content/types";
import { cx } from "@/lib/cx";
import { serviceAreaMapIsConfigured, serviceAreaMapUrl } from "@/lib/maps";
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

// ── Pricing band ─────────────────────────────────────────────────────────────

/**
 * The homepage pricing band. Three cards side by side, one per dog count, each carrying BOTH
 * frequencies — not one card per frequency. The choice a visitor cannot change is how many dogs
 * they own, so that is what picks the card; how often we come is the thing they are still weighing,
 * and it belongs inside the card as a comparison of two numbers.
 *
 * Deliberately not `PriceTable`. That is the real grid on /pricing, marked up as a table because a
 * buyer scrutinising it needs rows and scoped headers. This is the landing-page version of the same
 * three facts: a list of plans, read one card at a time.
 *
 * Inside a card the two frequencies are NOT equals. Weekly is the plan being sold — big navy
 * numeral, the only thing on the card you can read from across the room — and every other week is a
 * quiet line under a hairline: there if you want it, not an invitation to shop down.
 *
 * Centred throughout, at every width — so this band is `align="center"` rather than the house
 * `center-mobile`, the same exception `HowItWorks` takes. A left-hung title over a centred row of
 * cards is the only thing in the band not on the midline, which reads as a mistake.
 *
 * One column, then three at `md` — never two, for the reason `HowItWorks` gives. The step is `md`
 * rather than `sm` because the featured card wears both a chip and a paw across its top edge, and
 * three columns at 40rem leaves the two too close to sit side by side.
 *
 * Every price comes from content/pricing.ts. Nothing in this file knows what a plan costs.
 */
export function PricingBand({
  heading,
  assurances,
  promise,
  cta,
}: {
  heading: string;
  /** The dotted reassurance strip under the title — the same treatment the hero uses. */
  assurances: readonly string[];
  /** The guarantee, restated in money terms, under the cards. */
  promise: string;
  cta: string;
}) {
  return (
    <Section tone="canvas">
      <Container>
        <Stack gap={10} align="center">
          <Stack gap={4} align="center">
            <Heading level={2} align="center">
              {heading}
            </Heading>
            <InlineList items={assurances} />
          </Stack>

          {/* `mt-2` gives back the featured card's chip overhang, so it does not crowd the strip
              above it. A real list — three parallel offers is a list, and a screen reader saying
              "three items" is the summary a sighted reader gets from the row of cards.

              `w-full` because the Stack above centres its children by shrinking them. */}
          <ul className="mt-2 grid w-full list-none grid-cols-1 gap-6 pl-0 md:grid-cols-3">
            {priceTiers.map((tier) => (
              <li key={tier.id}>
                <Card tone={tier.featured ? "featured" : "default"}>
                  {tier.featured && (
                    <>
                      {/* Straddles the top rim — `-top-3.5` is half the chip's height, so the
                          border cuts it in two and the opaque fill runs the rim behind it. */}
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <Badge tone="featured">Most popular</Badge>
                      </span>
                      {/* The house paw, stuck on the corner like a sticker. It hangs OUTSIDE the
                          card on purpose: inside, a centred plan name on a narrow card runs under
                          it. Decoration — hidden from assistive tech, untouchable by the pointer. */}
                      <PawPrint
                        size={44}
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-3 -top-3 rotate-12 text-amber"
                      />
                    </>
                  )}

                  {/* No alignment of its own — the band's centring is inherited. */}
                  <Stack gap={5}>
                    <div>
                      <Heading level={3} size="h4">
                        {tier.name}
                      </Heading>
                      <Text size="small" tone="muted">
                        {tier.dogs}
                      </Text>
                    </div>

                    {/* A description list: each frequency is a term, its price is the value. The
                        unit rides both prices — these are monthly totals, not per visit, and that
                        is the one misread this band exists to prevent. */}
                    <dl className="flex flex-col gap-5">
                      <div>
                        <Text as="dt" size="small" tone="muted">
                          Weekly
                        </Text>
                        {/* The focal point of the whole band. `leading-none` because the numeral
                            has no descenders and h2's line box would otherwise leave a gap under
                            it wider than the one above the unit. */}
                        <dd className="font-display text-h2 font-bold leading-none text-brand">
                          {`$${tier.weekly}`}
                        </dd>
                        <Text size="small" tone="muted">
                          {pricing.unit}
                        </Text>
                      </div>

                      {/* The quieter option, under a hairline and at body weight — available, not
                          advertised. */}
                      <div className="border-t border-line pt-4">
                        <Text as="dt" size="small" tone="muted">
                          Every other week
                        </Text>
                        <Text as="dd" size="small" tone="muted">
                          <Text as="span" weight="semibold" tone="default">
                            {`$${tier.biweekly}`}
                          </Text>
                          {` ${pricing.unit}`}
                        </Text>
                      </div>
                    </dl>
                  </Stack>
                </Card>
              </li>
            ))}
          </ul>

          <Stack gap={5} align="center">
            <Text tone="muted" measure>
              {promise}
            </Text>
            {/* Points at /contact/, not the quote form: someone who has just read three prices is
                choosing between them, and the next thing they want is a person, not a second form
                asking the questions the prices already answered. */}
            <Cluster gap={4} justify="center">
              <Button href={routes.contact()} size="lg">
                {cta}
              </Button>
            </Cluster>
          </Stack>
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

// ── Service area map ─────────────────────────────────────────────────────────

/**
 * The coverage band: a map to orient, a list of towns to answer.
 *
 * It sits between "how it works" and the prices on purpose. "Do you even come to my street?" is
 * disqualifying — someone outside the territory should find that out before they read a number,
 * and someone inside it should have the doubt cleared while they still have it.
 *
 * The map is decoration and the town list is the content, not the other way round. That ordering
 * is why the whole thing still works with the map gone: no key configured (see lib/maps.ts), no
 * iframe, and the band reads as a slightly plainer version of itself rather than as a hole.
 * It is also why the towns are `Button`s and not pins — a pin is not a link to a page that ranks.
 */
/**
 * The map itself, framed. Renders nothing at all when no key is configured — see lib/maps.ts.
 *
 * Separate from the band below so /locations/ can show the map without the town chips, which on
 * that page would be the same ten links as the cards directly under it.
 */
export function ServiceAreaMapFrame() {
  if (!serviceAreaMapIsConfigured()) return null;

  /**
   * Two crops of the same map, not one image squeezed. A 16/9 strip on a 390px screen is about
   * 220px of map — not enough of the territory to orient anyone — so the phone gets a squarer
   * frame. A `<picture>` fetches only the crop that matches, so this is two URLs and still one
   * request.
   *
   * 640 is Google's ceiling on a free static map in either direction; `scale=2` inside the URL is
   * what makes it sharp, so the numbers here are the CSS size and the file is twice that.
   */
  const wide = serviceAreaMapUrl({ width: 640, height: 360 });
  const tall = serviceAreaMapUrl({ width: 480, height: 440 });
  if (!wide || !tall) return null;

  return (
    /* The frame owns the corners so the image needs no rounding of its own to disagree about. */
    <div className="w-full overflow-hidden rounded-lg border border-line shadow-sm">
      <picture>
        <source media="(min-width: 640px)" srcSet={wide} />
        {/* eslint-disable-next-line @next/next/no-img-element -- Not a local asset. It must be
            fetched by the BROWSER so the request carries a Referer and the key's referrer
            restriction applies; next/image would fetch it from our server and strip that. */}
        <img
          src={tall}
          alt={`Map of the area ${site.name} covers: Northwest Philadelphia and the Main Line, with a marker on each town served.`}
          loading="lazy"
          decoding="async"
          width={640}
          height={360}
          className="block aspect-4/3 w-full object-cover sm:aspect-video"
        />
      </picture>
    </div>
  );
}

export function ServiceAreaMap({
  heading,
  intro,
  cities,
  cta,
}: {
  heading: string;
  intro: string;
  cities: readonly { slug: string; name: string }[];
  /** Omit on /locations/ itself, where the link would point at the page you are already on. */
  cta?: string;
}) {
  return (
    <Section tone="alt">
      <Container>
        <Stack gap={8} align="center">
          <Stack gap={3} align="center">
            <Heading level={2} align="center">
              {heading}
            </Heading>
            <Text tone="muted" measure>
              {intro}
            </Text>
          </Stack>

          <ServiceAreaMapFrame />

          {/* The chips are the actual answer, so they stay above the CTA: someone who finds their
              town here is done reading and wants the button, and someone who does not is the one
              the CTA's wording is written for. */}
          <Cluster gap={3} justify="center">
            {cities.map((city) => (
              <Button key={city.slug} href={routes.city(city.slug)} variant="ghost" size="sm">
                {city.name}
              </Button>
            ))}
          </Cluster>

          {cta ? (
            <Button href={routes.locations()} variant="link">
              {cta}
            </Button>
          ) : null}
        </Stack>
      </Container>
    </Section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────

/**
 * The rows themselves, shared by every band that asks questions.
 *
 * `<details>` rather than React state: the answers are in the DOM and readable before any
 * JavaScript runs, which is what makes them indexable and what makes the page work on a slow
 * connection. It is also keyboard-operable for free. The open/close animation and the plus that
 * turns into a minus are pure CSS — see the `.faq-*` rules in app/base.css.
 *
 * The sign is a `<span>` with no content: it is drawn entirely from the summary's state, and a
 * screen reader is already told "expanded" or "collapsed" by the `<details>` itself. Reading a
 * plus out loud would say the same thing twice, wrong.
 */
function FaqRows({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="flex w-full flex-col gap-3">
      {items.map((item) => (
        <details key={item.question} className="faq-item">
          <summary className="faq-summary">
            {item.question}
            <span aria-hidden="true" className="faq-sign" />
          </summary>
          <div className="faq-answer">
            <Text tone="muted">{item.answer}</Text>
          </div>
        </details>
      ))}
    </div>
  );
}

/** The inner-page treatment: a left-hung title over the rows. Used on /faq/ and /pricing/. */
export function FaqAccordion({ heading, items }: { heading: string; items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section>
      <Container width="prose">
        <Stack gap={6}>
          <Heading level={2} align="center-mobile">{heading}</Heading>
          <FaqRows items={items} />
        </Stack>
      </Container>
    </Section>
  );
}

/**
 * Paw prints tracking up the margins of the FAQ band, outside the reading column and untouchable
 * by the pointer. Decoration, and hidden from assistive tech: nothing here is information.
 *
 * They live in the gutters `Container width="prose"` leaves behind, which only exist once the
 * viewport is wider than the reading measure — so below `lg` there is nowhere to put them and they
 * are simply not drawn, rather than being crowded in beside the text or pushed off-screen where
 * they would drag a horizontal scrollbar onto the page.
 *
 * Sizes and angles are deliberately uneven. Four identical paws at four identical angles reads as
 * a border pattern; a set that wanders reads as a dog walked through.
 */
function FaqPaws() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      <PawPrint size={72} className="absolute left-6 top-12 -rotate-12 text-brand opacity-10" />
      <PawPrint size={44} className="absolute left-28 top-52 rotate-12 text-amber opacity-60" />
      <PawPrint size={56} className="absolute bottom-16 left-10 rotate-6 text-brand opacity-10" />
      <PawPrint size={52} className="absolute right-24 top-24 rotate-12 text-brand opacity-10" />
      <PawPrint size={76} className="absolute bottom-24 right-8 -rotate-6 text-amber opacity-50" />
      <PawPrint size={40} className="absolute bottom-56 right-32 rotate-45 text-brand opacity-10" />
    </div>
  );
}

/**
 * The homepage FAQ band. White, centred, and narrower than the bands above it — after three bands
 * of cards and prices this one is a single column of questions, and the change of shape is what
 * says the page is winding down rather than starting another pitch.
 *
 * Centred at every width, not the house `center-mobile`: the whole band sits on the midline, and a
 * title that snapped left at `md` would be the only thing in it that did. Same exception
 * `HowItWorks` and `PricingBand` take.
 *
 * The link out is the point of only asking four questions here. The other five are real questions
 * with real answers, and this is the one place on the homepage that has earned the click to them.
 */
export function FaqBand({
  heading,
  items,
  cta,
}: {
  heading: string;
  items: readonly FaqItem[];
  /** The label on the link through to /faq/. */
  cta: string;
}) {
  if (items.length === 0) return null;
  return (
    <Section tone="raised">
      {/* Full-bleed, so the paws can sit in the margins the prose Container leaves. It is the
          positioning parent for them and nothing else. */}
      <div className="relative">
        <FaqPaws />
        <Container width="prose">
          {/* No `align="center"` on the Stack: that would hand `text-center` down to the answers
              as well, and a centred paragraph is a paragraph nobody finishes. The two things that
              are centred say so themselves. */}
          <Stack gap={8}>
            <Heading level={2} align="center">
              {heading}
            </Heading>
            <FaqRows items={items} />
            <Cluster gap={4} justify="center">
              <Button href={routes.faq()} variant="secondary" size="md">
                {cta}
              </Button>
            </Cluster>
          </Stack>
        </Container>
      </div>
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

// ── CTA banner ───────────────────────────────────────────────────────────────

/**
 * The between-sections CTA. Drop it anywhere in a page's band stack — its job is to catch a
 * visitor mid-scroll, at the moment they have just been convinced of something, and hand them the
 * quote form before they have to reach the bottom of the page to find one.
 *
 * Deliberately NOT `CtaBand`, and the difference is the point. `CtaBand` is the page's closing
 * argument: full-bleed navy, an h2 at full size, two buttons, and it sits last. This is a ribbon —
 * a contained card inside the page width, one line of type, one button — so a page can carry three
 * of them without reading as three endings. Put a full-bleed band mid-page and the page looks like
 * it finished and then started again.
 *
 * Amber rather than navy for the same reason. Navy is the closing band and the footer, and a navy
 * ribbon two screens above a navy band is the same colour saying two different things. Amber is a
 * BACKGROUND ONLY colour — ink on it is 7.71:1, white on it is 1.64:1 — so everything in here is
 * ink, and the button is the navy `primary`, which is the one fill on the site that carries light
 * text. See the palette note at the top of theme.css.
 *
 * `tone` is the surrounding band, not the ribbon: the ribbon floats on it. Match it to whichever
 * neighbour should appear to continue through the banner — on the homepage it is `canvas`, so the
 * "why us" band simply runs on and the ribbon sits inside it rather than cutting it in two.
 */
export function CtaBanner({
  heading,
  detail,
  tone = "canvas",
  cta = primaryCta,
}: {
  heading: string;
  /** One line under the title. Anything longer belongs in a band, not a ribbon. */
  detail?: string;
  /** The band behind the ribbon — match it to the neighbour it should read as part of. */
  tone?: "default" | "alt" | "canvas" | "raised";
  /** Override only where the page's next step genuinely is not the quote form. */
  cta?: { label: string; href: string };
}) {
  return (
    // `sm`, the tightest band on the site: the ribbon carries its own padding, and a full-size
    // band around it would put more air between it and its neighbours than the neighbours have
    // between their own title and content.
    <Section tone={tone} spacing="sm">
      <Container>
        {/* `overflow-hidden` is what lets the paws hang off the edges — they are positioned
            outside the box and clipped back to its corner radius, so they read as printed on the
            ribbon rather than stuck to it. */}
        <div className="relative overflow-hidden rounded-lg bg-amber px-6 py-8 shadow-md sm:px-10 sm:py-10">
          <CtaBannerPaws />

          {/* Stacked and centred on a phone, then a row with the words left and the button right.
              `relative` lifts it above the paws; `gap-6` is the air between the two on a phone. */}
          <div className="relative flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-10">
            {/* The house `center-mobile` rule, applied to the block rather than to the title
                alone, so the line under it follows the title instead of sitting centred beneath a
                left-hung one. */}
            <div className="text-center md:text-left">
              <Stack gap={2}>
                <Heading level={2} size="h3">
                  {heading}
                </Heading>
                {/* Ink, not `muted`: ink-muted on amber is 3.75:1 and fails AA. On this ribbon
                    the supporting line is the same colour as the title — the size does the
                    demoting. */}
                {detail && <Text>{detail}</Text>}
              </Stack>
            </div>

            {/* `shrink-0` or the label wraps mid-word as the heading beside it grows. The arrow is
                the consequence of the action — where it takes you — which is why it sits right. */}
            <div className="shrink-0">
              <Button href={cta.href} size="lg" icon={ArrowRight}>
                {cta.label}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The paws on the ribbon. Decoration — hidden from assistive tech, untouchable by the pointer, and
 * in `amber-dark`, which is the ribbon's own hover shade: a tone-on-tone watermark rather than a
 * second colour arriving.
 *
 * Both hang off a corner and are clipped by the parent's `overflow-hidden`. They are drawn at
 * every width — unlike the FAQ band's, which need gutters to live in — because the ribbon's own
 * padding keeps them clear of the words even on a phone.
 */
function CtaBannerPaws() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <PawPrint size={96} className="absolute -left-7 -top-7 rotate-12 text-amber-dark opacity-50" />
      <PawPrint
        size={72}
        className="absolute -bottom-6 right-8 -rotate-12 text-amber-dark opacity-40"
      />
    </div>
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
