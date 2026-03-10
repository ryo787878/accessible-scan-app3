import type { Metadata } from "next";
import Link from "next/link";
import { Shield, BarChart3, ListOrdered } from "lucide-react";
import { ScanForm } from "@/components/scan-form";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { FaqJsonLd } from "@/components/seo/jsonld/faq";
import { SoftwareApplicationJsonLd } from "@/components/seo/jsonld/software-application";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";
import { SITE_DESCRIPTION } from "@/lib/seo/site";

const pageTitle = "アクセシビリティ診断ツール | WCAGチェック対応";
const canonicalPath = "/";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: pageTitle,
    path: canonicalPath,
    description: SITE_DESCRIPTION,
    ogType: "lp",
    ogTitle: "アクセシビリティ診断",
  }),
  keywords: [
    "アクセシビリティ チェック",
    "アクセシビリティ 診断",
    "Webアクセシビリティ チェック",
    "ウェブ アクセシビリティ 診断",
    "アクセシビリティ テスト",
    "WCAG チェック",
  ],
};

const features = [
  {
    icon: Shield,
    title: "アクセシビリティ診断",
    description:
      "WCAG 2.1基準に基づき、コントラスト比、代替テキスト、フォームラベルなどの問題を自動検出します。",
  },
  {
    icon: BarChart3,
    title: "定量的な可視化",
    description: "違反件数を重大度別に集計し、サイト全体の状態を数値とグラフで把握できます。",
  },
  {
    icon: ListOrdered,
    title: "改善優先度の提示",
    description: "影響範囲の広いルールをTOP5でハイライトし、どこから直すべきかを明確にします。",
  },
];

const faqItems = [
  {
    q: "アクセシビリティ チェックは無料で使えますか？",
    a: "MVP版では無料で利用できます。URLを入力するとアクセシビリティ診断を開始できます。",
  },
  {
    q: "WCAG チェックはどの基準に対応していますか？",
    a: "自動診断は主にWCAG 2.1 AAを対象にしています。最終的な適合判断には手動監査も推奨です。",
  },
  {
    q: "Webアクセシビリティ テストの結果はどう活用できますか？",
    a: "重大度別の件数と優先度付きの改善候補を確認し、改修工数の高い課題から計画できます。",
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 py-10 md:py-10">
      <SoftwareApplicationJsonLd />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd items={[{ name: "ホーム", item: canonicalUrl(canonicalPath) }]} />
      <div className="flex w-full max-w-3xl flex-col gap-12">
        <section className="flex flex-col items-center gap-4 text-center">
          <div className="bg-primary flex size-20 items-center justify-center rounded-3xl">
            <Shield className="text-primary-foreground size-11" aria-hidden="true" />
          </div>
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Shield className="size-4" aria-hidden="true" />
            WCAG 2.1 準拠チェック
          </div>
          <div className="h-2" aria-hidden="true" />
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            アクセシビリティ診断
            <br />
            <span className="text-primary">Webアクセシビリティチェック</span>
          </h1>
          <div className="h-2" aria-hidden="true" />
          <p className="text-muted-foreground max-w-xl text-pretty text-base leading-relaxed md:text-lg">
            URLを入力するだけで、Webアクセシビリティ チェックと WCAG チェックを自動実行。
            検出された問題を日本語レポートで確認し、アクセシビリティ テストの改善優先順位を判断できます。
          </p>
        </section>

        <section aria-label="診断の特徴">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-muted/40 border-0">
                <CardHeader className="gap-3">
                  <div className="bg-background flex size-10 items-center justify-center rounded-lg border">
                    <feature.icon className="text-primary size-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section aria-label="診断開始フォーム">
          <ScanForm />
        </section>

        <section aria-label="よくある質問" className="space-y-3">
          <h2 className="text-xl font-semibold">よくある質問</h2>
          {faqItems.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-foreground/80">{item.a}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section aria-label="日本語ガイド" className="space-y-3">
          <h2 className="text-xl font-semibold">日本語ガイド</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  <Link href="/ja/accessibility-diagnosis" className="hover:underline">
                    ウェブ アクセシビリティ 診断ガイド
                  </Link>
                </CardTitle>
                <CardDescription>診断対象の決め方と改善優先度の付け方をまとめています。</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  <Link href="/ja/blog/accessibility-check-guide" className="hover:underline">
                    Webアクセシビリティ チェック実践ガイド
                  </Link>
                </CardTitle>
                <CardDescription>実務で再診断を回すための運用手順を確認できます。</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  <Link href="/ja/compare/accessibility-tools" className="hover:underline">
                    アクセシビリティ チェックツール比較
                  </Link>
                </CardTitle>
                <CardDescription>導入時に比較すべき軸を短時間で確認できます。</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <footer className="text-center">
          <p className="text-muted-foreground text-xs leading-relaxed">
            本ツールは Playwright + axe-core を使用して診断を実行します。
            <br />
            診断結果はWCAG 2.1 AA基準に基づく参考情報であり、完全な適合を保証するものではありません。
          </p>
        </footer>
      </div>
    </main>
  );
}
