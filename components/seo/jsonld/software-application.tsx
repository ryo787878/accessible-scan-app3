import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo/site";
import { JsonLd } from "@/components/seo/json-ld";

export function SoftwareApplicationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: absoluteUrl("/"),
        description: SITE_DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "JPY",
        },
      }}
    />
  );
}
