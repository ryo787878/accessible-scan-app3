import {
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  XOctagon,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Scan, Impact } from "@/lib/types";
import { extractStandardTags } from "@/lib/axe-tags";

interface ReportSummaryProps {
  scan: Scan;
}

export function ReportSummary({ scan }: ReportSummaryProps) {
  const successPages = scan.pages.filter((p) => p.status === "success");

  // 全違反のフラットリスト
  const allViolations = successPages.flatMap((p) => p.violations);

  // 総違反ノード数（要素数ベース）
  const totalNodes = allViolations.reduce((sum, v) => sum + v.nodes.length, 0);

  // 重大度別ノード数
  const criticalSerious = allViolations
    .filter((v): v is typeof v & { impact: "critical" | "serious" } =>
      v.impact === "critical" || v.impact === "serious"
    )
    .reduce((sum, v) => sum + v.nodes.length, 0);

  // ユニークルール数
  const uniqueRuleIds = new Set(allViolations.map((v) => v.id));

  // 「合格」ルール推定（代表的なaxeルール総数18種から違反ルール数を引く）
  const TOTAL_RULES_ESTIMATE = 18;
  const passedRules = Math.max(0, TOTAL_RULES_ESTIMATE - uniqueRuleIds.size);

  const metrics = [
    {
      label: "検出された違反",
      value: totalNodes,
      icon: AlertTriangle,
      color: "text-severity-serious" as const,
    },
    {
      label: "緊急 + 重大",
      value: criticalSerious,
      icon: XOctagon,
      color: "text-severity-critical" as const,
    },
    {
      label: "診断ページ数",
      value: successPages.length,
      icon: FileSearch,
      color: "text-primary" as const,
    },
    {
      label: "合格ルール数",
      value: passedRules,
      icon: CheckCircle2,
      color: "text-emerald-600" as const,
    },
  ];

  return (
    <section aria-label="サマリー">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader className="p-4">
              <CardDescription className="flex items-center gap-1.5">
                <m.icon className={`size-3.5 ${m.color}`} aria-hidden="true" />
                {m.label}
              </CardDescription>
              <CardTitle className={`text-3xl font-bold ${m.color}`}>
                {m.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

/** ルール別集計のユーティリティ */
export function aggregateByRule(scan: Scan) {
  const successPages = scan.pages.filter((p) => p.status === "success");
  const ruleMap = new Map<
    string,
    {
      ruleId: string;
      impact: Impact;
      pages: Set<string>;
      nodeCount: number;
      description: string;
      standardTags: Set<string>;
    }
  >();

  for (const page of successPages) {
    for (const v of page.violations) {
      const existing = ruleMap.get(v.id);
      if (existing) {
        existing.pages.add(page.url);
        existing.nodeCount += v.nodes.length;
        for (const tag of extractStandardTags(v.tags)) {
          existing.standardTags.add(tag);
        }
      } else {
        ruleMap.set(v.id, {
          ruleId: v.id,
          impact: v.impact,
          pages: new Set([page.url]),
          nodeCount: v.nodes.length,
          description: v.description,
          standardTags: new Set(extractStandardTags(v.tags)),
        });
      }
    }
  }

  return Array.from(ruleMap.values())
    .map((r) => ({
      ...r,
      pageCount: r.pages.size,
      standardTags: Array.from(r.standardTags),
    }))
    .sort((a, b) => {
      const impactOrder: Record<Impact, number> = {
        critical: 0,
        serious: 1,
        moderate: 2,
        minor: 3,
        unknown: 4,
      };
      if (impactOrder[a.impact] !== impactOrder[b.impact]) {
        return impactOrder[a.impact] - impactOrder[b.impact];
      }
      return b.nodeCount - a.nodeCount;
    });
}
