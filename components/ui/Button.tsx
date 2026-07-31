import Link from "next/link";
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
  "inline-flex items-center justify-center gap-2 font-display font-semibold no-underline " +
  "rounded-md transition-colors duration-150 ease-out cursor-pointer " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

/**
 * Note what `primary` does NOT do: white text on amber. That pair is 1.64:1 and illegible.
 * Amber is a fill for dark ink (7.71:1) — see the palette notes in theme.css.
 */
const variants: Record<ButtonVariant, string> = {
  primary: "bg-amber text-ink hover:bg-amber-dark hover:text-ink",
  secondary: "bg-brand text-ink-inverse hover:bg-brand-dark hover:text-ink-inverse",
  ghost:
    "bg-transparent text-brand border border-line-strong hover:bg-brand-tint hover:text-brand-dark",
  link: "bg-transparent text-brand underline hover:text-brand-dark p-0",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-small px-3 py-2",
  md: "text-body px-5 py-3",
  lg: "text-lead px-7 py-4",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the width of the container — used inside forms and on mobile CTA bands. */
  block?: boolean;
  children: ReactNode;
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
  const { variant = "primary", size = "md", block = false, children } = props;
  const classes = cx(
    base,
    variants[variant],
    variant === "link" ? sizes[size].replace(/px-\d+ py-\d+/, "") : sizes[size],
    block && "w-full",
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, block: _b, children: _c, href: _h, ...rest } = props;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
