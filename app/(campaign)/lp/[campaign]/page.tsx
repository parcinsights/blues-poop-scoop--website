import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand, TrustBar } from "@/components/blocks/blocks";
import {
  CAMPAIGN_FORM_ID,
  CampaignHero,
  ProcessBand,
  ReviewStrip,
  STICKY_CTA_HIDE,
} from "@/components/blocks/campaign";
import { StickyCtaBar } from "@/components/blocks/StickyCtaBar";
import { campaignBySlug, campaigns } from "@/content/campaigns";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

/**
 * /lp/<slug>/ — a paid-traffic landing page, one per record in content/campaigns.ts.
 *
 * The bands, top to bottom: the promise with the form beside it, three facts, the reviews, what
 * working with us looks like, and a closing ask. Every button jumps to the form or dials the phone;
 * see components/blocks/campaign.tsx for the rules the page is built on.
 *
 * `noindex`, absent from the sitemap, and linked from nowhere on the site — an ad is the only way
 * in, so every visit, and every lead tagged with this slug, is the campaign's. A page Google could
 * send people to would mix organic visitors into the ad's numbers. See `routes.campaign`.
 *
 * NO STRUCTURED DATA AND NO BREADCRUMBS, for the reason /thank-you/ has none: both describe a page's
 * place in a site somebody browses, and this page is deliberately not part of one.
 *
 * The form lands on /lp/<slug>/thank-you/, not /thank-you/, so Google Ads does not count these
 * leads — see `routes.campaignThankYou`. Meta's Lead event reports them as `campaign`, so they can
 * be split from the site's own forms there.
 */

type Params = { params: Promise<{ campaign: string }> };

/** Only the slugs in content/campaigns.ts exist. Anything else 404s without rendering. */
export const dynamicParams = false;

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ campaign: campaign.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { campaign: slug } = await params;
  const campaign = campaignBySlug(slug);
  if (!campaign) return {};
  return buildMetadata({ ...campaign.seo, path: routes.campaign(slug), noindex: true });
}

export default async function CampaignPage({ params }: Params) {
  const { campaign: slug } = await params;
  const campaign = campaignBySlug(slug);
  if (!campaign) notFound();

  const formHref = `#${CAMPAIGN_FORM_ID}`;

  return (
    <>
      <CampaignHero campaign={campaign} />

      <TrustBar items={campaign.trust} />

      <ReviewStrip
        heading={campaign.reviews.heading}
        intro={campaign.reviews.intro}
        reviews={campaign.reviews.items}
      />

      <ProcessBand process={campaign.process} />

      {/* `canvas`, after the white band above. The button jumps back up to the form rather than
          off to /contact/ — on this page there is nowhere else to go. */}
      <div {...STICKY_CTA_HIDE}>
        <CtaBand
          heading={campaign.close.heading}
          detail={campaign.close.detail}
          tone="canvas"
          cta={{ label: campaign.hero.cta, href: formHref }}
        />
      </div>

      <StickyCtaBar label={campaign.hero.cta} href={formHref} />
    </>
  );
}
