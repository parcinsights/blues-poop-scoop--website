import { NextResponse } from "next/server";

import {
  deliverToGhl,
  missingIntegrationIsFatal,
  sweepAndGo,
  type DeliveryResult,
} from "@/lib/integrations";
import { toWebhookLead } from "@/lib/lead-payload";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";
import { quickLeadSchema } from "@/lib/validation";

/**
 * The short-form lead sink — one route behind both places the short form appears (the pill card on
 * the service pages and on /locations/, which are the same QuickLeadForm component).
 *
 * The zip decides where the lead goes:
 *
 *   OUT of the service area → Sweep&Go's out_of_service_form, which is their out-of-area lead
 *     list. This is a real endpoint and it is the right home for a lead nobody is going to serve:
 *     it keeps the "we don't reach you yet" names in one place the client already looks at, rather
 *     than mixed in with quotable ones.
 *
 *   INSIDE the service area → GoHighLevel alone, where an automation texts and emails George.
 *     Sweep&Go has no create-an-in-service-lead endpoint — verified against their live API, not
 *     just their docs; see lib/integrations.ts for what was probed and what came back. Their only
 *     in-area write creates a real client and needs a street address this form does not ask for.
 *
 * GHL gets the lead either way. It is the notification channel — George should hear about an
 * out-of-area request too, because "we don't cover you yet" is still a reply someone is owed, and
 * a zip just outside the line is the kind of thing that decides where the line moves next.
 *
 * The service-area test is our own `servicedZips`, the same list the site renders, not Sweep&Go's
 * check_zip_code_exists. Two reasons: the answer has to agree with the map and the town list a
 * visitor just read, and on the current token that endpoint reports every serviced zip as unknown
 * because the account has no zips loaded.
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

  // The bot gate, after the cheap checks and before anything is delivered — no point spending a
  // round trip to Cloudflare on a payload that was never a valid lead. `action` must match the one
  // the widget was rendered with; see lib/turnstile.ts for what else is checked and what a missing
  // key does (it lets the lead through and logs, rather than closing the form).
  const gate = await verifyTurnstile({
    token: (body as { turnstileToken?: unknown }).turnstileToken,
    action: "quick-lead",
    ip: clientIp(request),
  });
  if (gate.status === "rejected" || gate.status === "failed") {
    console.warn(`[lead] turnstile ${gate.status}: ${gate.detail}`);
    return NextResponse.json({ error: "Could not verify that submission" }, { status: 403 });
  }
  if (gate.status === "not-configured") {
    console.warn("[lead] TURNSTILE_SECRET_KEY not set — lead accepted without bot check");
  }

  // The canonical webhook shape, identical to the one /api/contact sends. It is also what gets
  // logged on a failure, so a recovered lead reads the same as a delivered one.
  const lead = toWebhookLead("quick-form", parsed.data);
  const inServiceArea = lead.inServiceArea;

  // Both sinks at once. They are independent — one being down is no reason to skip the other, and
  // sequential awaits would make a slow Sweep&Go into a slow form for everybody.
  const [ghl, swg] = await Promise.all([
    deliverToGhl(lead),
    inServiceArea
      ? Promise.resolve(null)
      : sweepAndGo.saveOutOfServiceLead({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          zip: parsed.data.zip,
          // Everything their form has no field for. It is the difference between a name to call
          // back and a lead you can actually act on when the route reaches that zip.
          comment: [
            `${parsed.data.dogs} dog${parsed.data.dogs === 1 ? "" : "s"}`,
            `wants ${parsed.data.frequency}`,
            "via website quick quote form",
          ].join(" · "),
          // The short form never asks for SMS consent, so it cannot claim any. The contact form is
          // where that checkbox lives.
          marketingAllowed: false,
        }),
  ]);

  const results: DeliveryResult[] = swg === null ? [ghl] : [ghl, swg];

  // Log every failure with the whole payload before deciding what to return: a lead that failed to
  // deliver is recoverable from a log, and silently dropping one is the most expensive bug here.
  for (const result of results) {
    if (result.status === "failed") console.error("[lead] delivery failed:", result.detail, lead);
  }

  // One sink taking it is enough for the visitor to be told yes — the lead exists somewhere a human
  // will see it. A partial failure is loud in the log, not on the screen.
  if (results.some((result) => result.status === "delivered")) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  if (results.some((result) => result.status === "failed")) {
    return NextResponse.json({ error: "Could not send that right now" }, { status: 502 });
  }

  // Nothing delivered and nothing failed: every sink is unconfigured.
  const missing = results
    .map((result) => (result.status === "not-configured" ? result.missing : null))
    .filter(Boolean)
    .join(", ");

  if (missingIntegrationIsFatal()) {
    console.error(`[lead] ${missing} not set — lead NOT delivered`, lead);
    return NextResponse.json({ error: "Lead capture is not configured" }, { status: 503 });
  }

  // Off production this is expected: no credentials yet. Log it so it is visible, and let the form
  // complete so its success state can be designed and reviewed.
  console.warn(`[lead] ${missing} not set — accepted without delivery`, lead);
  return NextResponse.json({ ok: true, delivered: false });
}
