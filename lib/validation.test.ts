import { describe, expect, it } from "vitest";

import { contactRequestSchema, quickLeadSchema } from "./validation";

/**
 * The phone rules, exercised through the two schemas that carry them rather than against the
 * internal `phoneSchema` — a lead is only ever validated as a whole object, and that is the path
 * worth protecting.
 *
 * The field formats itself (see `PhoneInput`), so these cases are the ones the field cannot
 * prevent: a paste, a bot posting straight at the API, and the shape the field itself submits.
 */
const validQuickLead = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(267) 640-6798",
  zip: "19118",
  dogs: "2",
};

const validContactRequest = {
  zip: "19118",
  dogs: "2",
  frequency: "weekly",
  email: "jane@example.com",
  phone: "(267) 640-6798",
  smsConsent: true,
};

describe("phone normalisation", () => {
  it("reduces whatever the field submits to ten bare digits", () => {
    const parsed = quickLeadSchema.parse(validQuickLead);
    expect(parsed.phone).toBe("2676406798");
  });

  it("accepts the shapes people paste, and normalises them all the same way", () => {
    for (const input of [
      "2676406798",
      "267-640-6798",
      "267.640.6798",
      "+1 (267) 640-6798",
      "1 267 640 6798",
      " (267) 640-6798 ",
    ]) {
      expect(quickLeadSchema.parse({ ...validQuickLead, phone: input }).phone).toBe("2676406798");
    }
  });

  it("rejects anything that is not ten digits", () => {
    for (const input of ["267640679", "26764067989", "", "call me"]) {
      expect(quickLeadSchema.safeParse({ ...validQuickLead, phone: input }).success).toBe(false);
    }
  });

  /** An area code or exchange starting 0 or 1 is not a number the NANP issues. */
  it("rejects area codes and exchanges the numbering plan cannot issue", () => {
    for (const input of ["0676406798", "1676406798", "2670406798", "2671406798"]) {
      expect(quickLeadSchema.safeParse({ ...validQuickLead, phone: input }).success).toBe(false);
    }
  });

  it("applies the same rule on the contact form", () => {
    expect(contactRequestSchema.parse(validContactRequest).phone).toBe("2676406798");
    expect(
      contactRequestSchema.safeParse({ ...validContactRequest, phone: "267640679" }).success,
    ).toBe(false);
  });
});

describe("contact request", () => {
  /** The last-clean-up question is gone; a payload without it must still parse. */
  it("no longer requires a last-clean-up answer", () => {
    expect(contactRequestSchema.safeParse(validContactRequest).success).toBe(true);
  });

  /** "" is what an unanswered select submits, and it must not become a silent "weekly". */
  it("refuses an unanswered frequency", () => {
    expect(contactRequestSchema.safeParse({ ...validContactRequest, frequency: "" }).success).toBe(
      false,
    );
  });
});
