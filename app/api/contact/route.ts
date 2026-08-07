import { NextResponse } from "next/server";

import { deliverToGhl, missingIntegrationIsFatal } from "@/lib/integrations";
import { toWebhookLead } from "@/lib/lead-payload";
import { contactRequestSchema } from "@/lib/validation";

/**
 * The contact form's sink. Same destination as /api/lead — GoHighLevel, where an automation texts
 * and emails George — and a separate route because it carries a different payload: a frequency and
 * an SMS consent, and no name.
 *
 * The PAYLOAD is identical — same keys, same order, `name` null here because this form does not ask
 * for one. `source` is the only field that tells the two apart once they are both sitting in the
 * same CRM inbox, and it matters: a contact-form lead has said how often it wants us out and may
 * have agreed to be texted, so the reply can open with a price rather than with a question.
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
