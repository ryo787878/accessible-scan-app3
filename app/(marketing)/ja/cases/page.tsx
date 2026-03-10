import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Landmark, ShoppingCart } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "Webアクセシビリティ診断の事例";
const description = "公開可能な範囲で再構成した、業種別の診断課題と改善方針の例をまとめています。";
const canonicalPath = "/ja/cases";

export const metadata: Metadata = {
  ...buildPageMetadata({ title, path: canonicalPath, description, ogType: "blog" }),
  keywords: ["webアクセシビリティ診断 事例", "アクセシビリティ 改善事例", "WCAG 診断事例"],
};

const caseLinks = [
  {
    href: "/ja/cases/ecommerce-platform",
    title: "ECサイトの改善整理例",
    description: "商品一覧・カート・購入導線で起きやすい課題を整理した例です。",
    icon: ShoppingCart,
    label: "EC",
  },
  {
    href: "/ja/cases/public-sector-portal",
    title: "公共系ポータルの改善整理例",
    description: "情報探索と申請導線を中心に、優先課題を整理した例です。",
    icon: Landmark,
    label: "公共",
  },
  {
    href: "/ja/cases/recruit-site",
    title: "採用サイトの改善整理例",
    description: "募集要項・応募フォームで発生しやすい課題を整理した例です。",
    icon: Building2,
    label: "採用",
  },
];

export default function CaseIndexPage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "事例", item: canonicalUrl(canonicalPath) },
        ]}
      />

      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} variant="index" meta="注記: 実在案件の秘匿情報を除いて再構成した公開テンプレートです。" />

        <section className="grid gap-4 md:grid-cols-3" aria-label="事例一覧">
          {caseLinks.map((item) => (
            <Card key={item.href} className="bg-muted/35">
              <CardHeader className="gap-3">
                <div className="bg-background text-primary flex size-10 items-center justify-center rounded-lg border">
                  <item.icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <Badge variant="outline">{item.label}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  <Link href={item.href} className="hover:underline">
                    {item.title}
                  </Link>
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={item.href} className="text-primary text-sm font-medium hover:underline">
                  詳細を見る
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
