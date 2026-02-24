import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrganizationJsonLd } from "@/components/seo/jsonld/organization";
import { SoftwareApplicationJsonLd } from "@/components/seo/jsonld/software-application";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      <SoftwareApplicationJsonLd />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
