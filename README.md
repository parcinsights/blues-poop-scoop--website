# Blue's Poop Scoop

Marketing site for a pet waste removal business serving Philadelphia and the Main Line.
Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript strict.

See [PLAN.md](PLAN.md) for the full implementation plan and the outstanding client handoff list.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # enforcement + unit tests
pnpm typecheck
pnpm build
```

---

## The four rules

Each one is enforced by a test, not by a convention. Break one and `pnpm test` fails.

### 1. `app/theme.css` is the only place a color, font, or size is written

Every Tailwind default scale is cleared to `initial`. `bg-blue-500`, `text-4xl`, `rounded-xl` and
`p-[13px]` **do not compile**. Want a color that isn't in the file? Add it there, or get a build
error — there is no third option.

Restyling the whole site is one file.

### 2. `app/base.css` is the only place an element is styled

`h1`–`h6`, `p`, `a`, `ul`, `blockquote` are styled once. Write semantic HTML and it looks right with
zero classes. Changing every h2 on the site is one rule.

### 3. `content/` is the only place English lives

No component contains a business sentence. Headings, labels, button verbs, meta titles, meta
descriptions, alt text — all typed objects in `content/`. A missing field is a build error, which is
the point: you cannot ship a page with no meta description by forgetting.

Copy still awaiting real client facts is wrapped in `todo()`. That function **throws on a production
build**, so placeholder text physically cannot reach the live site.

### 4. `lib/routes.ts` is the only place a URL is written

`app/sitemap.ts` is generated from the registry, so a page cannot be orphaned. Nav links, redirect
destinations and breadcrumbs are all checked against it. `implemented: true` means a route file
really exists — the sitemap never lists a 404.

---

## Layout

```
app/theme.css        tokens — colors, type scale, spacing, radius, shadows
app/base.css         element styles + .prose + skip link
app/layout.tsx       fonts, header/footer, skip link
app/sitemap.ts       generated from lib/routes.ts
app/robots.ts        Disallow: / on every non-production deployment

components/ui/       Button, layout primitives, surfaces — shape only, no content
components/blocks/   Header, Footer — composed sections
components/seo/      JsonLd (the only ld+json in the app), Breadcrumbs

content/             every English string on the site
lib/seo.ts           buildMetadata() — canonical, OG, Twitter, robots
lib/schema.ts        JSON-LD @graph builders + build-time validation
lib/routes.ts        the route registry
lib/redirects.mjs    the 301 map from the old WordPress URLs
```

## What is deliberately absent

- **No `aggregateRating` or `review` markup.** Self-serving review structured data on your own site
  breaks Google's guidelines and risks a manual action. Real quotes render as visible content.
- **No street address.** Service-area business; `areaServed` carries coverage instead. This must
  stay consistent with the Google Business Profile's hidden-address setting.
- **No `lastmod` in the sitemap.** Google ignores it once every URL bumps on every deploy. It
  returns when content carries real edit dates.
- **No neighbourhood URLs.** Chestnut Hill, Mount Airy, Roxborough and East Falls are sections of
  the Philadelphia page, not four near-identical pages. See PLAN.md §2.
- **No client JS in the header.** The mobile menu is a `<details>` element.
