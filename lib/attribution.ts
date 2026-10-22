/**
 * WHERE A LEAD CAME FROM — the campaign page it was sent from, and the UTM tags on the ad link.
 *
 * The ad platforms already know which ad produced a conversion; the CRM does not, and the CRM is
 * where George decides which leads were worth the money. So every lead carries two answers with it:
 *
 *   · `campaign` — the slug of the landing page the form sat on (content/campaigns.ts). Set by the
 *     page, so it is right even when the ad link carries no tags at all.
 *   · `utm_*`   — whatever the ad link was tagged with. Meta fills these from the URL parameters set
 *     on the ad (`utm_source=facebook&utm_campaign={{campaign.name}}&utm_content={{ad.name}}` is
 *     the usual set), which is what tells two ads in one campaign apart.
 *
 * Both are optional everywhere. A lead from the homepage has neither, and that is an answer too.
 */

/** The five standard tags, in the order every analytics tool lists them. */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

/** Longer than any real tag. A cap so a crafted URL cannot push an unbounded string into the CRM. */
export const ATTRIBUTION_MAX_LENGTH = 200;

/**
 * The UTM tags on the current URL, with blanks dropped. Browser-only — call it at submit time,
 * which is also the right moment: the tags are on the URL the visitor is standing on.
 */
export function readUtmTags(search: string): Partial<Record<UtmKey, string>> {
  const params = new URLSearchParams(search);
  const tags: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) tags[key] = value.slice(0, ATTRIBUTION_MAX_LENGTH);
  }
  return tags;
}
