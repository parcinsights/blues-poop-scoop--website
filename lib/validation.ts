import { z } from "zod";

import { servicedZips } from "@/content/cities";

/**
 * One schema, used by the browser and the API route.
 *
 * Client-side validation is a convenience; server-side validation is the actual check. Sharing the
 * schema means they cannot drift apart and disagree about what a valid lead looks like.
 */

export const FREQUENCIES = ["weekly", "biweekly", "not-sure"] as const;

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

export const quickLeadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  phone: phoneSchema,
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Please enter a 5-digit zip code"),
  dogs: z.coerce.number().int().min(1, "At least one dog").max(20),
  frequency: z.enum(FREQUENCIES).optional(),
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
});

export type QuickLead = z.infer<typeof quickLeadSchema>;

/**
 * ── The contact form ─────────────────────────────────────────────────────────
 *
 * A different form to a different question, which is why it is a second schema and not a longer
 * first one. The short form's job is to get a stranger to raise a hand — five fields, name first.
 * This one is filled in by someone who has already decided to ask for a price, so it asks the
 * things a price actually depends on and drops the ones that do not: no name (the phone number and
 * the email are how George replies, and a name is a field between the visitor and the answer).
 *
 * The order is the client's, and it is the right one: the two questions that set the price come
 * first, the two that set the FIRST visit's price come next, and the contact details come last —
 * by the time someone is typing their mobile number they have already invested four answers, which
 * is the point at which people finish forms instead of abandoning them.
 */

/**
 * How often we come. Three real answers and no "not sure" — the short form offers that escape
 * hatch because it is asking a stranger; here the visitor is asking for a quote, and a quote needs
 * a frequency. Monthly is on this list and not on the short form's, which is the one thing the two
 * lists disagree about.
 *
 * DEFERRED: Sweep&Go's `clean_up_frequency` takes its own vocabulary and the onboarding call must
 * send one of its values verbatim. Map these there, at the seam — see lib/integrations.ts.
 */
export const CLEANUP_FREQUENCIES = ["weekly", "biweekly", "monthly"] as const;
export type CleanupFrequency = (typeof CLEANUP_FREQUENCIES)[number];

/**
 * NO `LAST_CLEANED`. The contact form used to ask how long the yard had been left — the
 * initial-cleanup question, and the reason a first visit costs more than the ones after it. It is
 * gone from the form and therefore from the payload: thirteen options in a dropdown is the
 * heaviest question on a form of five, and it is one George can settle in the reply text that is
 * already being sent. It goes back in as a field on the onboarding flow, not on the quote form.
 */
export const contactRequestSchema = z.object({
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Please enter a 5-digit zip code"),
  dogs: z.coerce.number().int().min(1, "At least one dog").max(20),
  // The select opens on an empty option rather than on a guess. "" fails the enum, which is the
  // whole point: a pre-selected "weekly" is an answer the visitor never gave, and it would go to
  // the CRM looking exactly like one they did.
  frequency: z.enum(CLEANUP_FREQUENCIES, { error: "Please choose how often you'd like us out" }),
  email: z.email("Please enter a valid email address"),
  phone: phoneSchema,
  /**
   * Whether they agreed to be texted. OPTIONAL, deliberately: consent that is required in order to
   * submit is not consent, and a form that withholds a quote until you accept marketing texts is
   * the thing the TCPA exists to stop. Unchecked is a perfectly good submission — it just means
   * George replies by phone or email instead.
   */
  smsConsent: z.boolean(),
  /** Honeypot. Same trick, and the same reason it is accepted here and dropped in the route. */
  company: z.string().max(200).optional(),
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
