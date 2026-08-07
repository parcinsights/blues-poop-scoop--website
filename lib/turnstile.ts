/**
 * Cloudflare Turnstile — the bot gate in front of every form.
 *
 * The honeypot catches the bots that fill every field they find; this catches the ones that read
 * the form first. It is the only anti-spam layer that costs a real visitor nothing: Managed mode
 * shows no puzzle unless the browser looks wrong, and most people never see the widget at all.
 *
 * THE SHAPE. Browser gets a token from Cloudflare → posts it with the lead → this file asks
 * Cloudflare whether the token is real. The check NEVER happens in the browser: a client that
 * verifies its own token is a client that can be told to say yes.
 *
 * Three things are checked, not one. `success` alone is not enough:
 *   · `success`  — the token is real and has not been used before. Tokens are SINGLE USE, so a
 *                  replayed submission fails here even though it came from a real widget.
 *   · `action`   — which form it came from. A token minted on the short form cannot be spent on
 *                  the contact form.
 *   · `hostname` — where the widget rendered. This is what stops someone lifting our sitekey onto
 *                  their own page and using it to mint tokens for our endpoint.
 *
 * ── Setup ────────────────────────────────────────────────────────────────────
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY  the widget's sitekey. Public by design — it ships in the JS.
 * TURNSTILE_SECRET_KEY            the widget's secret. Server only. Never NEXT_PUBLIC_.
 * TURNSTILE_HOSTNAMES             optional override of the hostname allowlist (comma separated).
 *
 * Create the widget at dash.cloudflare.com → Turnstile → Add widget, in Managed mode, with
 * bluespoopscoop.com, www.bluespoopscoop.com, localhost and 127.0.0.1 as its hostnames.
 *
 * ── Why an unconfigured gate lets the lead through ───────────────────────────
 * Unlike a missing CRM webhook, a missing Turnstile key is NOT fatal on production. The webhook is
 * where a lead goes; the gate is only who is allowed to send one. A gate that fails closed turns
 * one forgotten environment variable into a site that takes no leads at all, and losing every real
 * customer is a far worse outcome than filing some spam. It fails open and says so in the log.
 *
 * A token that is present but WRONG is a different matter entirely — that is a live gate catching
 * something, and it is refused.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  /** A real, unused token, from the right form, on a hostname we recognise. */
  | { status: "verified" }
  /** No secret configured. The caller lets the lead through and logs it — see above. */
  | { status: "not-configured" }
  /** Cloudflare says no, or the token is for the wrong form or the wrong site. Refuse. */
  | { status: "rejected"; detail: string }
  /** Cloudflare could not be reached or answered nonsense. Also refuse — see the note below. */
  | { status: "failed"; detail: string };

/** Whether the gate is switched on. The sitekey is checked in the browser, the secret here. */
export function turnstileIsConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

/**
 * The hostnames a token is allowed to have been minted on.
 *
 * Defaults to the site's own origin and its www twin, which is the whole allowlist that matters on
 * production. TURNSTILE_HOSTNAMES overrides it for a deployment that lives somewhere else.
 *
 * Off production the loopback names are added, because that is where the form is being worked on.
 * They are NEVER added on production: an allowlist containing `localhost` accepts a token minted
 * by anyone running our sitekey on their own machine, which is the exact hole this check exists to
 * close.
 */
function expectedHostnames(): Set<string> {
  const override = process.env.TURNSTILE_HOSTNAMES;
  if (override) {
    return new Set(
      override
        .split(",")
        .map((hostname) => hostname.trim().toLowerCase())
        .filter(Boolean),
    );
  }

  const hostnames = new Set<string>();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      const host = new URL(siteUrl).hostname.toLowerCase();
      hostnames.add(host);
      hostnames.add(host.startsWith("www.") ? host.slice(4) : `www.${host}`);
    } catch {
      // A malformed NEXT_PUBLIC_SITE_URL is a build problem, not a reason to crash a lead route.
    }
  }
  if (process.env.VERCEL_ENV !== "production") {
    hostnames.add("localhost");
    hostnames.add("127.0.0.1");
  }
  return hostnames;
}

/** What Cloudflare sends back. Only the four fields we act on are named. */
type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

/**
 * Ask Cloudflare whether this token is real, fresh, and from the form and site it claims.
 *
 * `action` is the caller's own name for the form, and it must match the `data-action` the widget
 * was rendered with. `ip` is the visitor's address, which Cloudflare uses as one more signal; it
 * is optional because a proxy that strips it should not break the check.
 *
 * A NETWORK failure is refused rather than waved through. It is the one place this file fails
 * closed, and the asymmetry is deliberate: an unconfigured gate is a mistake we made and the
 * visitor should not pay for it, but a gate that is switched on and cannot answer is exactly the
 * state a flood would produce. The visitor sees the form's error message, which tells them to
 * call — a real customer has another way in, and a script does not use it.
 */
export async function verifyTurnstile({
  token,
  action,
  ip,
}: {
  token: unknown;
  action: string;
  ip?: string | null;
}): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { status: "not-configured" };

  // Length-capped before it is sent anywhere: a real token is a few hundred characters, and an
  // arbitrarily long string from an unauthenticated endpoint is not something to forward.
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { status: "rejected", detail: "missing or malformed token" };
  }

  let result: SiteverifyResponse;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);

    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // Without a deadline this route waits as long as the network does, and a form that hangs is
      // a form that gets submitted twice.
      signal: AbortSignal.timeout(10_000),
      body,
    });
    if (!response.ok) throw new Error(`siteverify responded ${response.status}`);
    result = (await response.json()) as SiteverifyResponse;
  } catch (error) {
    return { status: "failed", detail: error instanceof Error ? error.message : "network error" };
  }

  if (!result.success) {
    // Their error codes are the only thing that makes a rejection debuggable — `invalid-input-secret`
    // (wrong key) and `timeout-or-duplicate` (a replay, or a token left sitting for five minutes)
    // are very different problems and look identical without this.
    return { status: "rejected", detail: (result["error-codes"] ?? ["unknown"]).join(", ") };
  }
  if (result.action !== action) {
    return { status: "rejected", detail: `action ${result.action ?? "missing"} != ${action}` };
  }
  const allowed = expectedHostnames();
  if (!result.hostname || !allowed.has(result.hostname.toLowerCase())) {
    return { status: "rejected", detail: `hostname ${result.hostname ?? "missing"} not allowed` };
  }

  return { status: "verified" };
}

/**
 * The visitor's IP as the platform reports it.
 *
 * `x-forwarded-for` is a list appended to by each hop, and the FIRST entry is the client. It is
 * spoofable in general — which is fine, because Cloudflare treats it as a hint and the token is
 * the actual proof.
 */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip");
}
