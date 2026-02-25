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
      label: "推定合格ルール数",
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

function normalizeSelector(selector: string): string {
  return selector
    .replace(/:nth-child\(\d+\)/g, ":nth-child(*)")
    .replace(/\[\w+(?:[-:]\w+)?="[^"]+"\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

type AggregatedRuleBase = {
  ruleId: string;
  impact: Impact;
  pages: Set<string>;
  nodeCount: number;
  description: string;
  standardTags: Set<string>;
  selectorPageMap: Map<string, Set<string>>;
};

export type AggregatedRule = {
  ruleId: string;
  impact: Impact;
  nodeCount: number;
  pageCount: number;
  description: string;
  standardTags: string[];
  recurrenceLabel: "単発" | "再発しやすい" | "共通コンポーネント疑い（高）";
  recurrenceReason: string;
  decisionType: "自動検出";
};

function toAggregatedRule(
  base: AggregatedRuleBase,
  totalSuccessPages: number
): AggregatedRule {
  const pageCount = base.pages.size;
  let maxSelectorPageCount = 0;
  for (const pages of base.selectorPageMap.values()) {
    if (pages.size > maxSelectorPageCount) {
      maxSelectorPageCount = pages.size;
    }
  }

  if (pageCount <= 1 && base.nodeCount <= 2) {
    return {
      ruleId: base.ruleId,
      impact: base.impact,
      nodeCount: base.nodeCount,
      pageCount,
      description: base.description,
      standardTags: Array.from(base.standardTags),
      recurrenceLabel: "単発",
      recurrenceReason: "単一ページでのみ検出され、局所修正の可能性が高いです。",
      decisionType: "自動検出",
    };
  }

  const commonThreshold = Math.max(3, Math.ceil(totalSuccessPages * 0.4));
  if (pageCount >= commonThreshold || maxSelectorPageCount >= 3) {
    return {
      ruleId: base.ruleId,
      impact: base.impact,
      nodeCount: base.nodeCount,
      pageCount,
      description: base.description,
      standardTags: Array.from(base.standardTags),
      recurrenceLabel: "共通コンポーネント疑い（高）",
      recurrenceReason:
        maxSelectorPageCount >= 3
          ? `同じHTML構造（同系セレクタ）が${maxSelectorPageCount}ページで再発しています。`
          : `全${totalSuccessPages}ページ中${pageCount}ページで発生し、テンプレート影響の可能性が高いです。`,
      decisionType: "自動検出",
    };
  }

  return {
    ruleId: base.ruleId,
    impact: base.impact,
    nodeCount: base.nodeCount,
    pageCount,
    description: base.description,
    standardTags: Array.from(base.standardTags),
    recurrenceLabel: "再発しやすい",
    recurrenceReason: "複数ページで発生しており、共通実装の見直しで横展開修正できる可能性があります。",
    decisionType: "自動検出",
  };
}

function aggregateIssuesByRule(
  scan: Scan,
  issueType: "violation" | "incomplete"
): AggregatedRuleBase[] {
  const successPages = scan.pages.filter((p) => p.status === "success");
  const ruleMap = new Map<string, AggregatedRuleBase>();

  for (const page of successPages) {
    const issues = issueType === "violation" ? page.violations : page.incompletes;
    for (const issue of issues) {
      const existing = ruleMap.get(issue.id);
      if (existing) {
        existing.pages.add(page.url);
        existing.nodeCount += issue.nodes.length;
        for (const tag of extractStandardTags(issue.tags)) {
          existing.standardTags.add(tag);
        }
        for (const node of issue.nodes) {
          const signature = normalizeSelector(node.target.join(" > "));
          if (!signature) continue;
          const selectorPages = existing.selectorPageMap.get(signature) ?? new Set<string>();
          selectorPages.add(page.url);
          existing.selectorPageMap.set(signature, selectorPages);
        }
      } else {
        const selectorPageMap = new Map<string, Set<string>>();
        for (const node of issue.nodes) {
          const signature = normalizeSelector(node.target.join(" > "));
          if (!signature) continue;
          const selectorPages = selectorPageMap.get(signature) ?? new Set<string>();
          selectorPages.add(page.url);
          selectorPageMap.set(signature, selectorPages);
        }

        ruleMap.set(issue.id, {
          ruleId: issue.id,
          impact: issue.impact,
          pages: new Set([page.url]),
          nodeCount: issue.nodes.length,
          description: issue.description,
          standardTags: new Set(extractStandardTags(issue.tags)),
          selectorPageMap,
        });
      }
    }
  }

  return Array.from(ruleMap.values());
}

function sortAggregatedRules<T extends { impact: Impact; nodeCount: number }>(rules: T[]): T[] {
  return rules.sort((a, b) => {
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

/** ルール別集計のユーティリティ */
export function aggregateByRule(scan: Scan): AggregatedRule[] {
  const successPages = scan.pages.filter((p) => p.status === "success");

  return sortAggregatedRules(
    aggregateIssuesByRule(scan, "violation").map((r) => toAggregatedRule(r, successPages.length))
  );
}

export type AggregatedIncompleteRule = {
  ruleId: string;
  impact: Impact;
  nodeCount: number;
  pageCount: number;
  description: string;
  standardTags: string[];
  recurrenceLabel: "単発" | "再発しやすい" | "共通コンポーネント疑い（高）";
  recurrenceReason: string;
  decisionType: "手動確認が必要";
};

export function aggregateIncompletesByRule(scan: Scan): AggregatedIncompleteRule[] {
  const successPages = scan.pages.filter((p) => p.status === "success");

  return sortAggregatedRules(
    aggregateIssuesByRule(scan, "incomplete").map((r) => {
      const base = toAggregatedRule(r, successPages.length);
      return {
        ...base,
        decisionType: "手動確認が必要" as const,
      };
    })
  );
}
