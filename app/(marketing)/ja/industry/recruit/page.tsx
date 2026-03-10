import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "採用向けWebアクセシビリティ診断ガイド";
const description = "採用サイトで優先すべき診断観点を、応募導線に沿って整理した業種別ページです。";
const canonicalPath = "/ja/industry/recruit";

export const metadata: Metadata = buildPageMetadata({ title, path: canonicalPath, description, ogType: "lp" });

export default function RecruitIndustryPage() {
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
        <PageIntro title={title} description={description} variant="article" />
        <Card>
          <CardHeader><CardTitle>優先観点</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li className="rounded-lg border bg-muted/25 p-3">募集要項ページの見出し階層と読み上げ順序</li>
              <li className="rounded-lg border bg-muted/25 p-3">応募フォームの入力支援とエラー表示連携</li>
              <li className="rounded-lg border bg-muted/25 p-3">モーダル・タブ操作時のフォーカス管理</li>
            </ul>
          </CardContent>
        </Card>
        <CtaLink href="/ja/cases/recruit-site" priority="secondary" size="sm">
          採用事例を見る
        </CtaLink>
      </div>
    </PageShell>
  );
}
