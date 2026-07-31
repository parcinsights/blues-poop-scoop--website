import { NextResponse } from "next/server";

import { quickLeadSchema, isServicedZip } from "@/lib/validation";

/**
 * The short-form lead sink: validate, then forward to GoHighLevel, where an automation texts and
 * emails George.
 *
 * Sweep&Go is deliberately NOT called here. Its onboarding endpoint creates a real client and
 * requires a full address, a frequency and an initial-cleanup decision — data this form does not
 * collect, and should not, because asking for it up front costs most of the submissions. The full
 * onboarding flow at /get-started/ posts to both.
 *
 * The webhook URL lives in env and is never committed (it is effectively a credential — anyone
 * holding it can inject leads into the client's CRM).
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

  const webhook = process.env.GHL_WEBHOOK_URL;
  if (!webhook) {
    // Loud in development, so a missing env var is found now rather than by a lost lead later.
    console.error("[lead] GHL_WEBHOOK_URL is not set — lead was not delivered", parsed.data);
    return NextResponse.json({ error: "Lead capture is not configured" }, { status: 503 });
  }

  const lead = {
    ...parsed.data,
    inServiceArea: isServicedZip(parsed.data.zip),
    source: "website:quick-form",
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      // Log the whole payload: a lead that failed to deliver is recoverable from logs, and
      // silently dropping one is the most expensive bug this route can have.
      console.error("[lead] GHL rejected the webhook", response.status, lead);
      return NextResponse.json({ error: "Could not send that right now" }, { status: 502 });
    }
  } catch (error) {
    console.error("[lead] GHL webhook threw", error, lead);
    return NextResponse.json({ error: "Could not send that right now" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
