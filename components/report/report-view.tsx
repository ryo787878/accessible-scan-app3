"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, XCircle, ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CtaLink } from "@/components/cta-link";
import { ReportSummary } from "@/components/report/report-summary";
import { ReportTopIssues } from "@/components/report/report-top-issues";
import { ReportRuleTable } from "@/components/report/report-rule-table";
import { ReportPageDetail } from "@/components/report/report-page-detail";
import { ScoreOverview } from "@/components/report/score-overview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Scan, ScanReportResponse } from "@/lib/types";

interface ReportViewProps {
  publicId: string;
}

export function ReportView({ publicId }: ReportViewProps) {
  const { status } = useSession();
  const [scan, setScan] = useState<Scan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusRuleId, setFocusRuleId] = useState<string | null>(null);
  const handleRequestDetail = (ruleId: string) => {
    // Allow selecting the same rule repeatedly.
    setFocusRuleId(null);
    window.setTimeout(() => setFocusRuleId(ruleId), 0);
  };

  const fetchReport = useCallback(async (): Promise<Scan | null> => {
    try {
      const res = await fetch(`/api/scans/${publicId}/report`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("レポートが見つかりません。URLを確認してください。");
        } else {
          setError("レポートの取得に失敗しました。");
        }
        return null;
      }
      const data: ScanReportResponse = await res.json();
      return {
        publicId: data.publicId,
        url: data.summary.inputUrl,
        maxPages: data.summary.totalPages,
        status: data.status,
        pages: data.pages,
        createdAt: data.summary.executedAt ?? new Date().toISOString(),
      };
    } catch {
      setError("サーバーとの通信に失敗しました。");
      return null;
    }
  }, [publicId]);

  useEffect(() => {
    let cancelled = false;

    async function pollUntilComplete() {
      const data = await fetchReport();
      if (cancelled) return;

      if (!data) {
        setLoading(false);
        return;
      }

      if (data.status === "completed" || data.status === "failed") {
        setScan(data);
        setLoading(false);
        return;
      }

      // まだ完了していない場合はポーリングで待つ
      const interval = setInterval(async () => {
        if (cancelled) {
          clearInterval(interval);
          return;
        }
        const d = await fetchReport();
        if (cancelled) {
          clearInterval(interval);
          return;
        }
        if (d && (d.status === "completed" || d.status === "failed")) {
          setScan(d);
          setLoading(false);
          clearInterval(interval);
        }
      }, 1500);
    }

    pollUntilComplete();
    return () => {
      cancelled = true;
    };
  }, [fetchReport]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <XCircle className="text-destructive size-12" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">エラー</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/" scroll>
              トップページに戻る
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/scan/${publicId}`} scroll>
              進捗ページへ
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!scan && !error) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-20"
        role="status"
        aria-label="読み込み中"
      >
        <Loader2 className="text-primary size-8 animate-spin" aria-hidden="true" />
        <p className="text-muted-foreground text-sm">
          {loading ? "レポートを準備中..." : "レポートを読み込み中..."}
        </p>
      </div>
    );
  }

  if (!scan) {
    return null;
  }

  const scannedAt = new Date(scan.createdAt);
  const formattedDate = `${scannedAt.getFullYear()}年${scannedAt.getMonth() + 1}月${scannedAt.getDate()}日 ${String(scannedAt.getHours()).padStart(2, "0")}:${String(scannedAt.getMinutes()).padStart(2, "0")}`;
  const isMember = status === "authenticated";

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          アクセシビリティ診断レポート
        </h1>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-2">
            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{scan.url}</span>
          </div>
          <div className="text-muted-foreground rounded-md border px-2.5 py-2">
            診断日時: {formattedDate}
          </div>
          <div className="text-muted-foreground rounded-md border px-2.5 py-2 sm:col-span-2">
            {scan.pages.filter((p) => p.status === "success").length}ページ診断完了
          </div>
        </div>
        <ScoreOverview scan={scan} />
      </div>

      {/* Summary */}
      <ReportSummary scan={scan} />

      {/* Top 5 Issues */}
      <ReportTopIssues scan={scan} />

      {isMember ? (
        <>
          {/* Rule Aggregate Table */}
          <ReportRuleTable scan={scan} onRequestDetail={handleRequestDetail} />

          {/* Page Detail */}
          <ReportPageDetail
            scan={scan}
            focusRuleId={focusRuleId}
            onFocusHandled={() => setFocusRuleId(null)}
          />
        </>
      ) : (
        <section aria-label="会員限定詳細">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">会員限定の詳細レポート</CardTitle>
              <CardDescription>
                「ルール別集計」と「ページ別詳細」は会員登録後に閲覧できます。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <CtaLink href={`/login?callbackUrl=/report/${publicId}`} priority="primary" fullWidth className="sm:flex-1">
                ログインして詳細を見る
              </CtaLink>
              <CtaLink href="/ja/accessibility-diagnosis" priority="secondary" fullWidth className="sm:flex-1">
                診断ガイドを見る
              </CtaLink>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Back action */}
      <div className="mt-4 flex flex-col items-center gap-4 border-t pt-8 md:mt-6">
        <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
          <CtaLink href="/" priority="secondary" size="lg" fullWidth>
            新しい診断を開始
          </CtaLink>
          <CtaLink href="/ja/accessibility-diagnosis" priority="tertiary" size="lg" fullWidth>
            診断ガイドを見る
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
