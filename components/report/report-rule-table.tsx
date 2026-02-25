"use client";

import { getAxeRuleJa, getQuickFixJa } from "@/lib/axe-ja";
import { SeverityBadge } from "@/components/report/severity-badge";
import {
  aggregateByRule,
  aggregateIncompletesByRule,
  type AggregatedIncompleteRule,
  type AggregatedRule,
} from "@/components/report/report-summary";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Scan, Impact } from "@/lib/types";
import { formatStandardTag } from "@/lib/axe-tags";

interface ReportRuleTableProps {
  scan: Scan;
  onRequestDetail?: (ruleId: string) => void;
}

const impactTabs: { value: string; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "critical", label: "重大" },
  { value: "serious", label: "高" },
  { value: "moderate", label: "中" },
  { value: "minor", label: "低" },
];

type AnyAggregatedRule = AggregatedRule | AggregatedIncompleteRule;

function renderRuleTable(
  filtered: AnyAggregatedRule[],
  onRequestDetail: ((ruleId: string) => void) | undefined,
  decisionType: "自動検出" | "手動確認が必要"
) {
  if (filtered.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        該当するルールはありません
      </p>
    );
  }

  return (
    <div className="rounded-xl border p-2">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-12 px-4">ルール</TableHead>
            <TableHead className="h-12 w-20 px-2 text-center md:w-24 md:px-4">重大度</TableHead>
            <TableHead className="h-12 w-20 px-2 text-right md:w-24 md:px-4">ページ数</TableHead>
            <TableHead className="h-12 w-20 px-2 text-right md:w-24 md:px-4">要素数</TableHead>
            <TableHead className="h-12 w-36 px-2 md:w-44 md:px-4">判定種別</TableHead>
            <TableHead className="h-12 w-44 px-2 md:w-56 md:px-4">再発しやすさ</TableHead>
            <TableHead className="h-12 w-24 px-2 md:w-28 md:px-4">対応状況</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((rule) => {
            const localized = getAxeRuleJa(rule.ruleId);
            const shouldShowRuleId = localized !== rule.ruleId;

            return (
              <TableRow key={`${decisionType}-${rule.ruleId}`}>
                <TableCell className="min-w-0 px-3 py-4 align-top whitespace-normal md:px-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] leading-6 font-medium">{localized}</span>
                      <button
                        type="button"
                        onClick={() => onRequestDetail?.(rule.ruleId)}
                        className="text-primary rounded border px-2 py-0.5 text-xs hover:bg-muted"
                        aria-label={`${localized} の詳細を開く`}
                      >
                        詳細
                      </button>
                    </div>

                    {shouldShowRuleId && (
                      <span className="text-muted-foreground font-mono text-xs break-all">{rule.ruleId}</span>
                    )}

                    <span className="text-muted-foreground text-xs leading-5 break-words">
                      どう直すか: {getQuickFixJa(rule.ruleId, rule.impact)}
                    </span>

                    {rule.standardTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rule.standardTags.map((tag) => (
                          <Badge key={`${rule.ruleId}-${tag}`} variant="outline" className="text-[10px]">
                            {formatStandardTag(tag)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="px-2 py-4 text-center align-top md:px-4">
                  <SeverityBadge impact={rule.impact} />
                </TableCell>

                <TableCell className="px-2 py-4 text-right font-mono align-top md:px-4">{rule.pageCount}</TableCell>

                <TableCell className="px-2 py-4 text-right font-mono align-top md:px-4">{rule.nodeCount}</TableCell>

                <TableCell className="px-2 py-4 align-top md:px-4">
                  <Badge variant={decisionType === "自動検出" ? "secondary" : "outline"}>{decisionType}</Badge>
                </TableCell>

                <TableCell className="px-2 py-4 align-top text-xs leading-5 md:px-4">
                  <p className="text-foreground font-medium">{rule.recurrenceLabel}</p>
                  <p className="text-muted-foreground">{rule.recurrenceReason}</p>
                </TableCell>

                <TableCell className="px-2 py-4 align-top md:px-4">
                  <Badge variant="outline">未対応</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function renderSeverityTabs(
  rules: AnyAggregatedRule[],
  onRequestDetail: ((ruleId: string) => void) | undefined,
  decisionType: "自動検出" | "手動確認が必要"
) {
  return (
    <Tabs defaultValue="all">
      <TabsList className="h-auto gap-1 p-1">
        {impactTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 hover:bg-transparent hover:text-current"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {impactTabs.map((tab) => {
        const filtered =
          tab.value === "all"
            ? rules
            : rules.filter((r) => r.impact === (tab.value as Impact));

        return (
          <TabsContent key={tab.value} value={tab.value}>
            {renderRuleTable(filtered, onRequestDetail, decisionType)}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export function ReportRuleTable({ scan, onRequestDetail }: ReportRuleTableProps) {
  const aggregatedViolations = aggregateByRule(scan);
  const aggregatedIncompletes = aggregateIncompletesByRule(scan);

  return (
    <section id="rule-aggregate" aria-label="ルール別集計">
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold tracking-tight">ルール別集計</h2>

        <Tabs defaultValue="auto">
          <TabsList className="h-auto gap-1 p-1">
            <TabsTrigger value="auto" className="px-4 py-2">
              自動検出
            </TabsTrigger>
            <TabsTrigger value="manual" className="px-4 py-2">
              手動確認が必要
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto">
            {renderSeverityTabs(aggregatedViolations, onRequestDetail, "自動検出")}
          </TabsContent>

          <TabsContent value="manual">
            {renderSeverityTabs(aggregatedIncompletes, onRequestDetail, "手動確認が必要")}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
