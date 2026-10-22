import type { Metadata } from "next";
import {
  ArrowUpRight,
  Dog,
  PawPrint,
  Sparkles,
  SprayCan,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { CtaBand } from "@/components/blocks/blocks";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";
import { Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
import type { AssetKey } from "@/content/assets";
import { residentialServices } from "@/content/services";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const seo = {
  title: "Our Services",
  description:
    "Weekly dog waste removal across Philadelphia and the Main Line, plus one-time yard cleanups.",
};

/** The standfirst under the h1. Says what the four cards below it are, before they are scrolled to. */
const intro =
  "Everything we do, in one place. Start with the scooping plan that fits your yard, then add whatever else it needs. No contracts on any of it.";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Services", path: routes.services() },
];

/**
 * ── HOW EACH CARD IS DRESSED ─────────────────────────────────────────────────
 * Icon, medallion colour and photograph, keyed by slug. All three live here rather than in
 * `content/services.ts` on purpose: this is how this ONE grid draws a service, not a fact about
 * the service. The service pages themselves use none of it.
 *
 * The four colours are the accent pairs from theme.css — a fill and the only ink allowed on it,
 * checked at 4.5:1 in lib/theme.test.ts. They exist for exactly this: four identical navy circles
 * read as a spec sheet, and the `WhyUs` band already cycles the same four. Do not mix and match
 * the halves of a pair.
 *
 * TO SWAP A PHOTO: drop the file in `public/`, declare it in `content/assets.ts` with its real
 * width, height and alt text (the registry requires all three), then change the key here. A
 * service with no `image` falls back to a dashed placeholder rather than a broken box.
 */
const cards: Record<
  string,
  { icon: LucideIcon; medallion: string; image?: AssetKey }
> = {
  "poop-scoop": {
    icon: Dog,
    medallion: "bg-accent-mint text-accent-mint-ink",
    image: "servicePoopScoop",
  },
  deodorizer: {
    icon: SprayCan,
    medallion: "bg-accent-lilac text-accent-lilac-ink",
    image: "serviceDeodorizer",
  },
  "haul-away": {
    icon: Truck,
    medallion: "bg-accent-peach text-accent-peach-ink",
    image: "serviceHaulAway",
  },
  "one-time-cleanup": {
    icon: Sparkles,
    medallion: "bg-accent-lemon text-accent-lemon-ink",
    image: "serviceOneTimeClean",
  },
};

export const metadata: Metadata = buildMetadata({ ...seo, path: routes.services() });

/**
 * A little trail of paws across the empty space either side of the page title. Decoration and
 * nothing else — `aria-hidden`, untouchable by the pointer, and carrying no information the words
 * do not already carry.
 *
 * `lg` and up ONLY. The standfirst is capped at the readable measure (42rem) inside a much wider
 * container, and these paws live in the margin that leaves. Below `lg` that margin is gone and
 * they would print straight through the sentence.
 *
 * Amber and sky, at half strength: they read as a watermark on the white band rather than as four
 * more things on the page. Navy would compete with the title.
 */
function TitlePaws() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <PawPrint size={64} className="absolute -top-3 left-2 -rotate-12 text-amber opacity-70" />
      <PawPrint size={34} className="absolute bottom-1 left-24 rotate-12 text-sky opacity-60" />
      <PawPrint size={72} className="absolute -bottom-4 right-4 rotate-12 text-amber opacity-70" />
      <PawPrint size={38} className="absolute right-24 top-0 -rotate-12 text-sky opacity-60" />
    </div>
  );
}

/**
 * The services index. NOT the service template — that is app/services/[service]/page.tsx, and this
 * page shares nothing with it but the content file.
 *
 * One grid of four, not the two bands this used to carry. The old split (core plan above, add-ons
 * below) was answering a question nobody asks on an index page: a visitor here wants to see the
 * menu, and the distinction between "buy this on its own" and "buy this alongside" is made on the
 * page they land on next. Four squares is the menu.
 */
export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.services(),
          name: "Our Services",
          description: seo.description,
          type: "CollectionPage",
          crumbs,
        })}
      />

      {/* `raised` — plain white, the one band with no cream in it. It has to be: the cards below
          carry the cream, and a cream card on a cream band is an invisible card. See the note on
          `Section tone="raised"` in components/ui/layout.tsx.

          One band, not two, so the h1 and the grid share a single rhythm — a second Section here
          would stack this band's bottom padding on the next one's top and open a gap that reads as
          a missing section. */}
      <Section tone="raised" spacing="md">
        <Container>
          <Stack gap={10}>
            <Stack gap={5}>
              {/* The trail stays hard left while the title centres. It is a "you are here", not
                  part of the title block, and centring it would make it read as a kicker. */}
              <Breadcrumbs crumbs={crumbs} />
              <div className="relative">
                <TitlePaws />
                {/* `relative` lifts the words above the paws — they are printed behind the title,
                    not stuck on top of it. */}
                <div className="relative">
                  <Stack gap={4} align="center">
                    <Heading level={1}>Our Services</Heading>
                    <Text size="lead" tone="muted" measure>
                      {intro}
                    </Text>
                  </Stack>
                </div>
              </div>
            </Stack>

            <Grid columns={2} gap={8}>
              {residentialServices.map((service) => {
                const card = cards[service.slug];
                const Icon = card?.icon;
                const image = card?.image;

                return (
                  <Card key={service.slug} tone="canvas" aspect="square">
                    {/* `h-full` hands the column the card's height, which is what lets the photo
                        take the slack (`grow`) and the button sit on the floor of a square card
                        rather than floating under the words. */}
                    <div className="flex h-full flex-col gap-5">
                      <Stack gap={3}>
                        {/* The medallion sits BESIDE the name rather than on a row of its own,
                            and the reason is the photograph: a square card is a fixed height
                            budget, and a row for the icon spent 4rem of it on 3rem of icon. Next
                            to the title it costs nothing, and that 4rem goes to the picture. */}
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <span
                              className={cx(
                                "inline-flex size-12 shrink-0 items-center justify-center rounded-pill",
                                card.medallion,
                              )}
                            >
                              <Icon size={24} aria-hidden="true" />
                            </span>
                          )}
                          {/* h2, because the h1 above is the only thing over them — there is no
                              band title in between any more. `size="h3"` keeps a grid of four from
                              shouting; see the level/size note in components/ui/typography.tsx. */}
                          <Heading level={2} size="h3">
                            {service.name}
                          </Heading>
                        </div>
                        <Text tone="muted">{service.summary}</Text>
                      </Stack>

                      {/* The photo. FIXED height, not `grow` — with `grow` the picture absorbed
                          whatever the words left over, so the card with the shortest summary got
                          the tallest photo and the four ran at four different sizes. A photo is
                          not a spacer. The slack goes to `mt-auto` above it instead, which also
                          pins the picture and the button to the floor of every card, so all four
                          images start and end on the same line however much text sits over them.

                          15rem is the ceiling, not a preference. Inside the square the title row,
                          the summary at its longest (three lines), the button and the gaps between
                          them come to roughly 15.5rem of the ~30.5rem available; a taller picture
                          than this and the longest card overflows its own square. If a summary
                          ever grows a fourth line, this number comes down. */}
                      <div className="relative mt-auto h-56 shrink-0 overflow-hidden rounded-md lg:h-60">
                        {image ? (
                          <Image
                            asset={image}
                            sizes="(min-width: 1024px) 34rem, (min-width: 640px) 45vw, 90vw"
                            className="absolute inset-0 size-full object-cover"
                          />
                        ) : (
                          /* Placeholder — see the `images` map above. Deliberately obvious: a
                             blank grey box would look like a broken photo, this looks like a
                             waiting one. It disappears per service the moment a key is added. */
                          <div className="absolute inset-0 flex items-center justify-center rounded-md border-2 border-dashed border-line text-caption text-ink-muted">
                            Photo goes here
                          </div>
                        )}
                      </div>

                      {/* Bottom right. The arrow points up-and-away because that is what the
                          click does — it leaves this page for the service's own. */}
                      <div className="flex justify-end">
                        <Button
                          href={routes.service(service.slug)}
                          variant="secondary"
                          icon={ArrowUpRight}
                          ariaLabel={`Learn more about ${service.name}`}
                        >
                          Learn more
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </Grid>
          </Stack>
        </Container>
      </Section>

      {/* `canvas`, not the site-default dark navy: on the dark band the navy buttons disappear
          into it, because --color-surface-dark and --color-brand are the same hex. See CtaBand. */}
      <CtaBand heading="Ready for a clean yard?" tone="canvas" />
    </>
  );
}
