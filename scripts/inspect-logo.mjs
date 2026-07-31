/**
 * One-off: report each brand file's dimensions, transparency, and dominant colors, and check the
 * sampled brand color against the token in app/theme.css.
 *
 * Run with: node scripts/inspect-logo.mjs
 */
import { readdirSync } from "node:fs";
import sharp from "sharp";

const DIR = "public/brand";

for (const file of readdirSync(DIR).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f))) {
  const path = `${DIR}/${file}`;
  const meta = await sharp(path).metadata();
  const stats = await sharp(path).stats();
  const data = await sharp(path)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const corner = `#${[data[0], data[1], data[2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  const dominant = `#${["r", "g", "b"]
    .map((c) => stats.dominant[c].toString(16).padStart(2, "0"))
    .join("")}`;

  console.log(file);
  console.log(`  ${meta.width}x${meta.height}  hasAlpha=${meta.hasAlpha}  opaque=${stats.isOpaque}`);
  console.log(`  corner=${corner} (alpha ${data[3]})  dominant=${dominant}`);
}
