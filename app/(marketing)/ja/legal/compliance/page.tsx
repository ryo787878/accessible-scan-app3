import type { Metadata } from "next";
import { CalendarClock, Scale, ShieldAlert } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBreadcrumbData } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";

const title = "Webアクセシビリティ法令対応ハブ";
const description = "法令対応を進めるための確認項目と、実務で見落としやすい論点を整理したページです。";
const canonicalPath = "/ja/legal/compliance";
const breadcrumb = createBreadcrumbData([
  { label: "ホーム", path: "/" },
  { label: "日本語ガイド", path: "/ja" },
  { label: "法令対応", path: "/ja/legal" },
  { label: "法令対応ハブ", path: canonicalPath },
]);

export const metadata: Metadata = {
  ...buildPageMetadata({ title, path: canonicalPath, description, ogType: "blog" }),
  keywords: ["webアクセシビリティ 法令対応", "JIS X 8341-3", "WCAG 2.2"],
};

const checklist = [
  "対象ページと業務フローを洗い出し、優先対象を定義する",
  "適用する基準（WCAG/JIS）と評価レベルを明文化する",
  "再診断と改修完了判定の運用ルールを決める",
];

export default function ComplianceHubPage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd items={breadcrumb.jsonLdItems} />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} variant="article" meta="注意: 本ページは一般的な実務整理であり、法的助言そのものではありません。" />

        <section className="grid gap-4 md:grid-cols-3" aria-label="確認ポイント">
          <Card className="bg-muted/35">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg"><Scale className="size-5" />適用基準</CardTitle>
              <CardDescription>プロジェクト単位で適用範囲を明確にし、評価軸を揃えることが重要です。</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-muted/35">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg"><CalendarClock className="size-5" />運用計画</CardTitle>
              <CardDescription>一度の診断で終わらせず、更新に合わせた再診断フローを決めます。</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-muted/35">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg"><ShieldAlert className="size-5" />監査対応</CardTitle>
              <CardDescription>診断結果、改修判断、再確認履歴を残し、説明可能な状態にします。</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>実務チェックリスト</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-relaxed">
              {checklist.map((item) => (
                <li key={item} className="rounded-lg border bg-muted/25 p-3">{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <CtaLink href="/ja/editorial-policy" priority="secondary" size="sm">
          監修・評価方針を見る
        </CtaLink>
      </div>
    </PageShell>
  );
}
