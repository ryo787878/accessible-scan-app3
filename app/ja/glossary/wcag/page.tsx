import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, ogImageUrl } from "@/lib/seo/site";

const title = "WCAGとは？";
const description = "WCAGの基本概念と、Webアクセシビリティ チェックで見るべき達成基準を解説します。";
const canonicalPath = "/ja/glossary/wcag";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    title,
    description,
    url: canonicalPath,
    images: [
      {
        url: ogImageUrl("blog", title),
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl("blog", title)],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "日本語ガイド", item: absoluteUrl("/ja") },
    { "@type": "ListItem", position: 3, name: "用語集", item: absoluteUrl(canonicalPath) },
  ],
};

export default function WcagGlossaryPage() {
  return (
    <PageShell maxWidth="3xl">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="flex flex-col gap-6">
        <PageIntro
          title="WCAGとは？"
          description="WCAGの基本概念と、Webアクセシビリティ チェックで見るべき達成基準を解説します。"
        />
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <p>WCAGはWeb Content Accessibility Guidelinesの略称で、アクセシビリティ実装の国際的な指針です。</p>
        </article>
      </div>
    </PageShell>
  );
}
