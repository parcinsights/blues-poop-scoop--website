/**
 * The two CRM integrations, and the seams they will plug into.
 *
 * Neither is wired yet — we have no credentials. This file exists so that "not configured" is a
 * defined, typed state rather than a crash, and so the work left to do is written down at the
 * place it will happen rather than in a chat log.
 *
 * ── GoHighLevel ──────────────────────────────────────────────────────────────
 * WIRED. The client's sub-account inbound webhook is a public, unguessable trigger URL rather than
 * a credential, and it is the SAME url on local, preview and production by request — one trigger,
 * one automation, one place to look when a lead is missing. `source` on the payload is what tells
 * a local test submission apart from a real one. GHL_WEBHOOK_URL still overrides it, so a preview
 * can be pointed somewhere else without a code change.
 * Wired at: app/api/lead/route.ts and app/api/contact/route.ts — both call deliverToGhl() below
 * with the SAME payload shape; see lib/lead-payload.ts.
 *
 * ── Sweep&Go ─────────────────────────────────────────────────────────────────
 * Needs: SWEEPANDGO_API_TOKEN (Bearer token, generated in their dashboard).
 * Base URL: https://openapi.sweepandgo.com (openapi.yaml at the repo root is their spec).
 * Endpoints that matter:
 *   POST /api/v2/client_on_boarding/out_of_service_form     capture an out-of-area lead  ← WIRED
 *   POST /api/v2/client_on_boarding/check_zip_code_exists   live service-area check
 *   PUT  /api/v1/residential/onboarding                 create a real client (full address,
 *                                                       dog count, frequency, initial cleanup)
 *   GET  /api/v2/client_on_boarding/price_registration_form real pricing, if we ever want to
 *                                                       stop hardcoding it
 *
 * There is NO create-an-in-service-lead endpoint, and this is not an oversight in the docs — it
 * was probed against the live API on 2026-08-03: /in_service_form, /save_lead, POST /api/v1/leads,
 * POST /api/v2/leads and POST /api/v2/free_quotes all answer 404 or 405, while out_of_service_form
 * answers 422 (a real endpoint rejecting an empty body). The `lead:in_service_area` name in their
 * tag list is a WEBHOOK Sweep&Go fires outward when a lead lands, not a route we can call inward.
 *
 * So an in-area short-form lead goes to GoHighLevel alone. The only Sweep&Go call that would put
 * one in their system is the onboarding PUT, which creates a live client on the dispatch board and
 * demands a street address, city and state the short form deliberately does not ask for. Inventing
 * those to force a lead through would put fake addresses in front of a technician.
 *
 * Also probed: `check_zip_code_exists` returns `not_exists` for every serviced zip on the test
 * token, because that account has no zips configured. The service-area branch therefore runs off
 * our own `servicedZips` list (see lib/validation.ts), which is the same list the site renders.
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
 * The client's GoHighLevel inbound webhook trigger. The same url in every environment — see the
 * header. It lives in the source rather than in an env var because it is not a secret and because
 * a lead sink that only works where someone remembered to set a variable is a lead sink that
 * silently stops working on the deployment nobody checked.
 */
const GHL_WEBHOOK_DEFAULT =
  "https://services.leadconnectorhq.com/hooks/0uR28ovg1XKQChcudZEP/webhook-trigger/517bb045-09b0-422b-a248-b762cf37a366";

/**
 * Post a lead to GoHighLevel, where an automation texts and emails the owner.
 *
 * Every caller sends the SAME payload shape — build it with `toWebhookLead`, never by hand — so
 * the trigger on the far side maps one set of fields no matter which form fired it.
 *
 * `not-configured` is now only reachable by blanking the override with whitespace; it is kept
 * because the routes already handle it and it costs nothing to leave the state defined.
 */
export async function deliverToGhl(payload: unknown): Promise<DeliveryResult> {
  // `||`, not `??`: .env.local ships the key with an empty value, and "" must fall through to the
  // default rather than be treated as a configured webhook.
  const webhook = (process.env.GHL_WEBHOOK_URL || GHL_WEBHOOK_DEFAULT).trim();
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

/** Sweep&Go's API host. Overridable so a test can point it somewhere that is not the real CRM. */
const SWEEPANDGO_BASE = process.env.SWEEPANDGO_API_BASE ?? "https://openapi.sweepandgo.com";

/** What the out-of-area form takes. Their field names, not ours — this is the seam, so it maps here. */
export type OutOfServiceLead = {
  name: string;
  email: string;
  phone: string;
  zip: string;
  /** Anything we know that their form has no field for: dog count, frequency, which page it came from. */
  comment?: string;
  /** Whether they agreed to marketing messages. The short form never asks, so it is false there. */
  marketingAllowed?: boolean;
};

export const sweepAndGo = {
  isConfigured(): boolean {
    return Boolean(process.env.SWEEPANDGO_API_TOKEN);
  },

  /**
   * File a lead Sweep&Go cannot serve, so it lands in their out-of-area list rather than nowhere.
   *
   * `address` is required by their schema and the short form does not collect one — the zip is the
   * whole point of this branch. We send an explicit "no address given" string rather than a blank
   * or a made-up street: whoever reads this lead needs to know the address is missing, not wonder
   * why it looks wrong.
   */
  async saveOutOfServiceLead(lead: OutOfServiceLead): Promise<DeliveryResult> {
    const token = process.env.SWEEPANDGO_API_TOKEN;
    if (!token) return { status: "not-configured", missing: "SWEEPANDGO_API_TOKEN" };

    try {
      const response = await fetch(
        `${SWEEPANDGO_BASE}/api/v2/client_on_boarding/out_of_service_form`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: lead.name,
            address: `No address given — web quote form (zip ${lead.zip})`,
            email_address: lead.email,
            zip_code: lead.zip,
            phone: lead.phone,
            comment: lead.comment ?? null,
            marketing_allowed: lead.marketingAllowed ? 1 : 0,
            marketing_allowed_source: "open_api",
          }),
        },
      );
      if (!response.ok) {
        // Their 422 carries the field that failed. Keep it: "responded 422" alone is unfixable.
        const detail = await response.text().catch(() => "");
        return {
          status: "failed",
          detail: `Sweep&Go responded ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
        };
      }
      return { status: "delivered" };
    } catch (error) {
      return { status: "failed", detail: error instanceof Error ? error.message : "network error" };
    }
  },
} as const;
