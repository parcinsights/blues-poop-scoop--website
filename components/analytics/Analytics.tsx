"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { googleAdsId, metaPixelId } from "@/lib/analytics";

/**
 * The two base tags — Google Ads and the Meta pixel — mounted once for the whole site.
 *
 * Each renders only if its ID is set, so an unconfigured environment ships neither. See
 * lib/analytics.ts for why the IDs live in the environment and belong to production alone.
 *
 * `afterInteractive` on both, which is Next's "as soon as the page is usable, not before". These
 * are marketing tags: nothing on the page waits for them, nobody sees them, and a conversion
 * reported 400ms later is worth exactly as much as one reported immediately. `beforeInteractive`
 * would put two third-party round trips in front of the site's own hydration to buy nothing.
 */
export function Analytics() {
  return (
    <>
      {googleAdsId ? (
        <>
          <Script
            id="google-ads-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
          />
          {/*
            The stock gtag bootstrap, verbatim from the Ads UI. `gtag` has to be a function
            declaration on `window` rather than anything tidier — the loaded library looks for that
            exact global, and the arguments object it pushes is what carries the call through.

            The `config` call is what reads the `gclid` off the ad click and stores it. Without it
            a conversion still fires but attributes to nothing, which in the Ads UI looks identical
            to no conversion at all.
          */}
          <Script id="google-ads-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAdsId}');`}
          </Script>
        </>
      ) : null}

      {metaPixelId ? (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
          </Script>
          {/*
            Meta's no-JavaScript fallback: a 1x1 request that records the view for browsers that
            never run the snippet above. It ships as-is from their UI and there is no reason to
            drop it, but do not expect much from it — a visitor with JavaScript off is a visitor
            who cannot use either form on this site.
          */}
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
          <MetaRouteViews />
        </>
      ) : null}
    </>
  );
}

/**
 * Re-fires Meta's `PageView` on client-side navigation.
 *
 * The pixel snippet counts one view, when the document loads. That is correct on a site of plain
 * documents and wrong here: this is the App Router, so every link press swaps the page without a
 * reload, and Meta would see a visitor who read nine pages as a visitor who read one. Retargeting
 * audiences and any future page-based rule are built on that count.
 *
 * The first render is skipped because the snippet above already reported it — without the guard,
 * every entry to the site reports two.
 *
 * `usePathname` and NOT `useSearchParams`: reading search params in a client component forces the
 * whole tree below it out of static rendering unless it is wrapped in Suspense, which is a real
 * cost against a site whose pages are entirely static. No page here varies by query string, so
 * there is nothing to lose by ignoring them.
 *
 * Google Ads is deliberately not re-configured on navigation. It needs the `gclid` captured once
 * per visit, which the initial `config` does; it has no interest in page counts. A GA4 property,
 * if one is ever added, WOULD want the same treatment as Meta gets here.
 */
function MetaRouteViews() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
