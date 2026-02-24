import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";
import { JsonLd } from "@/components/seo/json-ld";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.svg"),
      }}
    />
  );
}
