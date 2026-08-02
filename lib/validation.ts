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
 * How long the yard has been left. This is the initial-cleanup question, and it is the reason the
 * first visit costs more than the ones after it: a yard nobody has touched since spring is an
 * afternoon, not twenty minutes.
 *
 * Weeks at the short end and months at the long, because that is how people actually hold the
 * answer — nobody says "seven weeks", they say "a couple of months". The list ends at `10-plus`
 * rather than climbing forever: past that point the answer is "a long time" and the price is a
 * conversation either way.
 *
 * The labels live with the form; these are the values that go to the CRM. See ContactForm.
 */
export const LAST_CLEANED = [
  "1-week",
  "2-weeks",
  "3-weeks",
  "1-month",
  "2-months",
  "3-months",
  "4-months",
  "5-months",
  "6-months",
  "7-months",
  "8-months",
  "9-months",
  "10-plus-months",
] as const;
export type LastCleaned = (typeof LAST_CLEANED)[number];

export const contactRequestSchema = z.object({
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Please enter a 5-digit zip code"),
  dogs: z.coerce.number().int().min(1, "At least one dog").max(20),
  // Both selects open on an empty option rather than on a guess. "" fails the enum, which is the
  // whole point: a pre-selected "weekly" is an answer the visitor never gave, and it would go to
  // the CRM looking exactly like one they did.
  frequency: z.enum(CLEANUP_FREQUENCIES, { error: "Please choose how often you'd like us out" }),
  lastCleaned: z.enum(LAST_CLEANED, { error: "Please choose roughly how long it's been" }),
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
