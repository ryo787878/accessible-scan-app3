import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "公共系ポータルのWebアクセシビリティ診断例";
const description = "情報提供ページと申請導線を中心に、優先課題を整理した診断例です。";
const canonicalPath = "/ja/cases/public-sector-portal";

export const metadata: Metadata = buildPageMetadata({
  title,
  path: canonicalPath,
  description,
  ogType: "blog",
  article: true,
});

const sections = [
  {
    title: "よく見つかる課題",
    items: [
      "PDFや添付資料へのリンクテキストが文脈不足",
      "ナビゲーションの階層が深く、見出し構造も不統一",
      "申請フォームの必須項目表示が視覚依存になっている",
    ],
  },
  {
    title: "優先修正の方針",
    items: [
      "利用頻度が高い申請ページからエラー通知とラベルを修正",
      "ページテンプレート側で見出しレベルを統一",
      "文書リンクに形式・容量・内容を明示して判断しやすくする",
    ],
  },
];

export default function PublicSectorCasePage() {
  return (
    <PageShell maxWidth="3xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "事例", item: canonicalUrl("/ja/cases") },
          { name: "公共", item: canonicalUrl(canonicalPath) },
        ]}
      />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} variant="article" meta="公開テンプレート（実案件の固有情報は含みません）" />
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed">
                {section.items.map((item) => (
                  <li key={item} className="rounded-lg border bg-muted/25 p-3">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        <CtaLink href="/ja/legal/compliance" priority="secondary" size="sm">
          法令対応ハブを見る
        </CtaLink>
      </div>
    </PageShell>
  );
}
