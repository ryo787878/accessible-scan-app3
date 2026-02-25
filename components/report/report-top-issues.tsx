import { getAxeRuleJa, getQuickFixJa, getRuleGuidanceJa } from "@/lib/axe-ja";
import { SeverityBadge } from "@/components/report/severity-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Scan } from "@/lib/types";
import { aggregateByRule } from "@/components/report/report-summary";
import { ExternalLink } from "lucide-react";
import { formatStandardTag } from "@/lib/axe-tags";

interface ReportTopIssuesProps {
  scan: Scan;
}

export function ReportTopIssues({ scan }: ReportTopIssuesProps) {
  const aggregated = aggregateByRule(scan);
  const top5 = aggregated.slice(0, 5);

  if (top5.length === 0) {
    return (
      <section aria-label="上位課題">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">上位課題TOP5</CardTitle>
            <CardDescription>
              検出された違反はありません。
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    );
  }

  return (
    <section aria-label="上位課題">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight">上位課題 TOP5</h2>
        <div className="flex flex-col gap-3">
          {top5.map((issue, index) => {
            const guidance = getRuleGuidanceJa(issue.ruleId);

            return (
              <Card key={issue.ruleId}>
                <CardHeader className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">
                          {getAxeRuleJa(issue.ruleId)}
                        </CardTitle>
                        <SeverityBadge impact={issue.impact} />
                        {issue.standardTags.map((tag) => (
                          <Badge key={`${issue.ruleId}-${tag}`} variant="outline" className="text-[10px]">
                            {formatStandardTag(tag)}
                          </Badge>
                        ))}
                      </div>

                      {guidance ? (
                        <div className="text-muted-foreground space-y-1 text-xs leading-relaxed">
                          <p>
                            <strong className="text-foreground">何が問題か:</strong> {guidance.problem}
                          </p>
                          <p>
                            <strong className="text-foreground">なぜ困るか:</strong> {guidance.why}
                          </p>
                          <p>
                            <strong className="text-foreground">どう直すか:</strong> {guidance.howToFix.join(" / ")}
                          </p>
                          {guidance.example && (
                            <p>
                              <strong className="text-foreground">実装例:</strong>{" "}
                              <code className="bg-muted rounded px-1 py-0.5">{guidance.example}</code>
                            </p>
                          )}
                        </div>
                      ) : (
                        <>
                          <CardDescription className="leading-relaxed">
                            {issue.description}
                          </CardDescription>
                          <p className="text-muted-foreground text-xs">
                            どう直すか: {getQuickFixJa(issue.ruleId, issue.impact)}
                          </p>
                        </>
                      )}

                      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
                        <span>
                          該当ページ:{" "}
                          <strong className="text-foreground">{issue.pageCount}</strong>
                        </span>
                        <span>
                          該当要素:{" "}
                          <strong className="text-foreground">{issue.nodeCount}</strong>
                        </span>
                        <span>
                          再発しやすさ:{" "}
                          <strong className="text-foreground">{issue.recurrenceLabel}</strong>
                        </span>
                        <a
                          href={`https://dequeuniversity.com/rules/axe/4.10/${issue.ruleId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary inline-flex items-center gap-1 hover:underline"
                        >
                          詳細
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </div>
                      <p className="text-muted-foreground text-xs">{issue.recurrenceReason}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
