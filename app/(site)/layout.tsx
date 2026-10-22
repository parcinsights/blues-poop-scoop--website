import { Footer } from "@/components/blocks/Footer";
import { Header } from "@/components/blocks/Header";

/**
 * The chrome for every page a visitor BROWSES — the full header with its navigation, and the full
 * footer with the town directory.
 *
 * It lives here rather than in app/layout.tsx because one kind of page must not have it: the paid
 * landing pages under `(campaign)`. Someone who tapped an ad has one job on that page, and a menu of
 * fourteen other places to go is fourteen ways to leave without doing it. A route group is how the
 * App Router lets two sets of pages share the root (fonts, tags, skip link) while wearing different
 * chrome, and the parentheses mean no URL changes.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
