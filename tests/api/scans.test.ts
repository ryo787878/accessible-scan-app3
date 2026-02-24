import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mockCreate = vi.fn();
const mockEnqueue = vi.fn();
const mockValidateInput = vi.fn();
const mockBuildScanView = vi.fn();
const mockBuildScanReport = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    scan: {
      create: mockCreate,
    },
  },
}));

vi.mock("@/lib/jobs", () => ({
  enqueueScanJob: mockEnqueue,
}));

vi.mock("@/lib/validation", () => ({
  validateInput: mockValidateInput,
}));

vi.mock("@/lib/summary", () => ({
  buildScanView: mockBuildScanView,
  buildScanReport: mockBuildScanReport,
}));

vi.mock("@/lib/db-init", () => ({
  ensureDbSchema: vi.fn().mockResolvedValue(undefined),
}));

describe("scan api routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /api/scans returns 201", async () => {
    mockValidateInput.mockResolvedValue({
      inputUrl: "https://example.com",
      normalizedRootUrl: "https://example.com/",
      maxPages: 10,
    });
    mockCreate.mockResolvedValue({
      publicId: "scan_abc123",
      status: "queued",
    });

    const { POST } = await import("@/app/api/scans/route");
    const req = new NextRequest("http://localhost/api/scans", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.10",
      },
      body: JSON.stringify({ url: "https://example.com", maxPages: 10 }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.publicId).toBe("scan_abc123");
    expect(mockEnqueue).toHaveBeenCalledWith("scan_abc123");
  });

  it("POST /api/scans returns 400 for invalid url", async () => {
    mockValidateInput.mockRejectedValue(new Error("Invalid URL"));

    const { POST } = await import("@/app/api/scans/route");
    const req = new NextRequest("http://localhost/api/scans", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.11",
      },
      body: JSON.stringify({ url: "bad-url", maxPages: 10 }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Invalid URL");
  });

  it("GET /api/scans/[publicId] returns status", async () => {
    mockBuildScanView.mockResolvedValue({
      publicId: "scan_abc123",
      status: "running",
      url: "https://example.com",
      maxPages: 10,
      progress: {
        totalPages: 8,
        processedPages: 3,
        successPages: 2,
        failedPages: 1,
      },
      pages: [],
      createdAt: new Date().toISOString(),
      errorMessage: null,
    });

    const { GET } = await import("@/app/api/scans/[publicId]/route");
    const res = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ publicId: "scan_abc123" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("running");
    expect(body.progress.processedPages).toBe(3);
  });

  it("GET /api/scans/[publicId]/report returns report", async () => {
    mockBuildScanReport.mockResolvedValue({
      publicId: "scan_abc123",
      status: "completed",
      summary: {
        inputUrl: "https://example.com",
        executedAt: new Date().toISOString(),
        totalPages: 1,
        successPages: 1,
        failedPages: 0,
        totalViolations: 0,
        severityCounts: {
          critical: 0,
          serious: 0,
          moderate: 0,
          minor: 0,
          unknown: 0,
        },
      },
      pages: [],
    });

    const { GET } = await import("@/app/api/scans/[publicId]/report/route");
    const res = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ publicId: "scan_abc123" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.publicId).toBe("scan_abc123");
    expect(body.status).toBe("completed");
  });
});
