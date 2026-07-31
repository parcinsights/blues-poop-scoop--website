"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field, Honeypot, Input, Select } from "@/components/ui/Field";
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
export function QuickLeadForm({ compact = false }: { compact?: boolean }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
    <form onSubmit={onSubmit} noValidate className="relative">
      <Stack gap={4}>
        <Field label="Your name" htmlFor="name" required error={errors.name}>
          <Input id="name" autoComplete="name" invalid={Boolean(errors.name)} />
        </Field>

        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input id="email" type="email" autoComplete="email" invalid={Boolean(errors.email)} />
        </Field>

        <Field label="Phone" htmlFor="phone" required error={errors.phone}>
          <Input id="phone" type="tel" autoComplete="tel" invalid={Boolean(errors.phone)} />
        </Field>

        <Field
          label="Zip code"
          htmlFor="zip"
          required
          hint="So we can confirm we reach you."
          error={errors.zip}
        >
          <Input
            id="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            invalid={Boolean(errors.zip)}
          />
        </Field>

        <Field label="How many dogs?" htmlFor="dogs" required error={errors.dogs}>
          <Input id="dogs" type="number" min={1} max={20} defaultValue={1} invalid={Boolean(errors.dogs)} />
        </Field>

        {!compact && (
          <Field label="How often?" htmlFor="frequency">
            <Select
              id="frequency"
              defaultValue="not-sure"
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "biweekly", label: "Every other week" },
                { value: "not-sure", label: "Not sure yet" },
              ]}
            />
          </Field>
        )}

        <Honeypot />

        {state === "error" && (
          <Callout tone="warning">
            Something went wrong sending that. Please call us instead and we&apos;ll sort it out.
          </Callout>
        )}

        <Button type="submit" size="lg" block disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Get my free quote"}
        </Button>
      </Stack>
    </form>
  );
}
