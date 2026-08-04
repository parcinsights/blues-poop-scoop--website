import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CalendarHeart,
  Dog,
  Heart,
  MapPin,
  MessageCircleHeart,
  PawPrint,
  ShieldCheck,
  Signpost,
  Trash2,
} from "lucide-react";

import { ServiceTabs, type ServiceTab } from "@/components/blocks/ServiceTabs";
import { QuickLeadForm } from "@/components/forms/QuickLeadForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";
import {
  Cluster,
  Container,
  Grid,
  Section,
  type SectionTone,
  Split,
  Stack,
} from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { Rating } from "@/components/ui/Rating";
import { Badge, Card, Callout, Chip } from "@/components/ui/surfaces";
import {
  Eyebrow,
  Heading,
  InlineList,
  List,
  Quote,
  Text,
} from "@/components/ui/typography";
import type { AssetKey } from "@/content/assets";
import { priceTiers, pricing } from "@/content/pricing";
import { phoneCtaLabel, primaryCta } from "@/content/nav";
import { site } from "@/content/site";
import type {
  ContentBlock,
  FaqItem,
  Feature,
  PointIcon,
  Stat,
  TeamMember,
  WhyUsPoint,
} from "@/content/types";
import { cx } from "@/lib/cx";
import { serviceAreaMapIsConfigured, serviceAreaMapUrl } from "@/lib/maps";
import { routes } from "@/lib/routes";
import type { Crumb } from "@/lib/schema";

/**
 * The composed sections. Each takes content and renders it — none of them contains an English
 * sentence about the business, and none picks a colour or a type size. They arrange primitives.
 */

// ── Hero ─────────────────────────────────────────────────────────────────────

/**
 * THE FRONT-DOOR HERO, in two arrangements. Both carry the same words in the same order — rating,
 * h1, standfirst, two buttons, reassurance strip — and differ only in where the photograph goes.
 * That is why they are one component and not two: `ServiceHero` is a separate file-section because
 * its CONTENT differs (chips, a price button); these two do not.
 *
 *   `split`     words on the page gutter, photograph bleeding off the right edge of the screen.
 *               The homepage. It is the widest, loudest treatment on the site.
 *   `stacked`   everything centred in one column, photograph underneath at the full container
 *               width. /commercial/.
 *   `contained` words left, photograph right, both stopping at the container and the picture
 *               rounded on all four corners. /residential/.
 *
 * WHY /residential/ IS CONTAINED. Split is the front door's treatment and this page is a front door,
 * so it started there — but split's picture is a full half-VIEWPORT running off the edge with a
 * 40rem floor under it (see `Split`), and against a 2:3 portrait that is a very tall band before the
 * page has said anything. Contained caps it at 30rem, and the four rounded corners are what stop the
 * shorter picture reading as a split hero that failed to bleed.
 *
 * It is deliberately the same shape as `ServiceHero` and NOT the same component: this one carries
 * the hero's own words — rating, standfirst, assurance strip — and that one carries a service's
 * chips and its price button. Same bones, different content, which is the line this file draws
 * everywhere else too.
 *
 * WHY /commercial/ IS STACKED rather than split. Split puts the words in a half-width column, and
 * the commercial hero's job is to be read by somebody who does not yet know this service exists —
 * "pet waste stations, installed & serviced for you" is a sentence that has to land whole. Centred
 * across the full measure it reads as an announcement; in a half column beside a photograph it
 * reads as the top of an article. The photograph then arrives as the evidence rather than as the
 * thing competing with the claim.
 *
 * The picture in `stacked` is NOT cropped — no fixed height, no `object-cover`. It renders at its
 * own aspect at the container width, because the shot is two people standing on grounds and every
 * landscape crop of it takes either their heads or the scooper. See `commercialHero` in
 * content/assets.ts.
 *
 * Pass `crumbs` and the trail sits above everything, which is what lets an inner page use this hero
 * instead of `PageShell` — the homepage passes none, because a one-item trail is noise. It stays
 * HARD LEFT even when the hero is centred: a breadcrumb is where you are, not part of the title
 * block, and centring it makes it read as a kicker. Same rule `PricingBand` follows.
 */
export function Hero({
  heading,
  subheading,
  image,
  crumbs,
  rating,
  assurances,
  cta = primaryCta,
  layout = "split",
  tone = "canvas",
  showPhone = true,
}: {
  heading: string;
  subheading?: string;
  /** A key into the image registry. See content/assets.ts. */
  image?: AssetKey;
  /** The breadcrumb trail, when this hero is standing in for `PageShell` on an inner page. */
  crumbs?: Crumb[];
  rating?: { stars: number; label: string };
  /** The reassurance strip under the buttons — "No contracts", "Cancel anytime". */
  assurances?: readonly string[];
  /**
   * Override ONLY where the page's next step genuinely is not the residential quote form —
   * /commercial/, where the visitor is a property manager and the form asks how many dogs they
   * own. Everywhere else this stays `primaryCta`: one site, one primary action.
   */
  cta?: { label: string; href: string };
  /**
   * See the note above. `stacked` centres the words and puts the picture underneath; `contained`
   * keeps the split's two columns but stops the picture at the container and rounds it.
   */
  layout?: "split" | "stacked" | "contained";
  /**
   * The band. `canvas` is the house off-white every other page opens on; `raised` is plain white,
   * for a stacked hero whose photograph is the only thing carrying colour — on canvas the picture's
   * rounded corners sit on a tone barely different from their own and the frame goes soft.
   */
  tone?: "canvas" | "raised";
  showPhone?: boolean;
}) {
  const stacked = layout === "stacked";

  /** Everything except the trail and the picture. Identical in both arrangements. */
  const words = (
    <Stack gap={6} align={stacked ? "center" : undefined}>
      {rating && <Rating stars={rating.stars} label={rating.label} />}
      {/* `display` is the oversized treatment, and a front door is the only thing that gets it. */}
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
      <Stack gap={4} align={stacked ? "center" : undefined}>
        <Cluster gap={4} justify={stacked ? "center" : "start"}>
          <Button href={cta.href} size="lg">
            {cta.label}
          </Button>
          {showPhone && (
            <Button
              href={`tel:${site.phone.e164}`}
              variant="secondary"
              size="lg"
              /* The visible words are not the whole story — a screen reader gets the number too.
                 It must START with the visible label: WCAG 2.5.3 (Label in Name) requires the
                 accessible name to CONTAIN the visible text, so that someone driving the page by
                 voice can say "click call/text us now" and be understood. A bare
                 `Call (610) 410-0506` replaced the visible words instead of extending them, and
                 broke exactly that. */
              ariaLabel={`${phoneCtaLabel} — ${site.phone.display}`}
            >
              {phoneCtaLabel}
            </Button>
          )}
        </Cluster>
        {assurances && <InlineList items={assurances} />}
      </Stack>
    </Stack>
  );

  /* The trail above everything, as it is in the structured data. It is its own Stack child rather
     than part of `words` so that centring the words does not drag it onto the midline. */
  const body = (
    <Stack gap={6}>
      {crumbs && <Breadcrumbs crumbs={crumbs} />}
      {words}
    </Stack>
  );

  if (stacked) {
    return (
      // `hero`, not `hero-media`: the picture stops at the container here, so the band's bottom
      // padding is the air under a photograph rather than a strip of cream beside one.
      <Section tone={tone} spacing="hero">
        <Container>
          <Stack gap={10}>
            {body}
            {image && (
              <Image
                asset={image}
                // The page's LCP element. Exactly one image per page gets this.
                priority
                // Capped at the container, which is 75rem minus its own gutters.
                sizes="(min-width: 75rem) 71rem, 100vw"
                // `h-auto` is what keeps the picture uncropped — see the note above. `block` or the
                // img keeps its inline descender space and leaves a hairline of band under it.
                className="block h-auto w-full rounded-lg"
              />
            )}
          </Stack>
        </Container>
      </Section>
    );
  }

  if (layout === "contained") {
    return (
      // `hero`, not `hero-media`: the picture stops at the container on this arrangement too, so the
      // band's padding is air under a photograph rather than cream beside one.
      <Section tone={tone} spacing="hero">
        <Container>
          <div
            className={cx(
              "grid items-center gap-10",
              image && "lg:grid-cols-2 lg:gap-16",
            )}
          >
            {body}
            {image && (
              <Image
                asset={image}
                // The page's LCP element. Exactly one image per page gets this.
                priority
                // Half of a CONTAINER, not half of the viewport: the container tops out at 75rem
                // and the columns are 4rem apart, so this never renders wider than ~34rem.
                sizes="(min-width: 75rem) 34rem, (min-width: 64rem) 46vw, 100vw"
                // A FIXED height at every step, unlike `split` — which hands the picture the row's
                // height and puts a 40rem floor under it. That is the whole point of this
                // arrangement: a portrait photograph cannot make the band tall.
                className="h-80 w-full rounded-lg object-cover sm:h-96 lg:h-120"
              />
            )}
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section tone={tone} spacing={image ? "hero-media" : "hero"}>
      {image ? (
        <Split
          media={
            <Image
              asset={image}
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

// ── Service hero ─────────────────────────────────────────────────────────────

/**
 * The top of a service page. Same bones as the homepage hero — words left, photograph right — with
 * one deliberate difference: the picture STOPS AT THE CONTAINER. `Hero layout="split"` runs its
 * image off the right edge of the screen, which is the treatment the front door gets and only the
 * front door; a service page that did the same would make every one of the four look like a second
 * homepage.
 *
 * So this is a plain two-column grid inside a `Container`, not `Split`.
 *
 * The chips above the h1 are the service's own qualities, not the site's assurances — three or four
 * words each, read before the heading is. They are `Chip`, the outlined pill, which is the same
 * shape the tab toggles in the band below take: a visitor sees the vocabulary once as a label and
 * again as a control, which is what makes the second one obviously clickable.
 *
 * Two buttons, price first. On a service page the live question is what it costs — someone reading
 * about the work has already decided they want it done — so the pricing link takes the filled
 * treatment and the quote form follows it. That is the reverse of the homepage, on purpose.
 *
 * With no `image` the words simply take the full width. A stock photo would be worse than the
 * single column; see the note on `Service.image`.
 */
export function ServiceHero({
  heading,
  summary,
  tags,
  image,
  crumbs,
  pricingLabel,
}: {
  heading: string;
  summary: string;
  /** The outlined chips above the h1 — "Weekly or bi-weekly", "No contracts". */
  tags?: readonly string[];
  image?: AssetKey;
  crumbs: Crumb[];
  /** Words on the pricing button. The quote button is the site-wide `primaryCta`. */
  pricingLabel: string;
}) {
  return (
    // White, not the cream `canvas` the homepage hero uses: this page runs white from the header to
    // the closing band, and the two bands inside it are separated by a rule rather than by a tone
    // change. The photograph and the chips are what give the band its colour.
    <Section tone="raised" spacing="hero">
      <Container>
        <div
          className={cx(
            "grid items-center gap-10",
            image && "lg:grid-cols-2 lg:gap-16",
          )}
        >
          <Stack gap={6}>
            {/* Above everything, as it is in the structured data: the trail is where you are. */}
            <Breadcrumbs crumbs={crumbs} />

            <Stack gap={4}>
              {tags && tags.length > 0 && (
                <Cluster gap={2}>
                  {tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </Cluster>
              )}
              <Heading level={1}>{heading}</Heading>
              <Text size="lead" tone="muted" measure>
                {summary}
              </Text>
            </Stack>

            <Cluster gap={4}>
              <Button href={routes.pricing()} size="lg">
                {pricingLabel}
              </Button>
              <Button href={primaryCta.href} variant="secondary" size="lg">
                {primaryCta.label}
              </Button>
            </Cluster>
          </Stack>

          {image && (
            /* The page's LCP element, and the only image on it. Fixed height with `object-cover`
               rather than a natural aspect: the four service photographs are three different
               shapes, and letting each set its own height would make one page's hero half again
               as tall as the next one's. */
            <Image
              asset={image}
              priority
              sizes="(min-width: 64rem) 50vw, 100vw"
              className="h-80 w-full rounded-lg object-cover sm:h-112 lg:h-140"
            />
          )}
        </div>
      </Container>
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
  {
    fill: "bg-accent-peach text-accent-peach-ink",
    edge: "border-accent-peach",
  },
  {
    fill: "bg-accent-lilac text-accent-lilac-ink",
    edge: "border-accent-lilac",
  },
  {
    fill: "bg-accent-lemon text-accent-lemon-ink",
    edge: "border-accent-lemon",
  },
] as const;

/** The cycle. The modulo cannot miss, but a number index is still `| undefined` to the compiler. */
function medallion(index: number) {
  return (
    medallionAccents[index % medallionAccents.length] ?? medallionAccents[0]
  );
}

/**
 * Content names an icon by key; this is the only place that turns one into a picture. Typed
 * against `PointIcon`, so adding a key to that union without a glyph here fails the build.
 *
 * `flexible` and `reachable` are the same drawing on purpose — "no contracts, reach a person by
 * text" and "text or call us anytime" are the same promise told from two sides, and they never
 * appear in the same band.
 */
const pointIcons: Record<PointIcon, typeof BadgeCheck> = {
  guarantee: BadgeCheck,
  safety: Dog,
  local: MapPin,
  flexible: MessageCircleHeart,
  reachable: MessageCircleHeart,
  insured: ShieldCheck,
  // A waste station IS a post with a dispenser on it, which is the whole reason this glyph is a
  // signpost rather than a trash can: the trash can is one part of what we install, and drawing the
  // part makes "Station Installation" read as "we bring you a bin".
  stations: Signpost,
  // The heart is not decoration. `schedule` sits next to `reachable` and `flexible` in the same
  // grids, and a bare calendar beside two hearted glyphs reads as the one item on the page that
  // came from a different set.
  schedule: CalendarHeart,
  updates: BellRing,
  // The bin, and here it IS the whole point: `stations` avoids a trash can because that band sells
  // the post rather than the bin, and this one sells what we carry off the property.
  disposal: Trash2,
};

/**
 * A glyph in its pastel medallion — the circle that appears in "why us", "how it works" and the
 * guarantee grid. `index` picks the hue off the cycle above, so the colour is a property of where
 * the item sits rather than of what it says.
 *
 * Always decoration: the title beside it carries the meaning, and reading the icon out loud would
 * say the same thing twice, worse.
 */
function Medallion({ icon, index }: { icon: PointIcon; index: number }) {
  const Icon = pointIcons[icon];
  return (
    <span
      aria-hidden="true"
      className={cx(
        // `shrink-0` or the circle squashes into an oval as the text beside it wraps.
        "flex size-11 shrink-0 items-center justify-center rounded-pill",
        medallion(index).fill,
      )}
    >
      <Icon size={22} />
    </span>
  );
}

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
          {/* `sizes` is capped at 34rem rather than left at 50vw: this column is half of a
              CONTAINER, not half of the viewport. The container tops out at 75rem and the columns
              are 4rem apart, so the picture never renders wider than ~34rem however wide the
              screen gets. Claiming 50vw made the browser fetch the 828w file for a 536px slot and
              discard two thirds of the bytes. */}
          <Image
            asset={image}
            sizes="(min-width: 75rem) 34rem, (min-width: 64rem) 46vw, 100vw"
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
              {points.map((point, index) => (
                <li key={point.title} className="flex items-start gap-4">
                  <Medallion icon={point.icon} index={index} />
                  <div>
                    <Heading level={3} size="h5">
                      {point.title}
                    </Heading>
                    <Text tone="muted" size="small">
                      {point.detail}
                    </Text>
                  </div>
                </li>
              ))}
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

// ── Story band ───────────────────────────────────────────────────────────────

/**
 * A run of prose beside a photograph. It carries the origin story on /about/.
 *
 * DELIBERATELY NOT `WhyUs`, which is the same two-column shape. That band is an ARGUMENT — four
 * claims with a medallion each and a button out of it — and this one is somebody talking. Feed the
 * story through `WhyUs` and it comes out as four selling points; the whole value of an about page
 * is that it is the one place on the site not making a pitch.
 *
 * The picture sits on the RIGHT here and on the left in `WhyUs`, so the two never read as the same
 * band with different words. On a phone the words come first and the photograph closes the story —
 * the reverse of `WhyUs`, where the faces have to earn the claims that follow them.
 *
 * `note` is the aside at the end — the line that is charming rather than persuasive. It gets the
 * callout treatment so it reads as a margin note rather than as a fourth paragraph.
 */
export function StoryBand({
  eyebrow,
  heading,
  paragraphs,
  note,
  image,
  tone = "raised",
}: {
  eyebrow?: string;
  heading: string;
  /** One string per paragraph. Prose, not bullets — see the note above. */
  paragraphs: readonly string[];
  note?: string;
  image: AssetKey;
  tone?: "canvas" | "raised" | "alt";
}) {
  return (
    <Section tone={tone}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Stack gap={6}>
            <Stack gap={4}>
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              <Heading level={2} align="center-mobile">
                {heading}
              </Heading>
            </Stack>

            <Stack gap={4}>
              {paragraphs.map((paragraph) => (
                <Text key={paragraph} tone="muted">
                  {paragraph}
                </Text>
              ))}
            </Stack>

            {note && (
              <Callout tone="info">
                {/* The heart is decoration — the sentence beside it is the whole point, and
                    reading a glyph out loud before it would only get in the way. */}
                <div className="flex items-start gap-3">
                  <Heart
                    size={20}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-brand"
                  />
                  <Text size="small" weight="semibold">
                    {note}
                  </Text>
                </div>
              </Callout>
            )}
          </Stack>

          {/* Cropped to a band and never shown whole, exactly as `WhyUs` is: a 2:3 frame at full
              height is most of a phone screen before a word of the story appears. The default
              centre anchor is where the faces and the dog are. */}
          {/* `sizes` is capped at 34rem rather than left at 50vw: this column is half of a
              CONTAINER, not half of the viewport. The container tops out at 75rem and the columns
              are 4rem apart, so the picture never renders wider than ~34rem however wide the
              screen gets. Claiming 50vw made the browser fetch the 828w file for a 536px slot and
              discard two thirds of the bytes. */}
          <Image
            asset={image}
            sizes="(min-width: 75rem) 34rem, (min-width: 64rem) 46vw, 100vw"
            className="h-96 w-full rounded-lg object-cover sm:h-120 lg:h-160"
          />
        </div>
      </Container>
    </Section>
  );
}

// ── Trust bar ────────────────────────────────────────────────────────────────

/**
 * The thin strip directly under a hero: the two or three facts a visitor wants confirmed before
 * they will read anything else. On /commercial/ that is the star row, where we are, and the terms.
 *
 * Deliberately NOT cards, and not a `FeatureGrid`. A card is something you read; this is a caption
 * on the hero above it, and three cards here would look like the page's first real section rather
 * than the last line of its first one.
 *
 * `alt` — the deeper cream, and the yellowest surface in the palette that still carries ink at AA.
 * It is the band that gives a white hero its bottom edge: two light bands in a row need a tone
 * change between them or the page opens as one undifferentiated screen, and a rule there would be
 * a line drawn under a hero rather than a strip sitting below it.
 *
 * The rating is the same `Rating` row the homepage hero and the review cards use, so the claim here
 * and the evidence further down the page are visibly the same thing. Visible trust only: no
 * `aggregateRating` markup ever comes out of it. See content/reviews.ts.
 */
export function TrustBar({
  rating,
  items,
}: {
  rating?: { stars: number; label: string };
  /** Two or three at most. This is a strip, and a fourth item wraps it into a paragraph. */
  items: readonly { icon: PointIcon; label: string }[];
}) {
  return (
    <Section tone="alt" spacing="sm">
      <Container>
        {/* Stacked on a phone, one row from `sm`. The dividers are a left border that only exists
            once the row does — a hairline above a stacked item reads as a table, not a separator.
            `gap-0` in the row because the air between items is their own `px-8`, which is what puts
            each rule exactly halfway between its neighbours. */}
        <ul className="flex list-none flex-col items-center gap-5 pl-0 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0">
          {rating && (
            <li className="sm:px-8">
              <Rating stars={rating.stars} label={rating.label} />
            </li>
          )}
          {items.map((item, index) => {
            const Icon = pointIcons[item.icon];
            return (
              <li
                key={item.label}
                className={cx(
                  "flex items-center gap-2 sm:px-8",
                  (rating !== undefined || index > 0) &&
                    "sm:border-l sm:border-line",
                )}
              >
                {/* Decoration: the words beside it say the same thing, better. */}
                <Icon size={20} aria-hidden="true" className="text-brand" />
                <Text as="span" size="small" weight="semibold">
                  {item.label}
                </Text>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

// ── Audience band ────────────────────────────────────────────────────────────

/**
 * Who the page is for, as a wrapped row of tags. On /commercial/ it is the eight kinds of property
 * a manager might be arriving from, and the band exists for one reason: whichever one they are,
 * they should find their own word for it printed on the page.
 *
 * Tags rather than cards, and that is the point. Eight cards would be the largest band on the page
 * and would say these are eight different services; they are eight names for the same one. A row of
 * pills reads as a list you scan and stop at.
 *
 * They are NOT links and must not become any — there are no pages behind them, and eight clickable
 * tags promise eight routes that do not exist. Same rule as the zip chips; see `ServiceZips`.
 *
 * The fills cycle the four accent pairs the medallions use, so a tag's colour is a property of
 * where it sits rather than of what it says. Each pair is a fill and the only ink allowed on it,
 * checked at 4.5:1 in lib/theme.test.ts — never mix the halves.
 */
export function AudienceBand({
  eyebrow,
  heading,
  intro,
  audiences,
}: {
  /** The small uppercase kicker — "Who we serve". */
  eyebrow?: string;
  heading: string;
  intro?: string;
  audiences: readonly string[];
}) {
  return (
    <Section tone="canvas">
      <Container>
        <Stack gap={8} align="center">
          <Stack gap={4} align="center">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {/* Centred at every width, not the house `center-mobile`: the whole band sits on the
                midline, and a title that snapped left at `md` would be the only thing that did.
                Same exception `HowItWorks` and `PricingBand` take. */}
            <Heading level={2} align="center">
              {heading}
            </Heading>
            {intro && (
              <Text tone="muted" measure>
                {intro}
              </Text>
            )}
          </Stack>

          {/* A real list — this is a set of parallel items, and "list, eight items" up front is
              the summary a sighted reader gets from the shape of the row. `w-full` because the
              Stack above centres its children by shrinking them, and a shrunk row wraps early. */}
          <ul className="flex w-full list-none flex-wrap justify-center gap-3 pl-0">
            {audiences.map((audience, index) => (
              <li
                key={audience}
                className={cx(
                  "rounded-pill px-5 py-2 text-small font-semibold",
                  medallion(index).fill,
                )}
              >
                {audience}
              </li>
            ))}
          </ul>
        </Stack>
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

// ── Next steps ───────────────────────────────────────────────────────────────

/**
 * `HowItWorks` turned on its side: the same numbered medallions and pastel rims, stacked as a
 * column instead of spread as a row.
 *
 * It is a separate component rather than a prop on that band because the two are shaped by where
 * they sit, not by taste. `HowItWorks` is a full-width band of three equals and centres everything.
 * This one lives in a COLUMN beside a form — three short items in a 2/5 column would be three
 * squashed cards — so the numeral moves to the left of the words and each step becomes one line
 * you read down. The vocabulary is deliberately identical, so a visitor who has seen the homepage
 * recognises these as the same three-step promise.
 *
 * A real `<ol>` for the same reason: the order is the meaning, so the drawn numerals are decoration
 * and hidden — otherwise a screen reader says "one" twice.
 */
export function NextSteps({
  heading,
  steps,
}: {
  heading: string;
  steps: readonly { title: string; detail: string }[];
}) {
  return (
    <Stack gap={5}>
      <Heading level={2} size="h4" align="center-mobile">
        {heading}
      </Heading>
      <ol className="flex list-none flex-col gap-4 pl-0">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={cx(
              // White fill and a pastel rim, exactly as on the homepage's step cards — the colour
              // is worn on the border because these pastels cannot carry muted body text at 4.5:1.
              // See the note on `medallionAccents`.
              "flex items-start gap-4 rounded-lg border-2 bg-surface-raised p-5 shadow-sm",
              medallion(index).edge,
            )}
          >
            <span
              aria-hidden="true"
              className={cx(
                "flex size-10 shrink-0 items-center justify-center rounded-pill font-display text-h5 font-bold",
                medallion(index).fill,
              )}
            >
              {index + 1}
            </span>
            <Stack gap={2}>
              <Heading level={3} size="h6">
                {step.title}
              </Heading>
              <Text size="small" tone="muted">
                {step.detail}
              </Text>
            </Stack>
          </li>
        ))}
      </ol>
    </Stack>
  );
}

// ── Service details ──────────────────────────────────────────────────────────

/**
 * A tab's copy: paragraphs, not bullets.
 *
 * The tabs used to be ticked lists, and a list is the wrong shape for this. "What's included" as
 * five ticks is a spec sheet — five fragments that each answer half a question and read as though
 * they were written to be skimmed past. In sentences the same facts explain themselves, and the
 * page has room for it now that the tab is carrying one thing at a time.
 */
function Paragraphs({ items }: { items: readonly string[] }) {
  return (
    <Stack gap={4}>
      {items.map((paragraph) => (
        <Text key={paragraph} tone="muted" measure>
          {paragraph}
        </Text>
      ))}
    </Stack>
  );
}

/**
 * The second and last band of a service page: everything the page has to say about the service, in
 * one place, behind three chip toggles — and the quote form beside it.
 *
 * WHY TABS. The old template answered "what is this service" across five stacked bands, four of
 * which were word-for-word identical on all four services. A visitor scrolled past the guarantee,
 * the three steps, the price grid and the coverage list to reach two paragraphs that actually
 * differed. Toggles put the differing copy first and let the reader choose which part of it they
 * want, and the page ends one screen later instead of six.
 *
 * The three are fixed — About, Includes, Benefits — because they are the three questions every
 * service gets asked, and a page whose tab row changed service to service would stop reading as one
 * template. A tab with nothing behind it yet says so; see `pending`.
 *
 * The form is the whole conversion path on this page now, which is why it sits BESIDE the copy
 * rather than under it: on a laptop it is visible the moment the band is, and someone convinced by
 * the first tab never has to go looking. It is the short form — five fields — and the compact
 * variant at that. See QuickLeadForm for what it deliberately does not ask.
 */
export function ServiceDetails({
  labels,
  body,
  includes,
  benefits,
  pending,
  form,
}: {
  /** Tab words, plus the tablist's own name for screen readers. */
  labels: {
    tablist: string;
    about: string;
    includes: string;
    benefits: string;
  };
  /** The authored body — the About tab. Empty until someone writes it, which is also the page's publish gate. */
  body: ContentBlock[];
  includes?: readonly string[];
  benefits?: readonly string[];
  /** Stand-in for a tab whose content the client has not supplied yet. */
  pending: string;
  form: { heading: string; intro: string };
}) {
  /** A tab with no content behind it. One muted line — never an invented paragraph. */
  const note = (
    <Text tone="muted" measure>
      {pending}
    </Text>
  );

  const tabs: ServiceTab[] = [
    {
      id: "about",
      label: labels.about,
      panel: body.length > 0 ? <AuthoredBlocks blocks={body} /> : note,
    },
    {
      id: "includes",
      label: labels.includes,
      panel:
        includes && includes.length > 0 ? (
          <Paragraphs items={includes} />
        ) : (
          note
        ),
    },
    {
      id: "benefits",
      label: labels.benefits,
      panel:
        benefits && benefits.length > 0 ? (
          <Paragraphs items={benefits} />
        ) : (
          note
        ),
    },
  ];

  return (
    // White, same as the hero above it — the two are separated by a rule drawn to the container
    // width rather than by a change of colour. See `SectionDivider`.
    <Section tone="raised">
      <Container>
        {/* Three fifths to the copy, two to the form. The form is the only conversion path on this
            page, so it is deliberately wider than the third of the row a sidebar would take — at
            that width it is a panel someone fills in, not a thing parked beside the text.

            The air between the two columns is the `gap` PLUS `pr-8` on the copy: about 6rem, and
            deliberately more than a grid gap would give. A paragraph that runs right up to the edge
            of the card beside it reads as one wide thing with a box in it — the gutter is what
            makes the copy and the form two separate offers on the same row. It also pulls the line
            length down to roughly 70 characters, which is the measure the rest of the site uses. */}
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3 lg:pr-8">
            <ServiceTabs label={labels.tablist} tabs={tabs} />
          </div>

          <div className="lg:col-span-2">
            <LeadFormCard heading={form.heading} intro={form.intro} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The panel a form sits in: cream card, optional mark, title, one line, then the fields.
 *
 * THE SHELL IS SHARED AND THE FORM IS THE CHILD. Every form on the site that is not the whole page
 * lives in this object — the short quote form on the service pages and /locations/, the six-field
 * one on /contact/ — and they must be the same object, because a visitor who sees two differently
 * shaped forms on two pages of one site is looking at two different companies. What differs is the
 * fields inside it, so that is the only thing a caller passes.
 *
 * `tone="canvas"`, not `default`: a white card on a white band is an invisible card. Every band
 * that carries this is `raised`.
 */
export function FormCard({
  heading,
  intro,
  mark = true,
  children,
}: {
  heading: string;
  intro: string;
  /**
   * The logo mark above the title. On by default, and dropped on /contact/ — there the card is the
   * page's main object rather than a panel beside an argument, and a badge on top of the one thing
   * the page is for reads as branding on a form instead of as the form itself.
   */
  mark?: boolean;
  /** The form. `pill` variant, always — see the note on `FieldVariant`. */
  children: ReactNode;
}) {
  return (
    <Card tone="canvas">
      {/* Centred throughout, and the mark at the top is why: the logo is a symmetrical object, and
          left-hanging the words under a centred mark would read as two blocks that had come apart.
          The form's own controls are centred to match — see the `pill` variant in Field.

          It stays centred with the mark off, because the controls below it still are. */}
      <Stack gap={6} align="center">
        <Stack gap={4} align="center">
          {/* The mark alone, not the full lockup: the wordmark is already in the header two
              hundred pixels above, and the picture is what makes this card read as ours rather
              than as an embedded third-party form. */}
          {mark && <Image asset="logoMark" sizes="80px" className="h-20 w-auto" />}
          {/* h2 — on every page that uses this, the only thing above it is the page h1. */}
          <Heading level={2} size="h3" align="center">
            {heading}
          </Heading>
          <Text tone="muted">{intro}</Text>
        </Stack>
        {/* `w-full` — the Stack centres its children by shrinking them, and a form that
            shrink-wraps its fields is a column of half-width boxes. */}
        <div className="w-full">{children}</div>
      </Stack>
    </Card>
  );
}

/**
 * The SHORT quote form in that panel — the conversion path on the service pages and /locations/.
 *
 * It exists so those two callers cannot drift apart on which form they carry: the shell is shared
 * with /contact/, the five compact fields are this component's own decision.
 */
export function LeadFormCard({
  heading,
  intro,
}: {
  heading: string;
  intro: string;
}) {
  return (
    <FormCard heading={heading} intro={intro}>
      <QuickLeadForm compact variant="pill" />
    </FormCard>
  );
}

// ── Feature grid ─────────────────────────────────────────────────────────────

/**
 * A row of short parallel claims on cards. Two bands are built on it, and the only difference
 * between them is data: /about/ runs the three value props bare, /pricing/ runs the three
 * guarantees with a medallion on each. Never fork this for a third look.
 *
 * `intro` is the line under the title — a band whose heading names a promise ("The Blue's Poop
 * Scoop Guarantee") needs one sentence saying what the promise is before the three cards break it
 * into parts. Omit it and the title sits straight on the grid, as it does on /about/.
 *
 * The cards are a real `<ul>`: three parallel claims are a list, and a screen reader saying "three
 * items" up front is the summary a sighted reader gets from the row itself.
 */
export function FeatureGrid({
  eyebrow,
  heading,
  intro,
  features,
  tone = "alt",
  align = "start",
}: {
  /**
   * The small uppercase kicker over the title — "Our promise". It is a label FOR the heading, not
   * a heading of its own, which is why it is not in the outline. See `Eyebrow`.
   */
  eyebrow?: string;
  heading: string;
  intro?: string;
  features: readonly Feature[];
  /**
   * The band's surface. `raised` is plain white, and it flips the cards to cream — a white card on
   * a white band is an invisible card. See `Card`.
   *
   * `canvas` is the house off-white, the same surface every page's first band takes. Use it where
   * the band should read as a continuation of the page rather than as an alternate stripe: on
   * /about/ the promises sit between two white bands and the deeper `alt` cream made them the
   * loudest thing on a page whose job is to be quiet. The cards stay white on it, as on `alt`.
   */
  tone?: "alt" | "canvas" | "raised";
  /**
   * `center` puts the whole band on the midline, cards included. Use it where the band is a set of
   * equals with a medallion each; `start` is the plain left-hung treatment /about/ takes.
   */
  align?: "start" | "center";
}) {
  const centred = align === "center";

  return (
    <Section tone={tone}>
      <Container>
        <Stack gap={8} align={centred ? "center" : undefined}>
          <Stack gap={4} align={centred ? "center" : undefined}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {/* Centred at every width when the band is, not the house `center-mobile`: a title
                that snapped left at `md` would be the only thing here off the midline. */}
            <Heading level={2} align={centred ? "center" : "center-mobile"}>
              {heading}
            </Heading>
            {intro ? (
              centred ? (
                <Text tone="muted" measure>
                  {intro}
                </Text>
              ) : (
                /* Centred with the title on a phone and left-hung from `md`, matching it. */
                <div className="text-center md:text-left">
                  <Text tone="muted" measure>
                    {intro}
                  </Text>
                </div>
              )
            ) : null}
          </Stack>
          {/* The grid classes are on the `<ul>` itself rather than on a `Grid` inside it: an
              `<li>` has to be a direct child of its list, and wrapping the items in Grid's div
              would break that. Same reason `PricingBand` and `HowItWorks` hand-roll theirs.

              `w-full` because the Stack above centres its children by shrinking them. */}
          <ul className="grid w-full list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <li key={feature.title}>
                {/* On white the card carries the cream the page's other bands use; on the deeper
                    cream band it is the usual white. Either way the card is the lighter of the
                    two surfaces, which is how everything on this site lifts. */}
                <Card tone={tone === "raised" ? "canvas" : "default"}>
                  {/* The medallion gets its own step of the rhythm — at `gap-2` the icon reads as
                      part of the title's line rather than as the card's mark. Centred, the circle
                      sits on the midline above the words rather than beside them. */}
                  <Stack gap={4} align={centred ? "center" : undefined}>
                    {feature.icon && (
                      <Medallion icon={feature.icon} index={index} />
                    )}
                    <Stack gap={2}>
                      <Heading level={3}>{feature.title}</Heading>
                      <Text tone="muted">{feature.detail}</Text>
                    </Stack>
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

// ── Team band ────────────────────────────────────────────────────────────────

/**
 * The crew, one card each: a face, a name, the job, and what they actually do.
 *
 * The dog gets a card. That is not a joke at the expense of the band — the business is named after
 * him, the reviews mention him, and a visitor who scrolls past two owners and finds Blue listed as
 * Fearless Leader has just learned more about who they would be letting into their yard than any
 * paragraph could tell them.
 *
 * Centred, cards included: three people with a portrait each are a row of equals, and a left-hung
 * name under a centred photograph looks like a caption that slipped. Same call `FeatureGrid` makes
 * at `align="center"`.
 *
 * The photographs are anchored TOP rather than centre. Every portrait on file is a tall frame with
 * the face in the upper third, and the centre of one of those is a torso. See the crew block in
 * content/assets.ts.
 */
export function TeamBand({
  eyebrow,
  heading,
  intro,
  members,
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  members: readonly TeamMember[];
}) {
  return (
    // White, so the cards can carry the cream — a cream card on the cream band is invisible.
    <Section tone="raised">
      <Container>
        <Stack gap={8} align="center">
          <Stack gap={4} align="center">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {/* Centred at every width, not the house `center-mobile`: the whole band sits on the
                midline, and a title that snapped left at `md` would be the only thing that did. */}
            <Heading level={2} align="center">
              {heading}
            </Heading>
            {intro && (
              <Text tone="muted" measure>
                {intro}
              </Text>
            )}
          </Stack>

          {/* A real list — three parallel people. `w-full` because the Stack above centres its
              children by shrinking them. */}
          <ul className="grid w-full list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <li key={member.name}>
                <Card tone="canvas">
                  <Stack gap={5} align="center">
                    <Image
                      asset={member.image}
                      sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 90vw"
                      className="h-72 w-full rounded-md object-cover object-top"
                    />
                    <Stack gap={3} align="center">
                      <Stack gap={2} align="center">
                        <Heading level={3}>{member.name}</Heading>
                        {/* A badge rather than an eyebrow: the role is a label ON the person, the
                            way "Most popular" is a label on a price card. */}
                        <Badge tone="brand">{member.role}</Badge>
                      </Stack>
                      <Text size="small" tone="muted">
                        {member.bio}
                      </Text>
                    </Stack>
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

// ── Stat band ────────────────────────────────────────────────────────────────

/**
 * Four figures on the navy, and it is the only band on the site that is nothing but numbers.
 *
 * It works because the numbers are short and one of them is a joke — 5, 100%, 0 and 1 read in a
 * single glance, and "1 bestest boy" at the end is what stops the strip reading as a corporate
 * stat block. Give it a figure that needs a sentence to explain it and the band stops working.
 *
 * A real `<dl>`: each label is the term and its figure is the value, so a screen reader says
 * "Google rating, 5 stars" rather than reading four bare numerals. The column is REVERSED in CSS so
 * the figure sits on top visually while the markup keeps term-before-value order.
 *
 * Amber on navy is 5.49:1 — the one place on the site amber is used as INK rather than as a fill,
 * and it clears AA at that pairing. Nothing smaller than these figures may take it. See the palette
 * note at the top of theme.css.
 */
export function StatBand({ stats }: { stats: readonly Stat[] }) {
  return (
    <Section tone="dark" spacing="sm">
      <Container>
        {/* Two columns on a phone rather than four in a row: at four, "Locally owned & operated"
            wraps to three lines under a figure and the strip becomes a paragraph. */}
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse items-center gap-1 text-center"
            >
              <Text as="dt" size="small" tone="inverse">
                {stat.label}
              </Text>
              {/* `leading-none` because these are numerals with no descenders, and h1's line box
                  would otherwise leave a gap under the figure wider than the one above the label. */}
              <dd className="font-display text-h1 font-bold leading-none text-amber">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
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
          <Heading level={2} align="center-mobile">
            {heading}
          </Heading>
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
                    <th
                      scope="row"
                      className="py-4 pr-4 font-semibold text-ink"
                    >
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
  level = 2,
  crumbs,
  spacing = "md",
}: {
  heading: string;
  /** The dotted reassurance strip under the title — the same treatment the hero uses. */
  assurances: readonly string[];
  /** The guarantee, restated in money terms, under the cards. */
  promise: string;
  cta: string;
  /**
   * `1` on /pricing/, where this band is the top of the page and its title IS the page's title.
   * Everywhere else it is a section inside a page that already has an h1, and must stay `2`.
   */
  level?: 1 | 2;
  /**
   * The trail, when this band is standing in for `PageShell` at the top of a page. Same reason
   * `Hero` takes one: a page whose first words are a section title still has to say where it is.
   */
  crumbs?: Crumb[];
  /**
   * `sm` where the band follows a photograph that has already opened the page — the picture is the
   * air above the title, and a full `md` on top of it reads as a gap. `md` everywhere else.
   */
  spacing?: "sm" | "md";
}) {
  return (
    <Section tone="canvas" spacing={spacing}>
      <Container>
        {/* The trail hangs LEFT while the band it introduces is centred, and the two are separate
            stacks for exactly that reason. A centred breadcrumb reads as part of the title block —
            it is not; it is where you are, and it belongs on the page's own left edge, the same
            line it sits on for every other route. */}
        <Stack gap={6}>
          {crumbs && <Breadcrumbs crumbs={crumbs} />}

          <Stack gap={10} align="center">
            <Stack gap={4} align="center">
              <Heading level={level} align="center">
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
                            card on purpose: inside, a centred plan name on a narrow card runs
                            under it. Decoration — hidden from assistive tech, untouchable. */}
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
                        {/* DERIVED from the band's own level, never hardcoded. On /pricing/ this
                            band opens the page, so its title is the h1 and a fixed h3 here skipped
                            h2 entirely — the `heading-order` failure. Everywhere else the band is
                            an h2 section and these stay h3. `size` is unchanged either way: the
                            level is the outline, the size is the look, and only the outline moves. */}
                        <Heading level={level === 1 ? 2 : 3} size="h4">
                          {tier.name}
                        </Heading>
                        <Text size="small" tone="muted">
                          {tier.dogs}
                        </Text>
                      </div>

                      {/* A description list: each frequency is a term, its price is the value. The
                          unit rides both prices — these are monthly totals, not per visit, and
                          that is the one misread this band exists to prevent. */}
                      <dl className="flex flex-col gap-5">
                        <div>
                          <Text as="dt" size="small" tone="muted">
                            Weekly
                          </Text>
                          {/* The focal point of the whole band. `leading-none` because the numeral
                              has no descenders and h2's line box would otherwise leave a gap under
                              it wider than the one above the unit. */}
                          {/* The unit lives INSIDE the dd, exactly as the biweekly row below
                              already has it. A div inside a dl may only hold dt and dd elements —
                              a stray paragraph beside them makes the whole list invalid, and that
                              is what axe's `definition-list` rule fires on. Wrapping it keeps the
                              price and its unit as ONE value, which is what a screen reader
                              should read for the term: "$100 per month", not "$100" and then an
                              orphaned "per month". */}
                          <dd className="text-brand">
                            <span className="font-display text-h2 font-bold leading-none">
                              {`$${tier.weekly}`}
                            </span>
                            <Text size="small" tone="muted">
                              {pricing.unit}
                            </Text>
                          </dd>
                        </div>

                        {/* The quieter option, under a hairline and at body weight — available,
                            not advertised. */}
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
              {/* Points at /contact/, not the quote form: someone who has just read three prices
                  is choosing between them, and the next thing they want is a person, not a second
                  form asking the questions the prices already answered. */}
              <Cluster gap={4} justify="center">
                <Button href={routes.contact()} size="lg">
                  {cta}
                </Button>
              </Cluster>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}

// ── Photo band ───────────────────────────────────────────────────────────────

/**
 * One photograph, on the container line, with nothing on it. No overlaid heading, no gradient
 * scrim, no button — those turn a picture into a hero, and a page only gets one hero.
 *
 * On /pricing/ it is the first thing on the page: the van, the two owners and the phone number
 * painted on the door, before a single word. That is the "are these real people" question answered
 * without a sentence being spent on it, and it is why the page needs no introduction above it.
 *
 * IT IS CONTAINED, not full-bleed. Edge to edge, a photograph at the top of a page is a hero, and
 * this page's hero is the price. Inside `Container` with the same rounding a card takes, it reads
 * as the first item ON the page rather than as the page's own lid — it lines up with the h2 under
 * it and with every band below.
 *
 * `spacing="none"`, and it must stay a `<section>` for it: `main` is pulled up by the height of the
 * header and the first section gives that row back as a transparent border, so a bare `<img>` here
 * would slide under the nav bar. See base.css. The air below the picture belongs to the band that
 * follows.
 *
 * Fixed heights rather than the file's own 3:2 — at the page width a 3:2 is 500px tall and pushes
 * everything that matters off the screen. The crop is what keeps it a band. Whoever calls this
 * decides `priority`, since whether it is the page's LCP element depends on what sits above it.
 */
export function PhotoBand({
  image,
  priority = false,
  tone = "canvas",
}: {
  image: AssetKey;
  /** Set only when this is the largest thing above the fold. Exactly one image per page. */
  priority?: boolean;
  /**
   * The surface behind the picture. Only ever visible in the rounded corners and the gutters, so
   * the choice is not about colour — it is about which neighbour this band should disappear into.
   * `canvas` is right on /pricing/, where the photograph opens the page under a cream header; pass
   * the neighbour's own tone where the picture should read as sitting INSIDE the band above it
   * rather than as a strip of its own.
   */
  tone?: SectionTone;
}) {
  return (
    <Section tone={tone} spacing="none">
      <Container>
        <Image
          asset={image}
          priority={priority}
          // Capped at the container, which is 75rem minus its own gutters.
          sizes="(min-width: 75rem) 71rem, 100vw"
          // `block` or the img keeps its inline descender space and leaves a hairline of the band
          // showing under the picture.
          className="block h-56 w-full rounded-lg object-cover sm:h-72 lg:h-96"
        />
      </Container>
    </Section>
  );
}

// ── Serviced zip codes ───────────────────────────────────────────────────────

/**
 * The coverage answer as zip codes rather than town names.
 *
 * WHY ZIPS HERE, when the homepage band lists towns. A town name is what someone recognises, and
 * that is the right currency on a landing page. But this business's footprint is most of
 * Philadelphia — fifty-odd zips against ten town pages — so a list of towns on the pricing page
 * would understate the coverage badly, and a visitor in South Philly would read "Chestnut Hill,
 * Ardmore, Bryn Mawr…" and correctly conclude we do not come to them. The zip is also the exact
 * thing the quote form asks for two clicks later, so someone who finds theirs here already has
 * their answer typed.
 *
 * Chips, not links: a zip is not a page, and making these look clickable would promise fifty
 * routes that do not exist. The town names are still links, on the homepage band, where they point
 * at real pages.
 *
 * The note at the bottom is the whole reason this band is safe to publish. A list of fifty numbers
 * reads as a boundary, and the one visitor it fails is the one who scans it and does not find
 * their street — the line tells them to ask anyway, which is true and is the only thing worth
 * saying to them.
 */
export function ServiceZips({
  heading,
  intro,
  zips,
  note,
}: {
  heading: string;
  intro?: string;
  /** Every serviced zip, from content/cities.ts. Never typed out at a call site. */
  zips: readonly string[];
  /**
   * The "don't see yours?" escape hatch, split around the link rather than handed over as one
   * string with markup in it — no English is authored in this file, and no content file is allowed
   * to write a tag.
   */
  note: { before: string; link: string; after: string };
}) {
  return (
    // `canvas`, the pale cream — this band sits between two darker ones on /pricing/, and fifty
    // outlined chips need the quietest surface on the site behind them or the page reads as noise.
    <Section tone="canvas">
      <Container>
        <Stack gap={8} align="center">
          <Stack gap={3} align="center">
            <Heading level={2} align="center">
              {heading}
            </Heading>
            {intro && (
              <Text tone="muted" measure>
                {intro}
              </Text>
            )}
          </Stack>

          {/* A real list — fifty parallel facts are a list, and a screen reader announcing the
              count is the summary a sighted reader gets from the size of the block. `gap-2`, one
              step tighter than a chip row elsewhere: at this many items the air between them is
              what decides whether the band reads as a set or as confetti. */}
          <ul className="flex list-none flex-wrap justify-center gap-2 pl-0">
            {zips.map((zip) => (
              <li key={zip}>
                <Chip>{zip}</Chip>
              </li>
            ))}
          </ul>

          {/* The link is inside the sentence rather than being a button under it: this is a
              footnote for the minority the list just turned away, and a button would give it the
              weight of the band's main action. */}
          <Text tone="muted">
            {`${note.before} `}
            <Link href={routes.contact()}>{note.link}</Link>
            {note.after}
          </Text>
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
          <Heading level={2} align="center-mobile">
            {heading}
          </Heading>
          <Cluster gap={3}>
            {cities.map((city) => (
              <Button
                key={city.slug}
                href={routes.city(city.slug)}
                variant="ghost"
                size="sm"
              >
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
          alt={`Map of the area ${site.name} covers: a single shaded region over Philadelphia and the Main Line, drawn from the boundary of every zip code on the route.`}
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

/**
 * The coverage answer as NAMES, with the quote form beside it.
 *
 * It replaced a wall of fifty-six zip codes on /locations/. The zips are still the truth the lead
 * form is validated against, but they were the wrong thing to show a person: nobody recognises
 * their own zip faster than their own town, and fifty-six five-digit numbers in a block read as
 * noise rather than as reach. The zips still run on /pricing/, where the surrounding question is
 * "am I being quoted", and an exact list is the honest answer to it.
 *
 * WHY THE FORM IS IN THIS BAND. Finding your town here is the moment the objection dies, and it is
 * the only moment on this page when that is true. Sending someone to the bottom of the page to act
 * on it costs the conversion this band just earned. It is the same `LeadFormCard` the service
 * pages carry, so the two cannot drift apart.
 *
 * The form sits LEFT and the towns RIGHT — the reverse of the service pages. There the form is the
 * sidebar to the argument; here it is the thing being offered and the list is the qualifier, so it
 * takes the position the eye starts from. On a phone the two stack, form first.
 *
 * The chips are `Button`s, not `Chip`s, because every one of them is a link to a page that ranks.
 * A static chip would throw that away for identical pixels — `ghost` at `sm` is the same shape the
 * homepage's map band uses for exactly this.
 */
export function ServiceAreaTowns({
  heading,
  intro,
  places,
  note,
  form,
}: {
  heading: string;
  intro?: string;
  /** From `servicedPlaces` in content/cities.ts. Never typed out at a call site. */
  places: readonly { name: string; slug: string }[];
  /** The "don't see yours?" escape hatch, split around the link — see `ServiceZips`. */
  note: { before: string; link: string; after: string };
  form: { heading: string; intro: string };
}) {
  return (
    <Section tone="raised">
      <Container>
        {/* Two fifths to the form, three to the list — the same 2:3 the service pages use, mirrored.
            `items-start` so the card keeps its own height instead of stretching to the chip block
            beside it, which on a wide screen is much shorter. */}
        <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <LeadFormCard heading={form.heading} intro={form.intro} />
          </div>

          <div className="lg:col-span-3">
            <Stack gap={6}>
              <Stack gap={3}>
                {/* The house `center-mobile`: centred on a phone where the chips below it centre
                    too, left-hung from `sm` up where the block has an edge to hang from. */}
                <Heading level={2} align="center-mobile">
                  {heading}
                </Heading>
                {intro && (
                  <Text tone="muted" measure>
                    {intro}
                  </Text>
                )}
              </Stack>

              {/* A real list — fourteen parallel facts are a list, and a screen reader announcing
                  the count is the summary a sighted reader gets from the size of the block. */}
              <ul className="flex list-none flex-wrap justify-center gap-2 pl-0 md:justify-start">
                {places.map((place) => (
                  <li key={place.name}>
                    <Button
                      href={routes.city(place.slug)}
                      variant="ghost"
                      size="sm"
                    >
                      {place.name}
                    </Button>
                  </li>
                ))}
              </ul>

              {/* Inside the sentence rather than a button under it: this is a footnote for the
                  minority the list just turned away, and a button would give it the weight of the
                  band's main action — which is the form on the left. */}
              <Text size="small" tone="muted">
                {`${note.before} `}
                <Link href={routes.contact()}>{note.link}</Link>
                {note.after}
              </Text>
            </Stack>
          </div>
        </div>
      </Container>
    </Section>
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
              <Button
                key={city.slug}
                href={routes.city(city.slug)}
                variant="ghost"
                size="sm"
              >
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

/**
 * The inner-page treatment: a left-hung title over the rows. Used on /faq/ and /pricing/.
 *
 * `tone` exists because /faq/ stacks two of these. Two bands of the same surface in a row need a
 * `SectionDivider` between them, not a colour change — see the note on that component.
 */
export function FaqAccordion({
  heading,
  items,
  tone,
}: {
  heading: string;
  items: FaqItem[];
  tone?: SectionTone;
}) {
  if (items.length === 0) return null;
  return (
    <Section tone={tone}>
      <Container width="prose">
        <Stack gap={6}>
          <Heading level={2} align="center-mobile">
            {heading}
          </Heading>
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
      <PawPrint
        size={72}
        className="absolute left-6 top-12 -rotate-12 text-brand opacity-10"
      />
      <PawPrint
        size={44}
        className="absolute left-28 top-52 rotate-12 text-amber opacity-60"
      />
      <PawPrint
        size={56}
        className="absolute bottom-16 left-10 rotate-6 text-brand opacity-10"
      />
      <PawPrint
        size={52}
        className="absolute right-24 top-24 rotate-12 text-brand opacity-10"
      />
      <PawPrint
        size={76}
        className="absolute bottom-24 right-8 -rotate-6 text-amber opacity-50"
      />
      <PawPrint
        size={40}
        className="absolute bottom-56 right-32 rotate-45 text-brand opacity-10"
      />
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
  ctaHref = routes.faq(),
}: {
  heading: string;
  items: readonly FaqItem[];
  /**
   * The label on the link out. OPTIONAL: /commercial/ asks its own five questions and has no
   * deeper set to send anyone to — the site FAQ is a residential page, and pointing a property
   * manager at "do I need to be home?" is worse than ending the band on the last answer.
   */
  cta?: string;
  /**
   * Where that link goes. Defaults to /faq/, which is right for the homepage and wrong for any
   * band whose questions are not a subset of the site's.
   */
  ctaHref?: string;
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
            {cta && (
              <Cluster gap={4} justify="center">
                <Button href={ctaHref} variant="secondary" size="md">
                  {cta}
                </Button>
              </Cluster>
            )}
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
          <Heading level={2} align="center-mobile">
            {heading}
          </Heading>
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

/**
 * The page's closing argument. Full-bleed, an h2 at full size, two buttons, and it sits last.
 *
 * KNOWN PROBLEM with `tone="dark"`, which is still the default: `--color-surface-dark` and
 * `--color-brand` are the SAME navy — one token, two names — so `primary` is a navy fill on a navy
 * band and `ghost` is navy text on it — both buttons are all but invisible, and only the cream
 * label on the first one gives it an edge at all. Every page that closes on the dark band has
 * this. The real fix is a button variant that inverts on a dark surface; until that exists,
 * `tone="canvas"` is the way out, and it is what /services uses.
 */
export function CtaBand({
  heading,
  detail,
  tone = "dark",
  cta = primaryCta,
}: {
  heading: string;
  detail?: string;
  /** `canvas` is the light off-white close — same colour as a page's first band. */
  tone?: "dark" | "canvas";
  /** Override only where the page's next step is not the residential quote form. See `Hero`. */
  cta?: { label: string; href: string };
}) {
  // On the cream band the words are the page's normal ink, and the supporting line demotes to
  // muted as it does everywhere else. `inverse` there would be cream on cream.
  const dark = tone === "dark";

  return (
    <Section tone={tone} spacing="md">
      <Container>
        <Stack gap={5} align="center">
          <Heading level={2} tone={dark ? "inverse" : undefined}>
            {heading}
          </Heading>
          {detail && (
            <Text tone={dark ? "inverse" : "muted"} measure>
              {detail}
            </Text>
          )}
          <Cluster gap={4} justify="center">
            <Button href={cta.href} size="lg">
              {cta.label}
            </Button>
            <Button
              href={`tel:${site.phone.e164}`}
              variant="ghost"
              size="lg"
              /* Same WCAG 2.5.3 rule as the hero's phone button above: the accessible name starts
                 with the visible label and appends the number, rather than replacing it. */
              ariaLabel={`${phoneCtaLabel} — ${site.phone.display}`}
            >
              {phoneCtaLabel}
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
      <PawPrint
        size={96}
        className="absolute -left-7 -top-7 rotate-12 text-amber-dark opacity-50"
      />
      <PawPrint
        size={72}
        className="absolute -bottom-6 right-8 -rotate-12 text-amber-dark opacity-40"
      />
    </div>
  );
}

// ── Authored block renderer ──────────────────────────────────────────────────

/**
 * A page's authored body, WITHOUT the band around it. One branch per block kind; no HTML is ever
 * authored.
 *
 * Separate from `BlockRenderer` because the same blocks are rendered in two places now: as a band
 * of their own on the money pages, and inside a tab panel on a service page — where a `Section`
 * would put a second full-width band inside the band it is already in.
 */
export function AuthoredBlocks({ blocks }: { blocks: ContentBlock[] }) {
  if (blocks.length === 0) return null;

  return (
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
                  <details
                    key={item.question}
                    className="border-b border-line py-3"
                  >
                    <summary className="cursor-pointer font-semibold">
                      {item.question}
                    </summary>
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
  );
}

/** The same blocks as a band of their own — the money pages' authored middle. */
export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (blocks.length === 0) return null;

  return (
    <Section>
      <Container width="prose">
        <AuthoredBlocks blocks={blocks} />
      </Container>
    </Section>
  );
}
