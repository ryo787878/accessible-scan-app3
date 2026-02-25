import { describe, expect, it } from "vitest";
import { computeAccessibilityScore } from "@/lib/score";
import type { Scan, Violation } from "@/lib/types";

function violation(id: string, impact: Violation["impact"], nodeCount: number): Violation {
  return {
    id,
    impact,
    description: id,
    help: id,
    helpUrl: "https://example.com",
    nodes: Array.from({ length: nodeCount }, (_, idx) => ({
      html: `<div data-i="${idx}"></div>`,
      target: ["body", `div:nth-child(${idx + 1})`],
      failureSummary: "summary",
    })),
  };
}

function createScan({
  successPages,
  failedPages = 0,
  skippedPages = 0,
}: {
  successPages: Array<{ url: string; violations: Violation[] }>;
  failedPages?: number;
  skippedPages?: number;
}): Scan {
  const pages = [
    ...successPages.map((page) => ({
      url: page.url,
      status: "success" as const,
      violations: page.violations,
      incompletes: [],
    })),
    ...Array.from({ length: failedPages }, (_, idx) => ({
      url: `https://example.com/failed-${idx}`,
      status: "failed" as const,
      violations: [],
      incompletes: [],
    })),
    ...Array.from({ length: skippedPages }, (_, idx) => ({
      url: `https://example.com/skipped-${idx}`,
      status: "skipped" as const,
      violations: [],
      incompletes: [],
    })),
  ];

  return {
    publicId: "scan_test000001",
    url: "https://example.com",
    maxPages: pages.length,
    status: "completed",
    pages,
    createdAt: new Date().toISOString(),
  };
}

describe("computeAccessibilityScore", () => {
  it("critical is strongly penalized even when found on a single page", () => {
    const minorHeavyScan = createScan({
      successPages: Array.from({ length: 10 }, (_, idx) => ({
        url: `https://example.com/minor-${idx}`,
        violations: [violation("color-contrast", "minor", 30)],
      })),
    });

    const oneCriticalScan = createScan({
      successPages: Array.from({ length: 10 }, (_, idx) => ({
        url: `https://example.com/critical-${idx}`,
        violations: idx === 0 ? [violation("aria-input-field-name", "critical", 1)] : [],
      })),
    });

    const minorResult = computeAccessibilityScore(minorHeavyScan);
    const criticalResult = computeAccessibilityScore(oneCriticalScan);

    expect(criticalResult.score).toBeLessThan(minorResult.score);
    expect(criticalResult.impactedPageRates.critical).toBeCloseTo(0.1, 5);
  });

  it("serious deduction grows when affected page rate increases", () => {
    const lowRateScan = createScan({
      successPages: Array.from({ length: 10 }, (_, idx) => ({
        url: `https://example.com/low-${idx}`,
        violations: idx < 2 ? [violation("link-name", "serious", 1)] : [],
      })),
    });

    const highRateScan = createScan({
      successPages: Array.from({ length: 10 }, (_, idx) => ({
        url: `https://example.com/high-${idx}`,
        violations: idx < 8 ? [violation("link-name", "serious", 1)] : [],
      })),
    });

    const lowRateResult = computeAccessibilityScore(lowRateScan);
    const highRateResult = computeAccessibilityScore(highRateScan);

    expect(highRateResult.impactedPageRates.serious).toBeGreaterThan(lowRateResult.impactedPageRates.serious);
    expect(highRateResult.score).toBeLessThan(lowRateResult.score);
  });

  it("marks reliability low when failed/skipped pages dominate", () => {
    const scan = createScan({
      successPages: [
        {
          url: "https://example.com/ok",
          violations: [violation("image-alt", "moderate", 1)],
        },
      ],
      failedPages: 3,
      skippedPages: 2,
    });

    const result = computeAccessibilityScore(scan);

    expect(result.reliability.level).toBe("low");
    expect(result.reliability.successRate).toBeCloseTo(1 / 6, 5);
  });
});
