import pLimit from "p-limit";
import { chromium } from "playwright";
import { db } from "@/lib/db";
import { collectCandidateUrls } from "@/lib/crawl";
import { prioritizeUrls } from "@/lib/prioritize";
import { runAxe } from "@/lib/axe";
import { logger } from "@/lib/logger";
import { assertSafeHostname } from "@/lib/validation";
import { ensureDbSchema } from "@/lib/db-init";
import { env } from "@/lib/env";

type PageFailureCode =
  | "timeout"
  | "navigation_failed"
  | "http_error"
  | "axe_failed"
  | "axe_unavailable"
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

async function skipPage(scanPageId: number, code: PageFailureCode, message: string, httpStatus?: number) {
  await db.scanPage.update({
    where: { id: scanPageId },
    data: {
      status: "skipped",
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
  const context = await browser.newContext({
    // Some production sites enforce strict CSP (no eval/inline script).
    // axe injection requires script execution in page context.
    bypassCSP: true,
  });
  const page = await context.newPage();

  try {
    page.setDefaultNavigationTimeout(env.scanPageTimeoutMs);
    page.setDefaultTimeout(env.scanPageTimeoutMs);

    const initialHost = new URL(pageUrl).hostname;
    await assertSafeHostname(initialHost);

    const response = await page.goto(pageUrl, {
      timeout: env.scanPageTimeoutMs,
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
      try {
        await page.waitForTimeout(500);
        axe = await runAxe(page);
      } catch (retryError) {
        await skipPage(
          scanPageId,
          "axe_unavailable",
          `axe実行失敗（このページはスキップ）: ${String(retryError)}`,
          status ?? undefined
        );
        return;
      }
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
    if (selected.length === 0) {
      throw new Error("robots.txt のDisallow設定により診断対象ページが見つかりませんでした");
    }

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

    const limit = pLimit(env.scanConcurrency);
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
