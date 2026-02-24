import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_DESCRIPTION, absoluteUrl, ogImageUrl } from "@/lib/seo/site";

const title = "アクセシビリティ対策ガイド";
const canonicalPath = "/ja";

export const metadata: Metadata = {
  title,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    title,
    description: SITE_DESCRIPTION,
    url: canonicalPath,
    images: [
      {
        url: ogImageUrl("lp", title),
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE_DESCRIPTION,
    images: [ogImageUrl("lp", title)],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "ホーム",
      item: absoluteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "日本語ガイド",
      item: absoluteUrl(canonicalPath),
    },
  ],
};

export default function JaHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <JsonLd data={breadcrumbJsonLd} />
      <h1 className="text-3xl font-bold">アクセシビリティ対策ガイド</h1>
      <p className="text-muted-foreground">比較記事と解説記事を集約したSEO向けの日本語ページです。</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>比較ページ</CardTitle>
            <CardDescription>
              <Link href="/ja/compare/accessibility-tools" className="underline">
                アクセシビリティ チェックツール比較
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ブログ記事</CardTitle>
            <CardDescription>
              <Link href="/ja/blog/accessibility-check-guide" className="underline">
                Webアクセシビリティ チェック実践ガイド
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
