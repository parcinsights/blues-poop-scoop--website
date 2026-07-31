import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { assets, ogDefault } from "@/content/assets";
import type { Asset } from "@/content/types";

const ROOT = join(import.meta.dirname, "..");
const all: [string, Asset][] = [...Object.entries(assets), ["ogDefault", ogDefault]];

describe("image registry", () => {
  for (const [key, asset] of all) {
    describe(key, () => {
      it("has alt text", () => {
        expect(asset.alt.trim().length).toBeGreaterThan(0);
      });

      it("has no keyword stuffing in the alt text", () => {
        // Alt text describes the image for someone who cannot see it. A 15-word alt on a logo is
        // not a description, it is a paragraph aimed at a crawler.
        expect(asset.alt.split(/\s+/).length).toBeLessThanOrEqual(16);
      });

      it("points at a file that exists", () => {
        expect(existsSync(join(ROOT, "public", asset.src)), asset.src).toBe(true);
      });

      /**
       * The dimensions in the registry are what the browser reserves space with. If they disagree
       * with the real file, the image jumps when it loads — a CLS regression that is invisible
       * locally on a fast connection and obvious to a user on a phone.
       */
      it("declares the real dimensions of the file", async () => {
        const meta = await sharp(join(ROOT, "public", asset.src)).metadata();
        expect({ width: meta.width, height: meta.height }).toEqual({
          width: asset.width,
          height: asset.height,
        });
      });
    });
  }

  it("declares the social card at the size platforms actually crop to", () => {
    expect({ w: ogDefault.width, h: ogDefault.height }).toEqual({ w: 1200, h: 630 });
  });
});

describe("generated icons", () => {
  // Next emits <link rel="icon"> and the apple-touch-icon from these filenames alone. If the
  // generator has not been run, they are silently absent and the site ships with no favicon.
  for (const file of ["app/icon.png", "app/apple-icon.png"]) {
    it(`${file} exists — run scripts/generate-icons.mjs if not`, () => {
      expect(existsSync(join(ROOT, file))).toBe(true);
    });
  }
});
