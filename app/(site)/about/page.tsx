import type { Metadata } from "next";

import { CtaBand, FeatureGrid, StatBand, StoryBand, TeamBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { about } from "@/content/pages/standing";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * /about/ — the page that answers "who would actually be in my yard".
 *
 * It is the one page on the site with no argument on it. No prices, no plans, no service area, no
 * review wall: a visitor arrives here already interested and leaves either reassured or not, and
 * the things that reassure them are a face, a name and a dog — none of which are a sales point.
 * That is also why the review wall came off. Proof of the work belongs on the pages selling the
 * work; here it is the third band of testimonials a visitor has scrolled past, and it pushes the
 * crew — the only thing on this page they cannot read anywhere else — further down.
 *
 * Five bands, and they run in the order a stranger asks: where did this come from, what do you
 * stand for, who are you, and how big is this really. The numbers land AFTER the faces on purpose —
 * "0 contracts required" is a term, and a term is worth more once you know who is offering it.
 *
 * The tones alternate canvas / white / cream / white / navy / canvas, so no two touching bands
 * share a surface and nothing needs a divider.
 */

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "About", path: routes.about() },
];

export const metadata: Metadata = buildMetadata({ ...about.seo, path: routes.about() });

export default function AboutPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.about(),
          name: about.heading,
          description: about.seo.description,
          type: "AboutPage",
          crumbs,
        })}
      />

      <PageShell crumbs={crumbs} heading={about.heading} intro={about.intro} />

      <StoryBand
        eyebrow={about.story.eyebrow}
        heading={about.story.heading}
        paragraphs={about.story.paragraphs}
        note={about.story.note}
        image="aboutStory"
      />

      {/* `canvas`, the same off-white the page opens on, between two white bands: it gives the
          story above and the crew below their edges without a rule on either, and it keeps the
          whole page to two surfaces. The deeper `alt` cream did the same job louder — on a page
          whose argument is "we are two people and a dog", the promises are not the band that
          should shout. Centred, because three promises with a medallion each are a row of equals
          rather than a list you work down. */}
      <FeatureGrid
        eyebrow={about.values.eyebrow}
        heading={about.values.heading}
        features={about.values.points}
        tone="canvas"
        align="center"
      />

      <TeamBand
        eyebrow={about.team.eyebrow}
        heading={about.team.heading}
        members={about.team.members}
      />

      <StatBand stats={about.stats} />

      {/* `canvas`, not the site-default dark navy — and here it is also the band the navy strip
          above needs to end against. On the dark band the navy buttons disappear into it, because
          --color-surface-dark and --color-brand are the same hex. See CtaBand. */}
      <CtaBand heading={about.cta.heading} detail={about.cta.detail} tone="canvas" />
    </>
  );
}
