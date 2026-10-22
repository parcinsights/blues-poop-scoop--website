import { CampaignFooter, CampaignHeader } from "@/components/blocks/campaign";

/**
 * The chrome for the ad landing pages: a lockup and a phone number on top, the business's name and
 * number at the foot, and nothing to click that leaves the page. See components/blocks/campaign.tsx
 * for why a landing page drops the navigation.
 *
 * `.chrome-campaign` pins `--header-height` to this bar's height at every width. The site header
 * grows at `md` (its social row appears), and the page under it is pulled up by exactly that much —
 * this bar has no social row, so without the pin every campaign page would open with a strip of
 * empty band under the header on a laptop. See base.css.
 */
export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="chrome-campaign">
      <CampaignHeader />
      <main id="main">{children}</main>
      <CampaignFooter />
    </div>
  );
}
