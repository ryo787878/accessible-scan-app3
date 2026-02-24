"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Scan, PageStatus } from "@/lib/types";

const POLL_INTERVAL = 2000;

function statusIcon(status: PageStatus) {
  switch (status) {
    case "success":
      return (
        <CheckCircle2
          className="size-5 shrink-0 text-emerald-600"
          aria-label="成功"
        />
      );
    case "failed":
      return (
        <XCircle
          className="size-5 shrink-0 text-severity-critical"
          aria-label="失敗"
        />
      );
    case "running":
      return (
        <Loader2
          className="text-primary size-5 shrink-0 animate-spin"
          aria-label="実行中"
        />
      );
    case "skipped":
      return (
        <AlertTriangle
          className="size-5 shrink-0 text-amber-500"
          aria-label="スキップ"
        />
      );
    default:
      return (
        <Clock
          className="text-muted-foreground size-5 shrink-0"
          aria-label="待機中"
        />
      );
  }
}

function statusLabel(status: PageStatus): string {
  switch (status) {
    case "success":
      return "完了";
    case "failed":
      return "失敗";
    case "running":
      return "診断中";
    case "skipped":
      return "スキップ";
    default:
      return "待機中";
  }
}

export function ScanProgress({ publicId }: { publicId: string }) {
  const [scan, setScan] = useState<Scan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchScan = useCallback(async () => {
    try {
      const res = await fetch(`/api/scans/${publicId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("スキャンが見つかりません。URLを確認してください。");
        } else {
          setError("データの取得に失敗しました。");
        }
        return null;
      }
      const data: Scan = await res.json();
      setScan(data);
      return data;
    } catch {
      setError("サーバーとの通信に失敗しました。");
      return null;
    }
  }, [publicId]);

  useEffect(() => {
    fetchScan();

    const interval = setInterval(async () => {
      const data = await fetchScan();
      if (data && (data.status === "completed" || data.status === "failed")) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchScan]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <XCircle className="text-destructive size-12" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">エラー</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">トップページに戻る</Link>
        </Button>
      </div>
    );
  }

  if (!scan) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-20"
        role="status"
        aria-label="読み込み中"
      >
        <Loader2 className="text-primary size-8 animate-spin" aria-hidden="true" />
        <p className="text-muted-foreground text-sm">データを読み込み中...</p>
      </div>
    );
  }

  const successCount = scan.pages.filter((p) => p.status === "success").length;
  const failedCount = scan.pages.filter((p) => p.status === "failed").length;
  const skippedCount = scan.pages.filter((p) => p.status === "skipped").length;
  const pendingCount = scan.pages.filter(
    (p) => p.status === "pending" || p.status === "queued" || p.status === "running"
  ).length;
  const totalPages = scan.pages.length;
  const progressPercent =
    totalPages > 0
      ? Math.round(((successCount + failedCount + skippedCount) / totalPages) * 100)
      : 0;
  const isCompleted = scan.status === "completed";
  const isFailed = scan.status === "failed";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {isCompleted
            ? "診断が完了しました"
            : isFailed
              ? "診断中にエラーが発生しました"
              : "診断を実行しています..."}
        </h1>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{scan.url}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">全体の進捗</span>
          <span className="font-mono font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} aria-label={`進捗: ${progressPercent}%`} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4">
            <CardDescription>成功</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">
              {successCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardDescription>失敗</CardDescription>
            <CardTitle className="text-severity-critical text-2xl">
              {failedCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardDescription>残り</CardDescription>
            <CardTitle className="text-muted-foreground text-2xl">
              {pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Page list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ページ一覧</CardTitle>
          <CardDescription>
            {totalPages}ページ中{successCount + failedCount + skippedCount}ページの診断が完了
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col divide-y" role="list">
            {scan.pages.map((page) => (
              <li
                key={page.url}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                {statusIcon(page.status)}
                <span className="min-w-0 flex-1 truncate text-sm">
                  {page.url}
                </span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {statusLabel(page.status)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action button */}
      {isCompleted && (
        <Button asChild size="lg" className="w-full text-base">
          <Link href={`/report/${publicId}`}>
            レポートを見る
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      )}

      {isFailed && (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-center text-sm">
            一部のページで診断に失敗しました。完了した結果をレポートで確認できます。
          </p>
          <Button asChild size="lg" variant="outline" className="w-full text-base">
            <Link href={`/report/${publicId}`}>
              レポートを見る
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
