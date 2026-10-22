import { ArrowDown, CircleCheck, MapPin, Phone } from "lucide-react";

import { FormCard, medallion } from "@/components/blocks/blocks";
import { QuickLeadForm } from "@/components/forms/QuickLeadForm";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";
import { Container, Section, Stack } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { Rating } from "@/components/ui/Rating";
import { Card } from "@/components/ui/surfaces";
import { Eyebrow, Heading, Quote, Text } from "@/components/ui/typography";
import { campaignChrome } from "@/content/campaigns";
import { phoneCtaLabel } from "@/content/nav";
import { ratingSummary } from "@/content/reviews";
import { site } from "@/content/site";
import type { Campaign, Review } from "@/content/types";
import { cx } from "@/lib/cx";

/**
 * THE AD LANDING PAGE'S BLOCKS — /lp/<slug>/. Composed from the same primitives as the rest of the
 * site, and arranged for a different reader: someone who tapped an ad on a phone, inside Facebook's
 * or Instagram's own browser, and will give the page a few seconds to prove they landed somewhere
 * worth staying.
 *
 * Three rules shape everything in here, and they are the standard ones for paid traffic:
 *
 *   ONE ACTION. Every button on the page either jumps to the form or dials the phone. There is no
 *   navigation and no link to another page — each one would be a way to leave that the ad paid for.
 *
 *   THE FORM IS NEVER FAR. Beside the promise on a laptop, directly under it on a phone, and one
 *   tap away from anywhere else via the sticky bar (see StickyCtaBar).
 *
 *   PROOF BESIDE THE ASK. The stars sit above the h1, a quote sits beside the form, and the reviews
 *   are the first band after it.
 */

/** The form's anchor. One id per page — every "Get my free quote" button points here. */
export const CAMPAIGN_FORM_ID = "quote";

/**
 * The marker the sticky bar watches. Anything carrying it hides the bar while it is on screen —
 * see StickyCtaBar. Put on the bands that already hold the same two buttons.
 */
export const STICKY_CTA_HIDE = { "data-sticky-cta-hide": "" } as const;

/** The phone button's accessible name: the visible words first, then the number (WCAG 2.5.3). */
const phoneName = `${phoneCtaLabel} — ${site.phone.display}`;

// ── Chrome ───────────────────────────────────────────────────────────────────

/**
 * The bar across the top. The site header's lockup and its scroll behaviour, and nothing else: no
 * navigation, no social row, and a logo that is NOT a link. A logo that goes home is the most-tapped
 * way off a landing page, and home is not where this visitor was sent.
 *
 * The phone is the one thing on the right. A local service's number is a trust signal before it is
 * a button — it says there is a person — so from `sm` the digits are the label. On a phone there is
 * no room for them beside the lockup, and the round button says "call" on its own.
 *
 * Height: `py-4` around the 4rem mark is 6rem at every width, which is what the campaign wrapper
 * pins `--header-height` to — see `.chrome-campaign` in base.css.
 */
export function CampaignHeader() {
  return (
    <header className="header-lift sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          <span className="flex items-center gap-3">
            {/* `decorative`: the name is live text beside it. See the site Header for the rest. */}
            <Image asset="logoMark" decorative sizes="80px" className="h-16 w-auto" />
            <span className="flex flex-col gap-1">
              <span className="font-display font-semibold text-control text-brand leading-none">
                {site.name}
              </span>
              <span className="whitespace-nowrap text-caption font-semibold uppercase tracking-wide text-ink-muted leading-none">
                {site.descriptor}
              </span>
            </span>
          </span>

          <div className="sm:hidden">
            <Button
              href={`tel:${site.phone.e164}`}
              variant="secondary"
              icon={Phone}
              ariaLabel={phoneName}
            />
          </div>
          <div className="hidden sm:block">
            <Button
              href={`tel:${site.phone.e164}`}
              variant="secondary"
              icon={Phone}
              ariaLabel={phoneName}
            >
              {site.phone.display}
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}

/**
 * The foot of the page: who we are, how to reach us, the copyright. The site footer's navy and its
 * NAP, without the forty links — the same reasoning as the header above.
 */
export function CampaignFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark text-ink-inverse" {...STICKY_CTA_HIDE}>
      <Container>
        <div className="flex flex-col items-center gap-6 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col gap-2">
            <span className="font-display font-bold text-h5">{site.name}</span>
            <Text size="small">{campaignChrome.footerLine}</Text>
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <Link href={`tel:${site.phone.e164}`} variant="quiet" weight="semibold">
              {site.phone.display}
            </Link>
            <Link href={`mailto:${site.email}`} variant="quiet" size="small">
              {site.email}
            </Link>
          </div>
        </div>
        <div className="border-t border-line-strong py-6 text-center text-caption">
          © {year} {site.legalName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

/**
 * The amber swash under the h1's last words. Drawn, not underlined: an underline in a heading
 * reads as a link, and a hand-drawn stroke reads as emphasis. It draws itself in once on load —
 * `.swash` in base.css — and simply appears for anyone who has asked for less motion.
 *
 * The stroke is an SVG path stretched to the words' width (`preserveAspectRatio="none"`), so the
 * same curve fits "again" and "every single week" alike.
 */
function Swash({ children }: { children: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        className="swash absolute -bottom-1 left-0 h-3 w-full text-amber"
      >
        <path
          d="M4 11 C 50 3, 120 2, 196 8"
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/**
 * The first screen, and the band the page is judged on.
 *
 * TWO COLUMNS ON A LAPTOP — the promise on the left, the form on the right, both above the fold.
 * Nothing has to be scrolled to before somebody can start, which on paid traffic is the difference
 * that matters most.
 *
 * ONE COLUMN ON A PHONE, in the order the doubt arrives: do they come here and are they any good
 * (the stars and the pill), what is it (the h1), what does it cost (the standfirst), what's the
 * catch (the ticks), and then two thumb-sized buttons. The form follows straight on, so the jump
 * button is a short scroll rather than a trip.
 *
 * THE QUOTE MOVES. On a laptop it sits in the left column under the ticks, beside the form. On a
 * phone it lands under the form instead — proof for the visitor who reached the button and
 * hesitated. Same element, no duplicate, no hidden copy: the left column is `display: contents`
 * below `lg`, so its two children join the grid as siblings of the form and `order` puts the form
 * between them. (A row-spanning form was the first attempt; the grid shared the form's height
 * across both rows and opened a gap under the ticks.)
 *
 * No photograph, on purpose. On a phone a picture above the h1 pushes the buttons under the fold,
 * and the faces are one band down in "what working with us looks like". The form card carries Blue.
 */
export function CampaignHero({ campaign }: { campaign: Campaign }) {
  const { hero, form, spotlight } = campaign;

  return (
    <Section tone="canvas" spacing="hero">
      <Container>
        {/* The sticky bar's marker goes on the grid, not on a wrapper round the Section: the first
            band must stay a direct child of `main`, or it loses the header's height (base.css). */}
        <div
          className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12"
          {...STICKY_CTA_HIDE}
        >
          <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:gap-10 lg:pt-4">
            <div className="order-1">
              <Stack gap={6}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <Rating stars={ratingSummary.stars} label={ratingSummary.label} />
                  <span className="inline-flex items-center gap-1.5 rounded-pill border border-brand px-3 py-1 text-caption font-semibold text-brand">
                    <MapPin size={14} aria-hidden="true" />
                    {hero.serviceLine}
                  </span>
                </div>

                <Heading level={1} size="display">
                  {hero.heading}
                  {hero.highlight && (
                    <>
                      {" "}
                      <Swash>{hero.highlight}</Swash>
                    </>
                  )}
                </Heading>

                <Text size="lead" tone="muted" measure>
                  {hero.subheading}
                </Text>

                <ul className="flex list-none flex-col gap-3 pl-0">
                  {hero.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      {/* Decoration — the words are the claim. `success-ink` is the green the site
                          allows on a light band; the CTA green is for the button alone. */}
                      <CircleCheck size={24} aria-hidden="true" className="shrink-0 text-success-ink" />
                      <Text as="span" weight="semibold">
                        {point}
                      </Text>
                    </li>
                  ))}
                </ul>

                {/* A phone's two buttons. Gone from `lg`, where the form is already beside them and
                    the header carries the number. Full-width and stacked: these are thumb targets. */}
                <div className="flex flex-col gap-3 sm:flex-row lg:hidden">
                  <Button href={`#${CAMPAIGN_FORM_ID}`} variant="cta" size="lg" icon={ArrowDown} block>
                    {hero.cta}
                  </Button>
                  <Button
                    href={`tel:${site.phone.e164}`}
                    variant="secondary"
                    size="lg"
                    icon={Phone}
                    block
                    ariaLabel={phoneName}
                  >
                    {phoneCtaLabel}
                  </Button>
                </div>
              </Stack>
            </div>

            <div className="order-3">
              <SpotlightQuote review={spotlight} />
            </div>
          </div>

          {/* The form. `scroll-mt-28` clears the sticky header when a button jumps here. */}
          <div id={CAMPAIGN_FORM_ID} className="order-2 scroll-mt-28 lg:col-span-5">
            {/* `sky`, the loud card, for the reason /contact/ uses it: the form IS the page. It is
                the only glowing object on the page, which is the rule that card comes with. */}
            <FormCard heading={form.heading} intro={form.intro} tone="sky">
              <Stack gap={4} align="center">
                <div className="w-full">
                  <QuickLeadForm variant="pill" campaign={campaign.slug} submitLabel={form.submit} />
                </div>
                <Text size="caption" tone="muted">
                  {form.note}
                </Text>
              </Stack>
            </FormCard>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** One review, on a white card that lifts off the hero's off-white. */
function SpotlightQuote({ review }: { review: Review }) {
  return (
    <Card>
      <Stack gap={3}>
        <Rating stars={5} />
        <Quote attribution={review.name} detail={review.city}>
          <Text>{review.quote}</Text>
        </Quote>
      </Stack>
    </Card>
  );
}

// ── Reviews ──────────────────────────────────────────────────────────────────

/**
 * The reviews, in the shape each screen can afford.
 *
 * ON A PHONE, A SWIPEABLE ROW. Six testimonials stacked is two thousand pixels of scrolling between
 * the visitor and the rest of the page; as a row it is one card's height, and the next card peeking
 * in from the right edge is what says "swipe". Native scroll-snap, no script — it works before the
 * page hydrates, and inside an in-app browser that is not a given.
 *
 * FROM `lg`, THE SITE'S MASONRY. The same three columns as `ReviewWall`, because at that width every
 * card fits on one screen and staggered heights read better than a grid of half-empty boxes.
 *
 * The quotes are clamped to seven lines IN THE ROW ONLY. They run from three lines to fifteen, and
 * a row is as tall as its tallest card — unclamped, one long review turned the other five into
 * mostly-empty boxes. The masonry shows every word.
 *
 * The row runs to the edge of the screen on a phone (`-mx-5` undoes the container's gutter) so the
 * peeking card is cut by the screen rather than by an invisible margin; `px-5` and `scroll-px-5`
 * put the first card and every snap point back on the gutter line.
 */
export function ReviewStrip({
  heading,
  intro,
  reviews,
}: {
  heading: string;
  intro: string;
  reviews: readonly Review[];
}) {
  if (reviews.length === 0) return null;

  return (
    <Section tone="canvas">
      <Container>
        <Stack gap={8}>
          <div className="text-center md:text-left">
            <Stack gap={3}>
              <Heading level={2}>{heading}</Heading>
              <Text tone="muted">{intro}</Text>
            </Stack>
          </div>

          <ul className="-mx-5 flex list-none snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:block lg:columns-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {reviews.map((review) => (
              <li
                key={review.quote}
                className="w-5/6 shrink-0 snap-start sm:w-2/5 lg:mb-6 lg:w-auto lg:break-inside-avoid"
              >
                <Card>
                  <Stack gap={4}>
                    <Rating stars={5} />
                    <Quote attribution={review.name} detail={review.city}>
                      {/* Seven lines in the row, all of it in the masonry. The whole quote is
                          still in the page — a screen reader reads it all — the clamp only
                          stops one long review setting the height of every card beside it. */}
                      <span className="line-clamp-7 lg:line-clamp-none">{review.quote}</span>
                    </Quote>
                  </Stack>
                </Card>
              </li>
            ))}
          </ul>
        </Stack>
      </Container>
    </Section>
  );
}

// ── What working with us looks like ──────────────────────────────────────────

/**
 * The photograph and the steps. The faces are what an ad cannot fake and a franchise cannot copy,
 * and the steps answer the question that stops a form being sent: what happens after I press it?
 *
 * Three children in a grid, so a phone reads them in the order that makes sense there — the title,
 * the people, then the steps — while a laptop puts the photograph on the left across both rows.
 *
 * The steps are the `NextSteps` vocabulary — white cards, pastel rims, a numbered medallion — at a
 * size meant for a band rather than a sidebar. A real `<ol>`: the order is the meaning, so the drawn
 * numerals are hidden from assistive tech, which announces the order itself.
 */
export function ProcessBand({ process }: { process: Campaign["process"] }) {
  return (
    <Section tone="raised">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8">
          <div className="text-center md:text-left lg:col-start-2">
            <Stack gap={3}>
              <Eyebrow>{process.eyebrow}</Eyebrow>
              <Heading level={2}>{process.heading}</Heading>
              <Text tone="muted">{process.intro}</Text>
            </Stack>
          </div>

          <figure className="flex flex-col gap-3 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <Image
              asset={process.image}
              sizes="(min-width: 75rem) 34rem, (min-width: 64rem) 46vw, 100vw"
              // Cropped to a band on a phone, where a full portrait would be a screen of lawn.
              className="h-72 w-full rounded-lg object-cover sm:h-96 lg:h-140"
            />
            <figcaption className="text-center text-small text-ink-muted lg:text-left">
              {process.caption}
            </figcaption>
          </figure>

          <ol className="flex list-none flex-col gap-4 pl-0 lg:col-start-2">
            {process.steps.map((step, index) => (
              <li
                key={step.title}
                className={cx(
                  "flex items-start gap-4 rounded-lg border-2 bg-surface-raised p-5 shadow-sm",
                  medallion(index).edge,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "flex size-11 shrink-0 items-center justify-center rounded-pill font-display text-h5 font-bold",
                    medallion(index).fill,
                  )}
                >
                  {index + 1}
                </span>
                <Stack gap={2}>
                  <Heading level={3} size="h5">
                    {step.title}
                  </Heading>
                  <Text size="small" tone="muted">
                    {step.detail}
                  </Text>
                </Stack>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
