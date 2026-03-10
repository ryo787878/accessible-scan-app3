import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileText, ListChecks, ShieldCheck } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "Webアクセシビリティ診断サービス";
const description = "Webアクセシビリティ診断の進め方、診断対象、成果物、進行フローをまとめたサービス詳細ページです。";
const canonicalPath = "/ja/service/accessibility-audit";

export const metadata: Metadata = {
  ...buildPageMetadata({ title, path: canonicalPath, description, ogType: "lp" }),
  keywords: [
    "webアクセシビリティ診断",
    "アクセシビリティ診断 サービス",
    "WCAG 診断",
    "Webアクセシビリティ チェック",
  ],
};

const scopeItems = [
  "主要導線ページと共通テンプレートを優先して診断",
  "WCAG 2.1/2.2の観点で自動診断と手動確認を併用",
  "問題一覧だけでなく改善優先度と実装修正方針を提示",
];

const deliverables = [
  "診断サマリー（対象範囲・主要課題・優先度）",
  "課題一覧（発生箇所・再現条件・修正方針）",
  "再診断時の確認リスト（回帰防止項目）",
];

export default function AccessibilityAuditServicePage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "サービス", item: canonicalUrl("/ja/service") },
          { name: title, item: canonicalUrl(canonicalPath) },
        ]}
      />

      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} meta="公開情報: 2026-03-10時点" />

        <section className="grid gap-4 md:grid-cols-3" aria-label="サービスの要点">
          <Card className="bg-muted/35">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg">
                <ShieldCheck className="size-5" aria-hidden="true" />
                診断基準
              </CardTitle>
              <CardDescription>WCAGの達成基準を軸に、実際の利用体験に影響する項目を優先評価します。</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-muted/35">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg">
                <ListChecks className="size-5" aria-hidden="true" />
                診断範囲
              </CardTitle>
              <CardDescription>代表ページ、フォーム、ナビゲーションなど再発しやすい要素を重点確認します。</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-muted/35">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg">
                <FileText className="size-5" aria-hidden="true" />
                成果物
              </CardTitle>
              <CardDescription>開発チームがそのまま改修計画に使える形式で、診断結果を日本語で整理します。</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section aria-label="診断対象">
          <Card>
            <CardHeader>
              <CardTitle>診断対象の考え方</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 md:grid-cols-2 text-sm leading-relaxed">
                {scopeItems.map((item) => (
                  <li key={item} className="rounded-lg border bg-muted/25 p-4">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section aria-label="成果物">
          <Card>
            <CardHeader>
              <CardTitle>成果物に含める内容</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-relaxed">
                {deliverables.map((item) => (
                  <li key={item} className="inline-flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section aria-label="関連ページ" className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <Link href="/ja/report-sample" className="hover:underline">診断レポート見本</Link>
              </CardTitle>
              <CardDescription>成果物の構成を事前に確認できます。</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <Link href="/ja/cases" className="hover:underline">導入事例</Link>
              </CardTitle>
              <CardDescription>業種ごとの課題整理例を確認できます。</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <Link href="/ja/editorial-policy" className="hover:underline">監修・評価方針</Link>
              </CardTitle>
              <CardDescription>評価プロセスと公開ポリシーを確認できます。</CardDescription>
            </CardHeader>
          </Card>
        </section>
      </div>
    </PageShell>
  );
}
