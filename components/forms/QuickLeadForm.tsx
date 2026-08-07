"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { fieldLabels as labels, frequencyOptions } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { Field, Honeypot, Input, PhoneInput, Select, type FieldVariant } from "@/components/ui/Field";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { Callout } from "@/components/ui/surfaces";
import { Stack } from "@/components/ui/layout";
import { routes } from "@/lib/routes";
import { quickLeadSchema } from "@/lib/validation";

/**
 * The short lead form — hero, footer, the inline CTA bands, and the card on the service pages and
 * /locations/.
 *
 * It asks the six questions every form on the site asks: name, email, phone, zip, dog count,
 * frequency. See `leadFields` for why that set is defined in one place and why no caller may trim
 * it — a `compact` prop used to drop the frequency select on the card placements, which meant the
 * most-seen form on the site sent the CRM a lead with a hole in it.
 *
 * It posts to GHL alone. It does NOT create a Sweep&Go client, because Sweep&Go's onboarding
 * endpoint needs a full street address and an initial-cleanup decision — asking for all that up
 * front is how a quote form loses most of its submissions. The full onboarding lives on its own
 * page for people who have already decided.
 */

export function QuickLeadForm({
  variant = "boxed",
}: {
  /** See the note on `FieldVariant`. `pill` hides the labels and carries them as placeholders. */
  variant?: FieldVariant;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  /**
   * No `sent`. A success leaves this page for /thank-you/, so the state it would describe belongs
   * to a component that is already unmounting — the form stays in `sending` until the navigation
   * lands, which is also what keeps the button disabled through it.
   */
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  /** The bot gate. See `Turnstile` — invisible unless Cloudflare wants a look at this browser. */
  const turnstile = useRef<TurnstileHandle>(null);

  const pill = variant === "pill";
  /** In `pill` the label lives in the placeholder, so every field has to carry one. */
  const placeholder = (label: string) => (pill ? label : undefined);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = Object.fromEntries(form.entries());

    const parsed = quickLeadSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setState("sending");
    try {
      // Waits for the challenge if one is still running, and resolves null if the gate is off or
      // Cloudflare never answered — the server decides what a tokenless lead is worth.
      const turnstileToken = await turnstile.current?.token();
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, turnstileToken }),
      });
      if (!response.ok) {
        // The token was spent by that attempt whether or not it was accepted, so a second press
        // needs a fresh one. Without this, every retry fails as a replay.
        turnstile.current?.reset();
        setState("error");
        return;
      }
      router.push(routes.thankYou());
    } catch {
      turnstile.current?.reset();
      setState("error");
    }
  }

  return (
    /**
     * Two stacks, not one, and the nesting is the spacing.
     *
     * The fields are a group with `gap-4` between them; the button is a separate thing at `gap-8`
     * below that group. A single flat stack gave the submit button the same air as the gap between
     * two inputs, which made it read as a sixth field — the thing you tab into next rather than the
     * thing you press when you are finished. The step up is what ends the form.
     *
     * Both callers get this for free: the hero/footer boxed form and the `pill` card on the service
     * and coverage pages are the same component.
     */
    <form onSubmit={onSubmit} noValidate className="relative">
      <Stack gap={8}>
        <Stack gap={4}>
          <Field label={labels.name} htmlFor="name" required error={errors.name} hideLabel={pill}>
            <Input
              id="name"
              autoComplete="name"
              placeholder={placeholder(labels.name)}
              variant={variant}
              invalid={Boolean(errors.name)}
            />
          </Field>

          <Field label={labels.email} htmlFor="email" required error={errors.email} hideLabel={pill}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={placeholder(labels.email)}
              variant={variant}
              invalid={Boolean(errors.email)}
            />
          </Field>

          <Field label={labels.phone} htmlFor="phone" required error={errors.phone} hideLabel={pill}>
            {/* The same self-formatting field /contact/ uses. One phone control on the site, so
                the number reaching the CRM has one shape wherever it was typed. */}
            <PhoneInput
              id="phone"
              placeholder={placeholder(labels.phone)}
              variant={variant}
              invalid={Boolean(errors.phone)}
            />
          </Field>

          <Field
            label={labels.zip}
            htmlFor="zip"
            required
            // The hint is what the visible label cannot say in two words. It is dropped in `pill`
            // along with the label — a line of explanation under a placeholder-only field puts the
            // words back that the shape exists to remove.
            hint={pill ? undefined : "So we can confirm we reach you."}
            error={errors.zip}
            hideLabel={pill}
          >
            <Input
              id="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder={placeholder(labels.zip)}
              variant={variant}
              invalid={Boolean(errors.zip)}
            />
          </Field>

          <Field label={labels.dogs} htmlFor="dogs" required error={errors.dogs} hideLabel={pill}>
            {/* No default in `pill`: a pre-filled "1" with the label hidden is a box containing a
                number and no clue what it counts. The boxed form keeps it — there the label is
                visible, and one fewer field to fill is one fewer reason to abandon. */}
            <Input
              id="dogs"
              type="number"
              min={1}
              max={20}
              defaultValue={pill ? undefined : 1}
              placeholder={placeholder(labels.dogs)}
              variant={variant}
              invalid={Boolean(errors.dogs)}
            />
          </Field>

          {/* Opens on its own question rather than on a guess — see `frequencyOptions`. "Not sure
              yet" is on the list, so a required frequency costs a visitor nothing and the CRM
              never receives a blank where an answer should be. */}
          <Field
            label={labels.frequency}
            htmlFor="frequency"
            required
            error={errors.frequency}
            hideLabel={pill}
          >
            <Select
              id="frequency"
              defaultValue=""
              variant={variant}
              options={frequencyOptions}
              invalid={Boolean(errors.frequency)}
            />
          </Field>

          {/* Inside the field group: it is a field, just an invisible one, and hanging it in the
              outer stack would put eight units of air around a zero-height element. */}
          <Honeypot />

          {/* The same argument, for the same reason: zero height nearly always, and on the rare
              submission where a challenge does appear it belongs with the fields rather than
              wedged between the form and its button. */}
          <Turnstile ref={turnstile} action="quick-lead" />
        </Stack>

        {/* The failure message belongs with the button rather than with the fields — it is about
            the press that just failed, and it is the line you read before pressing again. */}
        {state === "error" && (
          <Callout tone="warning">
            Something went wrong sending that. Please call us instead and we&apos;ll sort it out.
          </Callout>
        )}

        <Button type="submit" size="lg" block disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Get started now"}
        </Button>
      </Stack>
    </form>
  );
}
