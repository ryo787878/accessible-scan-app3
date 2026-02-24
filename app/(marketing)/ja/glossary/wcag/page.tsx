import type { Metadata } from "next";
import { MarkdownDocLayout } from "@/components/markdown-doc-layout";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "WCAGとは？";
const description = "WCAGの基本概念と、Webアクセシビリティ チェックで見るべき達成基準を解説します。";
const canonicalPath = "/ja/glossary/wcag";

export const metadata: Metadata = buildPageMetadata({
  title,
  path: canonicalPath,
  description,
  ogType: "blog",
});

export default function WcagGlossaryPage() {
  return (
    <MarkdownDocLayout title={title} description={description}>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "用語集", item: canonicalUrl(canonicalPath) },
        ]}
      />
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <p>WCAGはWeb Content Accessibility Guidelinesの略称で、アクセシビリティ実装の国際的な指針です。</p>
      </article>
    </MarkdownDocLayout>
  );
}
