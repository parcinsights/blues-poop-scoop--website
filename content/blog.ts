/**
 * The blog. One entry = one post at /blog/[slug]/.
 *
 * EMPTY ON PURPOSE, and it should stay empty until there is something real to say. The failure
 * mode for a blog on a site like this one is well documented: six AI-written posts about "5 Tips
 * For A Clean Yard" that every competitor also has, published once and never touched. That is a
 * liability — it dilutes the site's topical focus and it dates itself in public. The index route
 * exists so a post can be dropped in and be live; until then it is noindexed and out of the
 * sitemap, exactly like an unauthored service page (see lib/content.ts).
 *
 * What is actually worth writing here, in rough order of value:
 *   · Seasonal, local, and specific — "what the March thaw does to a Philly backyard", written
 *     from route days, not from a template.
 *   · The health questions customers genuinely ask (parasites, lawn burn, what is safe around
 *     kids). These are searched, and George can answer them from real experience.
 *   · Jobs with before-and-afters, named neighbourhood, owner's permission on record.
 *
 * A post is worth publishing when it contains a fact a franchise site could not copy.
 */

import type { BlogPost } from "./types";

export const posts: BlogPost[] = [];

/** Newest first — the only order the index ever shows. */
export const postsByDate = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const postBySlug = new Map(posts.map((post) => [post.slug, post]));

/** Long-form date for a byline: "March 4, 2026". Fixed locale, so SSR and client agree. */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
