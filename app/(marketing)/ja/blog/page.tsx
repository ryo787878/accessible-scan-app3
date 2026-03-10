import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { jaBlogLinks } from "@/lib/content/ja-guides";
import { createBreadcrumbData } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";

const title = "アクセシビリティ診断ブログ";
const description = "アクセシビリティ診断とWebアクセシビリティチェックの実務運用を解説する記事一覧です。";
const canonicalPath = "/ja/blog";
const breadcrumb = createBreadcrumbData([
  { label: "ホーム", path: "/" },
  { label: "日本語ガイド", path: "/ja" },
  { label: "ブログ", path: canonicalPath },
]);

export const metadata: Metadata = buildPageMetadata({ title, path: canonicalPath, description, ogType: "blog" });

export default function JaBlogIndexPage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd items={breadcrumb.jsonLdItems} />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} />
        <section className="grid gap-4">
          {jaBlogLinks.map((entry) => (
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
