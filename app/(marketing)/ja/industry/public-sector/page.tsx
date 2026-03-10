import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "公共向けWebアクセシビリティ診断ガイド";
const description = "公共情報提供サイトで見落としやすい観点を、実務優先度に沿って整理した業種別ページです。";
const canonicalPath = "/ja/industry/public-sector";

export const metadata: Metadata = buildPageMetadata({ title, path: canonicalPath, description, ogType: "lp" });

export default function PublicIndustryPage() {
  return (
    <PageShell maxWidth="3xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "業種別", item: canonicalUrl("/ja/industry") },
          { name: title, item: canonicalUrl(canonicalPath) },
        ]}
      />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} />
        <Card>
          <CardHeader><CardTitle>優先観点</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li className="rounded-lg border bg-muted/25 p-3">情報探索のための見出し・ランドマーク構造</li>
              <li className="rounded-lg border bg-muted/25 p-3">申請フォームのラベル・必須表示・エラー通知</li>
              <li className="rounded-lg border bg-muted/25 p-3">PDFや外部文書リンクの説明整備</li>
            </ul>
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground">関連: <Link href="/ja/cases/public-sector-portal" className="hover:underline">公共事例</Link></p>
      </div>
    </PageShell>
  );
}
