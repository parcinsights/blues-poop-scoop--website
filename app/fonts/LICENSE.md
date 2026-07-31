# LINE Seed Sans

**Family:** LINE Seed Sans (Latin), version 1.001
**Copyright:** © LINE Corporation
**Source:** https://seed.line.me
**License:** LINE Seed Font License — free to use, including commercially, and free to embed
in a website. Redistribution is permitted so long as the font is not sold on its own and this
notice travels with the files. Full terms are published at https://seed.line.me.

## Files here

Converted from the upstream `.otf` releases to `.woff2` (lossless; glyph outlines and metrics are
unchanged — only the container and compression differ). Three of the five shipped weights are
included, since those are what the site's type scale asks for:

| File                      | Weight | Used by                           |
| ------------------------- | ------ | --------------------------------- |
| `LINESeedSans_Rg.woff2`   | 400    | body copy; also serves 500 rules  |
| `LINESeedSans_Bd.woff2`   | 700    | h1/h2; also serves 600 rules      |
| `LINESeedSans_XBd.woff2`  | 800    | available, not currently invoked  |

Thin (100) and Heavy (900) are not vendored. To add one, download it from the source above,
convert with `fonttools` (`TTFont(src).flavor = "woff2"`), and add a `src` entry in
[`app/layout.tsx`](../layout.tsx).
