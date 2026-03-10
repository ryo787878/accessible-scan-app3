import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { jaServiceLinks } from "@/lib/content/ja-guides";
import { createBreadcrumbData } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";

const title = "アクセシビリティ診断サービス一覧";
const description = "サービス紹介と関連資料の一覧ページです。";
const canonicalPath = "/ja/service";
const breadcrumb = createBreadcrumbData([
  { label: "ホーム", path: "/" },
  { label: "日本語ガイド", path: "/ja" },
  { label: "サービス", path: canonicalPath },
]);

export const metadata: Metadata = buildPageMetadata({ title, path: canonicalPath, description, ogType: "lp" });

export default function JaServiceIndexPage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd items={breadcrumb.jsonLdItems} />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} variant="index" />
        <section className="grid gap-4 md:grid-cols-2">
          {jaServiceLinks.map((entry) => (
            <Card key={entry.href}>
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link href={entry.href} className="hover:underline">
                    {entry.title}
                  </Link>
                </CardTitle>
                <CardDescription>{entry.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
