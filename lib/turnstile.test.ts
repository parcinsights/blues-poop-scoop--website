import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clientIp, turnstileIsConfigured, verifyTurnstile } from "@/lib/turnstile";

/**
 * The gate's three checks and its two failure postures. `success` alone proving nothing is the
 * whole point of the file, so every one of the other checks gets a test that would pass without it.
 */

const SECRET = "test-secret";

/** A siteverify response, with the fields that make it pass by default. */
function siteverify(overrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    json: async () => ({ success: true, action: "quick-lead", hostname: "bluespoopscoop.com", ...overrides }),
  } as Response;
}

beforeEach(() => {
  vi.stubEnv("TURNSTILE_SECRET_KEY", SECRET);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://bluespoopscoop.com");
  vi.stubEnv("TURNSTILE_HOSTNAMES", "");
  vi.stubEnv("VERCEL_ENV", "production");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("verifyTurnstile", () => {
  it("accepts a real token from the right form on the right host", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(siteverify());
    const result = await verifyTurnstile({ token: "tok", action: "quick-lead", ip: "203.0.113.7" });

    expect(result).toEqual({ status: "verified" });
    // The secret and the visitor IP go to Cloudflare; the token is what is being asked about.
    const body = String((fetchSpy.mock.calls[0]?.[1] as RequestInit).body);
    expect(body).toContain(`secret=${SECRET}`);
    expect(body).toContain("response=tok");
    expect(body).toContain("remoteip=203.0.113.7");
  });

  it("refuses a token minted for a different form", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(siteverify({ action: "contact" }));
    const result = await verifyTurnstile({ token: "tok", action: "quick-lead" });
    expect(result.status).toBe("rejected");
  });

  it("refuses a token minted on somebody else's page", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(siteverify({ hostname: "evil.example.com" }));
    const result = await verifyTurnstile({ token: "tok", action: "quick-lead" });
    expect(result.status).toBe("rejected");
  });

  it("refuses localhost on production and allows it everywhere else", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(siteverify({ hostname: "localhost" }));
    expect((await verifyTurnstile({ token: "tok", action: "quick-lead" })).status).toBe("rejected");

    vi.stubEnv("VERCEL_ENV", "development");
    expect((await verifyTurnstile({ token: "tok", action: "quick-lead" })).status).toBe("verified");
  });

  it("keeps Cloudflare's error codes so a rejection is debuggable", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      siteverify({ success: false, "error-codes": ["timeout-or-duplicate"] }),
    );
    const result = await verifyTurnstile({ token: "tok", action: "quick-lead" });
    expect(result).toEqual({ status: "rejected", detail: "timeout-or-duplicate" });
  });

  it("refuses a missing, malformed, or absurdly long token without calling out", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    for (const token of [undefined, "", 42, "x".repeat(2049)]) {
      expect((await verifyTurnstile({ token, action: "quick-lead" })).status).toBe("rejected");
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fails CLOSED when Cloudflare cannot be reached", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
    const result = await verifyTurnstile({ token: "tok", action: "quick-lead" });
    expect(result).toEqual({ status: "failed", detail: "network down" });
  });

  it("fails OPEN when no secret is configured, so a missing key cannot close the forms", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(await verifyTurnstile({ token: "tok", action: "quick-lead" })).toEqual({
      status: "not-configured",
    });
    expect(turnstileIsConfigured()).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("honours an explicit hostname allowlist", async () => {
    vi.stubEnv("TURNSTILE_HOSTNAMES", "staging.example.com, bluespoopscoop.com");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(siteverify({ hostname: "staging.example.com" }));
    expect((await verifyTurnstile({ token: "tok", action: "quick-lead" })).status).toBe("verified");
  });
});

describe("clientIp", () => {
  it("takes the first hop of x-forwarded-for, then x-real-ip, then nothing", () => {
    const forwarded = new Request("https://x.test", {
      headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18" },
    });
    expect(clientIp(forwarded)).toBe("203.0.113.7");

    const real = new Request("https://x.test", { headers: { "x-real-ip": "203.0.113.9" } });
    expect(clientIp(real)).toBe("203.0.113.9");

    expect(clientIp(new Request("https://x.test"))).toBeNull();
  });
});
