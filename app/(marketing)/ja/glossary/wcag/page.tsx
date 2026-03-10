import type { Metadata } from "next";
import Link from "next/link";
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
          { name: "用語集", item: canonicalUrl("/ja/glossary") },
          { name: title, item: canonicalUrl(canonicalPath) },
        ]}
      />
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          WCAGはWeb Content Accessibility Guidelinesの略称で、ウェブ アクセシビリティ 診断やWebアクセシビリティ
          チェックの基準になる国際ガイドラインです。
        </p>
        <h2>よく使う4原則</h2>
        <p>
          WCAGは「知覚可能」「操作可能」「理解可能」「堅牢」の4原則で構成されます。アクセシビリティ診断では、この4原則に沿って問題を整理すると改善方針が決めやすくなります。
        </p>
        <h2>まず確認したい達成基準</h2>
        <ul>
          <li>代替テキスト: 画像の意味が伝わる説明になっているか</li>
          <li>コントラスト: 文字が背景に埋もれていないか</li>
          <li>フォームラベル: 入力項目の目的が明確か</li>
          <li>キーボード操作: マウスなしでも主要操作が完結するか</li>
        </ul>
        <p>
          実務では、まず自動診断で全体傾向を把握し、次に手動確認で補完する流れが一般的です。
          <Link href="/ja/accessibility-diagnosis" className="ml-1">
            診断フローの全体像はこちら
          </Link>
          で確認できます。
        </p>
      </article>
    </MarkdownDocLayout>
  );
}
