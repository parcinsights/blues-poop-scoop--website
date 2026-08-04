import { z } from "zod";

import { servicedZips } from "@/content/cities";

/**
 * One schema, used by the browser and the API route.
 *
 * Client-side validation is a convenience; server-side validation is the actual check. Sharing the
 * schema means they cannot drift apart and disagree about what a valid lead looks like.
 */

export const FREQUENCIES = ["weekly", "biweekly", "not-sure"] as const;

export const quickLeadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+.-]{10,}$/, "Please enter a valid phone number"),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Please enter a 5-digit zip code"),
  dogs: z.coerce.number().int().min(1, "At least one dog").max(20),
  frequency: z.enum(FREQUENCIES).optional(),
  /** Honeypot — must be empty. A bot fills it; a human never sees it. */
  company: z.string().max(0).optional(),
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
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+.-]{10,}$/, "Please enter a valid phone number"),
  /**
   * Whether they agreed to be texted. OPTIONAL, deliberately: consent that is required in order to
   * submit is not consent, and a form that withholds a quote until you accept marketing texts is
   * the thing the TCPA exists to stop. Unchecked is a perfectly good submission — it just means
   * George replies by phone or email instead.
   */
  smsConsent: z.boolean(),
  /** Honeypot — must be empty. Same trick as the short form. */
  company: z.string().max(0).optional(),
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
