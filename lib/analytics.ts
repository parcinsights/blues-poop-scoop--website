/**
 * The ad platforms' tracking, in one place: the Google Ads tag and the Meta pixel.
 *
 * TWO IDS, BOTH PUBLIC. They ship inside the browser bundle and name an ad account, nothing more —
 * neither is a secret, and neither can be used to spend anyone's money. They live in the
 * environment rather than in a constant here for one reason: a preview deployment that reports
 * conversions poisons the real account's data, and Smart Bidding then optimises toward whatever
 * a preview URL happened to do. Set these in Vercel's PRODUCTION environment only. Blank is the
 * safe state and switches the whole file off — the same call `lib/turnstile.ts` makes about its
 * own key, for the same reason: the site's job is taking leads, and it must not stop taking them
 * because a tag is unconfigured.
 */

/** From Google Ads → Admin → Data manager → Google tag. The `AW-` prefix is part of the value. */
export const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

/** From Meta Events Manager → Data sources → the pixel. A bare number, no prefix. */
export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

/**
 * GOOGLE ADS CONVERSIONS ARE NOT SENT FROM CODE. The "Submit lead form" conversion action is a URL
 * rule set in the Ads UI — a page view matching `^https?://bluespoopscoop\.com/thank-you/` — and
 * the Google tag applies it on its own, including on the client-side navigation a form does. So
 * nothing here calls `gtag` for a lead. The ad landing pages are kept out of it by landing on
 * /lp/<slug>/thank-you/ instead; see `routes.campaignThankYou`.
 *
 * (There used to be a `gtag("event", "ads_conversion_Sign_up_1")` call here. That event belonged
 * to a GA4-imported "Sign-up" action whose trigger was an old Sweep&Go thank-you URL, and with no
 * GA4 on this site it never recorded anything.)
 *
 * In the Ads UI, keep "Submit lead form" on Count: One — /thank-you/ is a refreshable URL, and
 * One counts a lead once per ad click however many times the page loads.
 */

/**
 * Which form produced the lead. Reported to Meta so they can be told apart in-platform. `campaign`
 * is the quick form on an ad landing page (/lp/…/) — the one a Meta campaign is judged on.
 */
export type LeadSource = "quick_lead" | "contact" | "campaign";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * WHY A HANDOFF FLAG AND NOT JUST "FIRE ON THE THANK-YOU PAGE".
 *
 * Every form lands on a thank-you page, which makes that page the obvious conversion trigger — and
 * it is, but only for people who got there by submitting something. The page is a real URL: it
 * survives a refresh, a back-then-forward, and a bookmark, and each of those would report another
 * lead that never happened. Meta would then optimise toward whatever traffic refreshes pages.
 *
 * So the form sets a flag as it navigates and the thank-you page spends it. One submit, one Lead,
 * and a reload finds nothing left to claim. `sessionStorage` because the flag must not outlive the
 * tab, and because it survives the navigation itself — which a variable in memory would not, the
 * form component being unmounted by the very thing it is trying to report.
 */
const PENDING_KEY = "bps:lead-pending";

/** Wrapped because Safari's private mode throws on `sessionStorage` rather than returning null. */
function session(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Called by a form immediately before it navigates to /thank-you/. */
export function markLeadPending(source: LeadSource): void {
  session()?.setItem(PENDING_KEY, source);
}

/** Reads and clears in one step, so a second caller finds nothing. Null means "not a real submit". */
function consumeLeadPending(): LeadSource | null {
  const store = session();
  const value = store?.getItem(PENDING_KEY) ?? null;
  if (value) store?.removeItem(PENDING_KEY);
  return value === "quick_lead" || value === "contact" || value === "campaign" ? value : null;
}

/**
 * Reports one lead to Meta, or does nothing at all.
 *
 * Returns silently when there is no pending flag — that is the refresh case, and it is the normal
 * path for most views of a thank-you page over a site's life. `window.fbq` is optional-called
 * rather than assumed: an ad blocker, an offline tag script, or an unset ID all leave it undefined,
 * and none of those are worth an exception on a page whose actual job is telling someone their
 * message was sent. Google Ads is not called here — see the note above `LeadSource`.
 */
export function reportSignup(): void {
  const source = consumeLeadPending();
  if (!source) return;

  // Meta: the standard `Lead` event, which is the one their optimisation understands. `PageView`
  // alone builds an audience; this is what lets Meta learn who fills forms in.
  window.fbq?.("track", "Lead", { content_name: source });
}
