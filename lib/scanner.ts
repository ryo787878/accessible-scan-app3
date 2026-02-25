import pLimit from "p-limit";
import { chromium, type BrowserContext, type Page } from "playwright";
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

const MAX_TEXT_FIELD_CHARS = 3000;
const MAX_TARGET_ENTRIES = 30;
const MAX_TARGET_ENTRY_CHARS = 500;

function truncateText(value: string, maxChars = MAX_TEXT_FIELD_CHARS): string {
  return value.length > maxChars ? `${value.slice(0, maxChars)}...` : value;
}

function sanitizeNode(raw: Record<string, unknown>): {
  html: string;
  target: string[];
  failureSummary: string;
} {
  const html = typeof raw.html === "string" ? truncateText(raw.html) : "";
  const failureSummary = typeof raw.failureSummary === "string" ? truncateText(raw.failureSummary) : "";
  const target = Array.isArray(raw.target)
    ? raw.target
        .filter((item): item is string => typeof item === "string")
        .slice(0, MAX_TARGET_ENTRIES)
        .map((item) => truncateText(item, MAX_TARGET_ENTRY_CHARS))
    : [];

  return { html, target, failureSummary };
}

function sanitizeAxeIssuesForStorage(
  issues: Array<{
    id: string;
    impact?: string | null;
    description: string;
    help: string;
    helpUrl: string;
    tags?: string[];
    nodes: Array<Record<string, unknown>>;
  }>
) {
  return issues.slice(0, env.scanMaxViolationsPerPage).map((v) => {
    const sanitizedNodes = v.nodes.slice(0, env.scanMaxNodesPerViolation).map(sanitizeNode);

    return {
      id: truncateText(v.id, 120),
      impact: v.impact ?? null,
      description: truncateText(v.description, 500),
      help: truncateText(v.help, 500),
      helpUrl: truncateText(v.helpUrl, 1000),
      tags: Array.isArray(v.tags) ? v.tags.slice(0, 30).map((tag) => truncateText(tag, 80)) : [],
      nodes: sanitizedNodes,
    };
  });
}

async function createHostSafetyChecker() {
  const cache = new Map<string, boolean>();

  return async (hostname: string): Promise<boolean> => {
    const lower = hostname.toLowerCase();
    const cached = cache.get(lower);
    if (cached !== undefined) return cached;

    try {
      await assertSafeHostname(lower);
      cache.set(lower, true);
      return true;
    } catch {
      cache.set(lower, false);
      return false;
    }
  };
}

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

async function runAxeOnDomSnapshot(
  context: BrowserContext,
  sourcePage: Page,
  sourceUrl: string
): Promise<Awaited<ReturnType<typeof runAxe>>> {
  const snapshotPage = await context.newPage();
  try {
    const html = await sourcePage.content();
    await snapshotPage.setContent(html, { waitUntil: "domcontentloaded" });
    return await runAxe(snapshotPage, `${sourceUrl}#dom-snapshot`);
  } finally {
    await snapshotPage.close();
  }
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
  const isSafeHost = await createHostSafetyChecker();

  try {
    page.setDefaultNavigationTimeout(env.scanPageTimeoutMs);
    page.setDefaultTimeout(env.scanPageTimeoutMs);

    const initialHost = new URL(pageUrl).hostname;
    await assertSafeHostname(initialHost);

    await context.route("**/*", async (route) => {
      const requestUrl = route.request().url();

      try {
        const parsed = new URL(requestUrl);
        const protocol = parsed.protocol.toLowerCase();
        if (protocol !== "http:" && protocol !== "https:") {
          return route.abort();
        }

        const safe = await isSafeHost(parsed.hostname);
        if (!safe) {
          return route.abort();
        }
      } catch {
        return route.abort();
      }

      return route.continue();
    });

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
      axe = await runAxe(page, pageUrl);
    } catch (error) {
      logger.warn("axe run failed; retrying once", {
        scanPageId,
        pageUrl,
        error: error instanceof Error ? error.message : String(error),
      });
      try {
        await page.waitForTimeout(500);
        axe = await runAxe(page, pageUrl);
      } catch (retryError) {
        logger.warn("axe run failed on live page; trying dom snapshot fallback", {
          scanPageId,
          pageUrl,
          error: retryError instanceof Error ? retryError.message : String(retryError),
        });
        try {
          axe = await runAxeOnDomSnapshot(context, page, pageUrl);
        } catch (snapshotError) {
          await skipPage(
            scanPageId,
            "axe_unavailable",
            `axe実行失敗（このページはスキップ）: ${String(snapshotError)}`,
            status ?? undefined
          );
          logger.warn("page skipped due to axe unavailable", {
            scanPageId,
            pageUrl,
            error: snapshotError instanceof Error ? snapshotError.message : String(snapshotError),
          });
          return;
        }
      }
    }

    const violations = sanitizeAxeIssuesForStorage(axe.violations);
    const incompletes = sanitizeAxeIssuesForStorage(axe.incomplete ?? []);

    if (violations.length > 0 || incompletes.length > 0) {
      await db.axeViolation.createMany({
        data: [
          ...violations.map((v) => ({
            scanPageId,
            issueType: "violation",
            ruleId: v.id,
            impact: v.impact ?? null,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            tagsJson: JSON.stringify(v.tags ?? []),
            nodeCount: v.nodes.length,
            nodesJson: JSON.stringify(v.nodes),
          })),
          ...incompletes.map((v) => ({
            scanPageId,
            issueType: "incomplete",
            ruleId: v.id,
            impact: v.impact ?? null,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            tagsJson: JSON.stringify(v.tags ?? []),
            nodeCount: v.nodes.length,
            nodesJson: JSON.stringify(v.nodes),
          })),
        ],
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
