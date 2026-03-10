import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Eye, Shield } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";

const title = "監修・評価方針（Webアクセシビリティ診断）";
const description = "診断記事と公開情報の評価方針、更新ルール、品質確認プロセスをまとめています。";
const canonicalPath = "/ja/editorial-policy";

export const metadata: Metadata = {
  ...buildPageMetadata({ title, path: canonicalPath, description, ogType: "blog" }),
  keywords: ["webアクセシビリティ診断 監修", "アクセシビリティ 評価方針", "WCAG 評価手順"],
};

const items = [
  {
    icon: Eye,
    title: "評価観点",
    description: "自動診断結果だけでなく、実際の操作体験に影響する観点を併せて記載します。",
  },
  {
    icon: ClipboardList,
    title: "更新ルール",
    description: "基準変更や主要仕様変更が発生した場合は、該当ページの更新日と変更点を明示します。",
  },
  {
    icon: Shield,
    title: "公開ポリシー",
    description: "個別案件の機密情報は公開せず、再利用可能な実務知見として再構成して公開します。",
  },
];

export default function EditorialPolicyPage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl("/ja") },
          { name: "監修・評価方針", item: canonicalUrl(canonicalPath) },
        ]}
      />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} meta="最終更新日: 2026-03-10" />
        <section className="grid gap-4 md:grid-cols-3" aria-label="方針">
          {items.map((item) => (
            <Card key={item.title} className="bg-muted/35">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-lg">
                  <item.icon className="size-5" aria-hidden="true" />
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
        <p className="text-sm text-muted-foreground">
          関連: <Link href="/ja/legal/compliance-2026" className="hover:underline">法令対応ハブ（2026）</Link>
        </p>
      </div>
    </PageShell>
  );
}
