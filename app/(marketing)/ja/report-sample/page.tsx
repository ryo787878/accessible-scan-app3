import type { Metadata } from "next";
import { FileText, Gauge, Wrench } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "Webアクセシビリティ診断レポート見本";
const description = "診断レポートの構成見本を公開し、事前に確認しやすい形で整理しています。";
const canonicalPath = "/ja/report-sample";

export const metadata: Metadata = {
  ...buildPageMetadata({ title, path: canonicalPath, description, ogType: "blog" }),
  keywords: ["アクセシビリティ診断 レポート", "webアクセシビリティ診断", "WCAG チェック レポート"],
};

const sections = [
  {
    icon: Gauge,
    title: "1. 診断サマリー",
    description: "対象範囲、主要課題、優先度を1ページで把握できる形式を採用します。",
  },
  {
    icon: FileText,
    title: "2. 課題詳細",
    description: "発生箇所、再現条件、関連する達成基準、実装観点を整理します。",
  },
  {
    icon: Wrench,
    title: "3. 修正方針",
    description: "コンポーネント単位の修正順序と、再診断時に確認すべき項目を提示します。",
  },
];

export default function ReportSamplePage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "レポート見本", item: canonicalUrl(canonicalPath) },
        ]}
      />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} variant="article" />
        <section className="grid gap-4 md:grid-cols-3" aria-label="レポート構成">
          {sections.map((section) => (
            <Card key={section.title} className="bg-muted/35">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-lg">
                  <section.icon className="size-5" aria-hidden="true" />
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
        <Card>
          <CardHeader>
            <CardTitle>公開範囲について</CardTitle>
            <CardDescription>
              本ページはレポート構成の見本です。実案件のURLや個別課題の詳細など、機密情報は公開しません。
            </CardDescription>
          </CardHeader>
        </Card>
        <CtaLink href="/ja/service/accessibility-audit" priority="secondary" size="sm">
          診断サービス詳細を見る
        </CtaLink>
      </div>
    </PageShell>
  );
}
