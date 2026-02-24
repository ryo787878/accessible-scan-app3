import { JsonLd } from "@/components/seo/json-ld";

type ArticleJsonLdProps = {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  pageUrl: string;
  imageUrl: string;
};

export function ArticleJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  pageUrl,
  imageUrl,
}: ArticleJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        inLanguage: "ja-JP",
        datePublished,
        dateModified,
        author: {
          "@type": "Organization",
          name: "Accessible Scan",
        },
        publisher: {
          "@type": "Organization",
          name: "Accessible Scan",
        },
        mainEntityOfPage: pageUrl,
        image: [imageUrl],
      }}
    />
  );
}
