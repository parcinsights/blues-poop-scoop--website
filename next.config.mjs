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
  },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
