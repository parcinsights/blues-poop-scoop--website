# Blue's Poop Scoop — Implementation Plan

Standalone marketing site for a real client. Pet waste removal, Philadelphia + Main Line.
Isolated repo — **not** a tenant of `../seo-website-template`. Patterns may be harvested back into
that template later; nothing here imports from it.

**Status:** phases 1–2 built (scaffold + SEO spine). 44 tests pass, typecheck and build clean.
Phases 3–6 blocked on the client handoff in §10. Last updated 2026-07-31.

---

## 1. Decisions locked

| Area | Decision |
|---|---|
| Stack | Next.js (App Router) · React · Tailwind v4 · TypeScript strict |
| Hosting | Vercel |
| Images | Cloudflare R2 + Cloudflare Images on `img.bluespoopscoop.com` |
| Content | Typed TS files under `content/` — no CMS |
| Colors | One `@theme` block; Tailwind defaults cleared so literal colors cannot compile |
| Type | One scale in the same file; base element styles in one `@layer base` sheet |
| URLs | Restructured, with a 301 from every existing URL |
| Pricing | Hardcoded from real client numbers in `content/pricing.ts` |
| Segments | Residential in full + one real commercial landing page |
| Reviews | Hand-picked real quotes, rendered as content. **No review schema markup** |
| Address | Service-area business — no street address rendered anywhere |
| Lead capture | Two form types, different sinks (§7) |

---

## 2. Known facts (verified 2026-07-31)

Existing site: WordPress + Yoast behind Cloudflare bot protection. Direct crawl returns 403, so the
full URL inventory must come from the client (§10).

Confirmed live URLs: `/` · `/about/` · `/residential/` · `/commercial-services/` ("Coming Soon").
A GoHighLevel funnel page for "Service Areas" also exists outside the WordPress install.

Service zips: `19003 19004 19010 19035 19038 19041 19072 19085 19096 19118 19119 19128 19129`

Mapped:

| Zip | Place | Type |
|---|---|---|
| 19003 | Ardmore | municipality |
| 19004 | Bala Cynwyd | municipality |
| 19010 | Bryn Mawr | municipality |
| 19035 | Gladwyne | municipality |
| 19038 | Glenside | municipality |
| 19041 | Haverford | municipality |
| 19072 | Narberth | municipality |
| 19085 | Villanova | municipality |
| 19096 | Wynnewood | municipality |
| 19118 | Chestnut Hill | Philadelphia neighborhood |
| 19119 | Mount Airy | Philadelphia neighborhood |
| 19128 | Roxborough | Philadelphia neighborhood |
| 19129 | East Falls | Philadelphia neighborhood |

**Geo recommendation (needs a nod, default assumed):** give each *municipality* its own page, and
give Philadelphia one page that covers Chestnut Hill / Mount Airy / Roxborough / East Falls as
sections rather than four separate URLs. Four near-identical neighborhood URLs is the classic
doorway-page pattern and is the single most likely way this site gets algorithmically discounted.
If a neighborhood later earns real, distinct content — actual jobs, photos, route specifics — it can
graduate to its own URL then.

---

## 3. Repo structure

```
app/
  layout.tsx                root shell: fonts, theme, header/footer, skip link, org+website JSON-LD
  page.tsx                  home
  services/page.tsx
  services/[service]/page.tsx
  locations/page.tsx
  locations/[city]/page.tsx
  locations/[city]/[service]/page.tsx
  commercial/page.tsx
  about/page.tsx
  contact/page.tsx
  faq/page.tsx
  pricing/page.tsx
  get-started/page.tsx      the full Sweep&Go onboarding flow
  api/lead/route.ts         short form  -> GHL
  api/onboard/route.ts      full form   -> Sweep&Go + GHL
  sitemap.ts  robots.ts  not-found.tsx  opengraph-image.tsx
  theme.css                 THE token file — colors, type scale, spacing, radius
  base.css                  @layer base — h1-h6, p, a, ul, ol, blockquote, focus rings

components/
  ui/         Button Container Section Stack Cluster Card Field Input Select Badge Prose Icon
  blocks/     Hero ServiceGrid Steps PriceTable FaqAccordion CtaBand ServiceAreaList
              ReviewWall NapBlock TrustBar
  forms/      QuickLeadForm OnboardingForm (multi-step) ZipGate
  seo/        JsonLd Breadcrumbs

content/
  site.ts        NAP, hours, socials, GBP link, founding year, legal name
  nav.ts         header + footer link structure
  services.ts    service definitions: slug, name, h1, intent, copy blocks
  cities.ts      city definitions: slug, name, zips, lat/lng, copy blocks
  pricing.ts     real plans and rates
  faq.ts         questions + answers (feeds both the page and FAQPage schema)
  reviews.ts     real quotes, first name, city
  pages/         home.ts about.ts contact.ts commercial.ts get-started.ts
  assets.ts      the image registry — every image, keyed, with REQUIRED alt text

lib/
  seo.ts         buildMetadata() — one function, every page
  schema.ts      JSON-LD @graph builders
  routes.ts      typed URL helpers + the route registry that feeds sitemap.ts
  redirects.ts   the 301 map, consumed by next.config
  sweepandgo.ts  API client
  ghl.ts         webhook client
  validation.ts  Zod schemas shared by forms and API routes
```

---

## 4. The three centralization rules

### Color — `app/theme.css`

Single Tailwind v4 `@theme` block. Every Tailwind default palette entry set to `initial`, so
`bg-blue-500` and `bg-[#1a2b3c]` **do not compile** — a build error, not a code-review note. Semantic
names only (`brand`, `brand-dark`, `accent`, `ink`, `ink-muted`, `surface`, `surface-alt`, `line`,
`success`, `danger`). Changing the palette = editing one block, nothing else.

A vitest test asserts no component contains a hex code, an `rgb(`, or a Tailwind arbitrary value.

### Type — same file + `app/base.css`

Scale, families, weights, line-heights, and letter-spacing as tokens. `base.css` styles `h1`–`h6`,
`p`, `a`, `ul`, `ol`, `blockquote` once, so semantic HTML is correctly styled with zero classes.
Long-form content renders inside `<Prose>`. Fonts self-hosted via `next/font` — preloaded,
`display: swap`, subset. Changing a heading style = editing one rule.

### Content — `content/`

No English sentence lives in a component. Every heading, label, button verb, alt string, meta title,
and meta description comes from `content/`. Typed objects, so a missing field is a build error.
Content edits never touch a `.tsx` file.

---

## 5. Components

Three layers, strictly: `ui/` (no business meaning) → `blocks/` (composed sections, content-driven)
→ pages (~20-line assemblies). A page never writes a raw `<button>`, never sets a color, never
hardcodes a string.

`Button` carries the variants — `primary` `secondary` `ghost` `link`, sizes `sm` `md` `lg`, plus
`href` (renders `<a>`) vs `onClick` (renders `<button>`). Every CTA on the site is this component.

---

## 6. SEO implementation

**Metadata** — `lib/seo.ts` exposes one `buildMetadata()`. Every page gets: unique title (templated),
unique description drawn from its own content, self-referencing canonical, OG tags, Twitter summary
card, `metadataBase` from a single env-derived origin. No page hand-rolls a `<meta>`.

**Structured data** — `lib/schema.ts` emits one `@graph` per page, assembled from the same data the
page renders so markup cannot drift from content:
`LocalBusiness` (service-area: `areaServed` list, no `address` street) · `WebSite` · `WebPage` ·
`BreadcrumbList` · `Service` on service pages · `FAQPage` on the FAQ · `ImageObject` for hero images.
All `@id`s on our own origin. Deliberately **no** `aggregateRating` or `review` — self-serving review
markup on your own domain is against Google's guidelines and risks a manual action.

**Crawl** — `app/sitemap.ts` generated from the route registry in `lib/routes.ts`, so a new page
cannot be orphaned. `app/robots.ts` allows everything in production and returns `Disallow: /` on
preview deployments (prevents preview URLs being indexed — a genuinely common leak). Real 404.

**Migration** — every old URL 301s to its new home via `lib/redirects.ts` in `next.config`. Any old
URL with no equivalent redirects to the nearest relevant page, never to the homepage in bulk (bulk
homepage redirects are treated as soft 404s). Post-launch: submit the new sitemap in Search Console
and watch the coverage report for a fortnight.

**Images** — `components/ui/Image` takes an **asset key**, not a `src`. Alt text is a required field
on the asset record in `content/assets.ts`, so a missing alt is a type error. Explicit width/height
on every image (no CLS), AVIF/WebP, `priority` on the LCP image only, Cloudflare loader, lazy
everything below the fold.

**On-page** — exactly one `<h1>` per page, no skipped heading levels, visible breadcrumbs everywhere
except home, descriptive internal anchor text, services↔locations cross-linking so every page is
reachable in ≤3 clicks.

**Performance budget** — every page statically generated. Client JS only for the mobile nav and the
forms. Targets: LCP < 2.0s, CLS < 0.05, INP < 200ms, JS < 100KB gzipped on content pages. No
third-party script above the fold; analytics loaded with `next/script` at `afterInteractive`.

**Accessibility** — skip link, visible focus rings, WCAG AA contrast asserted by a unit test over the
token pairs, every form field labeled with real `<label>`s, `aria-current` on active nav, keyboard-
operable accordions, `prefers-reduced-motion` respected.

---

## 7. Lead pipeline

Two forms, deliberately different, because the CRMs demand different things.

**QuickLeadForm** — hero, footer, and inline CTA bands. Fields: name, email, phone, zip, number of
dogs. One component behind every placement (`LeadFormCard` → `QuickLeadForm`), so the service pages
and `/locations/` cannot drift apart. `POST /api/lead` branches on the zip:

- **in the service area** → GHL webhook only. Not enough information or intent to create a client
  record, and Sweep&Go has no endpoint that would take it anyway — see §7a.
- **outside it** → Sweep&Go `out_of_service_form` **and** GHL. The owner still owes that person a
  reply, and a zip just outside the line is what decides where the line moves next.

Either way GHL gets it; one sink succeeding is a success for the visitor, and a partial failure is
loud in the log rather than on the screen.

**OnboardingForm** — its own page at `/get-started/`, multi-step. Collects everything
`PUT /api/v1/residential/onboarding` requires: first/last name, email, cell, home address, city,
state, zip, number of dogs, cleanup frequency, initial-cleanup flag. `POST /api/onboard` →
**Sweep&Go client creation AND GHL**, fired independently so a Sweep&Go failure never loses the lead.
Zip validated live against `POST /api/v2/client_on_boarding/check_zip_code_exists`; an out-of-area
zip routes to `POST /api/v2/client_on_boarding/out_of_service_form` and still notifies GHL.

Both routes: Zod-validated server-side, honeypot field, rate limited by IP, credentials in env only
(`GHL_WEBHOOK_URL`, `SWEEPANDGO_API_TOKEN`) and never in the client bundle. Failures are logged with
the payload retained so no lead is silently dropped.

### 7a. What Sweep&Go's API actually does — probed live 2026-08-03

Against a real token, not read off the spec. Three of these contradict what the plan above assumed,
so read them before building the onboarding step.

**There is no create-an-in-service-lead endpoint.** `lead:in_service_area` appears in their tag list
but it is a WEBHOOK they fire outward when a lead lands, not a route we can call. Probed and 404 or
405: `/client_on_boarding/in_service_form`, `/client_on_boarding/service_form`,
`/client_on_boarding/save_lead`, `/client_on_boarding/lead`, `POST /api/v1/leads`,
`POST /api/v2/leads`, `POST /api/v1/leads/create`, `POST /api/v2/free_quotes`. The only writes that
exist are the out-of-area form, the residential onboarding PUT, and create-client-with-package.

So an in-area short-form lead has nowhere to go in Sweep&Go. It goes to GHL alone. Forcing one in
via the onboarding PUT would put a live client on the dispatch board with an invented street address.

**`POST /client_on_boarding/out_of_service_form` works.** Verified end to end: it returns
`{"success":"success"}` and the lead appears in `GET /api/v1/leads/list` as `type: out_of_area`.
`address` is required and the short form has no address field, so we send an explicit
`"No address given - web quote form (zip NNNNN)"` rather than a blank or an invented street.

Note `GET /api/v1/leads/out_of_service` returned `total: 0` while `leads/list` showed the same leads.
That read endpoint filters on something other than `type`. Confirm with the client which list in
their dashboard these actually surface in before telling him where to look.

**`PUT /api/v1/residential/onboarding` requires 11 fields**, per its own 422 on an empty body:
`zip_code` `number_of_dogs` `last_time_yard_was_thoroughly_cleaned` `clean_up_frequency`
`first_name` `last_name` `email` `city` `home_address` `state` `initial_cleanup_required`.
The spec also lists `marketing_allowed` as required; the server does not enforce it. Phone is NOT
required, which is odd for this business — send it anyway.

Two enum vocabularies must be mapped at the seam, not stored in our shape:
`clean_up_frequency` takes `once_a_week | bi_weekly | once_a_month` (plus daily/every-N-week values
we do not offer); `last_time_yard_was_thoroughly_cleaned` takes only nine buckets —
`one_week, two_weeks, three_weeks, one_month, two_months, 3-4_months, 5-6_months, 7-9_months,
10+_months` — while our `LAST_CLEANED` has thirteen values. Our 4/5/6/7/8/9-month options collapse
into their three wide buckets. Either map lossily or trim our list to their nine.

**The zip check cannot be trusted on the current token.** `POST
/client_on_boarding/check_zip_code_exists` is real and answers correctly, but the account behind our
test token is not George's: of our 56 serviced zips, **zero** return `exists`, while 19025
(Glenside) does. Gating on the live call today would route every visitor to the out-of-area form.
Gate on our own `servicedZips` until the client's real service area is loaded into his account, then
switch.

### 7b. DEFERRED — the two-step form, pending the client's decision

Proposed and NOT built. The client has to decide whether he wants it, because it trades website
conversion for CRM completeness and that is his call to make, not ours.

The shape: every form on the site opens as **one field, the zip**. Submit it, check the service
area, then branch — in-area reveals the full onboarding form, out-of-area reveals a short
name/email/phone form that files an out-of-area lead. This mirrors Sweep&Go's own onboarding flow
and keeps the hero card a single input until someone has shown intent.

The cost, and the reason this is a conversation and not a ticket: the in-area branch is ~9 visible
fields (the 11 required minus `state`, always PA, and `city`, derivable from zip), and completing it
creates a LIVE CLIENT on the dispatch board with no agreed price and no human review. That is a lot
of friction for a website form, and a real client record created by a stranger.

Two questions to settle before building:
1. `initial_cleanup_required` — ask it outright, or infer it from `last_time_yard_was_thoroughly_
   cleaned` (past ~3 weeks implies yes)? Inferring saves a field but bills someone a first-visit
   surcharge they never explicitly agreed to.
2. Does a completed full form onboard immediately, or land in GHL carrying the full onboarding
   payload so the owner confirms a price and triggers the onboard himself?

---

## 8. Testing

Vitest + Testing Library. `pnpm typecheck` clean. Enforcement tests, not just behaviour tests:
no hex/arbitrary values in components · no bare English string in a component · every route in the
registry appears in the sitemap · every asset record has non-empty alt · token contrast pairs pass
WCAG AA · every old URL in the redirect map resolves to a route that exists. Playwright smoke test
over both form paths against a Sweep&Go test token. Lighthouse CI budget on the built output.

---

## 9. Build phases

1. ✔ **Scaffold** — Next app, theme tokens (placeholder values), base sheet, `ui/` primitives,
   layout shell, enforcement tests.
2. ✔ **SEO spine** — `lib/seo.ts`, `lib/schema.ts`, `lib/routes.ts`, sitemap, robots, 404,
   breadcrumbs. Homepage renders with a valid 3-node `@graph`, self-referencing canonical, one h1,
   and two preloaded font files.
3. ✔ **Brand pass** — real palette, real fonts (Bitter + Montserrat), logo wired into the header,
   favicon / apple-icon / OG card generated by `scripts/generate-icons.mjs`. Every color pair
   contrast-tested; every image dimension checked against the real file.
4. **Content build** — home, services, locations, about, contact, faq, pricing, commercial.
   *Blocked on facts and photos.*
5. **Forms** — both routes, both integrations, zip gating. *Blocked on API credentials.*
6. **Migration** — redirect map from the real URL inventory. *Blocked on the URL list.*
7. **Launch** — Vercel project, DNS cutover, Cloudflare Images, GSC + GA4, sitemap submission,
   redirect verification.

Phases 1 and 2 can start immediately and are roughly half the code.

---

## 10. What I need from you

**Blocks the brand pass:** logo files (SVG preferred, plus a square mark for the favicon and OG
image), exact hex codes, font names — and whether they're licensed for web use.

**Blocks the migration:** the complete list of current URLs. Fastest source is
`https://bluespoopscoop.com/sitemap_index.xml` opened in a browser (Cloudflare blocks my fetch), or a
Search Console page export. Without this, old rankings die at cutover.

**Blocks content:** real pricing (plans + rates), review quotes with first name and city, photos from
the crew's phones (the single highest-value SEO asset available and the one thing no competitor can
copy), legal business name, phone, email, hours, founding year, service list with the client's own
names for each, and what the owner says makes them different from the franchises.

**Blocks the forms:** GHL sub-account webhook URL, Sweep&Go API token, and confirmation of the exact
cleanup-frequency values their account uses.

**Blocks the service-area map (built, parked):** the **Maps Static API** activated on the Google
Cloud project that owns the key in `NEXT_PUBLIC_GOOGLE_MAPS_KEY`. The key is valid — the Maps Embed
API answers `200` with it — but every static request comes back `403 "This API is not activated on
your API project"`, including a bare one with no polygon or markers. That wording is project-level
activation, not a key restriction (a restricted key reports "not authorized to use this service"
instead), so the likely cause is that the API was enabled in a different project than the one the
key belongs to: check the project picker while the key is on screen under Credentials, then enable
it there. Also confirm the referrer restriction lists the production domain.

Everything else is done and tested: `lib/maps.ts` (convex hull of the town centres → a filled
polygon, plus a pin per town, auto-framed so adding a town re-fits the map), `coords` on every entry
in `content/cities.ts`, `ServiceAreaMap` and `ServiceAreaMapFrame` in `components/blocks/blocks.tsx`,
and the copy in `content/pages/home.ts`. Two call sites are commented out rather than deleted —
`app/page.tsx` between the steps and the prices, and `app/locations/page.tsx` above the town cards.
Uncomment both once a static map actually loads; until then the band would ship a broken image,
because nothing on the server can tell a working key from one Google will refuse.

**Blocks launch:** domain registrar login, Vercel account, Cloudflare account, GA4 property, Search
Console access, Google Business Profile access.

**Needs a nod:** the Philadelphia-neighborhoods geo call in §2.

---

## 11. Open items

- Old URL inventory unknown — redirect map cannot be written yet.
- The existing GoHighLevel "Service Areas" funnel page: fold into the new site, or leave live? If it
  stays, it competes with our own location pages for the same queries.
- Sweep&Go documents no rate limits and no sandbox. Test-mode behaviour needs confirming before we
  point a live form at the client's production CRM.
- **The two-step zip-gate form is with the client — see §7b.** It adds real friction to a website
  form and creates live clients from strangers, so it is his call. Nothing is built.
- **The Sweep&Go token in `.env.local` is a test token on somebody else's account** — its service
  area is 19025, not ours. Needs replacing with the client's before the zip gate or onboarding can
  be switched to the live check.
- Two test leads sit in that account from this work — `TEST LEAD please ignore` and
  `E2E Out Of Area TEST`, both zip 08540. Their API has no delete-lead endpoint; clear them from the
  dashboard.
- Commercial landing page needs real commercial facts. Their current page says "Coming Soon" — if
  they have never done a commercial job, the page can only offer the service, not evidence it.
