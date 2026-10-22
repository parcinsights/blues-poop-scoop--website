import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { markLeadPending, reportSignup, type LeadSource } from "./analytics";
import { routes } from "./routes";

/**
 * Which platform hears about which form.
 *
 * Google Ads counts leads by URL — its "Submit lead form" action is a page-view rule matching the
 * pattern below, compiled into the Google tag (read off the live tag on 2026-10-21). The ad landing
 * pages belong to the Meta campaign and must stay out of it, so their thank-you URL must not match.
 * Meta hears about every lead, from code.
 */

const GOOGLE_ADS_LEAD_RULE = /^https?:\/\/bluespoopscoop\.com\/thank-you\//;
const ORIGIN = "https://bluespoopscoop.com";

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  };
}

let gtag: ReturnType<typeof vi.fn>;
let fbq: ReturnType<typeof vi.fn>;

beforeEach(() => {
  gtag = vi.fn();
  fbq = vi.fn();
  vi.stubGlobal("window", { sessionStorage: memoryStorage(), gtag, fbq });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Google Ads lead conversion", () => {
  it("counts the main site's thank-you page", () => {
    expect(`${ORIGIN}${routes.thankYou()}`).toMatch(GOOGLE_ADS_LEAD_RULE);
  });

  it("does NOT count an ad landing page's thank-you page", () => {
    expect(`${ORIGIN}${routes.campaignThankYou("poop-free-yard")}`).not.toMatch(GOOGLE_ADS_LEAD_RULE);
  });

  it("is never sent from code, which would double-count on top of the URL rule", () => {
    for (const source of ["quick_lead", "contact", "campaign"] as const) {
      markLeadPending(source);
      reportSignup();
    }
    expect(gtag).not.toHaveBeenCalled();
  });
});

describe("Meta Lead event", () => {
  it.each<LeadSource>(["quick_lead", "contact", "campaign"])("reports a %s submit", (source) => {
    markLeadPending(source);
    reportSignup();

    expect(fbq).toHaveBeenCalledWith("track", "Lead", { content_name: source });
  });

  it("reports nothing on a reload of the thank-you page", () => {
    markLeadPending("contact");
    reportSignup();
    reportSignup();

    expect(fbq).toHaveBeenCalledTimes(1);
  });
});
