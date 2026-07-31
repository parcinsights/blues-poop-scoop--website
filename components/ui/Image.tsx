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
  sizes,
  className,
}: {
  asset: AssetKey;
  priority?: boolean;
  /** Tells the browser the rendered width so it can pick the right source. */
  sizes?: string;
  /** Layout only — sizing and positioning. Never color or type. */
  className?: string;
}) {
  const record = assets[asset];
  return (
    <NextImage
      src={record.src}
      alt={record.alt}
      width={record.width}
      height={record.height}
      priority={priority}
      // Anything not priority is lazy; that is Next's default and it is the right one.
      sizes={sizes}
      className={cx(className)}
    />
  );
}
