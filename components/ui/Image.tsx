import NextImage from "next/image";

import { assets, type AssetKey } from "@/content/assets";
import { cx } from "@/lib/cx";

/**
 * The image component. Note the props: there is **no `src` and no `alt`**.
 *
 * You pass a key into `content/assets.ts`, and the source, dimensions and alt text come from that
 * record. Three things follow:
 *
 *  · An image with missing alt text cannot exist — the registry type requires it.
 *  · Width and height are always present, so images never cause layout shift (CLS).
 *  · The same image used on two pages cannot pick up two different alt strings.
 *
 * `priority` should be set on exactly one image per page — the largest one above the fold, which
 * is usually the LCP element. Setting it on several is worse than setting it on none, because
 * they then compete for bandwidth during the first paint.
 */
export function Image({
  asset,
  priority = false,
  decorative = false,
  sizes,
  className,
}: {
  asset: AssetKey;
  priority?: boolean;
  /**
   * Renders `alt=""`, hiding the image from assistive tech.
   *
   * Only correct when the words BESIDE the image already say what it says — the header lockup,
   * where the mark sits next to the company name as live text. Announcing both makes a screen
   * reader say the brand twice, which is the `image-redundant-alt` failure. It is an explicit
   * opt-in and never a default: the registry's job is to make a MISSING alt impossible, and an
   * empty one has to be a decision someone wrote down.
   */
  decorative?: boolean;
  /** Tells the browser the rendered width so it can pick the right source. */
  sizes?: string;
  /** Layout only — sizing and positioning. Never color or type. */
  className?: string;
}) {
  const record = assets[asset];
  return (
    <NextImage
      src={record.src}
      alt={decorative ? "" : record.alt}
      width={record.width}
      height={record.height}
      priority={priority}
      /**
       * Next 16 no longer derives this from `priority` — `priority` now only emits the
       * `<link rel="preload">`, and `fetchPriority` is a plain pass-through prop (see
       * next/dist/shared/lib/get-img-props.js). Without it the LCP image ships at the browser's
       * default `auto` priority and Lighthouse's LCP-discovery audit fails on "fetchpriority=high
       * should be applied". Passing it here keeps that a property of `priority` rather than
       * something every call site has to remember.
       */
      fetchPriority={priority ? "high" : undefined}
      /**
       * 68, not Next's default of 75. Every image on this site is a PHOTOGRAPH served as AVIF, and
       * across the set that step costs nothing anyone can see while cutting about a quarter of the
       * bytes — measured, not assumed: the "why us" portrait goes 250KB → 192KB at the width a
       * phone actually requests, the hero 53KB → 39KB, the pricing banner 100KB → 76KB.
       *
       * It is set HERE rather than per call site so the site cannot end up with three opinions
       * about it. The value has to be listed in `images.qualities` in next.config.mjs — Next 16
       * errors on any quality not in that allowlist rather than falling back.
       *
       * Do not push it lower without looking at the result. Flat colour and hard edges — a logo,
       * a screenshot — degrade visibly long before a photograph does, and this component serves
       * the brand mark too.
       */
      quality={68}
      // Anything not priority is lazy; that is Next's default and it is the right one.
      sizes={sizes}
      className={cx(className)}
    />
  );
}
