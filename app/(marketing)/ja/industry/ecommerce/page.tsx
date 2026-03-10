import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "EC向けWebアクセシビリティ診断ガイド";
const description = "ECサイトで優先しやすい診断観点と、継続運用のポイントを整理した業種別ページです。";
const canonicalPath = "/ja/industry/ecommerce";

export const metadata: Metadata = buildPageMetadata({ title, path: canonicalPath, description, ogType: "lp" });

export default function EcommerceIndustryPage() {
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
              <li className="rounded-lg border bg-muted/25 p-3">商品検索・絞り込みUIのキーボード操作性</li>
              <li className="rounded-lg border bg-muted/25 p-3">商品画像とボタンの代替情報の適切化</li>
              <li className="rounded-lg border bg-muted/25 p-3">購入フォームのエラー通知と入力支援</li>
            </ul>
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground">関連: <Link href="/ja/cases/ecommerce-platform" className="hover:underline">EC事例</Link></p>
      </div>
    </PageShell>
  );
}
