import { describe, expect, it } from "vitest";

import { ATTRIBUTION_MAX_LENGTH, UTM_KEYS, readUtmTags } from "./attribution";
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
  frequency: "weekly",
};

const validContactRequest = {
  ...validQuickLead,
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
});

/**
 * THE POINT OF `leadFields`. Every form on the site asks the same six questions, so the two schemas
 * must accept the same keys — `smsConsent` excepted, which is a permission and lives on /contact/
 * alone. A form that quietly drops a question is the bug this whole shape exists to make
 * impossible, and it is invisible until a lead arrives in the CRM with a hole in it.
 */
describe("one field set, every form", () => {
  const questions = ["name", "email", "phone", "zip", "dogs", "frequency", "company"];
  /** Where the lead came from — optional on both, sent only by the ad landing pages. */
  const attribution = ["campaign", ...UTM_KEYS];

  it("asks the same questions on both schemas", () => {
    expect(Object.keys(quickLeadSchema.shape).sort()).toEqual(
      [...questions, ...attribution].sort(),
    );
    expect(Object.keys(contactRequestSchema.shape).sort()).toEqual(
      [...questions, ...attribution, "smsConsent"].sort(),
    );
  });

  it("requires every question on both", () => {
    for (const missing of ["name", "email", "phone", "zip", "dogs", "frequency"]) {
      const { [missing]: _dropped, ...rest } = validContactRequest as Record<string, unknown>;
      expect(quickLeadSchema.safeParse(rest).success, `quick lead without ${missing}`).toBe(false);
      expect(contactRequestSchema.safeParse(rest).success, `contact without ${missing}`).toBe(
        false,
      );
    }
  });

  /** "" is what an unanswered select submits, and it must not become a silent "weekly". */
  it("refuses an unanswered frequency on either form", () => {
    expect(quickLeadSchema.safeParse({ ...validQuickLead, frequency: "" }).success).toBe(false);
    expect(contactRequestSchema.safeParse({ ...validContactRequest, frequency: "" }).success).toBe(
      false,
    );
  });

  /** Both offer the whole vocabulary now — "not-sure" and "monthly" used to be one form each. */
  it("accepts every frequency on either form", () => {
    for (const frequency of ["weekly", "biweekly", "monthly", "not-sure"]) {
      expect(quickLeadSchema.safeParse({ ...validQuickLead, frequency }).success).toBe(true);
      expect(contactRequestSchema.safeParse({ ...validContactRequest, frequency }).success).toBe(
        true,
      );
    }
  });
});

describe("attribution", () => {
  it("is optional — a lead from any ordinary form still parses", () => {
    expect(quickLeadSchema.safeParse(validQuickLead).success).toBe(true);
  });

  it("carries the campaign and the UTM tags through", () => {
    const parsed = quickLeadSchema.parse({
      ...validQuickLead,
      campaign: "poop-free-yard",
      utm_source: "facebook",
      utm_content: "blue-video",
    });
    expect(parsed).toMatchObject({
      campaign: "poop-free-yard",
      utm_source: "facebook",
      utm_content: "blue-video",
    });
  });

  it("caps a crafted value rather than passing an unbounded string to the CRM", () => {
    const long = "x".repeat(ATTRIBUTION_MAX_LENGTH + 1);
    expect(quickLeadSchema.safeParse({ ...validQuickLead, utm_campaign: long }).success).toBe(false);
  });
});

describe("readUtmTags", () => {
  it("reads the five tags and ignores everything else on the URL", () => {
    expect(
      readUtmTags("?utm_source=facebook&utm_medium=paid&fbclid=abc123&utm_campaign=fall"),
    ).toEqual({ utm_source: "facebook", utm_medium: "paid", utm_campaign: "fall" });
  });

  it("drops blanks, so an empty tag is not sent as an answer", () => {
    expect(readUtmTags("?utm_source=&utm_content=%20")).toEqual({});
  });

  it("truncates rather than rejects a long tag, so the lead still sends", () => {
    const tags = readUtmTags(`?utm_term=${"y".repeat(500)}`);
    expect(tags.utm_term).toHaveLength(ATTRIBUTION_MAX_LENGTH);
  });
});
