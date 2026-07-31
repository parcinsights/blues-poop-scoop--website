/**
 * The two CRM integrations, and the seams they will plug into.
 *
 * Neither is wired yet — we have no credentials. This file exists so that "not configured" is a
 * defined, typed state rather than a crash, and so the work left to do is written down at the
 * place it will happen rather than in a chat log.
 *
 * ── DEFERRED: GoHighLevel ────────────────────────────────────────────────────
 * Needs: GHL_WEBHOOK_URL (the client's sub-account inbound webhook).
 * Wired at: app/api/lead/route.ts — already calls deliverToGhl() below.
 * On arrival: set the env var. No code change.
 *
 * ── DEFERRED: Sweep&Go ───────────────────────────────────────────────────────
 * Needs: SWEEPANDGO_API_TOKEN (Bearer token, generated in their dashboard), and confirmation of
 * the exact `clean_up_frequency` values this account uses — the onboarding call must send one
 * verbatim.
 * Base URL: https://openapi.sweepandgo.com
 * Endpoints that matter, from their docs:
 *   PUT  /api/v1/residential/onboarding                 create a real client (full address,
 *                                                       dog count, frequency, initial cleanup)
 *   POST /api/v2/client_on_boarding/check_zip_code_exists   live service-area check
 *   POST /api/v2/client_on_boarding/out_of_service_form     capture an out-of-area lead
 *   GET  /api/v2/client_on_boarding/price_registration_form real pricing, if we ever want to
 *                                                       stop hardcoding it
 * Note there is NO create-an-in-service-lead endpoint. That is why the short form posts to GHL
 * only, and why the full onboarding lives on its own page.
 * Wired at: app/api/onboard/route.ts — NOT YET BUILT (phase 5).
 */

export type DeliveryResult =
  | { status: "delivered" }
  | { status: "not-configured"; missing: string }
  | { status: "failed"; detail: string };

/** True on the real production deployment — where a missing credential must never be tolerated. */
function isProductionDeploy(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/**
 * Post a lead to GoHighLevel, where an automation texts and emails the owner.
 *
 * When the webhook is not configured, this reports `not-configured` rather than throwing. The
 * caller decides what that means: during design and development the form should still complete so
 * the success state is reviewable, but on production a missing credential is a real outage and is
 * surfaced as one. Silently accepting a lead nobody receives is the worst possible behaviour.
 */
export async function deliverToGhl(payload: unknown): Promise<DeliveryResult> {
  const webhook = process.env.GHL_WEBHOOK_URL;
  if (!webhook) return { status: "not-configured", missing: "GHL_WEBHOOK_URL" };

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return { status: "failed", detail: `GHL responded ${response.status}` };
    return { status: "delivered" };
  } catch (error) {
    return { status: "failed", detail: error instanceof Error ? error.message : "network error" };
  }
}

/**
 * Whether a missing integration should fail the request.
 *
 * Off production: no — a developer or designer working on the form should see it succeed.
 * On production: yes — a lead that reaches nobody is worse than an error the visitor can see and
 * respond to by picking up the phone.
 */
export function missingIntegrationIsFatal(): boolean {
  return isProductionDeploy();
}

/** Placeholder for the Sweep&Go client. Phase 5. See the header comment for the endpoint map. */
export const sweepAndGo = {
  isConfigured(): boolean {
    return Boolean(process.env.SWEEPANDGO_API_TOKEN);
  },
} as const;
