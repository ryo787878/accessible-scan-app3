"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, XCircle, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportSummary } from "@/components/report/report-summary";
import { ReportTopIssues } from "@/components/report/report-top-issues";
import { ReportRuleTable } from "@/components/report/report-rule-table";
import { ReportPageDetail } from "@/components/report/report-page-detail";
import { ScoreOverview } from "@/components/report/score-overview";
import type { Scan, ScanReportResponse } from "@/lib/types";

interface ReportViewProps {
  publicId: string;
}

export function ReportView({ publicId }: ReportViewProps) {
  const [scan, setScan] = useState<Scan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
            <Link href="/">トップページに戻る</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/scan/${publicId}`}>進捗ページへ</Link>
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

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          アクセシビリティ診断レポート
        </h1>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{scan.url}</span>
          </span>
          <span>診断日時: {formattedDate}</span>
          <span>
            {scan.pages.filter((p) => p.status === "success").length}ページ診断完了
          </span>
        </div>
        <ScoreOverview scan={scan} />
      </div>

      {/* Summary */}
      <ReportSummary scan={scan} />

      {/* Top 5 Issues */}
      <ReportTopIssues scan={scan} />

      {/* Rule Aggregate Table */}
      <ReportRuleTable scan={scan} />

      {/* Page Detail */}
      <ReportPageDetail scan={scan} />

      {/* Back action */}
      <div className="flex flex-col items-center gap-4 border-t pt-8">
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            新しい診断を開始
          </Link>
        </Button>
      </div>
    </div>
  );
}
