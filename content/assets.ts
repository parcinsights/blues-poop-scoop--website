/**
 * THE IMAGE REGISTRY. Every image on the site is declared here, with its alt text.
 *
 * The `Image` component takes a KEY from this file — it has no `src` prop and no `alt` prop. That
 * is the whole point: alt text is a required field on the record, so an image with no alt text is
 * a TypeScript error rather than something an accessibility audit finds in six months.
 *
 * Writing alt text: describe the image for someone who cannot see it. It is not a place for
 * keywords. "Dog poop removal Ardmore PA weekly service" helps nobody and is exactly the kind of
 * thing that reads as manipulation. For the logo, the alt is simply the company name, because
 * that is what the image communicates.
 */

import type { Asset } from "./types";

export const assets = {
  /**
   * THE logo — the header lockup's picture half, cropped tight to the artwork's own edges so the
   * space around it in the header comes from layout rather than from transparent pixels baked
   * into the file. The wordmark beside it is live text, not part of this image.
   *
   * Note the dimensions: 483×405 is not square. Declaring it square is what makes the header jump
   * as the image loads, so the registry carries the real numbers and assets.test.ts checks them
   * against the file on every run.
   */
  logoMark: {
    src: "/brand/blues-poop-scoop--logo-cropped.png",
    alt: "Blue's Poop Scoop",
    width: 483,
    height: 405,
  },
  /**
   * The homepage hero photograph — the owners and the dog the business is named after. A real
   * photo of the actual people is the single hardest thing for a franchise competitor to match,
   * which is why it sits above the fold rather than a stock lawn.
   */
  landingHero: {
    src: "/landing--hero.jpg",
    alt: "The owners of Blue's Poop Scoop in branded sweatshirts, holding their small white dog outdoors",
    width: 3000,
    height: 2000,
  },
  /**
   * The "why us" band. Portrait, and cropped to a band on a phone — see the note in `WhyUs`.
   * Downsized from the 4000×6000 original: nothing on the page renders it wider than ~600 CSS
   * pixels, and shipping the camera's file is 2.7MB of nothing.
   */
  whyUs: {
    src: "/why-us.jpg",
    alt: "The owners of Blue's Poop Scoop kneeling on a lawn with their small white dog",
    width: 2000,
    height: 3000,
  },
  /**
   * The full-bleed band at the top of /pricing/ — the van, the two owners, the real scooper and
   * the phone number painted on the door. It runs edge to edge under the h1 and is the only
   * picture on the page: someone about to read three numbers is deciding whether these are real
   * people, and a signwritten van answers that faster than any sentence.
   *
   * Cropped hard by `object-cover` in a fixed-height band, so the van sits in the middle third of
   * the frame and survives the crop at every width. Downsized from the camera's 6000×4000 — the
   * band never renders wider than ~1600 CSS pixels and the original was 2.6MB.
   */
  pricingBanner: {
    src: "/pricing.jpg",
    alt: "The two owners of Blue's Poop Scoop standing beside their branded green and white van",
    width: 2400,
    height: 1600,
  },
  /**
   * The photograph under the /commercial/ hero — both owners on the lawn of a brick building,
   * with the rake and the scooper. It is the one picture on file taken on GROUNDS rather than in
   * somebody's back yard, which is the whole reason it belongs to this page: a property manager
   * scanning it sees a building like theirs, not a garden.
   *
   * It runs at the full container width with no crop, so unlike the other photographs here its
   * shape is the shape it renders at. Downsized from the camera's 6000×4000 — the band never
   * renders wider than ~1140 CSS pixels and the original was 4.2MB.
   */
  commercialHero: {
    src: "/commercial.jpg",
    alt: "Two Blue's Poop Scoop owners on a lawn outside a brick building, holding a scooper",
    width: 2400,
    height: 1600,
  },

  /**
   * The photograph beside the story on /about/ — both owners and Blue, on a path in the fall.
   * Portrait, and cropped to a band exactly as `whyUs` is: the faces sit at about a third of the
   * way down and the dog at three quarters, so a centre crop keeps all three. Downsized from the
   * original 1950×2925.
   */
  aboutStory: {
    src: "/about.jpg",
    alt: "Both owners in branded sweatshirts on a leafy path, with their small white dog",
    width: 1200,
    height: 1800,
  },

  /**
   * The band under the h1 on /opportunities/ — both owners from behind, walking away up a leafy
   * path in the branded sweatshirts, the phone number across the back of each.
   *
   * It is on the hiring page rather than anywhere else because of what it shows: not faces selling
   * a service, but the UNIFORM and the walk. Someone reading a job ad is picturing themselves
   * doing the work, and this is the only picture on file taken from behind — nobody in it is
   * looking at you, so there is room in the frame to imagine being the third person on that path.
   *
   * Cropped to a wide band by `PhotoBand`, and it survives that crop: both figures sit in the
   * middle third with the lettering at their shoulder blades, which is the part that has to
   * stay.
   */
  opportunitiesHero: {
    src: "/opportunities.jpg",
    // Sixteen words, which is the registry's ceiling — the slogan is spent on deliberately. It is
    // the only text visible in the frame, and text in a picture belongs in its alt.
    alt: "Two staff walking away up a path, sweatshirts printed “We scoop so you don't have to”",
    width: 3000,
    height: 2000,
  },

  /**
   * ── THE CREW ───────────────────────────────────────────────────────────────
   * One portrait per member of the team band on /about/. All three are cropped by `object-cover`
   * with a TOP anchor in a fixed-height box — every one of them is a tall portrait with the face in
   * the upper third, and a centre crop takes the head off. Downsized from the camera's 4000×6000.
   *
   * Which face belongs to which name was confirmed by the client on 2026-08-01, after the first
   * pair of files turned out to be the wrong way round. If it ever needs correcting again the fix
   * is the two `src` lines below and nothing else — no page, block or content record names a file.
   */

  teamGeorge: {
    src: "/george.jpg",
    alt: "George, in a Blue's Poop Scoop cap and branded shirt, outside in front of a hedge",
    width: 1200,
    height: 1800,
  },
  teamSophie: {
    src: "/sophie.jpg",
    alt: "Sophie, in a Blue's Poop Scoop t-shirt, outside in front of a hedge",
    width: 1200,
    height: 1800,
  },
  /** Blue himself, in the company bandana. The business is named after this dog. */
  teamBlue: {
    src: "/blue.webp",
    alt: "Blue, a small white and grey dog in a blue bandana, lying on the grass",
    width: 1200,
    height: 1800,
  },

  /**
   * ── THE SERVICE CARDS ──────────────────────────────────────────────────────
   * One per service, for the 2×2 grid on /services/. All four are cropped square-ish by
   * `object-cover` in a fixed-height box, so what matters in each is that the subject sits near
   * the middle — the top and bottom of a tall frame are the first things the crop takes.
   */

  /**
   * Poop Scoop. The only one of the four that is a photograph of the actual business — the owners,
   * in branded shirts, with the real scooper. Downsized from the camera's 4000×6000: nothing
   * renders it wider than ~600 CSS pixels and the original was 4MB.
   */
  servicePoopScoop: {
    src: "/services--poop-scoop.jpg",
    alt: "Two Blue's Poop Scoop staff beside a dog waste station, one holding a scooper",
    width: 1200,
    height: 1800,
  },
  /** Deodorizer. Stock — a pump sprayer treating a lawn. Replace when there is a photo of the real work. */
  serviceDeodorizer: {
    src: "/services--deodorizer.jpg",
    alt: "A gloved worker kneeling on a lawn, spraying it with a handheld pump sprayer",
    width: 1031,
    height: 797,
  },
  /** Haul Away. Stock — a loaded skip on a driveway. */
  serviceHaulAway: {
    src: "/services--haul-away.webp",
    alt: "A blue skip on a driveway, filled with household junk and bagged waste",
    width: 1920,
    height: 1280,
  },
  /** One-Time Clean. Stock — a caddy of cleaning supplies. */
  serviceOneTimeClean: {
    src: "/services--one-time-clean.jpg",
    alt: "A yellow bucket packed with brushes, cloths, gloves and spray bottles",
    width: 1200,
    height: 675,
  },

  /** The full lockup, artwork and wordmark together. For social cards and print, not the header. */
  logoFull: {
    src: "/brand/blues-poop-scoop--logo--full.png",
    alt: "Blue's Poop Scoop — pet waste removal",
    width: 1024,
    height: 1024,
  },
} as const satisfies Record<string, Asset>;

export type AssetKey = keyof typeof assets;

/** The default social share card, generated by scripts/generate-icons.mjs. */
export const ogDefault = {
  src: "/brand/og-default.png",
  alt: "Blue's Poop Scoop — pet waste removal",
  width: 1200,
  height: 630,
} satisfies Asset;
