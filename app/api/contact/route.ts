import { NextResponse } from "next/server";

import { deliverToGhl, missingIntegrationIsFatal } from "@/lib/integrations";
import { toWebhookLead } from "@/lib/lead-payload";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";
import { contactRequestSchema } from "@/lib/validation";

/**
 * The contact form's sink. Same destination as /api/lead — GoHighLevel, where an automation texts
 * and emails George — and a separate route because it carries one extra answer, the SMS consent,
 * and because its Turnstile `action` must differ from the short form's.
 *
 * The PAYLOAD is identical: same keys, same order, same values for the six questions both forms
 * ask. `source` and `smsConsent` are the only fields that tell the two apart once they are sitting
 * in the same CRM inbox, and `source` matters — a contact-form lead may have agreed to be texted,
 * so the reply can open with a price rather than with a question.
 *
 * Sweep&Go is not called here either. This form now collects nearly everything their onboarding
 * endpoint wants — the gap is the street address — so this is the route phase 5 will extend rather
 * than the short one. See lib/integrations.ts.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again" }, { status: 400 });
  }

  // Honeypot: a real person never sees this field. Return 200 so the bot believes it worked and
  // does not come back with a different shape.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  // The bot gate. `action` is "contact" here and "quick-lead" on the other route, which is what
  // stops a token minted on one form being spent on the other. See lib/turnstile.ts.
  const gate = await verifyTurnstile({
    token: (body as { turnstileToken?: unknown }).turnstileToken,
    action: "contact",
    ip: clientIp(request),
  });
  if (gate.status === "rejected" || gate.status === "failed") {
    console.warn(`[contact] turnstile ${gate.status}: ${gate.detail}`);
    return NextResponse.json({ error: "Could not verify that submission" }, { status: 403 });
  }
  if (gate.status === "not-configured") {
    console.warn("[contact] TURNSTILE_SECRET_KEY not set — lead accepted without bot check");
  }

  // The canonical webhook shape — the same keys /api/lead sends, with `name` null and `smsConsent`
  // carrying the box. One trigger on the GHL side reads both. See lib/lead-payload.ts.
  const lead = toWebhookLead("contact-form", parsed.data);

  const result = await deliverToGhl(lead);

  if (result.status === "not-configured") {
    if (missingIntegrationIsFatal()) {
      console.error(`[contact] ${result.missing} is not set — lead NOT delivered`, lead);
      return NextResponse.json({ error: "Lead capture is not configured" }, { status: 503 });
    }
    console.warn(`[contact] ${result.missing} not set — accepted without delivery`, lead);
    return NextResponse.json({ ok: true, delivered: false });
  }

  if (result.status === "failed") {
    // The whole payload goes to the log: a lead that failed to deliver is recoverable from one,
    // and dropping it silently is the most expensive bug this route can have.
    console.error("[contact] delivery failed:", result.detail, lead);
    return NextResponse.json({ error: "Could not send that right now" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
