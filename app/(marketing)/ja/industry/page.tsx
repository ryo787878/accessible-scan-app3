import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { jaIndustryLinks } from "@/lib/content/ja-guides";
import { createBreadcrumbData } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";

const title = "業種別アクセシビリティ診断ガイド";
const description = "業種ごとの優先観点を整理したガイド一覧です。";
const canonicalPath = "/ja/industry";
const breadcrumb = createBreadcrumbData([
  { label: "ホーム", path: "/" },
  { label: "日本語ガイド", path: "/ja" },
  { label: "業種別", path: canonicalPath },
]);

export const metadata: Metadata = buildPageMetadata({ title, path: canonicalPath, description, ogType: "lp" });

export default function JaIndustryIndexPage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd items={breadcrumb.jsonLdItems} />
      <div className="flex flex-col gap-6">
        <PageIntro title={title} description={description} />
        <section className="grid gap-4 md:grid-cols-3">
          {jaIndustryLinks.map((entry) => (
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
