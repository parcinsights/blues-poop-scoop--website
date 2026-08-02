import { redirects } from "./lib/redirects.mjs";

/**
 * One trailing-slash policy, decided once. Changing it after launch is a URL migration,
 * so it is pinned here and every internal URL is built from `lib/routes.ts` to match.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Cloudflare Images serves the transforms; Next only needs the width set it may request.
    // Swapped to a custom loader in phase 5, once img.bluespoopscoop.com exists.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1920],
    imageSizes: [96, 160, 240, 320],
    /**
     * The allowlist of `q` values the optimizer will honour. Next 16 refuses any quality not
     * listed here — an unlisted one returns an error, not a fallback — so the site default set in
     * ui/Image must appear in this array or every image on the site 400s.
     */
    qualities: [68, 75],
  },
  async redirects() {
    return redirects;
  },

  /**
   * Security headers. Not ranking factors — preventing a hacked site is the point, and a hacked
   * site IS a ranking event: it earns a manual action and a browser interstitial (SEO master §29).
   *
   * What is deliberately NOT here is a script-src CSP. Locking scripts down properly needs a
   * per-request nonce, a nonce needs middleware, and middleware would run on every request and
   * opt this site out of being fully static — a real TTFB cost (§14.8) against a threat model of
   * a site with no user input rendered anywhere and no third-party scripts at all. `frame-ancestors`
   * is worth having on its own, so it ships as a one-directive policy; revisit the rest if a tag
   * manager or a chat widget ever lands here.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          /**
           * Two years, subdomains included, and preload-eligible. Only ever sent over HTTPS, so
           * it cannot strand a local http:// dev server.
           */
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Stops a browser from second-guessing a Content-Type — the classic "upload a .jpg that
          // is really JavaScript" path.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Full URL to ourselves, origin-only to anyone else: referral traffic still attributes
          // in the other site's analytics without leaking our full paths off-origin.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here needs a camera, a microphone or a location.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Clickjacking: nobody frames this site. The modern spelling of X-Frame-Options: DENY.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
