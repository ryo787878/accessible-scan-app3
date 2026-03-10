import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, FileBarChart2, Gauge } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { FaqJsonLd } from "@/components/seo/jsonld/faq";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "ウェブ アクセシビリティ 診断ガイド";
const description =
  "Webアクセシビリティ チェックとアクセシビリティ診断を実務で進めるために、対象ページの選び方・診断手順・改善優先度の付け方をまとめました。";
const canonicalPath = "/ja/accessibility-diagnosis";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title,
    path: canonicalPath,
    description,
    ogType: "lp",
  }),
  keywords: [
    "ウェブ アクセシビリティ 診断",
    "Webアクセシビリティ チェック",
    "アクセシビリティ診断",
    "アクセシビリティ チェック",
    "WCAG チェック",
  ],
};

const faqItems = [
  {
    q: "アクセシビリティ チェックとアクセシビリティ診断の違いは何ですか？",
    a: "チェックは個別項目の確認、診断はサイト全体の状態把握と改善優先度の設計まで含む運用として捉えると実務で使いやすくなります。",
  },
  {
    q: "ウェブ アクセシビリティ 診断はどのページから始めるべきですか？",
    a: "トップ、主要導線、フォームを含む代表テンプレートを優先すると、少ない工数で改善効果を出しやすくなります。",
  },
  {
    q: "WCAG チェックの結果はどう活用すれば良いですか？",
    a: "重大度と再発頻度でタスクを並べ替え、共通コンポーネントから修正することで再診断時の改善率を高められます。",
  },
];

const steps = [
  {
    icon: ClipboardCheck,
    title: "1. 対象ページを決める",
    description:
      "流入が多いページ、CVに近いページ、共通テンプレートの3軸で対象を選びます。これだけで診断効率が上がります。",
  },
  {
    icon: FileBarChart2,
    title: "2. Webアクセシビリティ チェックを実行",
    description:
      "自動診断で代替テキスト、コントラスト、フォームラベル、見出し構造を確認し、問題を重大度別に整理します。",
  },
  {
    icon: Gauge,
    title: "3. 改善優先度を決める",
    description:
      "影響ユーザー数と改修工数のバランスで優先順位を付け、共通UIから順に修正すると全体改善が早く進みます。",
  },
];

export default function AccessibilityDiagnosisPage() {
  return (
    <PageShell maxWidth="4xl">
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "ウェブ アクセシビリティ 診断", item: canonicalUrl(canonicalPath) },
        ]}
      />

      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border bg-linear-to-br from-emerald-50 to-sky-100 p-6 md:p-8 dark:from-emerald-950/20 dark:to-sky-950/20">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">ウェブ アクセシビリティ 診断ガイド</h1>
          <p className="text-muted-foreground mt-3 max-w-3xl leading-relaxed">
            このページは、アクセシビリティ チェックを運用に定着させたいチーム向けに、診断の進め方を実務ベースで整理しています。
            まずは自動診断で全体像を可視化し、次に再発しやすいパターンから改修する流れが効果的です。
          </p>
        </section>

        <section aria-label="診断ステップ" className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="bg-muted/35">
              <CardHeader className="gap-3">
                <div className="bg-background text-primary flex size-10 items-center justify-center rounded-lg border">
                  <step.icon className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl leading-tight">{step.title}</CardTitle>
                <CardDescription className="leading-relaxed">{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section aria-label="改善の観点">
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-xl">
                <CheckCircle2 className="size-5" aria-hidden="true" />
                改善タスクで先に見るべきポイント
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm leading-relaxed md:grid-cols-2">
                <li className="rounded-lg border bg-muted/25 p-4">画像の代替テキストとフォームラベルを優先修正し、主要操作を支える情報欠落を防ぎます。</li>
                <li className="rounded-lg border bg-muted/25 p-4">コントラスト不足やフォーカス不可視を解消し、キーボード利用時の操作性を確保します。</li>
                <li className="rounded-lg border bg-muted/25 p-4">見出しの階層とランドマークを整備し、支援技術でのページ移動効率を改善します。</li>
                <li className="rounded-lg border bg-muted/25 p-4">再診断を前提に、共通コンポーネントへ修正を集約して再発率を下げます。</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section aria-label="関連ページ" className="space-y-3">
          <h2 className="text-xl font-semibold">次に読むページ</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  <Link href="/ja/blog/accessibility-check-guide" className="hover:underline">
                    Webアクセシビリティ チェック実践ガイド
                  </Link>
                </CardTitle>
                <CardDescription>診断結果を運用に落とし込む手順を確認できます。</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  <Link href="/ja/compare/accessibility-tools" className="hover:underline">
                    アクセシビリティ チェックツール比較
                  </Link>
                </CardTitle>
                <CardDescription>導入前に見落としやすい比較ポイントを整理できます。</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  <Link href="/ja/glossary/wcag" className="hover:underline">
                    WCAGとは？
                  </Link>
                </CardTitle>
                <CardDescription>基礎用語を短時間で確認できます。</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section aria-label="FAQ" className="space-y-3">
          <h2 className="text-xl font-semibold">よくある質問</h2>
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
