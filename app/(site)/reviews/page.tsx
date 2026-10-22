import type { Metadata } from "next";

import { CtaBand, ReviewWall } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { reviewsPage } from "@/content/pages/standing";
import { reviews } from "@/content/reviews";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Reviews", path: routes.reviews() },
];

export const metadata: Metadata = buildMetadata({ ...reviewsPage.seo, path: routes.reviews() });

/**
 * The full review wall.
 *
 * The graph is `standardPageGraph` and nothing more. It is worth saying why, because this is the
 * one page on the site where adding `aggregateRating` looks obviously correct: reviews you
 * gathered yourself, on your own domain, are explicitly outside what Google accepts as review
 * markup, and it is a manual-action risk rather than a missed opportunity. The stars on each card
 * do the persuading; the visitor's own eyes are the audience here, not the crawler.
 */
export default function ReviewsPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.reviews(),
          name: reviewsPage.heading,
          description: reviewsPage.seo.description,
          type: "CollectionPage",
          crumbs,
        })}
      />
      <PageShell crumbs={crumbs} heading={reviewsPage.heading} intro={reviewsPage.intro} />
      <ReviewWall heading="In our customers' words" reviews={reviews} />
      {/* `canvas`, matching the services CTAs: on the dark band the navy buttons disappear into
          it, because --color-surface-dark and --color-brand are the same hex. See CtaBand. */}
      <CtaBand
        heading="Want a yard you can walk barefoot in?"
        detail={`Call ${site.phone.display} or get a free quote — most yards are priced in a minute.`}
        tone="canvas"
      />
    </>
  );
}
