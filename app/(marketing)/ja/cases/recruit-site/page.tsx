import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "採用サイトのWebアクセシビリティ診断例";
const description = "募集情報の閲覧と応募フォームに集中して、改善優先度を整理した診断例です。";
const canonicalPath = "/ja/cases/recruit-site";

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
      "募集要項の見出しが視覚デザイン優先で階層化されていない",
      "応募フォームの入力補助テキストが読み上げで把握しづらい",
      "モーダルやタブでフォーカス移動が不安定になる",
    ],
  },
  {
    title: "優先修正の方針",
    items: [
      "応募開始から送信完了までの手続きを先に安定化",
      "募集要項テンプレートの見出し・ランドマークを統一",
      "コンポーネント化された入力UIを共通修正して再発を防止",
    ],
  },
];

export default function RecruitCasePage() {
  return (
    <PageShell maxWidth="3xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "事例", item: canonicalUrl("/ja/cases") },
          { name: "採用", item: canonicalUrl(canonicalPath) },
        ]}
      />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} meta="公開テンプレート（実案件の固有情報は含みません）" />
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
        <p className="text-sm text-muted-foreground">
          関連: <Link href="/ja/industry/recruit" className="hover:underline">採用サイト向け業種別ガイド</Link>
        </p>
      </div>
    </PageShell>
  );
}
