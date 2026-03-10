import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrganizationJsonLd } from "@/components/seo/jsonld/organization";
import { WebsiteJsonLd } from "@/components/seo/jsonld/website";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
