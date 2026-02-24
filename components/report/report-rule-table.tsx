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

  return (
    <section aria-label="ルール別集計">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight">ルール別集計</h2>
        <Tabs defaultValue="all">
          <TabsList>
            {impactTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
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
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ルール</TableHead>
                          <TableHead className="w-20 text-center">
                            重大度
                          </TableHead>
                          <TableHead className="w-24 text-right">
                            ページ数
                          </TableHead>
                          <TableHead className="w-24 text-right">
                            要素数
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((rule) => (
                          <TableRow
                            key={rule.ruleId}
                            className="cursor-pointer"
                            onClick={() => {
                              const target = document.getElementById(`rule-${rule.ruleId}`);
                              if (target) {
                                target.scrollIntoView({ behavior: "smooth", block: "start" });
                              }
                            }}
                          >
                            <TableCell>
                              <div className="flex flex-col gap-0.5">
                                {(() => {
                                  const localized = getAxeRuleJa(rule.ruleId);
                                  const shouldShowRuleId = localized !== rule.ruleId;
                                  return (
                                    <>
                                      <span className="font-medium">{localized}</span>
                                      {shouldShowRuleId && (
                                        <span className="text-muted-foreground font-mono text-xs">
                                          {rule.ruleId}
                                        </span>
                                      )}
                                      <span className="text-muted-foreground text-xs">
                                        修正方法: {getQuickFixJa(rule.ruleId)}
                                      </span>
                                    </>
                                  );
                                })()}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <SeverityBadge impact={rule.impact} />
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {rule.pageCount}
                            </TableCell>
                            <TableCell className="text-right font-mono">
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
