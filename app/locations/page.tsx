import type { Metadata } from "next";

import {
  CtaBand,
  ServedAreas,
  ServiceAreaMapFrame,
  ServiceAreaTowns,
} from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { servicedPlaces } from "@/content/cities";
import { servedAreas } from "@/content/neighborhoods";
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
 * the city in there" at a glance, the TOWN CHIPS take the ones with a page of their own, and the
 * FULL LIST is where everybody else finds their name.
 *
 * There is no zip band here. It described one that had already been removed, and since 2026-08-07
 * there is no zip band on /pricing/ either — that page carries the same map this one opens on. The
 * only place zips are still printed is a town's own page, where the list is four numbers rather
 * than forty-five. See `ServiceZips`.
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
        intro="We're based in Chestnut Hill and service Philadelphia and the surrounding areas — Montgomery and Delaware counties included. If you're nearby but not listed, ask; we'll tell you honestly whether we can reach you."
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

      {/* THE FULL LIST — forty-odd names, no pages, three columns. It sits under the chips rather
          than replacing them because the two answer different halves of the same question: the
          chips take you somewhere, this tells you yes. See content/neighborhoods.ts for why it is
          a list and not forty more URLs. */}
      <ServedAreas
        heading={locationsPage.served.heading}
        intro={locationsPage.served.intro}
        areas={servedAreas}
        note={locationsPage.served.note}
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
