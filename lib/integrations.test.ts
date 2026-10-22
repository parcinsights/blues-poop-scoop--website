import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { deliverToGhl } from "./integrations";

/**
 * Where a lead goes, by environment. The rule: the real GoHighLevel trigger is used by the
 * production deploy and nowhere else, so a test submission from a laptop or a preview can never
 * text the owner. An explicit GHL_WEBHOOK_URL is the one way to deliver off production.
 */

const REAL_TRIGGER = "https://services.leadconnectorhq.com/hooks/";
const OVERRIDE = "https://webhook.test/ghl";

function stubFetch() {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ok: true }));
}

beforeEach(() => {
  vi.stubEnv("GHL_WEBHOOK_URL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("deliverToGhl", () => {
  it("posts to the real trigger on the production deploy", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const fetchSpy = stubFetch();

    expect(await deliverToGhl({ source: "quick-form" })).toEqual({ status: "delivered" });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(String(fetchSpy.mock.calls[0]![0])).toMatch(new RegExp(`^${REAL_TRIGGER}`));
  });

  it.each([
    ["a local dev server", ""],
    ["vercel dev", "development"],
    ["a preview deploy", "preview"],
  ])("sends nothing from %s", async (_where, vercelEnv) => {
    vi.stubEnv("VERCEL_ENV", vercelEnv);
    const fetchSpy = stubFetch();

    expect(await deliverToGhl({ source: "quick-form" })).toEqual({
      status: "not-configured",
      missing: "GHL_WEBHOOK_URL",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("treats a whitespace-only override as no override", async () => {
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("GHL_WEBHOOK_URL", "   ");
    const fetchSpy = stubFetch();

    expect((await deliverToGhl({})).status).toBe("not-configured");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("honours an explicit override anywhere, so delivery can be tested on purpose", async () => {
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("GHL_WEBHOOK_URL", OVERRIDE);
    const fetchSpy = stubFetch();

    expect(await deliverToGhl({})).toEqual({ status: "delivered" });
    expect(String(fetchSpy.mock.calls[0]![0])).toBe(OVERRIDE);
  });
});
