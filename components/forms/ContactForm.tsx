"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Honeypot, Input, Select } from "@/components/ui/Field";
import { Callout } from "@/components/ui/surfaces";
import { Stack } from "@/components/ui/layout";
import { Text } from "@/components/ui/typography";
import {
  CLEANUP_FREQUENCIES,
  LAST_CLEANED,
  contactRequestSchema,
  type CleanupFrequency,
  type LastCleaned,
} from "@/lib/validation";

/**
 * The form on /contact/. Six fields and a consent box, in the SAME card the short form uses on
 * /locations/ and the service pages — `pill` controls, centred, labels carried as placeholders,
 * inside `FormCard`. The only thing /contact/ drops is the logo mark; see `FormCard`.
 *
 * That decision is the whole design of this page. A site with one form shape has one form; a site
 * with a rounded centred card on four pages and a stack of grey boxes on the fifth has a form and
 * a form-looking thing, and the fifth is the one people don't trust.
 *
 * WHAT THE PILL COSTS, AND WHAT IS DONE ABOUT IT. A placeholder disappears under the first
 * keystroke — see the note on `FieldVariant`. Three consequences, handled here rather than papered
 * over: every placeholder repeats its `<label>` word for word, so the hidden label a screen reader
 * announces is the same question a sighted reader read; the two selects open on the QUESTION as
 * their empty option rather than on a generic "Choose one", because a round control reading
 * "Choose one" twice in a column is two identical mystery boxes; and the number field carries no
 * default, since a pre-filled "1" with no visible label is a box containing a number and no clue
 * what it counts.
 *
 * The field ORDER is the client's and it is deliberate — see `contactRequestSchema` for why the
 * price questions come before the contact details.
 *
 * It posts to /api/contact, not /api/lead: different payload, different source tag in the CRM.
 */

/**
 * Every label, once. They are the labels AND the placeholders, and the two must match word for
 * word — a hidden label that says something different from the placeholder over it hands a screen
 * reader and a sighted reader two different forms.
 *
 * They are short for the same reason: at this width a placeholder that wraps is a placeholder that
 * gets clipped, so each is the question at its shortest honest length.
 */
const labels = {
  zip: "Zip code",
  dogs: "How many dogs?",
  frequency: "How often?",
  lastCleaned: "Last thorough clean-up?",
  email: "Email address",
  phone: "Cell phone number",
} as const;

/**
 * The words for the stored values, in the two selects. Typed as a total `Record`, so adding a value
 * to `LAST_CLEANED` without writing a label for it fails the build rather than rendering a blank
 * line in a dropdown.
 */
const frequencyLabels: Record<CleanupFrequency, string> = {
  weekly: "Once a week",
  biweekly: "Every other week",
  monthly: "Once a month",
};

const lastCleanedLabels: Record<LastCleaned, string> = {
  "1-week": "About a week ago",
  "2-weeks": "Two weeks ago",
  "3-weeks": "Three weeks ago",
  "1-month": "About a month ago",
  "2-months": "Two months ago",
  "3-months": "Three months ago",
  "4-months": "Four months ago",
  "5-months": "Five months ago",
  "6-months": "Six months ago",
  "7-months": "Seven months ago",
  "8-months": "Eight months ago",
  "9-months": "Nine months ago",
  "10-plus-months": "Ten months or more",
};

/**
 * Each select opens on its own QUESTION as an empty option — this is the select's placeholder, and
 * it is what makes the two round controls readable with their labels hidden. "" is not a valid
 * value and the schema rejects it, so an unanswered question stays unanswered instead of quietly
 * becoming whichever option happened to be first in the list.
 */
const frequencyOptions = [
  { value: "", label: labels.frequency },
  ...CLEANUP_FREQUENCIES.map((value) => ({ value, label: frequencyLabels[value] })),
];

// Mapped from the tuple rather than written out again, so the dropdown runs shortest-to-longest in
// the same order the values are declared in — the order is data, not a coincidence of typing.
const lastCleanedOptions = [
  { value: "", label: labels.lastCleaned },
  ...LAST_CLEANED.map((value) => ({ value, label: lastCleanedLabels[value] })),
];

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = Object.fromEntries(form.entries());

    // An unchecked box sends nothing at all — it is absent from the FormData rather than "off" —
    // so the boolean is built here instead of being coerced out of a value that may not exist.
    const parsed = contactRequestSchema.safeParse({
      ...raw,
      smsConsent: raw.smsConsent === "on",
    });

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
      const response = await fetch("/api/contact", {
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
        <Text>
          We&apos;ll be back to you shortly with a price for your yard and a first clean-up date.
        </Text>
      </Callout>
    );
  }

  return (
    // Same two-stack shape as the short form: the fields are a group at `gap-4`, and the button is
    // a separate thing at `gap-8` below them. The step up in air is what ends the form — flat, the
    // submit reads as one more field to tab into. See QuickLeadForm.
    <form onSubmit={onSubmit} noValidate className="relative">
      <Stack gap={8}>
        {/**
         * TWO FIELDS PER ROW from `sm` up, and the pairing is not arbitrary — each row is one
         * question asked twice: where and how big (zip, dogs), how often and how bad (frequency,
         * last clean-up), and the two ways to reach you (email, phone). Six lines stacked in a
         * column made a form that had to be scrolled to be understood; three rows of two is the
         * whole thing at a glance, which is the point of a card this wide.
         *
         * One column below `sm`. Two pills side by side on a phone are two half-width boxes whose
         * placeholders clip, which is the failure the pill variant is least able to survive.
         *
         * A plain grid rather than `Grid`: that primitive's two-column setting also promotes to
         * three at `lg`, and three pills across is a row of stubs.
         */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* No `hint` on any field. The pill shape exists to make a form read as a few soft lines
              rather than as a stack of instructions, and a line of explanation under a
              placeholder-only control puts back exactly the words the shape removes. Everything
              that has to be said is said in the label — which is why the labels are questions. */}
          <Field label={labels.zip} htmlFor="zip" required error={errors.zip} hideLabel>
            <Input
              id="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder={labels.zip}
              variant="pill"
              invalid={Boolean(errors.zip)}
            />
          </Field>

          <Field label={labels.dogs} htmlFor="dogs" required error={errors.dogs} hideLabel>
            {/* No default: a pre-filled "1" under a hidden label is a box with a number in it and
                nothing saying what the number counts. */}
            <Input
              id="dogs"
              type="number"
              min={1}
              max={20}
              placeholder={labels.dogs}
              variant="pill"
              invalid={Boolean(errors.dogs)}
            />
          </Field>

          <Field
            label={labels.frequency}
            htmlFor="frequency"
            required
            error={errors.frequency}
            hideLabel
          >
            <Select
              id="frequency"
              defaultValue=""
              options={frequencyOptions}
              variant="pill"
              invalid={Boolean(errors.frequency)}
            />
          </Field>

          <Field
            label={labels.lastCleaned}
            htmlFor="lastCleaned"
            required
            error={errors.lastCleaned}
            hideLabel
          >
            <Select
              id="lastCleaned"
              defaultValue=""
              options={lastCleanedOptions}
              variant="pill"
              invalid={Boolean(errors.lastCleaned)}
            />
          </Field>

          <Field label={labels.email} htmlFor="email" required error={errors.email} hideLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={labels.email}
              variant="pill"
              invalid={Boolean(errors.email)}
            />
          </Field>

          <Field label={labels.phone} htmlFor="phone" required error={errors.phone} hideLabel>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder={labels.phone}
              variant="pill"
              invalid={Boolean(errors.phone)}
            />
          </Field>

          {/* Across both columns, and a step of air above it. It is not a seventh answer, it is a
              permission — putting it in a cell beside "cell phone number" makes it read as part of
              the same question, which is the one reading of an SMS consent that must never happen.

              It keeps its words for the obvious reason: a checkbox has no placeholder to hide them
              in, and this is the sentence someone is agreeing to. Never pre-ticked and never
              required to submit — see the note on `smsConsent`. The hint carries the two
              disclosures that make the consent a real one: what the texts are for, and how to stop
              them. */}
          <div className="pt-2 sm:col-span-2">
            <Checkbox
              id="smsConsent"
              align="center"
              label="Text me about my quote and my scheduled visits."
              hint="Message and data rates may apply. Reply STOP at any time to opt out."
              error={errors.smsConsent}
            />
          </div>

          {/* Inside the field grid — it is a field, just an invisible one. */}
          <Honeypot />
        </div>

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
