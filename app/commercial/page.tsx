import type { Metadata } from "next";

import { BlockRenderer, CtaBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { commercial } from "@/content/pages/standing";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "Commercial", path: routes.commercial() },
];

export const metadata: Metadata = buildMetadata({
  ...commercial.seo,
  path: routes.commercial(),
  // The client's current site lists commercial as "Coming Soon". Until they confirm they actually
  // take this work, the page exists for review but is not indexed — offering a service nobody
  // performs is worse than having no page.
  noindex: !isPublishable(commercial.body),
});

export default function CommercialPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.commercial(),
          name: commercial.heading,
          description: commercial.seo.description,
          crumbs,
        })}
      />
      <PageShell crumbs={crumbs} heading={commercial.heading} intro={commercial.intro} />
      <BlockRenderer blocks={commercial.body} />
      <CtaBand heading="Managing a property?" detail="Tell us the site and we'll quote it." />
    </>
  );
}
