/**
 * Generates every derived brand asset from the two source files in public/brand/.
 *
 * Re-runnable and checked in, so nobody has to remember how the favicon was made or open an image
 * editor to redo it. When the client sends a better logo (ideally an SVG), drop it in and run
 * `node scripts/generate-icons.mjs` again.
 *
 * Outputs:
 *   app/icon.png              favicon — Next auto-emits the <link rel="icon">
 *   app/apple-icon.png        iOS home screen
 *   public/brand/og-default.png   1200x630 social share card
 *   public/brand/mark.png     tight, header-sized mark
 *
 * The background is read out of app/theme.css rather than repeated here, so the cream stays a
 * single source of truth even across a build script.
 */
import { readFileSync } from "node:fs";
import sharp from "sharp";

const theme = readFileSync("app/theme.css", "utf8");
const cream = theme.match(/--color-surface:\s*(#[0-9a-f]{6})/i)?.[1];
if (!cream) throw new Error("Could not read --color-surface from app/theme.css");

const toRgb = (hex) => ({
  r: Number.parseInt(hex.slice(1, 3), 16),
  g: Number.parseInt(hex.slice(3, 5), 16),
  b: Number.parseInt(hex.slice(5, 7), 16),
  alpha: 1,
});
const background = toRgb(cream);

const MARK = "public/brand/blues-poop-scoop--logo-cropped.png";
const FULL = "public/brand/blues-poop-scoop--logo--full.png";

/** Trim the source's own padding so we control the margin ourselves. */
const trimmedMark = await sharp(MARK).trim().toBuffer();

/** Square icon: the mark, centred, with ~10% breathing room. */
async function squareIcon(size, out) {
  const inner = Math.round(size * 0.8);
  const resized = await sharp(trimmedMark)
    .resize(inner, inner, { fit: "contain", background })
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(out);
  console.log(`${out}  ${size}x${size}`);
}

await squareIcon(512, "app/icon.png");
await squareIcon(180, "app/apple-icon.png");

/** Header mark — small, tight, retina-sized. */
await sharp(trimmedMark).resize(240, 240, { fit: "contain", background }).png().toFile("public/brand/mark.png");
console.log("public/brand/mark.png  240x240");

/** Social card: the full lockup on cream at the size every platform crops to. */
const card = await sharp(FULL).trim().resize(520, 520, { fit: "contain", background }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background } })
  .composite([{ input: card, gravity: "center" }])
  .png()
  .toFile("public/brand/og-default.png");
console.log("public/brand/og-default.png  1200x630");
