import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { jaCompareLinks } from "@/lib/content/ja-guides";
import { createBreadcrumbData } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";

const title = "アクセシビリティ診断ツール比較";
const description = "導入前に確認したい比較コンテンツの一覧ページです。";
const canonicalPath = "/ja/compare";
const breadcrumb = createBreadcrumbData([
  { label: "ホーム", path: "/" },
  { label: "日本語ガイド", path: "/ja" },
  { label: "比較", path: canonicalPath },
]);

export const metadata: Metadata = buildPageMetadata({ title, path: canonicalPath, description, ogType: "comparison" });

export default function JaCompareIndexPage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd items={breadcrumb.jsonLdItems} />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} variant="index" />
        <section className="grid gap-4">
          {jaCompareLinks.map((entry) => (
            <Card key={entry.href}>
              <CardHeader>
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <CardDescription>{entry.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CtaLink href={entry.href} priority="tertiary" size="sm" showArrow className="px-0">
                  比較を見る
                </CtaLink>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
