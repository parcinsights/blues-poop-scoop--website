/**
 * Class name joiner. Nine lines, no dependency.
 *
 * Deliberately NOT `tailwind-merge`/`clsx` merge semantics. Merging lets a caller pass
 * `className="bg-accent"` and quietly restyle a primitive from the outside — which is exactly how
 * a component library stops being the single source of truth for how a button looks. If a caller
 * needs a different button, the answer is a variant on the component, not an override at the
 * call site.
 */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
