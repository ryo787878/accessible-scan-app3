import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, ogImageUrl } from "@/lib/seo/site";

const title = "Webアクセシビリティ チェック実践ガイド";
const description = "アクセシビリティ 診断を現場運用するための、チェック観点と改善フローを解説します。";
const canonicalPath = "/ja/blog/accessibility-check-guide";

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
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl("blog", title)],
  },
};

const publishedAt = "2026-02-24";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  inLanguage: "ja-JP",
  datePublished: publishedAt,
  dateModified: publishedAt,
  author: {
    "@type": "Organization",
    name: "Accessible Scan",
  },
  publisher: {
    "@type": "Organization",
    name: "Accessible Scan",
  },
  mainEntityOfPage: absoluteUrl(canonicalPath),
  image: [ogImageUrl("blog", title)],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "日本語ガイド", item: absoluteUrl("/ja") },
    { "@type": "ListItem", position: 3, name: "ブログ", item: absoluteUrl(canonicalPath) },
  ],
};

export default function AccessibilityCheckGuidePage() {
  return (
    <PageShell maxWidth="3xl">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="flex flex-col gap-6">
        <PageIntro
          title="Webアクセシビリティ チェック実践ガイド"
          description={description}
          meta="公開日: 2026-02-24"
        />
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            アクセシビリティ テストでは、まずテンプレート単位で代表ページを選定し、重大度の高い課題から修正します。
            自動診断の結果をそのまま並べるのではなく、影響ユーザー数と改修工数で優先順位を決めるのが実務向きです。
          </p>
          <p>
            次に、フォーム・モーダル・ナビゲーションの3領域を反復監査します。
            ここは再発しやすいため、リリース前に同じチェック項目を毎回通す運用設計が有効です。
          </p>
        </article>
      </div>
    </PageShell>
  );
}
