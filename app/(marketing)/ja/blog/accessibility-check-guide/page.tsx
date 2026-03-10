import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { MarkdownDocLayout } from "@/components/markdown-doc-layout";
import { ArticleJsonLd } from "@/components/seo/jsonld/article";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";
import { ogImageUrl } from "@/lib/seo/site";

const title = "Webアクセシビリティ チェック実践ガイド";
const description = "アクセシビリティ 診断を現場運用するための、チェック観点と改善フローを解説します。";
const canonicalPath = "/ja/blog/accessibility-check-guide";
const publishedAt = "2026-02-24";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title,
    path: canonicalPath,
    description,
    ogType: "blog",
    article: true,
  }),
  keywords: [
    "Webアクセシビリティ チェック",
    "アクセシビリティ診断",
    "ウェブ アクセシビリティ 診断",
    "WCAG チェック",
  ],
};

export default function AccessibilityCheckGuidePage() {
  return (
    <MarkdownDocLayout title={title} description={description} meta="公開日: 2026-02-24">
      <ArticleJsonLd
        headline={title}
        description={description}
        datePublished={publishedAt}
        dateModified={publishedAt}
        pageUrl={canonicalUrl(canonicalPath)}
        imageUrl={ogImageUrl("blog", title)}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "ブログ", item: canonicalUrl("/ja/blog") },
          { name: title, item: canonicalUrl(canonicalPath) },
        ]}
      />
      <section aria-label="記事アクション" className="mb-6 flex flex-wrap gap-3">
        <CtaLink href="/" priority="primary" showArrow>
          無料診断を開始する
        </CtaLink>
        <CtaLink href="/ja/accessibility-diagnosis" priority="secondary">
          診断フローを確認する
        </CtaLink>
      </section>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          アクセシビリティ テストでは、まずテンプレート単位で代表ページを選定し、重大度の高い課題から修正します。
          自動診断の結果をそのまま並べるのではなく、影響ユーザー数と改修工数で優先順位を決めるのが実務向きです。
        </p>
        <p>
          次に、フォーム・モーダル・ナビゲーションの3領域を反復監査します。
          ここは再発しやすいため、リリース前に同じチェック項目を毎回通す運用設計が有効です。
        </p>
        <p>
          診断の全体フローを先に把握したい場合は
          <Link href="/ja/accessibility-diagnosis" className="ml-1">
            ウェブ アクセシビリティ 診断ガイド
          </Link>
          もあわせて確認してください。
        </p>
      </article>
      <section aria-label="関連ページ" className="mt-8 flex flex-wrap gap-3 border-t pt-6">
        <CtaLink href="/ja/compare/accessibility-tools" priority="secondary" size="sm">
          ツール比較を見る
        </CtaLink>
        <CtaLink href="/ja/service/accessibility-audit" priority="secondary" size="sm">
          診断サービス詳細を見る
        </CtaLink>
      </section>
    </MarkdownDocLayout>
  );
}
