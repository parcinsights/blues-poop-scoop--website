"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field, Honeypot, Input, Select, type FieldVariant } from "@/components/ui/Field";
import { Callout } from "@/components/ui/surfaces";
import { Stack } from "@/components/ui/layout";
import { Text } from "@/components/ui/typography";
import { quickLeadSchema } from "@/lib/validation";

/**
 * The short lead form — hero, footer, and inline CTA bands.
 *
 * It collects only what someone will actually type before they are convinced: name, email, phone,
 * zip, dog count. It posts to GHL alone. It does NOT create a Sweep&Go client, because Sweep&Go's
 * onboarding endpoint needs a full address, a frequency and an initial-cleanup decision — asking
 * for all that up front is how a quote form loses most of its submissions. The full onboarding
 * lives on its own page for people who have already decided.
 *
 * This is the only client component on the site apart from nothing else — the rest is static.
 */

/**
 * Every label, once. They are the labels AND — in the `pill` variant — the placeholders, and the
 * two must match word for word: a hidden label that says something different from the placeholder
 * above it is worse than either alone, because a screen reader and a sighted reader are then being
 * given different forms.
 */
const labels = {
  name: "Your name",
  email: "Email",
  phone: "Phone",
  zip: "Zip code",
  dogs: "How many dogs?",
  frequency: "How often?",
} as const;

export function QuickLeadForm({
  compact = false,
  variant = "boxed",
}: {
  /** Drops the frequency select — for the form dropped inside another page. */
  compact?: boolean;
  /** See the note on `FieldVariant`. `pill` hides the labels and carries them as placeholders. */
  variant?: FieldVariant;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      setState(response.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <Callout tone="success">
        <strong>Thanks — we&apos;ve got it.</strong>
        <Text>We&apos;ll be in touch shortly with a price for your yard.</Text>
      </Callout>
    );
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
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
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

          {!compact && (
            <Field label={labels.frequency} htmlFor="frequency" hideLabel={pill}>
              <Select
                id="frequency"
                defaultValue="not-sure"
                variant={variant}
                options={[
                  { value: "weekly", label: "Weekly" },
                  { value: "biweekly", label: "Every other week" },
                  { value: "not-sure", label: "Not sure yet" },
                ]}
              />
            </Field>
          )}

          {/* Inside the field group: it is a field, just an invisible one, and hanging it in the
              outer stack would put eight units of air around a zero-height element. */}
          <Honeypot />
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
