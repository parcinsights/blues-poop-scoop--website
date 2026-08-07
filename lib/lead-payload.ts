import type { ContactRequest, QuickLead } from "@/lib/validation";
import { isServicedZip } from "@/lib/validation";

/**
 * ONE payload shape, for every form on the site.
 *
 * The two forms ask different questions — the short one asks for a name and offers "not sure" as a
 * frequency, the contact one drops the name and adds an SMS consent — but the webhook receiving
 * them is a single GoHighLevel inbound trigger, and a trigger that gets two different key sets is
 * a trigger that has to be built twice and drifts the moment a third form appears.
 *
 * So every key below is ALWAYS present, and a question a given form never asked arrives as `null`
 * rather than as a missing key. `null` is an answer ("we did not ask") that a CRM mapping can see;
 * an absent key is a field that silently maps to nothing.
 *
 * Adding a form means calling this and nothing else.
 */
export type LeadSource = "quick-form" | "contact-form";

export type WebhookLead = {
  /** Which form this came from. The one field that tells the two apart in the CRM inbox. */
  source: LeadSource;
  /** ISO 8601, server clock. */
  submittedAt: string;
  /** Null on the contact form, which deliberately does not ask for a name. */
  name: string | null;
  email: string;
  /** Ten digits, punctuation already stripped by `phoneSchema`. */
  phone: string;
  zip: string;
  dogs: number;
  /**
   * The two forms offer different vocabularies — "not-sure" only on the short one, "monthly" only
   * on the contact one — so this stays a string rather than a union. Null when unanswered.
   */
  frequency: string | null;
  /** Only the contact form asks. False on the short form, which therefore claims no consent. */
  smsConsent: boolean;
  /** Checked against our own `servicedZips`, the same list the site renders. */
  inServiceArea: boolean;
};

/**
 * Build the canonical payload from whichever form's validated data we have.
 *
 * Both schemas are discriminated structurally rather than by a tag: the short form has a `name`,
 * the contact form has an `smsConsent`. Optional chaining is avoided on purpose — every branch
 * writes every key, so a new field cannot be added to one form and forgotten in the other.
 */
export function toWebhookLead(source: LeadSource, lead: QuickLead | ContactRequest): WebhookLead {
  const quick = "name" in lead ? lead : null;
  const contact = "smsConsent" in lead ? lead : null;

  return {
    source,
    submittedAt: new Date().toISOString(),
    name: quick ? quick.name : null,
    email: lead.email,
    phone: lead.phone,
    zip: lead.zip,
    dogs: lead.dogs,
    frequency: (quick ? quick.frequency : contact?.frequency) ?? null,
    smsConsent: contact ? contact.smsConsent : false,
    inServiceArea: isServicedZip(lead.zip),
  };
}
