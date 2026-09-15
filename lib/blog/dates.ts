/**
 * Post dates, formatted one way everywhere. Fixed locale and a fixed zone — the business's own —
 * so the server render and a visitor's browser can never disagree about which day a post went up.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** "March 4, 2026". */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

/**
 * Whether an "Updated" date is worth showing. Within a day of publishing is the same edit session,
 * not a revision. The schema's `dateModified` is always the real value either way.
 */
export function wasRevised(post: { publishedAt: string; updatedAt: string }): boolean {
  return Date.parse(post.updatedAt) - Date.parse(post.publishedAt) > DAY_MS;
}
