"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScoreGauge } from "@/components/report/score-gauge";
import { computeAccessibilityScore } from "@/lib/score";
import { getImpactLabel } from "@/lib/axe-ja";
import type { Scan, Impact } from "@/lib/types";
import {
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

interface ScoreOverviewProps {
  scan: Scan;
}

type KnownImpact = Exclude<Impact, "unknown">;

const SEVERITY_ORDER: KnownImpact[] = ["critical", "serious", "moderate", "minor"];

const SEVERITY_STYLES: Record<KnownImpact, { bar: string; text: string }> = {
  critical: {
    bar: "bg-severity-critical",
    text: "text-severity-critical",
  },
  serious: {
    bar: "bg-severity-serious",
    text: "text-severity-serious",
  },
  moderate: {
    bar: "bg-severity-moderate",
    text: "text-severity-moderate",
  },
  minor: {
    bar: "bg-severity-minor",
    text: "text-severity-minor",
  },
};

export function ScoreOverview({ scan }: ScoreOverviewProps) {
  const result = computeAccessibilityScore(scan);
  const maxCount = Math.max(1, ...Object.values(result.severityCounts));

  return (
    <section aria-label="スコア概要">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="size-5 shrink-0" aria-hidden="true" />
            アクセシビリティスコア
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* Score gauge */}
            <div className="flex shrink-0 flex-col items-center gap-3">
              <ScoreGauge result={result} />
              <p className="text-muted-foreground max-w-48 text-center text-xs leading-relaxed">
                WCAG 2.1 AA基準に基づく
                <br />
                自動検出可能な項目のスコア
              </p>
            </div>

            {/* Right column: severity breakdown + stats */}
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              {/* Severity breakdown bars */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold">重大度別の内訳</h3>
                <div className="flex flex-col gap-2.5">
                  {SEVERITY_ORDER.map((impact) => {
                    const count = result.severityCounts[impact];
                    const width =
                      count > 0
                        ? Math.max(4, (count / maxCount) * 100)
                        : 0;
                    return (
                      <div key={impact} className="flex items-center gap-3">
                        <span
                          className={`w-16 shrink-0 text-xs font-medium ${SEVERITY_STYLES[impact].text}`}
                        >
                          {getImpactLabel(impact)}
                        </span>
                        <div className="bg-muted relative h-5 flex-1 overflow-hidden rounded-sm">
                          <div
                            className={`h-full rounded-sm transition-all duration-700 ease-out ${SEVERITY_STYLES[impact].bar}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <span className="text-foreground w-8 shrink-0 text-right text-sm font-bold tabular-nums">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle
                      className="text-muted-foreground size-3.5"
                      aria-hidden="true"
                    />
                    <span className="text-foreground text-xl font-bold tabular-nums">
                      {result.uniqueRules}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    違反ルール
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <FileSearch
                      className="text-muted-foreground size-3.5"
                      aria-hidden="true"
                    />
                    <span className="text-foreground text-xl font-bold tabular-nums">
                      {result.pageCount}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    診断ページ
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      className="text-muted-foreground size-3.5"
                      aria-hidden="true"
                    />
                    <span className="text-foreground text-xl font-bold tabular-nums">
                      {result.passedRules}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    合格ルール
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
