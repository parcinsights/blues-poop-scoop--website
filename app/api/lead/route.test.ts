import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

/**
 * The lead route end to end, with the network stubbed: what gets through the gate, what does not,
 * and — the thing that actually matters — that nothing which fails the gate ever reaches the CRM.
 *
 * Both outbound calls go through `fetch`, so one stub covers Cloudflare and GoHighLevel; they are
 * told apart by url. `GHL_WEBHOOK_URL` is overridden to a fake so that a test which slips past the
 * stub cannot post a fictional lead into the client's real inbox.
 */

const GHL = "https://webhook.test/ghl";
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const validLead = {
  name: "George",
  email: "george@example.com",
  phone: "2676406798",
  zip: "19001",
  dogs: 1,
  turnstileToken: "token",
};

function post(body: unknown) {
  return POST(
    new Request("https://bluespoopscoop.com/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.7" },
      body: JSON.stringify(body),
    }),
  );
}

/** Stub both destinations. `verified` decides what Cloudflare says about the token. */
function stubNetwork({ verified }: { verified: boolean }) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    if (url === SITEVERIFY) {
      return Response.json({
        success: verified,
        action: "quick-lead",
        hostname: "bluespoopscoop.com",
        "error-codes": verified ? [] : ["invalid-input-response"],
      });
    }
    if (url === GHL) return Response.json({ ok: true });
    throw new Error(`unexpected fetch to ${url}`);
  });
}

/** Every call the stub saw that went to the CRM. */
function ghlCalls(fetchSpy: ReturnType<typeof stubNetwork>) {
  return fetchSpy.mock.calls.filter(([input]) => String(input) === GHL);
}

beforeEach(() => {
  vi.stubEnv("GHL_WEBHOOK_URL", GHL);
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://bluespoopscoop.com");
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("SWEEPANDGO_API_TOKEN", "");
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/lead", () => {
  it("delivers a verified lead in the canonical payload shape", async () => {
    const fetchSpy = stubNetwork({ verified: true });
    const response = await post(validLead);

    expect(response.status).toBe(200);
    const [call] = ghlCalls(fetchSpy);
    expect(call).toBeDefined();
    const payload = JSON.parse(String((call![1] as RequestInit).body));
    expect(payload).toMatchObject({
      source: "quick-form",
      name: "George",
      email: "george@example.com",
      phone: "2676406798",
      zip: "19001",
      dogs: 1,
      smsConsent: false,
      inServiceArea: true,
    });
    // The token is a credential for the gate, not part of the lead. It must not be forwarded.
    expect(payload).not.toHaveProperty("turnstileToken");
  });

  it("refuses a submission with no token and sends NOTHING to the CRM", async () => {
    const fetchSpy = stubNetwork({ verified: true });
    const response = await post({ ...validLead, turnstileToken: undefined });

    expect(response.status).toBe(403);
    expect(ghlCalls(fetchSpy)).toHaveLength(0);
  });

  it("refuses a token Cloudflare rejects and sends NOTHING to the CRM", async () => {
    const fetchSpy = stubNetwork({ verified: false });
    const response = await post(validLead);

    expect(response.status).toBe(403);
    expect(ghlCalls(fetchSpy)).toHaveLength(0);
  });

  it("still swallows the honeypot before spending a call on Cloudflare", async () => {
    const fetchSpy = stubNetwork({ verified: true });
    const response = await post({ ...validLead, company: "spam corp" });

    // 200 so the bot believes it worked, and not a single outbound call.
    expect(response.status).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("lets the lead through when the gate is unconfigured, rather than closing the form", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const fetchSpy = stubNetwork({ verified: true });
    const response = await post({ ...validLead, turnstileToken: undefined });

    expect(response.status).toBe(200);
    expect(ghlCalls(fetchSpy)).toHaveLength(1);
  });
});
