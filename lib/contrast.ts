/**
 * WCAG relative luminance and contrast ratio.
 *
 * Used by theme.test.ts to prove the palette is legible. Contrast is the one accessibility
 * property that is fully decidable from the token values alone — so it should be a test, not a
 * manual audit somebody does once and never repeats after the client sends new brand colors.
 */

function channel(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG 2.1 minimums. */
export const AA_NORMAL_TEXT = 4.5;
export const AA_LARGE_TEXT = 3.0;
/** Non-text: interactive borders, focus indicators, icons that carry meaning. */
export const AA_NON_TEXT = 3.0;
