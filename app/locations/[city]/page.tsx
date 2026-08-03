import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BlockRenderer,
  CtaBand,
  FaqBand,
  Hero,
  HowItWorks,
  PricingBand,
  ReviewWall,
  ServiceAreaList,
  ServiceZips,
  TrustBar,
} from "@/components/blocks/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { cities, cityBySlug } from "@/content/cities";
import { answeredResidentialFaqs } from "@/content/faq";
import { cityPage } from "@/content/pages/city-page";
import { home } from "@/content/pages/home";
import { residential } from "@/content/pages/standing";
import { ratingSummary, reviews } from "@/content/reviews";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * THE city page. Singular, the same way /services/[service]/ is: ten towns render through this one
 * file, in the same bands, in the same order. Only the words and the zips change, and both come
 * from `content/cities.ts` and `content/pages/city-page.ts`. Never fork it for one town.
 *
 * IT USED TO BE A DIFFERENT SITE. The old template was `PageShell` + the authored body + a row of
 * plan buttons + `PriceTable` + a CTA — written before the design system existed, and it looked it:
 * a bare h1 on cream, a table, and nothing else the rest of the site does. This is the same argument
 * in the bands every other page uses.
 *
 * WHAT MAKES THESE PAGES SAFE TO PUBLISH, and it is worth being precise because it is the one SEO
 * question this route can get wrong. Reusing the steps, the prices, the reviews and the FAQ across
 * ten pages is boilerplate — it is what every service site does, and nothing is penalised for it.
 * The failure mode is a page whose ONLY difference from its nine siblings is a swapped place name.
 * So this template gives each town three things that genuinely differ — its name and county in the
 * h1 and standfirst, its own zip codes, and `city.body` — and the publish gate hangs on the third:
 * a town with no authored body renders for review, carries noindex, and stays out of the sitemap.
 * See lib/content.ts and the note in content/pages/city-page.ts.
 *
 * NO LINKS TO /locations/[city]/[service]/. The old template carried a "Plans available in X" row
 * pointing at them; every one of those pages is unauthored, noindexed and thinner than this page,
 * so the row spent this page's link equity on ten dead ends. When a money page is genuinely
 * written, it gets linked from the town it belongs to — one at a time, the same way it is authored.
 */

type Params = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city: slug } = await params;
  const city = cityBySlug.get(slug);
  if (!city) return {};
  return buildMetadata({
    ...city.seo,
    path: routes.city(slug),
    noindex: !isPublishable(city.body),
  });
}

export default async function CityPage({ params }: Params) {
  const { city: slug } = await params;
  const city = cityBySlug.get(slug);
  if (!city) notFound();

  const path = routes.city(slug);
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home() },
    { name: "Areas We Serve", path: routes.locations() },
    { name: city.name, path },
  ];

  /** Every other town. The foot of the page is the only place the ten link to each other. */
  const elsewhere = cities.filter((other) => other.slug !== city.slug);

  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path,
          name: cityPage.heading(city),
          description: city.seo.description,
          crumbs,
        })}
      />

      {/* `contained` — the two-column hero that stops at the container, the same one /residential/
          takes. Not `split`: that bleed is the front door's treatment, and ten town pages wearing it
          would each read as another homepage.

          The owners and Blue, on all ten. A town page answers one question — do you come here, and
          who turns up — and the faces answer the second half of it faster than any sentence. The
          same shot opens the homepage; the two are never on screen together, and it is landscape, so
          it survives this band's crop with everybody still in the frame. */}
      <Hero
        heading={cityPage.heading(city)}
        subheading={cityPage.intro(city)}
        image="landingHero"
        layout="contained"
        crumbs={crumbs}
        rating={ratingSummary}
        assurances={home.hero.assurances}
      />

      {/* The same three facts /residential/ opens with, from that record rather than retyped —
          "Philadelphia & the Main Line", the dog policy, the texts. They are true on every page of
          this site, and one copy of them is the point. */}
      <TrustBar items={residential.trust} />

      {/* THE ONLY PART THAT IS THIS TOWN'S. Renders nothing until somebody writes it, which is also
          what keeps the page out of the index — see the note above. */}
      <BlockRenderer blocks={city.body} />

      {/* This town's zips, not the site-wide list. One number on most of these pages and four on
          Philadelphia's, which is the point: it is a fact about this town, on this town's page. */}
      <ServiceZips
        heading={cityPage.zips.heading(city)}
        zips={city.zips}
        note={cityPage.zips.note}
      />

      <HowItWorks heading={home.howItWorks.heading} steps={home.howItWorks.steps} />

      {/* The homepage's own plans. Someone who arrived from "dog poop removal ardmore" gets the
          prices without a second click; every number comes from content/pricing.ts. */}
      <PricingBand
        heading={home.pricing.heading}
        assurances={home.pricing.assurances}
        promise={home.pricing.promise}
        cta={home.pricing.cta}
      />

      {/* Five of the eight, ordered the way a homeowner's doubt arrives. The link out to /faq/ is
          what stops ten town pages each printing the whole set. */}
      <FaqBand
        heading={cityPage.faq.heading}
        items={answeredResidentialFaqs.slice(0, 5)}
        cta={cityPage.faq.cta}
      />

      {/* Both bands are white and nothing marks the seam. This is that mark — a hairline on the
          container line rather than a change of colour. See `SectionDivider`. */}
      <SectionDivider tone="raised" />

      {/* The quotes are not from this town and the heading does not pretend they are. No review on
          file carries a city; when one does, this band is where a local quote belongs. */}
      <ReviewWall heading={cityPage.reviews.heading} reviews={reviews} />

      {/* The sibling towns, and the only cross-link between the ten. It keeps every location one hop
          from every other instead of routing all of them through /locations/. */}
      <ServiceAreaList heading={cityPage.nearby.heading} cities={elsewhere} />

      {/* `canvas`, not the site-default navy: on the dark band the navy buttons disappear into it,
          because --color-surface-dark and --color-brand are the same hex. See CtaBand. */}
      <CtaBand
        heading={cityPage.cta.heading(city)}
        detail={cityPage.cta.detail}
        tone="canvas"
      />
    </>
  );
}
