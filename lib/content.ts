import type { ContentBlock } from "@/content/types";

/**
 * The thin-content guard.
 *
 * This site will have ~30 routes across 10 cities × 2 services, and until each one has genuinely
 * distinct copy they are near-identical pages differing only by a place name. That is the
 * doorway-page pattern, and it is the single biggest ranking risk in a build shaped like this
 * one — worse than any technical mistake, because Google treats it as manipulation rather than
 * sloppiness.
 *
 * So a page is only *published* — indexable, and listed in the sitemap — once someone has actually
 * written its body. Until then the route still exists and renders (so it can be reviewed, linked
 * internally, and filled in), but it carries `noindex` and stays out of the sitemap.
 *
 * The effect is that content, not a developer's memory, decides what Google sees.
 */
export function isPublishable(blocks: ContentBlock[]): boolean {
  return blocks.length > 0;
}

/** Words of real prose in a page body — the rough signal of whether a page says anything. */
export function wordCount(blocks: ContentBlock[]): number {
  let words = 0;
  for (const block of blocks) {
    if (block.kind === "prose") {
      for (const paragraph of block.paragraphs) words += paragraph.split(/\s+/).filter(Boolean).length;
    } else if (block.kind === "list") {
      for (const item of block.items) words += item.split(/\s+/).filter(Boolean).length;
    } else if (block.kind === "steps") {
      for (const step of block.steps) words += step.detail.split(/\s+/).filter(Boolean).length;
    } else if (block.kind === "faq") {
      for (const item of block.items) words += item.answer.split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}
