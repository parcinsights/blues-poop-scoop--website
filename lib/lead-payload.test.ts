import { describe, expect, it } from "vitest";

import { toWebhookLead } from "@/lib/lead-payload";
import { contactRequestSchema, quickLeadSchema } from "@/lib/validation";

/**
 * The whole point of the module: one webhook, one payload shape. If these two key sets ever
 * disagree, the GoHighLevel trigger silently maps nothing for whichever form changed.
 */

const quick = quickLeadSchema.parse({
  name: "George",
  email: "george@example.com",
  phone: "(267) 640-6798",
  zip: "19001",
  dogs: "2",
  frequency: "not-sure",
});

const contact = contactRequestSchema.parse({
  zip: "19001",
  dogs: "2",
  frequency: "monthly",
  email: "george@example.com",
  phone: "267.640.6798",
  smsConsent: true,
});

describe("toWebhookLead", () => {
  it("sends the same keys from both forms", () => {
    const fromQuick = Object.keys(toWebhookLead("quick-form", quick)).sort();
    const fromContact = Object.keys(toWebhookLead("contact-form", contact)).sort();
    expect(fromQuick).toEqual(fromContact);
  });

  it("drops the honeypot and keeps every question as a value, null when unasked", () => {
    const payload = toWebhookLead("contact-form", contact);
    expect(payload).toMatchObject({
      source: "contact-form",
      name: null, // the contact form does not ask
      phone: "2676406798", // normalised by the schema, not by the payload
      dogs: 2,
      frequency: "monthly",
      smsConsent: true,
    });
    expect(payload).not.toHaveProperty("company");
  });

  it("claims no SMS consent for the short form, which never asks", () => {
    expect(toWebhookLead("quick-form", quick)).toMatchObject({
      source: "quick-form",
      name: "George",
      smsConsent: false,
      frequency: "not-sure",
    });
  });

  it("carries the service-area answer so the CRM does not have to guess", () => {
    const out = toWebhookLead("quick-form", { ...quick, zip: "90210" });
    expect(out.inServiceArea).toBe(false);
    expect(toWebhookLead("quick-form", quick).inServiceArea).toBe(true);
  });
});
