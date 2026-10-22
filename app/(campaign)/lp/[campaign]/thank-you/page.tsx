import type { Metadata } from "next";

import { ThankYou } from "@/components/blocks/ThankYou";
import { campaigns } from "@/content/campaigns";
import { thankYou } from "@/content/pages/standing";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

/**
 * /lp/<slug>/thank-you/ — where an ad landing page's form lands. The same page as /thank-you/, at a
 * URL Google Ads' "Submit lead form" rule does not match, so these leads stay out of Google Ads'
 * conversions. See `ThankYou` for the why, and `routes.campaignThankYou`.
 *
 * In the campaign chrome, like the landing page it follows: no site nav, just the phone.
 */

type Params = { params: Promise<{ campaign: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ campaign: campaign.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { campaign: slug } = await params;
  return buildMetadata({ ...thankYou.seo, path: routes.campaignThankYou(slug), noindex: true });
}

export default function CampaignThankYouPage() {
  return <ThankYou />;
}
