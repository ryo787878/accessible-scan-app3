import type { Impact, Scan } from "@/lib/types";

type KnownImpact = Exclude<Impact, "unknown">;

const SEVERITY_WEIGHTS: Record<KnownImpact, number> = {
  critical: 8,
  serious: 5,
  moderate: 3,
  minor: 1,
};

const TOTAL_RULES_ESTIMATE = 18;
const MAX_DEDUCTION = 100;

export interface ScoreResult {
  score: number;
  grade: "good" | "needs-work" | "poor";
  label: string;
  severityCounts: Record<KnownImpact, number>;
  totalNodes: number;
  uniqueRules: number;
  passedRules: number;
  pageCount: number;
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

  let totalNodes = 0;
  for (const v of allViolations) {
    if (v.impact === "unknown") {
      severityCounts.minor += v.nodes.length;
    } else {
      severityCounts[v.impact] += v.nodes.length;
    }
    totalNodes += v.nodes.length;
  }

  // 重み付き減点を算出
  let deduction = 0;
  for (const [impact, count] of Object.entries(severityCounts) as [KnownImpact, number][]) {
    deduction += SEVERITY_WEIGHTS[impact] * count;
  }

  // 0-100にクランプ（対数的に減衰させて極端な0を避ける）
  const normalizedDeduction = Math.min(
    MAX_DEDUCTION,
    (deduction / (deduction + 20)) * MAX_DEDUCTION
  );
  const score = Math.round(Math.max(0, 100 - normalizedDeduction));

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
    totalNodes,
    uniqueRules,
    passedRules: Math.max(0, TOTAL_RULES_ESTIMATE - uniqueRules),
    pageCount: successPages.length,
  };
}
