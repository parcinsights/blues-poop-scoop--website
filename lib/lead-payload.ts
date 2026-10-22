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
  /**
   * The ad landing page the form sat on — a slug from content/campaigns.ts — or null for every
   * other form. It is the field a CRM filter is built on: "leads from the poop-free-yard ad".
   * See lib/attribution.ts.
   */
  campaign: string | null;
  /** The ad link's UTM tags, null when the link carried none. Always present, like every key here. */
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
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
    // `|| null` rather than `?? null`: an empty string is no more an answer than a missing key.
    campaign: lead.campaign || null,
    utmSource: lead.utm_source || null,
    utmMedium: lead.utm_medium || null,
    utmCampaign: lead.utm_campaign || null,
    utmContent: lead.utm_content || null,
    utmTerm: lead.utm_term || null,
  };
}
