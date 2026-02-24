"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAxeRuleJa, getQuickFixJa } from "@/lib/axe-ja";
import { SeverityBadge } from "@/components/report/severity-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import type { Scan } from "@/lib/types";

interface ReportPageDetailProps {
  scan: Scan;
  focusRuleId?: string | null;
  onFocusHandled?: () => void;
}

const HEADER_OFFSET = 84;

function scrollToElementWithOffset(elementId: string) {
  const target = document.getElementById(elementId);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

export function ReportPageDetail({
  scan,
  focusRuleId,
  onFocusHandled,
}: ReportPageDetailProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const successPages = scan.pages.filter((p) => p.status === "success");
  const failedPages = scan.pages.filter((p) => p.status === "failed");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [showFloatingBack, setShowFloatingBack] = useState(false);
  const firstRuleAnchorByPage = new Map<string, Set<string>>();

  {
    const seen = new Set<string>();
    for (const page of successPages) {
      const pageAnchors = new Set<string>();
      for (const violation of page.violations) {
        if (!seen.has(violation.id)) {
          seen.add(violation.id);
          pageAnchors.add(violation.id);
        }
      }
      firstRuleAnchorByPage.set(page.url, pageAnchors);
    }
  }

  const firstPageByRule = useMemo(() => {
    const map = new Map<string, string>();
    for (const page of successPages) {
      for (const violation of page.violations) {
        if (!map.has(violation.id)) {
          map.set(violation.id, page.url);
        }
      }
    }
    return map;
  }, [successPages]);

  useEffect(() => {
    if (!focusRuleId) return;
    const pageUrl = firstPageByRule.get(focusRuleId);
    if (!pageUrl) return;

    setOpenItems((prev) => (prev.includes(pageUrl) ? prev : [...prev, pageUrl]));
    window.setTimeout(() => {
      scrollToElementWithOffset(`rule-${focusRuleId}`);
      onFocusHandled?.();
    }, 120);
  }, [focusRuleId, firstPageByRule, onFocusHandled]);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
      setShowFloatingBack(inView);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="ページ別詳細">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight">ページ別詳細</h2>
        {failedPages.length > 0 && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">取得失敗ページ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {failedPages.map((page) => (
                <div key={page.url} className="text-sm">
                  <p className="font-medium">{page.url}</p>
                  <p className="text-muted-foreground text-xs">
                    {page.errorCode ?? "unknown"} {page.errorMessage ? `- ${page.errorMessage}` : ""}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        {successPages.length === 0 && (
          <p className="text-muted-foreground text-sm">
            成功ページがないため違反詳細は表示できません。
          </p>
        )}
        {successPages.length > 0 && (
          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="flex flex-col gap-3">
            {successPages.map((page) => (
              <AccordionItem
                key={page.url}
                value={page.url}
                className="rounded-lg border px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex min-w-0 flex-col gap-1 text-left">
                    <span className="truncate text-sm font-medium">
                      {page.url}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {page.violations.length} ルール /{" "}
                      {page.violations.reduce((s, v) => s + v.nodes.length, 0)}{" "}
                      要素
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {page.violations.length === 0 ? (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      このページでは違反が検出されませんでした
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {page.violations.map((v) => (
                        <Card
                          key={v.id}
                          id={firstRuleAnchorByPage.get(page.url)?.has(v.id) ? `rule-${v.id}` : undefined}
                          className="bg-muted/30 border-0 shadow-none"
                        >
                          <CardHeader className="p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <CardTitle className="text-sm">
                                {getAxeRuleJa(v.id)}
                              </CardTitle>
                              <SeverityBadge impact={v.impact} />
                            </div>
                            <p className="text-muted-foreground text-xs">
                              修正方法: {getQuickFixJa(v.id, v.impact)}
                            </p>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-3 px-4 pt-0 pb-4">
                            {v.nodes.map((node, nodeIdx) => (
                              <div
                                key={nodeIdx}
                                className="flex flex-col gap-2 rounded-md border bg-background p-3"
                              >
                                <div className="flex flex-col gap-1">
                                  <span className="text-muted-foreground text-xs font-medium">
                                    対象要素
                                  </span>
                                  <code className="bg-muted overflow-x-auto rounded px-2 py-1 text-xs break-all">
                                    {node.html}
                                  </code>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-muted-foreground text-xs font-medium">
                                    セレクタ
                                  </span>
                                  <code className="bg-muted overflow-x-auto rounded px-2 py-1 font-mono text-xs break-all">
                                    {node.target.join(" > ")}
                                  </code>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-muted-foreground text-xs font-medium">
                                    修正方法
                                  </span>
                                  <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
                                    {node.failureSummary}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => scrollToElementWithOffset("rule-aggregate")}
          >
            <ChevronUp aria-hidden="true" />
            ルール別集計へ戻る
          </Button>
        </div>
      </div>
      {showFloatingBack && (
        <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
          <Button
            type="button"
            variant="outline"
            className="bg-background/95 shadow-lg backdrop-blur"
            onClick={() => scrollToElementWithOffset("rule-aggregate")}
          >
            <ChevronUp aria-hidden="true" />
            ルール別集計へ戻る
          </Button>
        </div>
      )}
    </section>
  );
}
