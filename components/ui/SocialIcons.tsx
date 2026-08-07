import { siFacebook, siGoogle, siInstagram, siTiktok } from "simple-icons";

import { cx } from "@/lib/cx";
import { socialProfiles } from "@/content/site";

/**
 * The four social marks, from `simple-icons` — the OFFICIAL brand artwork.
 *
 * These used to be hand-drawn strokes built on lucide's 24-unit grid, because lucide carries no
 * brand glyphs (Instagram and Facebook were removed from it upstream, and TikTok and Google were
 * never in it). They were wrong: a brand mark is a specific shape people recognise pre-attentively,
 * and an approximation of one reads as a bad copy rather than as a simplified version. Stroked
 * outlines made it worse — at 20-something pixels a 2px stroke on a complex glyph like the TikTok
 * note or the Google G turns to mush.
 *
 * These are SOLID FILLS at the same 24-unit viewBox, which is why they stay crisp at any size: the
 * shape scales, and there is no stroke width to go soft. `simple-icons` ships the paths the brands
 * themselves publish, so the Instagram lens and the Google G are correct rather than close.
 *
 * ── Why the whole package is imported ────────────────────────────────────────
 * `import { siInstagram } from "simple-icons"` reaches an index of ~3,300 icons. That is fine here
 * and would not be in a client component: every call site is a SERVER component, so the paths are
 * rendered to HTML at build time and not one byte of this reaches a browser as JavaScript. If one
 * of these ever has to render on the client, switch to the `simple-icons/icons/instagram` subpath
 * first — the export map supports it.
 *
 * ── Colour ───────────────────────────────────────────────────────────────────
 * `currentColor`, never the brand hex each icon carries. One row has to work on the cream header
 * and on the navy footer, and four different brand colours in a row of four is the loudest thing on
 * a page whose job is a quote form. The marks are recognisable by shape alone.
 */

/** `simple-icons` gives a 24×24 path and a title. That is all a mark is. */
type Mark = { path: string; title: string };

/**
 * ── THE SIZE, and the honest note about sharpness ────────────────────────────
 * ONE KNOB, here. 16px. Change this line and every social icon on the site changes with it.
 *
 * Both dimensions are set in CSS rather than as `width`/`height` attributes, and that part IS a
 * fix: base.css styles every `svg` with `max-width: 100%; height: auto`, and a CSS rule beats an
 * HTML presentational attribute, so an attribute-sized icon had its height thrown away and
 * recomputed. `shrink-0` stops flex renegotiating the width for the same reason.
 *
 * WHAT THAT DID NOT FIX, because it is not a bug: these marks are soft at this size. They are
 * detailed glyphs — Instagram's lens is a ring about 1.5 units thick in a 24-unit box, so at 16px
 * it is a single CSS pixel and the browser has no choice but to anti-alias it to grey. Font
 * Awesome's brand set was rendered side by side with these and is no better; it is the size, not
 * the artwork. The only real levers are to draw them BIGGER or to accept the anti-aliasing, and
 * every site with brand icons in a header has made the same trade.
 */
const ICON_SIZE = "size-4";

const marks: Record<string, Mark> = {
  instagram: siInstagram,
  tiktok: siTiktok,
  facebook: siFacebook,
  google: siGoogle,
};

/**
 * The row of social links. It renders `socialProfiles` — the profiles the business actually owns,
 * in one fixed order — and NOTHING is written here: no URL, no account name, no label.
 *
 * `tone` is which surface it sits on, not a colour: `ink` for the cream header, `inverse` for the
 * navy footer. Each is a hover treatment as well as a resting colour, because a row of four small
 * targets needs to say out loud which one the pointer is on.
 *
 * Every link opens in its own tab with `rel="noopener noreferrer"` — an off-site profile is the one
 * place on this site where stealing the tab back is worse than opening one.
 */
export function SocialLinks({ tone = "ink" }: { tone?: "ink" | "inverse" }) {
  if (socialProfiles.length === 0) return null;

  const tones = {
    ink: "text-ink hover:bg-brand-tint hover:text-brand",
    inverse: "text-ink-inverse hover:bg-brand-dark hover:text-amber",
  } as const;

  return (
    // `gap-2` plus each link's own `p-1` puts 16px of air between one glyph and the next.
    <ul className="flex list-none items-center gap-2 pl-0">
      {socialProfiles.map((profile) => {
        const mark = marks[profile.id];
        if (!mark) return null;
        return (
          <li key={profile.id}>
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              /* The accessible name is the whole job here — the glyph is `aria-hidden`, so without
                 this the link announces as its own URL. */
              aria-label={`${profile.label} — opens in a new tab`}
              /* `p-1` — 4px, client-requested 2026-08-07. It is the hover target's breathing room
                 and nothing else; the row's own height comes from this plus the glyph. */
              className={cx(
                "flex items-center justify-center rounded-pill p-1 no-underline",
                "transition-colors duration-150 ease-out",
                tones[tone],
              )}
            >
              {/* `fill="currentColor"` and no stroke: these are solid shapes, not outlines.
                  Sized by class, never by attribute — see the note on `sizes`. */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                className={cx("shrink-0", ICON_SIZE)}
              >
                <path d={mark.path} />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
