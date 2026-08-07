import type { ContactRequest, QuickLead } from "@/lib/validation";
import { isServicedZip } from "@/lib/validation";

/**
 * ONE payload shape, for every form on the site.
 *
 * Every form now asks the same six questions — see `leadFields` — so every key below carries a
 * real answer on every submission. The webhook receiving them is a single GoHighLevel inbound
 * trigger, and a trigger that gets two different key sets is a trigger that has to be built twice
 * and drifts the moment a third form appears.
 *
 * `smsConsent` is the one thing the forms differ on, and it is a permission rather than a question:
 * only /contact/ has room to state what is being agreed to, so a lead from anywhere else claims
 * nothing. It is still ALWAYS present — `false` is an answer a CRM mapping can read, an absent key
 * is a field that silently maps to nothing.
 *
 * Adding a form means calling this and nothing else.
 */
export type LeadSource = "quick-form" | "contact-form";

export type WebhookLead = {
  /** Which form this came from. The one field that tells the two apart in the CRM inbox. */
  source: LeadSource;
  /** ISO 8601, server clock. */
  submittedAt: string;
  name: string;
  email: string;
  /** Ten digits, punctuation already stripped by `phoneSchema`. */
  phone: string;
  zip: string;
  dogs: number;
  /** One of `FREQUENCIES`. A string rather than a union so the CRM contract survives a new option. */
  frequency: string;
  /** Only /contact/ asks. False elsewhere, which therefore claims no consent. */
  smsConsent: boolean;
  /** Checked against our own `servicedZips`, the same list the site renders. */
  inServiceArea: boolean;
};

/**
 * Build the canonical payload from whichever form's validated data we have.
 *
 * The two schemas are discriminated structurally rather than by a tag: `smsConsent` is the only
 * key one has and the other does not. Everything else is read straight off `lead`, because both
 * schemas spread the same `leadFields` — which is what makes a field added there impossible to
 * forget here.
 */
export function toWebhookLead(source: LeadSource, lead: QuickLead | ContactRequest): WebhookLead {
  return {
    source,
    submittedAt: new Date().toISOString(),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    zip: lead.zip,
    dogs: lead.dogs,
    frequency: lead.frequency,
    smsConsent: "smsConsent" in lead ? lead.smsConsent : false,
    inServiceArea: isServicedZip(lead.zip),
  };
}
