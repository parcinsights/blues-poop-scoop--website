import { z } from "zod";

import { servicedZips } from "@/content/cities";

/**
 * One schema, used by the browser and the API route.
 *
 * Client-side validation is a convenience; server-side validation is the actual check. Sharing the
 * schema means they cannot drift apart and disagree about what a valid lead looks like.
 */

/**
 * How often we come — ONE list, for every form on the site.
 *
 * There used to be two: the short form offered "not-sure" and the contact form offered "monthly",
 * so the same question had two different answer sets depending on which page you were standing on
 * and the CRM received a vocabulary that depended on the referrer. "not-sure" stays because a
 * stranger being asked to commit to a schedule before hearing a price will abandon rather than
 * guess; "monthly" stays because it is a service the client sells. Both belong on both.
 */
export const FREQUENCIES = ["weekly", "biweekly", "monthly", "not-sure"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

/**
 * A US phone number, in whatever shape the field handed over.
 *
 * It NORMALISES rather than merely accepting. `PhoneInput` submits "(267) 640-6798", a paste might
 * arrive as "+1 267.640.6798", and the CRM should never have to hold both — so the punctuation is
 * stripped here and what leaves is ten digits. Two records for one person, differing only in
 * brackets, is the failure this prevents.
 *
 * The rule is the NANP's, not "ten of anything": an area code and an exchange both start 2–9, so
 * "0006406798" is not a number that can exist and is rejected rather than filed. The field caps
 * the length already — this is the half that does not trust the field, since the API takes JSON
 * from anywhere.
 */
const phoneSchema = z
  .string()
  .transform((value) => {
    const digits = value.replace(/\D/g, "");
    // A leading 1 on an eleven-digit number is the country code, not an area code — the same rule
    // `PhoneInput` applies to a paste. Both ends do it, because the API takes JSON from callers
    // that never went near the field.
    return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  })
  .refine(
    (digits) => /^[2-9]\d{2}[2-9]\d{6}$/.test(digits),
    "Please enter a valid 10-digit phone number",
  );

/**
 * THE SIX QUESTIONS. Every form on the site asks exactly these, in this order, and they are
 * written once here so that no form can quietly ask a different set.
 *
 * This used to be two divergent object literals — the short form asked for a name and skipped
 * frequency in its compact placement, the contact form asked for a frequency and no name — which
 * meant the GoHighLevel trigger received a different key set depending on which page the visitor
 * happened to be on, and a "lead" from one page could not be compared with a lead from another.
 * One spread, one truth: a field added below appears on every form and in every payload.
 *
 * `smsConsent` is deliberately NOT in here. It is a permission, not a question about the yard, and
 * it lives only on /contact/ where there is room to state what is being agreed to.
 */
const leadFields = {
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  phone: phoneSchema,
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Please enter a 5-digit zip code"),
  dogs: z.coerce.number().int().min(1, "At least one dog").max(20),
  /**
   * Required on every form, and answerable on every form — "Not sure yet" is one of the options,
   * so requiring it costs a visitor nothing and buys a payload where the field is never empty.
   *
   * The select opens on an empty option rather than on a guess. "" fails the enum, which is the
   * point: a pre-selected "weekly" is an answer the visitor never gave, and it would reach the CRM
   * looking exactly like one they did.
   */
  frequency: z.enum(FREQUENCIES, { error: "Please choose how often you'd like us out" }),
  /**
   * Honeypot. A bot fills it; a human never sees it.
   *
   * The schema ACCEPTS whatever is in it and the API route is what throws the submission away —
   * see /api/lead. Rejecting it here instead returned a 400 naming `company` as the bad field,
   * which is a free lesson in how to get past the trap. The route answers 200 and drops it, so a
   * bot learns nothing and does not come back with a different shape.
   *
   * Capped only to keep an unbounded string out of the parser.
   */
  company: z.string().max(200).optional(),
} as const;

export const quickLeadSchema = z.object(leadFields);

export type QuickLead = z.infer<typeof quickLeadSchema>;

/**
 * ── The contact form ─────────────────────────────────────────────────────────
 *
 * The SAME six questions, plus one permission. It is a second schema rather than a longer first one
 * only because of `smsConsent` — and because the two routes tag their source differently in the
 * CRM. Every question it asks, the short form asks too, and vice versa: see `leadFields`.
 *
 * It used to be a genuinely different form — no name, its own frequency list — on the theory that
 * someone asking for a price should be asked fewer things. What that actually produced was two
 * incomparable lead shapes and a CRM that could not tell whether a missing name meant "did not
 * answer" or "was never asked".
 *
 * The ORDER on the page is still the client's, and it is still the right one: the questions that
 * set the price come first and the contact details come last — by the time someone is typing their
 * mobile number they have invested several answers, which is the point at which people finish
 * forms instead of abandoning them. Order is a rendering decision; see ContactForm.
 *
 * DEFERRED: Sweep&Go's `clean_up_frequency` takes its own vocabulary and the onboarding call must
 * send one of its values verbatim. Map `FREQUENCIES` there, at the seam — see lib/integrations.ts.
 *
 * NO `LAST_CLEANED`. The contact form used to ask how long the yard had been left — the
 * initial-cleanup question, and the reason a first visit costs more than the ones after it. It is
 * gone from the form and therefore from the payload: thirteen options in a dropdown is the
 * heaviest question on the form, and it is one George can settle in the reply text that is
 * already being sent. It goes back in as a field on the onboarding flow, not on the quote form.
 */
export const contactRequestSchema = z.object({
  ...leadFields,
  /**
   * Whether they agreed to be texted. OPTIONAL, deliberately: consent that is required in order to
   * submit is not consent, and a form that withholds a quote until you accept marketing texts is
   * the thing the TCPA exists to stop. Unchecked is a perfectly good submission — it just means
   * George replies by phone or email instead.
   */
  smsConsent: z.boolean(),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

/**
 * Whether we cover a zip, checked against the same city list the site renders. The authoritative
 * check happens against Sweep&Go's `check_zip_code_exists` at onboarding time; this one exists so
 * an out-of-area visitor gets an honest answer immediately rather than waiting for a callback.
 */
export function isServicedZip(zip: string): boolean {
  return servicedZips.includes(zip);
}
