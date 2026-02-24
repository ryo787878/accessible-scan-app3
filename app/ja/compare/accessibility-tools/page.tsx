import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { absoluteUrl, ogImageUrl } from "@/lib/seo/site";

const title = "アクセシビリティ チェックツール比較";
const description = "Webアクセシビリティ チェックとWCAG チェックの観点で、導入前に確認すべき比較ポイントを整理します。";
const canonicalPath = "/ja/compare/accessibility-tools";

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
        url: ogImageUrl("comparison", title),
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
    images: [ogImageUrl("comparison", title)],
  },
};

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "日本語ガイド", item: absoluteUrl("/ja") },
    { "@type": "ListItem", position: 3, name: "比較", item: absoluteUrl(canonicalPath) },
  ],
};

export default function CompareAccessibilityToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <h1 className="text-3xl font-bold">アクセシビリティ チェックツール比較</h1>
      <p className="text-muted-foreground">導入時の比較軸をまとめたページです。</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>基準対応</CardTitle>
            <CardDescription>WCAG 2.1 AAの判定ロジックと更新頻度</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>レポート品質</CardTitle>
            <CardDescription>重要度・影響範囲・修正優先度が明示されるか</CardDescription>
          </CardHeader>
        </Card>
        <Card>
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
    </main>
  );
}
