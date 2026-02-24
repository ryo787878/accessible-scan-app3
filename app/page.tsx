import { ScanForm } from "@/components/scan-form";
import { Shield, BarChart3, ListOrdered } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "アクセシビリティ診断",
    description:
      "WCAG 2.1基準に基づき、コントラスト比、代替テキスト、フォームラベルなどの問題を自動検出します。",
  },
  {
    icon: BarChart3,
    title: "定量的な可視化",
    description:
      "違反件数を重大度別に集計し、サイト全体の状態を数値とグラフで把握できます。",
  },
  {
    icon: ListOrdered,
    title: "改善優先度の提示",
    description:
      "影響範囲の広いルールをTOP5でハイライトし、どこから直すべきかを明確にします。",
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 py-10 md:py-16">
      <div className="flex w-full max-w-3xl flex-col gap-12">
        {/* Hero */}
        <section className="flex flex-col items-center gap-4 text-center">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Shield className="size-4" aria-hidden="true" />
            WCAG 2.1 準拠チェック
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Webアクセシビリティ
            <br />
            <span className="text-primary">自動診断ツール</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-pretty text-base leading-relaxed md:text-lg">
            URLを入力するだけで、サイト全体のアクセシビリティを自動スキャン。
            検出された問題を日本語レポートで確認し、改善の優先順位を判断できます。
          </p>
        </section>

        {/* Feature Cards */}
        <section aria-label="診断の特徴">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-muted/40 border-0">
                <CardHeader className="gap-3">
                  <div className="bg-background flex size-10 items-center justify-center rounded-lg border">
                    <feature.icon
                      className="text-primary size-5"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Scan Form */}
        <section aria-label="診断開始フォーム">
          <ScanForm />
        </section>

        {/* Footer note */}
        <footer className="text-center">
          <p className="text-muted-foreground text-xs leading-relaxed">
            本ツールは Playwright + axe-core を使用して診断を実行します。
            <br />
            診断結果はWCAG 2.1 AA基準に基づく参考情報であり、完全な適合を保証するものではありません。
          </p>
        </footer>
      </div>
    </main>
  );
}
