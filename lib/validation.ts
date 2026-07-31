import { z } from "zod";

import { servicedZips } from "@/content/cities";

/**
 * One schema, used by the browser and the API route.
 *
 * Client-side validation is a convenience; server-side validation is the actual check. Sharing the
 * schema means they cannot drift apart and disagree about what a valid lead looks like.
 */

export const FREQUENCIES = ["weekly", "biweekly", "not-sure"] as const;

export const quickLeadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+.-]{10,}$/, "Please enter a valid phone number"),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Please enter a 5-digit zip code"),
  dogs: z.coerce.number().int().min(1, "At least one dog").max(20),
  frequency: z.enum(FREQUENCIES).optional(),
  /** Honeypot — must be empty. A bot fills it; a human never sees it. */
  company: z.string().max(0).optional(),
});

export type QuickLead = z.infer<typeof quickLeadSchema>;

/**
 * Whether we cover a zip, checked against the same city list the site renders. The authoritative
 * check happens against Sweep&Go's `check_zip_code_exists` at onboarding time; this one exists so
 * an out-of-area visitor gets an honest answer immediately rather than waiting for a callback.
 */
export function isServicedZip(zip: string): boolean {
  return servicedZips.includes(zip);
}
