import type { Metadata } from "next";

import { CtaBand, ServiceAreaMapFrame, ServiceAreaTowns } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { servicedPlaces } from "@/content/cities";
import { locationsPage } from "@/content/pages/standing";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const seo = {
  title: "Areas We Serve",
  description:
    "Pet waste removal in Chestnut Hill, Mt. Airy, Roxborough, East Falls, Ardmore, Bryn Mawr, Haverford, Narberth, Gladwyne and Glenside.",
};

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Areas We Serve", path: routes.locations() },
];

export const metadata: Metadata = buildMetadata({ ...seo, path: routes.locations() });

/**
 * One question, asked three ways, because people arrive holding it in three different forms.
 *
 * Somebody landing here from "pooper scooper near me" is not reading — they are looking for
 * themselves on the page. The order is widest recognition first: the SHAPE answers "is my side of
 * the city in there" at a glance, the ZIP answers it exactly, and the TOWN CARDS are for the
 * person who has already found themselves and now wants the page about their street.
 *
 * The zip band is the same `ServiceZips` running the same copy as /pricing/. That is on purpose
 * and not a shortcut: coverage is one fact, and a visitor who checked their zip on the pricing
 * page and then checked it here must not be able to find two different answers.
 */
export default function LocationsIndexPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.locations(),
          name: "Areas We Serve",
          description: seo.description,
          type: "CollectionPage",
          crumbs,
        })}
      />
      {/* The map goes INSIDE the shell, not in a band under it. It is the intro sentence's own
          illustration — "Northwest Philadelphia and the Main Line" is exactly what the shape says —
          and a section break between the two would put a horizon between a claim and its evidence.
          It renders nothing at all when the Static API is off; see lib/maps.ts. */}
      <PageShell
        crumbs={crumbs}
        heading="Areas we serve"
        intro="We cover Northwest Philadelphia and the Main Line. If you're nearby but not listed, ask — we'll tell you honestly whether we can reach you."
      >
        <ServiceAreaMapFrame />
      </PageShell>

      {/* Both bands are cream, so nothing marks the seam between them. This is that mark — the
          same hairline /pricing/ uses where two white bands meet. */}
      <SectionDivider tone="canvas" />

      <ServiceAreaTowns
        heading={locationsPage.towns.heading}
        intro={locationsPage.towns.intro}
        places={servicedPlaces}
        note={locationsPage.towns.note}
        form={locationsPage.towns.form}
      />

      {/* The grid of town CARDS used to sit here and is gone. It listed the same ten towns the
          chips above already list, linking to the same ten pages — one screen of duplication that
          made the page look longer without answering anything the band above had not. The county
          and zip line each card carried is the one thing lost, and it belongs on the town's own
          page rather than on the index of them.

          Every city page is still linked: from the chips, and from the footer's own column. */}

      {/* `canvas`, not the default navy. On the dark band the navy buttons disappear into it —
          --color-surface-dark and --color-brand are the same hex — and this page in particular
          closes on two buttons that have to be found. Same call as /pricing/. See `CtaBand`. */}
      <CtaBand
        heading="Not sure if we reach you?"
        detail="Send us your zip code and we'll confirm."
        tone="canvas"
      />
    </>
  );
}
