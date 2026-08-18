"use client";

import { useEffect } from "react";

import { reportSignup } from "@/lib/analytics";

/**
 * Fires the sign-up conversion on /thank-you/, and only for someone who actually submitted a form.
 *
 * The whole decision — why this is here rather than inside the form's submit handler, and why it
 * cannot simply fire on mount — is written out on `reportSignup` in lib/analytics.ts. The short
 * version: the form navigates away before a tag could finish, and /thank-you/ is a refreshable URL,
 * so the form leaves a one-use flag behind and this spends it.
 *
 * Renders nothing. It is an effect with a mounting point, which is what a page-load tag is.
 */
export function SignupConversion() {
  useEffect(() => {
    reportSignup();
  }, []);

  return null;
}
