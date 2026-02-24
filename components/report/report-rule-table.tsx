"use client";

import { getAxeRuleJa, getQuickFixJa } from "@/lib/axe-ja";
import { SeverityBadge } from "@/components/report/severity-badge";
import { aggregateByRule } from "@/components/report/report-summary";
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

interface ReportRuleTableProps {
  scan: Scan;
}

const impactTabs: { value: string; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "critical", label: "重大" },
  { value: "serious", label: "高" },
  { value: "moderate", label: "中" },
  { value: "minor", label: "低" },
];

export function ReportRuleTable({ scan }: ReportRuleTableProps) {
  const aggregated = aggregateByRule(scan);
  const scrollToRule = (ruleId: string) => {
    const target = document.getElementById(`rule-${ruleId}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section aria-label="ルール別集計">
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold tracking-tight">ルール別集計</h2>
        <Tabs defaultValue="all">
          <TabsList className="h-auto gap-1 p-1">
            {impactTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-4 py-2">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {impactTabs.map((tab) => {
            const filtered =
              tab.value === "all"
                ? aggregated
                : aggregated.filter((r) => r.impact === (tab.value as Impact));

            return (
              <TabsContent key={tab.value} value={tab.value}>
                {filtered.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    該当するルールはありません
                  </p>
                ) : (
                  <div className="rounded-xl border p-2">
                    <Table className="table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="h-12 px-4">ルール</TableHead>
                          <TableHead className="h-12 w-20 px-2 text-center md:w-24 md:px-4">
                            重大度
                          </TableHead>
                          <TableHead className="h-12 w-16 px-2 text-right md:w-24 md:px-4">
                            ページ数
                          </TableHead>
                          <TableHead className="h-12 w-16 px-2 text-right md:w-24 md:px-4">
                            要素数
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((rule) => (
                          <TableRow key={rule.ruleId}>
                            <TableCell className="min-w-0 px-3 py-4 align-top whitespace-normal md:px-4">
                              <div className="flex flex-col gap-1.5">
                                {(() => {
                                  const localized = getAxeRuleJa(rule.ruleId);
                                  const shouldShowRuleId = localized !== rule.ruleId;
                                  return (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => scrollToRule(rule.ruleId)}
                                        className="w-fit text-left text-[15px] leading-6 font-medium hover:underline focus-visible:underline"
                                      >
                                        {localized}
                                      </button>
                                      {shouldShowRuleId && (
                                        <span className="text-muted-foreground font-mono text-xs break-all">
                                          {rule.ruleId}
                                        </span>
                                      )}
                                      <span className="text-muted-foreground text-xs leading-5 break-words">
                                        修正方法: {getQuickFixJa(rule.ruleId, rule.impact)}
                                      </span>
                                    </>
                                  );
                                })()}
                              </div>
                            </TableCell>
                            <TableCell className="px-2 py-4 text-center align-top md:px-4">
                              <SeverityBadge impact={rule.impact} />
                            </TableCell>
                            <TableCell className="px-2 py-4 text-right font-mono align-top md:px-4">
                              {rule.pageCount}
                            </TableCell>
                            <TableCell className="px-2 py-4 text-right font-mono align-top md:px-4">
                              {rule.nodeCount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
