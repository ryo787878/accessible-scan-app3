import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { FaqJsonLd } from "@/components/seo/jsonld/faq";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "アクセシビリティ チェックツール比較";
const description = "Webアクセシビリティ チェックとWCAG チェックの観点で、導入前に確認すべき比較ポイントを整理します。";
const canonicalPath = "/ja/compare/accessibility-tools";

export const metadata: Metadata = buildPageMetadata({
  title,
  path: canonicalPath,
  description,
  ogType: "comparison",
});

const faqItems = [
  {
    q: "比較で最初に見るべき指標は何ですか？",
    a: "WCAG違反の重大度表示と、改善優先度の算出方法を最初に確認してください。",
  },
  {
    q: "診断対象ページ数の上限は重要ですか？",
    a: "重要です。実サイト規模に対して上限が低すぎると、実態を反映しない結果になりやすくなります。",
  },
  {
    q: "無料ツールでも実運用できますか？",
    a: "小規模サイトの一次診断には十分です。継続運用ではレポート品質と再現性を確認してください。",
  },
];

export default function CompareAccessibilityToolsPage() {
  return (
    <PageShell maxWidth="4xl">
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "比較", item: canonicalUrl(canonicalPath) },
        ]}
      />
      <div className="flex flex-col gap-6">
        <PageIntro title="アクセシビリティ チェックツール比較" description="導入時の比較軸をまとめたページです。" />
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-muted/40 border-0">
            <CardHeader>
              <CardTitle>基準対応</CardTitle>
              <CardDescription>WCAG 2.1 AAの判定ロジックと更新頻度</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-muted/40 border-0">
            <CardHeader>
              <CardTitle>レポート品質</CardTitle>
              <CardDescription>重要度・影響範囲・修正優先度が明示されるか</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-muted/40 border-0">
            <CardHeader>
              <CardTitle>運用性</CardTitle>
              <CardDescription>継続スキャンと再診断のしやすさ</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <section className="space-y-3" aria-label="比較FAQ">
          <h2 className="text-xl font-semibold">FAQ</h2>
          {faqItems.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
                <CardDescription className="text-foreground/80">{item.a}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
