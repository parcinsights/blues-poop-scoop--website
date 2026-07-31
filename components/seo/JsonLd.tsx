import { assertValidGraph } from "@/lib/schema";

/**
 * The ONLY `<script type="application/ld+json">` in the application.
 *
 * Every page passes a finished graph built by lib/schema.ts. No component assembles structured
 * data for what it renders — that is how markup drifts away from the page it describes.
 *
 * The graph is validated here, at build time. A duplicate @id or a dangling reference throws
 * during `next build` rather than showing up as a warning in Search Console six weeks later.
 */
export function JsonLd({ graph }: { graph: Record<string, unknown> }) {
  const validated = assertValidGraph(graph);
  return (
    <script
      type="application/ld+json"
      // Content is generated from typed config, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(validated) }}
    />
  );
}
