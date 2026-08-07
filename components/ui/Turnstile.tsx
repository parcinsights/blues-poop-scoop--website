"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import type { Ref } from "react";

/**
 * The Cloudflare Turnstile widget — the bot gate every form submits through.
 *
 * WHAT A VISITOR SEES: nothing, nearly always. `appearance: "interactive"` keeps the widget out of
 * the layout entirely until Cloudflare decides this browser needs to prove something, at which
 * point a small checkbox appears above the submit button. That is the whole reason this and not a
 * CAPTCHA: a quote form that makes people identify traffic lights is a quote form fewer people
 * finish, and the spam it stops is cheaper than the customers it costs.
 *
 * WHAT IT DOES: mints a single-use token, which the form posts alongside the lead and the API route
 * checks against Cloudflare. See lib/turnstile.ts for the half that actually decides.
 *
 * RENDERED EXPLICITLY, not by the script's own class scan. Two reasons, both about this site:
 * the forms are React and a widget the script injects is a widget React does not know it has, and
 * a token is spent the moment it is verified — so a failed submission must reset the widget to get
 * a fresh one, which needs the widget id that only explicit rendering hands back.
 *
 * WHEN THE KEY IS MISSING this renders nothing and `token()` resolves null. The site keeps taking
 * leads with the gate switched off rather than refusing everyone — the same call lib/turnstile.ts
 * makes on the server, and the reasoning is written out there.
 */

/** Public by design: it ships inside the JavaScript bundle and identifies the widget, nothing more. */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export const turnstileEnabled = Boolean(SITE_KEY);

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** How long `token()` waits for a challenge to finish before giving up and submitting without one. */
const TOKEN_TIMEOUT_MS = 12_000;

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      appearance?: "always" | "execute" | "interactive";
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    },
  ) => string | undefined;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * One script tag for the whole page, shared by every widget on it.
 *
 * The promise is module-level rather than per-component because the footer form and an inline CTA
 * form are two components wanting the same script — without this they race, and the loser appends a
 * second copy of it.
 */
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Let the next mount try again — a blocked or flaky first load should not permanently
      // poison every form on the page.
      scriptPromise = null;
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type TurnstileHandle = {
  /**
   * The current token, waiting for one if the challenge has not finished yet.
   *
   * Resolves `null` rather than rejecting when the gate is off, the script never loaded, or the
   * challenge takes longer than `TOKEN_TIMEOUT_MS`. Null means "submit anyway": the server decides
   * what a tokenless lead is worth, and a visitor whose corporate proxy eats Cloudflare should not
   * be silently unable to ask for a quote.
   */
  token: () => Promise<string | null>;
  /** Throw the spent token away and mint a new one. Call after a failed submission. */
  reset: () => void;
};

export function Turnstile({
  action,
  ref,
}: {
  /** Which form this is. Must match the `action` the API route expects — that pairing is the check. */
  action: string;
  ref?: Ref<TurnstileHandle>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  /** Submissions that arrived before the token did, waiting to be handed one. */
  const waitersRef = useRef<((token: string | null) => void)[]>([]);

  function settle(token: string | null) {
    tokenRef.current = token;
    if (token === null) return;
    const waiters = waitersRef.current;
    waitersRef.current = [];
    for (const waiter of waiters) waiter(token);
  }

  useEffect(() => {
    if (!turnstileEnabled) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widgetIdRef.current =
          window.turnstile.render(container, {
            sitekey: SITE_KEY,
            action,
            appearance: "interactive",
            callback: (token) => settle(token),
            // A failed challenge leaves the form usable. The token is simply absent, the server
            // sees a tokenless lead, and the visitor is never stuck staring at a broken widget.
            "error-callback": () => settle(null),
            // Tokens go stale after about five minutes. Someone reading the page that long and
            // then submitting deserves a fresh one rather than a rejection.
            "expired-callback": () => {
              tokenRef.current = null;
              if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
            },
          }) ?? null;
      })
      .catch(() => settle(null));

    return () => {
      cancelled = true;
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
    // `action` is a constant per call site; re-rendering the widget on a change would orphan it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    token: () => {
      if (!turnstileEnabled) return Promise.resolve(null);
      if (tokenRef.current) return Promise.resolve(tokenRef.current);
      return new Promise<string | null>((resolve) => {
        waitersRef.current.push(resolve);
        // The timeout resolves the whole promise, not this one waiter — a second submission press
        // simply joins the queue again and gets whatever the widget has by then.
        setTimeout(() => resolve(tokenRef.current), TOKEN_TIMEOUT_MS);
      });
    },
    reset: () => {
      tokenRef.current = null;
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
    },
  }));

  if (!turnstileEnabled) return null;

  // Centred, and empty until Cloudflare decides otherwise: with `interactive` the container has no
  // height at all on the overwhelming majority of submissions, so it adds nothing to the form's
  // rhythm until the one time it has something to say.
  return <div ref={containerRef} className="flex justify-center empty:hidden" />;
}
