import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CircleHelp, Compass, GitCompare } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const guideLinks = [
  {
    title: "まず読む",
    description: "Webアクセシビリティ チェック実践ガイドで、改善の進め方を把握します。",
    href: "/ja/blog/accessibility-check-guide",
    icon: BookOpen,
    label: "解説記事",
  },
  {
    title: "次に比較する",
    description: "主要な比較軸を確認し、自社運用に合うツール要件を整理します。",
    href: "/ja/compare/accessibility-tools",
    icon: GitCompare,
    label: "比較ページ",
  },
  {
    title: "用語を確認する",
    description: "WCAGの基本概念や達成基準を短時間で確認できます。",
    href: "/ja/glossary/wcag",
    icon: CircleHelp,
    label: "用語集",
  },
];

export default function JaHomePage() {
  return (
    <PageShell maxWidth="4xl">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="flex flex-col gap-8">
        <section className="rounded-2xl border bg-linear-to-br from-sky-50 to-cyan-100 p-6 md:p-8 dark:from-sky-950/30 dark:to-cyan-950/30">
          <div className="flex flex-col gap-4">
            <Badge variant="outline" className="w-fit bg-background/70">
              日本語ガイド
            </Badge>
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">アクセシビリティ対策ガイド</h1>
            <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              何から始めるか迷わないように、実践ガイド・比較・用語集を1ページに整理しました。まずは実践ガイドを読み、次に比較ページで要件を固める流れがおすすめです。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/ja/blog/accessibility-check-guide" scroll>
                  実践ガイドから始める
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/ja/compare/accessibility-tools" scroll>
                  比較ページを見る
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section aria-label="ガイド一覧" className="grid gap-4 md:grid-cols-3">
          {guideLinks.map((item) => (
            <Card key={item.href} className="bg-muted/35">
              <CardHeader className="gap-3">
                <div className="bg-background text-primary flex size-10 items-center justify-center rounded-lg border">
                  <item.icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">{item.label}</Badge>
                  <CardTitle className="text-xl leading-tight">{item.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{item.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="px-0">
                  <Link href={item.href} scroll>
                    読む
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section aria-label="利用の流れ">
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-xl">
                <Compass className="size-5" />
                迷ったときの進め方
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-3 md:grid-cols-3">
                <li className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
                  <p className="font-semibold">1. 実践ガイドを読む</p>
                  <p className="text-muted-foreground mt-1">改善優先度の決め方を把握する</p>
                </li>
                <li className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
                  <p className="font-semibold">2. ツールを比較する</p>
                  <p className="text-muted-foreground mt-1">運用に必要な機能要件を整理する</p>
                </li>
                <li className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
                  <p className="font-semibold">3. 用語を確認する</p>
                  <p className="text-muted-foreground mt-1">WCAGの基礎を短時間で補完する</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  );
}
