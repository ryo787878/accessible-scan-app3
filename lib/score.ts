import type { Impact, Scan } from "@/lib/types";

type KnownImpact = Exclude<Impact, "unknown">;
type ReliabilityLevel = "high" | "medium" | "low";

const MAX_DEDUCTION_BY_SEVERITY: Record<KnownImpact, number> = {
  critical: 55,
  serious: 35,
  moderate: 20,
  minor: 10,
};

export interface ScoreResult {
  score: number;
  grade: "good" | "needs-work" | "poor";
  label: string;
  severityCounts: Record<KnownImpact, number>;
  impactedPageCounts: Record<KnownImpact, number>;
  impactedPageRates: Record<KnownImpact, number>;
  totalNodes: number;
  uniqueRules: number;
  pageCount: number;
  reliability: {
    level: ReliabilityLevel;
    label: "高" | "中" | "低";
    message: string;
    successPages: number;
    failedPages: number;
    skippedPages: number;
    totalPages: number;
    successRate: number;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeSeverityDeduction(
  impact: KnownImpact,
  pageRate: number,
  nodeCount: number
): number {
  const safeRate = clamp(pageRate, 0, 1);
  const scale = Math.log10(nodeCount + 1);

  switch (impact) {
    case "critical": {
      // 少数ページでも大きく減点し、影響ページ率が高いほど急激に悪化させる。
      const deduction = 25 + safeRate * 40 + scale * 5;
      return clamp(deduction, 0, MAX_DEDUCTION_BY_SEVERITY.critical);
    }
    case "serious": {
      const deduction = safeRate * 28 + scale * 4;
      return clamp(deduction, 0, MAX_DEDUCTION_BY_SEVERITY.serious);
    }
    case "moderate": {
      const deduction = safeRate * 14 + scale * 3;
      return clamp(deduction, 0, MAX_DEDUCTION_BY_SEVERITY.moderate);
    }
    case "minor": {
      // minor は逓減: ページ率は平方根で圧縮し、過剰減点を防ぐ。
      const deduction = Math.sqrt(safeRate) * 8 + scale * 1.5;
      return clamp(deduction, 0, MAX_DEDUCTION_BY_SEVERITY.minor);
    }
  }
}

function computeReliability(scan: Scan, successPages: number): ScoreResult["reliability"] {
  const totalPages = scan.pages.length;
  const failedPages = scan.pages.filter((p) => p.status === "failed").length;
  const skippedPages = scan.pages.filter((p) => p.status === "skipped").length;

  const successRate = totalPages > 0 ? successPages / totalPages : 0;

  let level: ReliabilityLevel;
  let label: "高" | "中" | "低";
  let message: string;

  if (successRate >= 0.9 && failedPages + skippedPages <= 1) {
    level = "high";
    label = "高";
    message = "スコアの信頼性は高いです。";
  } else if (successRate >= 0.7) {
    level = "medium";
    label = "中";
    message = "一部ページ未取得のため、目安として確認してください。";
  } else {
    level = "low";
    label = "低";
    message = "失敗/スキップページが多く、信頼度が低い結果です。";
  }

  return {
    level,
    label,
    message,
    successPages,
    failedPages,
    skippedPages,
    totalPages,
    successRate,
  };
}

export function computeAccessibilityScore(scan: Scan): ScoreResult {
  const successPages = scan.pages.filter((p) => p.status === "success");
  const allViolations = successPages.flatMap((p) => p.violations);

  const severityCounts: Record<KnownImpact, number> = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };

  const impactedPagesBySeverity: Record<KnownImpact, Set<string>> = {
    critical: new Set(),
    serious: new Set(),
    moderate: new Set(),
    minor: new Set(),
  };

  let totalNodes = 0;

  for (const page of successPages) {
    for (const v of page.violations) {
      const impact: KnownImpact = v.impact === "unknown" ? "minor" : v.impact;
      severityCounts[impact] += v.nodes.length;
      if (v.nodes.length > 0) {
        impactedPagesBySeverity[impact].add(page.url);
      }
      totalNodes += v.nodes.length;
    }
  }

  const pageCount = successPages.length;
  const impactedPageCounts: Record<KnownImpact, number> = {
    critical: impactedPagesBySeverity.critical.size,
    serious: impactedPagesBySeverity.serious.size,
    moderate: impactedPagesBySeverity.moderate.size,
    minor: impactedPagesBySeverity.minor.size,
  };

  const impactedPageRates: Record<KnownImpact, number> = {
    critical: pageCount > 0 ? impactedPageCounts.critical / pageCount : 0,
    serious: pageCount > 0 ? impactedPageCounts.serious / pageCount : 0,
    moderate: pageCount > 0 ? impactedPageCounts.moderate / pageCount : 0,
    minor: pageCount > 0 ? impactedPageCounts.minor / pageCount : 0,
  };

  const criticalDeduction = impactedPageCounts.critical > 0
    ? computeSeverityDeduction("critical", impactedPageRates.critical, severityCounts.critical)
    : 0;
  const seriousDeduction = computeSeverityDeduction(
    "serious",
    impactedPageRates.serious,
    severityCounts.serious
  );
  const moderateDeduction = computeSeverityDeduction(
    "moderate",
    impactedPageRates.moderate,
    severityCounts.moderate
  );
  const minorDeduction = computeSeverityDeduction("minor", impactedPageRates.minor, severityCounts.minor);

  const rawDeduction = criticalDeduction + seriousDeduction + moderateDeduction + minorDeduction;
  const totalDeduction = clamp(rawDeduction, 0, 95);
  const score = Math.round(clamp(100 - totalDeduction, 0, 100));

  const uniqueRules = new Set(allViolations.map((v) => v.id)).size;

  let grade: ScoreResult["grade"];
  let label: string;
  if (score >= 90) {
    grade = "good";
    label = "良好";
  } else if (score >= 50) {
    grade = "needs-work";
    label = "改善が必要";
  } else {
    grade = "poor";
    label = "要対応";
  }

  return {
    score,
    grade,
    label,
    severityCounts,
    impactedPageCounts,
    impactedPageRates,
    totalNodes,
    uniqueRules,
    pageCount,
    reliability: computeReliability(scan, successPages.length),
  };
}
