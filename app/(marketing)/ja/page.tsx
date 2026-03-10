import type { Metadata } from "next";
import {
  BookOpen,
  BriefcaseBusiness,
  CircleHelp,
  ClipboardCheck,
  FileText,
  GitCompare,
  Landmark,
  Rocket,
  ShieldCheck,
  Store,
  Wrench,
} from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbJsonLd } from "@/components/seo/jsonld/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo/metadata";
import { SITE_DESCRIPTION } from "@/lib/seo/site";

const title = "アクセシビリティ対策ガイド | ウェブ アクセシビリティ 診断の始め方";
const canonicalPath = "/ja";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title,
    path: canonicalPath,
    description: SITE_DESCRIPTION,
    ogType: "lp",
  }),
  keywords: [
    "ウェブ アクセシビリティ 診断",
    "Webアクセシビリティ チェック",
    "アクセシビリティ診断",
    "アクセシビリティ チェック",
    "WCAG チェック",
  ],
};

const personaLinks = [
  {
    title: "まず診断を始めたい",
    description: "対象選定から改善優先度まで、最初に必要な流れを短時間で把握します。",
    href: "/ja/accessibility-diagnosis",
    cta: "診断ガイドへ",
    icon: Rocket,
    tone: "bg-primary text-primary-foreground",
    badge: "初回向け",
  },
  {
    title: "導入可否を比較したい",
    description: "評価軸を整理して、運用に合うツールとサービス要件を明確化します。",
    href: "/ja/compare/accessibility-tools",
    cta: "比較ページへ",
    icon: GitCompare,
    tone: "bg-muted/40",
    badge: "導入検討",
  },
  {
    title: "実装と運用を改善したい",
    description: "修正フロー、再診断、法令対応まで実務の運用ルールを固めます。",
    href: "/ja/service/accessibility-audit",
    cta: "サービス詳細へ",
    icon: Wrench,
    tone: "bg-muted/40",
    badge: "実装担当",
  },
] as const;

const guideLinks = [
  {
    title: "Webアクセシビリティ チェック実践ガイド",
    description: "改善の進め方と再診断運用を解説した記事です。",
    href: "/ja/blog/accessibility-check-guide",
    icon: BookOpen,
    label: "解説記事",
  },
  {
    title: "WCAGとは？",
    description: "基礎用語と達成基準を短時間で確認できます。",
    href: "/ja/glossary/wcag",
    icon: CircleHelp,
    label: "用語集",
  },
  {
    title: "監修・評価方針",
    description: "品質確認プロセスと更新方針を確認できます。",
    href: "/ja/editorial-policy",
    icon: ClipboardCheck,
    label: "品質管理",
  },
  {
    title: "法令対応ハブ",
    description: "法令対応で見落としやすい実務論点を整理しています。",
    href: "/ja/legal/compliance",
    icon: Landmark,
    label: "法令対応",
  },
];

const industryLinks = [
  {
    title: "EC向けガイド",
    description: "購入導線とフォームを優先した診断観点をまとめています。",
    href: "/ja/industry/ecommerce",
    icon: Store,
  },
  {
    title: "公共向けガイド",
    description: "情報探索と申請導線の改善観点を整理しています。",
    href: "/ja/industry/public-sector",
    icon: Landmark,
  },
  {
    title: "採用向けガイド",
    description: "募集要項と応募フォームの改善観点を整理しています。",
    href: "/ja/industry/recruit",
    icon: BriefcaseBusiness,
  },
];

export default function JaHomePage() {
  return (
    <PageShell maxWidth="4xl">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", item: canonicalUrl("/") },
          { name: "日本語ガイド", item: canonicalUrl(canonicalPath) },
        ]}
      />
      <div className="flex flex-col gap-8">
        <section className="rounded-2xl border bg-linear-to-br from-sky-50 to-cyan-100 p-6 md:p-8 dark:from-sky-950/30 dark:to-cyan-950/30">
          <div className="flex flex-col gap-4">
            <Badge variant="outline" className="w-fit bg-background/70">
              日本語ガイド
            </Badge>
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">アクセシビリティ対策ガイド</h1>
            <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              目的別に迷わず進めるために、診断開始、比較検討、運用改善の導線を分けて整理しました。
              まずは下の3つから、今の目的に最も近い入口を選んでください。
            </p>
            <div className="flex flex-wrap gap-3">
              <CtaLink href="/ja/accessibility-diagnosis" priority="primary" size="lg" showArrow>
                3分で診断を始める
              </CtaLink>
              <CtaLink href="/ja/compare/accessibility-tools" priority="secondary" size="lg">
                導入比較を確認する
              </CtaLink>
            </div>
          </div>
        </section>

        <section aria-label="目的別の入口" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">目的別に進む</h2>
            <p className="text-muted-foreground text-sm">今の状況に近いカードを選ぶと、必要なページへ最短で移動できます。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {personaLinks.map((item, index) => (
              <Card key={item.href} className={index === 0 ? "border-primary border-2" : ""}>
                <CardHeader className="gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-lg border ${item.tone}`}>
                    <item.icon className="size-5" aria-hidden="true" />
                  </div>
                  <Badge variant="outline" className="w-fit">{item.badge}</Badge>
                  <CardTitle className="text-xl leading-tight">{item.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CtaLink
                    href={item.href}
                    priority={index === 0 ? "primary" : "secondary"}
                    fullWidth
                    showArrow
                  >
                    {item.cta}
                  </CtaLink>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-label="最短ステップ">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">最短3ステップ</CardTitle>
              <CardDescription>初回導入時に迷いづらい推奨順です。</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-3 md:grid-cols-3">
                <li className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
                  <p className="font-semibold">1. 診断を開始する</p>
                  <p className="text-muted-foreground mt-1">対象ページ選定と優先順位付けを確認する</p>
                </li>
                <li className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
                  <p className="font-semibold">2. 比較軸を固める</p>
                  <p className="text-muted-foreground mt-1">レポート品質と運用性で導入可否を判断する</p>
                </li>
                <li className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
                  <p className="font-semibold">3. 運用ルールを決める</p>
                  <p className="text-muted-foreground mt-1">再診断と品質管理の更新フローを定義する</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section aria-label="ガイド一覧" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">関連ガイド</h2>
            <p className="text-muted-foreground text-sm">必要な情報だけを短時間で拾えるように分類しています。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guideLinks.map((item) => (
              <Card key={item.href} className="bg-muted/35">
                <CardHeader className="gap-3">
                  <div className="bg-background text-primary flex size-10 items-center justify-center rounded-lg border">
                    <item.icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline">{item.label}</Badge>
                    <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{item.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <CtaLink href={item.href} priority="tertiary" showArrow className="px-0">
                    ページへ移動
                  </CtaLink>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-label="導入検討" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">導入検討向け</h2>
            <p className="text-muted-foreground text-sm">サービス比較や成果物の確認に使えるページです。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted/30">
              <CardHeader className="gap-3">
                <div className="bg-background text-primary flex size-10 items-center justify-center rounded-lg border">
                  <ShieldCheck className="size-5" />
                </div>
                <CardTitle className="text-lg leading-tight">診断サービス詳細</CardTitle>
                <CardDescription>診断範囲、成果物、進め方を1ページで確認できます。</CardDescription>
              </CardHeader>
              <CardContent>
                <CtaLink href="/ja/service/accessibility-audit" priority="tertiary" showArrow className="px-0">
                  詳細を見る
                </CtaLink>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardHeader className="gap-3">
                <div className="bg-background text-primary flex size-10 items-center justify-center rounded-lg border">
                  <FileText className="size-5" />
                </div>
                <CardTitle className="text-lg leading-tight">診断レポート見本</CardTitle>
                <CardDescription>レポートの粒度と確認ポイントを事前に把握できます。</CardDescription>
              </CardHeader>
              <CardContent>
                <CtaLink href="/ja/report-sample" priority="tertiary" showArrow className="px-0">
                  見本を見る
                </CtaLink>
              </CardContent>
            </Card>
          </div>
        </section>

        <section aria-label="業種別ガイド" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">業種別ガイド</h2>
            <p className="text-muted-foreground text-sm">業種ごとに優先して診断すべき観点を整理しています。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {industryLinks.map((item) => (
              <Card key={item.href}>
                <CardHeader>
                  <CardTitle className="inline-flex items-center gap-2 text-lg">
                    <item.icon className="size-5 text-primary" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CtaLink href={item.href} priority="secondary" size="sm">
                    ページへ移動
                  </CtaLink>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
