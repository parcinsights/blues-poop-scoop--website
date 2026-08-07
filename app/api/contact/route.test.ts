import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

/**
 * The contact route's half of the gate. The lead route's test covers the shared behaviour; what is
 * worth proving separately is that this route expects its OWN action, so a token minted on the
 * short form cannot be spent here, and that its payload is the same shape with `name` null.
 */

const GHL = "https://webhook.test/ghl";
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const validRequest = {
  zip: "19001",
  dogs: 2,
  frequency: "weekly",
  email: "george@example.com",
  phone: "2676406798",
  smsConsent: true,
  turnstileToken: "token",
};

function post(body: unknown) {
  return POST(
    new Request("https://bluespoopscoop.com/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

/** `action` is what the stubbed Cloudflare claims the token was minted for. */
function stubNetwork(action: string) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    if (url === SITEVERIFY) {
      return Response.json({ success: true, action, hostname: "bluespoopscoop.com" });
    }
    if (url === GHL) return Response.json({ ok: true });
    throw new Error(`unexpected fetch to ${url}`);
  });
}

function ghlCalls(fetchSpy: ReturnType<typeof stubNetwork>) {
  return fetchSpy.mock.calls.filter(([input]) => String(input) === GHL);
}

beforeEach(() => {
  vi.stubEnv("GHL_WEBHOOK_URL", GHL);
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://bluespoopscoop.com");
  vi.stubEnv("VERCEL_ENV", "production");
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("delivers a verified request in the same payload shape, with no name", async () => {
    const fetchSpy = stubNetwork("contact");
    const response = await post(validRequest);

    expect(response.status).toBe(200);
    const payload = JSON.parse(String((ghlCalls(fetchSpy)[0]![1] as RequestInit).body));
    expect(payload).toMatchObject({
      source: "contact-form",
      name: null,
      frequency: "weekly",
      smsConsent: true,
      inServiceArea: true,
    });
    expect(payload).not.toHaveProperty("turnstileToken");
  });

  it("refuses a token minted on the short form", async () => {
    const fetchSpy = stubNetwork("quick-lead");
    const response = await post(validRequest);

    expect(response.status).toBe(403);
    expect(ghlCalls(fetchSpy)).toHaveLength(0);
  });
});
