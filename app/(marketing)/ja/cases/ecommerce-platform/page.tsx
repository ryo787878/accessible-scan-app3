import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "ECサイトのWebアクセシビリティ診断例";
const description = "商品検索から購入完了までの導線で、優先して改善しやすい課題を整理した例です。";
const canonicalPath = "/ja/cases/ecommerce-platform";

export const metadata: Metadata = buildPageMetadata({
  title,
  path: canonicalPath,
  description,
  ogType: "blog",
  article: true,
});

const sections = [
  {
    title: "よく見つかる課題",
    items: [
      "商品カード画像の代替テキストが機能説明になっていない",
      "絞り込みUIがキーボード操作しづらい",
      "エラーメッセージが視覚表示だけで読み上げ連携されない",
    ],
  },
  {
    title: "優先修正の方針",
    items: [
      "購入導線上のフォーム入力とエラー通知を先行修正",
      "商品一覧・詳細の見出し構造を整理して探索効率を改善",
      "コンポーネント単位で修正し、再発箇所を減らす",
    ],
  },
];

export default function EcommerceCasePage() {
  return (
    <PageShell maxWidth="3xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "事例", item: canonicalUrl("/ja/cases") },
          { name: "EC", item: canonicalUrl(canonicalPath) },
        ]}
      />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} meta="公開テンプレート（実案件の固有情報は含みません）" />
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed">
                {section.items.map((item) => (
                  <li key={item} className="rounded-lg border bg-muted/25 p-3">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        <p className="text-sm text-muted-foreground">
          関連: <Link href="/ja/service/accessibility-audit" className="hover:underline">診断サービス詳細</Link>
        </p>
      </div>
    </PageShell>
  );
}
