import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { AA_NON_TEXT, AA_NORMAL_TEXT, contrastRatio } from "./contrast";
import { BRAND_HEX, INK_HEX, SURFACE_HEX } from "./tokens";

const ROOT = join(import.meta.dirname, "..");
const THEME_CSS = readFileSync(join(ROOT, "app/theme.css"), "utf8");

/** Pull a token's literal value out of theme.css — the canonical source. */
function token(name: string): string {
  const match = THEME_CSS.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match?.[1]) throw new Error(`theme.css has no --${name}`);
  return match[1].trim();
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const SOURCE_FILES = [
  ...walk(join(ROOT, "app")),
  ...walk(join(ROOT, "components")),
  ...walk(join(ROOT, "content")),
  ...walk(join(ROOT, "lib")),
].filter((file) => !file.endsWith(".test.ts"));

describe("theme.css is the single source of color", () => {
  it("clears every Tailwind default scale, so literal utilities cannot compile", () => {
    // Without these, `bg-blue-500` and `text-4xl` silently work and bypass this file entirely.
    for (const namespace of ["--color-*", "--font-*", "--text-*", "--radius-*", "--shadow-*"]) {
      expect(THEME_CSS).toContain(`${namespace}: initial;`);
    }
  });

  it("keeps lib/tokens.ts in sync with theme.css", () => {
    expect(token("color-brand")).toBe(BRAND_HEX);
    expect(token("color-ink")).toBe(INK_HEX);
    expect(token("color-surface")).toBe(SURFACE_HEX);
  });

  it("has no hard-coded color anywhere outside theme.css", () => {
    const offenders: string[] = [];
    for (const file of SOURCE_FILES) {
      // lib/tokens.ts is the one sanctioned mirror, checked for drift by the test above.
      if (file.endsWith("lib/tokens.ts")) continue;
      const source = readFileSync(file, "utf8");
      for (const [index, line] of source.split("\n").entries()) {
        if (/#[0-9a-fA-F]{3,8}\b/.test(line) || /\b(rgb|hsl)a?\(/.test(line)) {
          offenders.push(`${file.replace(ROOT, "")}:${index + 1} — ${line.trim()}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("has no Tailwind arbitrary values, which route around the token set", () => {
    const offenders: string[] = [];
    for (const file of SOURCE_FILES) {
      const source = readFileSync(file, "utf8");
      for (const [index, line] of source.split("\n").entries()) {
        // e.g. p-[13px], bg-[#abc], text-[22px]
        if (/\b[a-z-]+-\[[^\]]+\]/.test(line)) {
          offenders.push(`${file.replace(ROOT, "")}:${index + 1} — ${line.trim()}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("palette meets WCAG AA", () => {
  const surface = token("color-surface");
  const surfaceAlt = token("color-surface-alt");
  const surfaceRaised = token("color-surface-raised");
  const surfaceDark = token("color-surface-dark");
  const ink = token("color-ink");
  const inkMuted = token("color-ink-muted");
  const brand = token("color-brand");
  const inkInverse = token("color-ink-inverse");

  /**
   * `canvas` is in here despite nothing rendering on it yet. It is the house page background kept
   * ready for the swap described in theme.css, and a background nobody has contrast-checked is
   * exactly the kind of thing that gets switched on during a redesign and ships illegible.
   */
  const READABLE_SURFACES: [string, string][] = [
    ["surface", surface],
    ["surface-alt", surfaceAlt],
    ["surface-raised", surfaceRaised],
    ["canvas", token("color-canvas")],
  ];

  const textPairs: [string, string, string][] = [
    ...READABLE_SURFACES.flatMap(
      ([name, bg]): [string, string, string][] => [
        [`ink on ${name}`, ink, bg],
        [`ink-muted on ${name}`, inkMuted, bg],
        [`brand on ${name}`, brand, bg],
      ],
    ),
    ["brand on brand-tint", brand, token("color-brand-tint")],
    ["brand on sky-tint", brand, token("color-sky-tint")],
    ["ink on sky-tint", ink, token("color-sky-tint")],
    ["ink-inverse on brand", inkInverse, brand],
    ["ink-inverse on brand-dark", inkInverse, token("color-brand-dark")],
    ["ink-inverse on surface-dark", inkInverse, surfaceDark],
    // The fill colors carry INK, never light text — that is what makes them usable at all.
    ["ink on sky", ink, token("color-sky")],
    ["ink on amber (the primary CTA)", ink, token("color-amber")],
    ["ink on amber-dark (CTA hover)", ink, token("color-amber-dark")],
    ["ink on amber-tint", ink, token("color-amber-tint")],
    ["ink on success", ink, token("color-success")],
    ["success-ink on surface", token("color-success-ink"), surface],
    ["danger-ink on surface", token("color-danger-ink"), surface],
    ["danger-ink on danger", token("color-danger-ink"), token("color-danger")],
  ];

  for (const [label, fg, bg] of textPairs) {
    it(`${label} clears ${AA_NORMAL_TEXT}:1`, () => {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    });
  }

  /**
   * The accent medallions on the "why us" band. Each fill has exactly one ink partner, and the
   * glyph inside it is small enough to be held to the text minimum rather than 3:1.
   */
  describe("accent pairs", () => {
    for (const name of ["mint", "peach", "lilac", "lemon"]) {
      it(`accent-${name}-ink clears ${AA_NORMAL_TEXT}:1 on accent-${name}`, () => {
        expect(
          contrastRatio(token(`color-accent-${name}-ink`), token(`color-accent-${name}`)),
        ).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      });
    }
  });

  /**
   * The inverse assertions. Three of the client's brand colors are light fills that look like
   * button colors and are not — white on amber is 1.64:1. Encoding that as a test means the
   * mistake gets caught the first time somebody tries it, rather than shipping and being found
   * by a customer who cannot read the quote button.
   */
  describe("light fills are documented as unusable with light text", () => {
    for (const name of ["color-sky", "color-amber", "color-success"]) {
      it(`${name} must never carry ink-inverse text`, () => {
        expect(contrastRatio(inkInverse, token(name))).toBeLessThan(AA_NORMAL_TEXT);
      });
    }
  });

  // Interactive borders are held to the non-text minimum. `--color-line` is the client's #a0b5bb,
  // which is decorative only (dividers, card edges) at 1.95:1 — deliberately exempt.
  it(`line-strong clears ${AA_NON_TEXT}:1 on every surface, for input borders`, () => {
    for (const [name, bg] of READABLE_SURFACES) {
      expect(contrastRatio(token("color-line-strong"), bg), name).toBeGreaterThanOrEqual(
        AA_NON_TEXT,
      );
    }
  });

  it(`the focus ring clears ${AA_NON_TEXT}:1 against every surface it lands on`, () => {
    for (const [name, bg] of READABLE_SURFACES) {
      expect(contrastRatio(brand, bg), name).toBeGreaterThanOrEqual(AA_NON_TEXT);
    }
  });
});
