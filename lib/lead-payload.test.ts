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
  name: "George",
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

  it("drops the honeypot and carries every question as a real value", () => {
    const payload = toWebhookLead("contact-form", contact);
    expect(payload).toMatchObject({
      source: "contact-form",
      name: "George",
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

  it("files a campaign lead under its slug and UTM tags, and every other lead under null", () => {
    const fromAd = toWebhookLead(
      "quick-form",
      quickLeadSchema.parse({
        ...quick,
        campaign: "poop-free-yard",
        utm_source: "facebook",
        utm_campaign: "fall",
      }),
    );
    expect(fromAd).toMatchObject({
      campaign: "poop-free-yard",
      utmSource: "facebook",
      utmCampaign: "fall",
      utmMedium: null,
    });

    // Present and null, not absent — a CRM mapping reads null; a missing key maps to nothing.
    expect(toWebhookLead("contact-form", contact)).toMatchObject({
      campaign: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
    });
  });
});
