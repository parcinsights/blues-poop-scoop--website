/**
 * The few theme values JavaScript needs, which CSS custom properties cannot supply:
 * the `theme-color` meta tag and the generated Open Graph image.
 *
 * app/theme.css remains canonical. `theme.test.ts` parses that file and fails if these drift out
 * of sync, so this cannot quietly become a second source of truth for the brand color.
 */
export const BRAND_HEX = "#0b4e70";
export const INK_HEX = "#333333";
export const SURFACE_HEX = "#fff3de";
