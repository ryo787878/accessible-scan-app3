import type { Scan, ScanReportResponse, Violation } from "@/lib/types";
import { db } from "@/lib/db";
import { impactToJa } from "@/lib/i18n-ja";
import { ensureDbSchema } from "@/lib/db-init";
import { recoverStaleScans } from "@/lib/scan-recovery";

function parseJsonArray<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

function toScanStatus(status: string): Scan["status"] {
  if (status === "queued" || status === "running" || status === "completed" || status === "failed") {
    return status;
  }
  return "failed";
}

function toPageStatus(status: string): NonNullable<Scan["pages"]>[number]["status"] {
  if (
    status === "queued" ||
    status === "pending" ||
    status === "running" ||
    status === "success" ||
    status === "failed" ||
    status === "skipped"
  ) {
    return status;
  }
  return "failed";
}

export async function buildScanView(publicId: string): Promise<Scan | null> {
  await ensureDbSchema();
  await recoverStaleScans();
  const scan = await db.scan.findUnique({
    where: { publicId },
    include: {
      pages: {
        include: { violations: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!scan) return null;

  const pages = scan.pages.map((page) => ({
    url: page.url,
    status: toPageStatus(page.status),
    httpStatus: page.httpStatus,
    errorCode: page.errorCode,
    errorMessage: page.errorMessage,
    violations: page.violations.map<Violation>((v) => ({
      id: v.ruleId,
      impact: impactToJa(v.impact),
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: parseJsonArray<string[]>(v.tagsJson, []),
      nodes: parseJsonArray(v.nodesJson, []),
    })),
  }));

  const totalPages = pages.length;
  const successPages = pages.filter((p) => p.status === "success").length;
  const failedPages = pages.filter((p) => p.status === "failed").length;
  const processedPages = successPages + failedPages;

  return {
    publicId: scan.publicId,
    url: scan.inputUrl,
    normalizedRootUrl: scan.normalizedRootUrl,
    maxPages: scan.maxPages,
    status: toScanStatus(scan.status),
    progress: {
      totalPages,
      processedPages,
      successPages,
      failedPages,
    },
    pages,
    createdAt: scan.createdAt.toISOString(),
    startedAt: scan.startedAt?.toISOString() ?? null,
    finishedAt: scan.finishedAt?.toISOString() ?? null,
    errorMessage: scan.errorMessage,
  };
}

export async function buildScanReport(publicId: string): Promise<ScanReportResponse | null> {
  const scan = await buildScanView(publicId);
  if (!scan) return null;

  const totalViolations = scan.pages.reduce((sum, page) => sum + page.violations.reduce((acc, v) => acc + v.nodes.length, 0), 0);

  const severityCounts = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    unknown: 0,
  } as const;

  const mutable = { ...severityCounts };
  for (const page of scan.pages) {
    for (const v of page.violations) {
      mutable[v.impact] += v.nodes.length;
    }
  }

  return {
    publicId: scan.publicId,
    status: scan.status,
    summary: {
      inputUrl: scan.url,
      executedAt: scan.finishedAt ?? scan.createdAt,
      totalPages: scan.progress?.totalPages ?? 0,
      successPages: scan.progress?.successPages ?? 0,
      failedPages: scan.progress?.failedPages ?? 0,
      totalViolations,
      severityCounts: mutable,
    },
    pages: scan.pages,
  };
}
