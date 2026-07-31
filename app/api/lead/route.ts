import { NextResponse } from "next/server";

import { deliverToGhl, missingIntegrationIsFatal } from "@/lib/integrations";
import { quickLeadSchema, isServicedZip } from "@/lib/validation";

/**
 * The short-form lead sink: validate, then forward to GoHighLevel, where an automation texts and
 * emails George.
 *
 * Sweep&Go is deliberately NOT called here. Its onboarding endpoint creates a real client and
 * requires a full address, a frequency and an initial-cleanup decision — data this form does not
 * collect, and should not, because asking for it up front costs most of the submissions. The full
 * onboarding flow (phase 5, /api/onboard) will post to both.
 *
 * DEFERRED: GHL_WEBHOOK_URL is not set yet. Until it is, this route accepts and logs leads off
 * production so the form is reviewable during design, and refuses on production so a lead can
 * never be silently swallowed. See lib/integrations.ts.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = quickLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again" }, { status: 400 });
  }

  // Honeypot: a real person never sees this field, so anything in it is a bot. Return 200 so the
  // bot believes it succeeded and does not retry with a different shape.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const lead = {
    ...parsed.data,
    inServiceArea: isServicedZip(parsed.data.zip),
    source: "website:quick-form",
    submittedAt: new Date().toISOString(),
  };

  const result = await deliverToGhl(lead);

  if (result.status === "not-configured") {
    if (missingIntegrationIsFatal()) {
      console.error(`[lead] ${result.missing} is not set — lead NOT delivered`, lead);
      return NextResponse.json({ error: "Lead capture is not configured" }, { status: 503 });
    }
    // Off production this is expected: no credentials yet. Log it so it is visible, and let the
    // form complete so its success state can be designed and reviewed.
    console.warn(`[lead] ${result.missing} not set — accepted without delivery`, lead);
    return NextResponse.json({ ok: true, delivered: false });
  }

  if (result.status === "failed") {
    // Log the whole payload: a lead that failed to deliver is recoverable from logs, and silently
    // dropping one is the most expensive bug this route can have.
    console.error("[lead] delivery failed:", result.detail, lead);
    return NextResponse.json({ error: "Could not send that right now" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
