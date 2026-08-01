import { Star } from "lucide-react";

/**
 * The star row. Amber fill — the one brand colour that reads as gold, and it is a fill here rather
 * than text, so the "background only" rule in theme.css is not being bent.
 *
 * Accessibility: the stars are one image, not five. A screen reader announcing "star star star
 * star star" is noise, so the row carries a single `role="img"` with the rating spelled out and
 * every glyph inside it is hidden.
 *
 * This renders visible trust only. It deliberately emits no `aggregateRating` structured data —
 * see content/reviews.ts for why self-serving review markup is a manual-action risk.
 */
export function Rating({
  stars,
  label,
  outOf = 5,
}: {
  /** Whole stars filled. */
  stars: number;
  /** The words beside the row — who rated, or how many. */
  label?: string;
  outOf?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1" role="img" aria-label={`${stars} out of ${outOf} stars`}>
        {Array.from({ length: outOf }, (_, index) => (
          <Star
            key={index}
            size={18}
            aria-hidden="true"
            className={index < stars ? "fill-amber text-amber" : "fill-transparent text-line"}
          />
        ))}
      </div>
      {label && <span className="text-small font-semibold text-ink">{label}</span>}
    </div>
  );
}
