import pLimit from "p-limit";
import { chromium } from "playwright";
import { db } from "@/lib/db";
import { collectCandidateUrls } from "@/lib/crawl";
import { prioritizeUrls } from "@/lib/prioritize";
import { runAxe } from "@/lib/axe";
import { logger } from "@/lib/logger";
import { assertSafeHostname } from "@/lib/validation";
import { ensureDbSchema } from "@/lib/db-init";

const PAGE_TIMEOUT_MS = 30_000;
const CONCURRENCY = 2;

type PageFailureCode =
  | "timeout"
  | "navigation_failed"
  | "http_error"
  | "axe_failed"
  | "non_html_content"
  | "unknown";

async function failPage(scanPageId: number, code: PageFailureCode, message: string, httpStatus?: number) {
  await db.scanPage.update({
    where: { id: scanPageId },
    data: {
      status: "failed",
      errorCode: code,
      errorMessage: message,
      httpStatus,
      finishedAt: new Date(),
    },
  });
}

async function processScanPage(scanPageId: number, pageUrl: string): Promise<void> {
  await db.scanPage.update({
    where: { id: scanPageId },
    data: { status: "running", startedAt: new Date() },
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    page.setDefaultNavigationTimeout(PAGE_TIMEOUT_MS);
    page.setDefaultTimeout(PAGE_TIMEOUT_MS);

    const initialHost = new URL(pageUrl).hostname;
    await assertSafeHostname(initialHost);

    const response = await page.goto(pageUrl, {
      timeout: PAGE_TIMEOUT_MS,
      waitUntil: "domcontentloaded",
    });

    try {
      await page.waitForLoadState("networkidle", { timeout: 2_000 });
    } catch {
      await page.waitForTimeout(1_000);
    }

    const finalUrl = page.url();
    const finalHost = new URL(finalUrl).hostname;
    await assertSafeHostname(finalHost);

    const contentType = response?.headers()["content-type"]?.toLowerCase() ?? "";
    const status = response?.status() ?? null;

    if (status && status >= 400) {
      await failPage(scanPageId, "http_error", `HTTPステータス ${status}`, status);
      return;
    }

    if (contentType && !contentType.includes("text/html")) {
      await failPage(scanPageId, "non_html_content", "HTMLコンテンツではありません", status ?? undefined);
      return;
    }

    let axe;
    try {
      axe = await runAxe(page);
    } catch (error) {
      await failPage(scanPageId, "axe_failed", `axe実行失敗: ${String(error)}`, status ?? undefined);
      return;
    }

    if (axe.violations.length > 0) {
      await db.axeViolation.createMany({
        data: axe.violations.map((v) => ({
          scanPageId,
          ruleId: v.id,
          impact: v.impact ?? null,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          tagsJson: JSON.stringify(v.tags ?? []),
          nodeCount: v.nodes.length,
          nodesJson: JSON.stringify(v.nodes),
        })),
      });
    }

    await db.scanPage.update({
      where: { id: scanPageId },
      data: {
        status: "success",
        httpStatus: status,
        finishedAt: new Date(),
      },
    });
  } catch (error) {
    const message = String(error);
    const code: PageFailureCode = message.includes("Timeout") ? "timeout" : "navigation_failed";
    await failPage(scanPageId, code, message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
}

export async function executeScan(publicId: string): Promise<void> {
  await ensureDbSchema();
  const scan = await db.scan.findUnique({ where: { publicId } });
  if (!scan) {
    logger.warn("scan not found", { publicId });
    return;
  }

  try {
    await db.scan.update({
      where: { id: scan.id },
      data: { status: "running", startedAt: new Date(), errorMessage: null },
    });

    const candidates = await collectCandidateUrls(scan.normalizedRootUrl, scan.maxPages);
    const selected = prioritizeUrls(scan.normalizedRootUrl, candidates, scan.maxPages);

    await db.scanPage.createMany({
      data: selected.map((url, index) => ({
        scanId: scan.id,
        url,
        normalizedUrl: url,
        orderIndex: index,
        status: "queued",
      })),
    });

    const scanPages = await db.scanPage.findMany({
      where: { scanId: scan.id },
      orderBy: { orderIndex: "asc" },
    });

    const limit = pLimit(CONCURRENCY);
    await Promise.all(scanPages.map((page) => limit(() => processScanPage(page.id, page.url))));

    await db.scan.update({
      where: { id: scan.id },
      data: { status: "completed", finishedAt: new Date() },
    });
  } catch (error) {
    logger.error("scan execution failed", { publicId, error: String(error) });
    await db.scan.update({
      where: { id: scan.id },
      data: {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "スキャン処理に失敗しました",
        finishedAt: new Date(),
      },
    });
  }
}
