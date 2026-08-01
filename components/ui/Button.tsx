import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "@/lib/cx";

/**
 * THE button. Every clickable call-to-action on this site is this component — there are no raw
 * `<button>` or styled `<a>` elements in any page.
 *
 * It renders an `<a>` when given `href` and a `<button>` otherwise, so "looks like a button" and
 * "is a link" stay correctly separated for screen readers and for middle-click.
 *
 * Need a look that isn't here? Add a variant. Do not pass `className` to reshape it from the call
 * site — see lib/cx.ts for why that door is deliberately shut.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-extrabold no-underline " +
  "rounded-pill transition duration-150 ease-out cursor-pointer " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

/**
 * The lift on hover. Transform only — the fill and the border animate through the same
 * `transition` on `base`, so a pointer entering the button moves one thing, not three.
 *
 * `motion-reduce` drops it entirely rather than shortening it: a visitor who has asked their OS
 * for no motion has asked for no motion, and colour alone still marks the hover state.
 */
const lift = "hover:scale-105 disabled:hover:scale-100 motion-reduce:hover:scale-100";

/**
 * `primary` is the navy fill with cream text — 8.18:1, and the only fill on the site that can
 * carry light text at all. The three light brand colors (sky, amber, green) cannot: white on sky
 * is 2.24:1. theme.test.ts asserts that, so trying it here fails the build rather than shipping.
 *
 * `secondary` is the same navy inverted — transparent fill, navy text and border, which reads as
 * the quieter of a pair sitting side by side.
 */
const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-ink-inverse hover:bg-brand-dark hover:text-ink-inverse",
  secondary:
    "bg-transparent text-brand border-2 border-brand hover:bg-brand-tint hover:text-brand-dark",
  ghost:
    "bg-transparent text-brand border-2 border-line-strong hover:bg-brand-tint hover:text-brand-dark",
  link: "bg-transparent text-brand underline hover:text-brand-dark",
};

/**
 * Padding for a button with words in it.
 *
 * `md` and `lg` share one label size — 18px, the control step — and differ by padding alone. A
 * button gets more presence by growing its target, not its type; running three text sizes a point
 * apart just made the three look like three different components.
 *
 * `sm` is the exception and stays smaller, because it is not a small CTA: it is the chip used for
 * dense wrapped lists (the city links) and the compact mobile header, where an 18px extrabold
 * label wraps a row of eleven of them onto four lines.
 */
const sizes: Record<ButtonSize, string> = {
  sm: "text-small px-4 py-2",
  md: "text-control px-6 py-3",
  lg: "text-control px-8 py-4",
};

/** Padding for an icon on its own — equal on all four sides, so the pill comes out round. */
const iconOnlySizes: Record<ButtonSize, string> = {
  sm: "text-small p-2",
  md: "text-body p-3",
  lg: "text-lead p-4",
};

/** Icon box in px, tuned to sit optically level with the cap height of each text size. */
const iconPixels: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the width of the container — used inside forms and on mobile CTA bands. */
  block?: boolean;
  /**
   * A lucide-react icon component, e.g. `import { ArrowRight } from "lucide-react"`.
   * Pass the component itself, not an element: `icon={ArrowRight}`.
   *
   * It renders to the RIGHT of the label, because every icon this site uses is a consequence of
   * the action (where it goes, what happens next) rather than a category marker for it.
   */
  icon?: LucideIcon;
  /**
   * Required when there is no `children` — an icon-only button is silent to a screen reader
   * otherwise. Also useful when the visible words are not the whole story ("Call" → the number).
   */
  ariaLabel?: string;
  children?: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  /** Set only for genuinely external destinations. */
  external?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    block = false,
    icon: Icon,
    ariaLabel,
    children,
  } = props;

  const iconOnly = Icon !== undefined && children === undefined;

  const classes = cx(
    base,
    variants[variant],
    // `link` is words in a sentence, not a control: no padding, and it does not grow on hover.
    variant === "link" ? "p-0" : iconOnly ? iconOnlySizes[size] : sizes[size],
    variant !== "link" && lift,
    block && "w-full",
  );

  const content = (
    <>
      {children}
      {Icon ? <Icon size={iconPixels[size]} aria-hidden="true" /> : null}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          aria-label={ariaLabel}
          rel="noopener noreferrer"
          target="_blank"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    block: _b,
    icon: _i,
    ariaLabel: _a,
    children: _c,
    href: _h,
    ...rest
  } = props;
  return (
    <button type="button" className={classes} aria-label={ariaLabel} {...rest}>
      {content}
    </button>
  );
}
