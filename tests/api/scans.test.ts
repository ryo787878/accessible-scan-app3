import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mockCreate = vi.fn();
const mockFindMany = vi.fn();
const mockScanUpdate = vi.fn();
const mockScanPageUpdateMany = vi.fn();
const mockEnqueue = vi.fn();
const mockValidateInput = vi.fn();
const mockBuildScanView = vi.fn();
const mockBuildScanReport = vi.fn();
const mockAuth = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    scan: {
      create: mockCreate,
      findMany: mockFindMany,
      update: mockScanUpdate,
    },
    scanPage: {
      updateMany: mockScanPageUpdateMany,
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

vi.mock("@/auth", () => ({
  auth: mockAuth,
}));

describe("scan api routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(undefined);
    mockEnqueue.mockReturnValue({ accepted: true });
    mockFindMany.mockResolvedValue([]);
    mockScanUpdate.mockResolvedValue(undefined);
    mockScanPageUpdateMany.mockResolvedValue({ count: 0 });
  });

  it("POST /api/scans returns 201", async () => {
    mockValidateInput.mockResolvedValue({
      inputUrl: "https://example.com",
      normalizedRootUrl: "https://example.com/",
      maxPages: 10,
    });
    mockCreate.mockResolvedValue({
      publicId: "scan_abc123def4",
      status: "queued",
    });

    const { POST } = await import("@/app/api/scans/route");
    const req = new NextRequest("http://localhost/api/scans", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.10",
      },
      body: JSON.stringify({
        url: "https://example.com",
        maxPages: 10,
        hasAuthorization: true,
        acceptedTerms: true,
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.publicId).toBe("scan_abc123def4");
    expect(mockEnqueue).toHaveBeenCalledWith("scan_abc123def4");
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
      body: JSON.stringify({
        url: "bad-url",
        maxPages: 10,
        hasAuthorization: true,
        acceptedTerms: true,
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Invalid URL");
  });

  it("POST /api/scans returns 415 for non-json content type", async () => {
    const { POST } = await import("@/app/api/scans/route");
    const req = new NextRequest("http://localhost/api/scans", {
      method: "POST",
      headers: {
        "content-type": "text/plain",
      },
      body: "hello",
    });

    const res = await POST(req);
    expect(res.status).toBe(415);
  });

  it("POST /api/scans returns 403 for cross-origin request", async () => {
    const { POST } = await import("@/app/api/scans/route");
    const req = new NextRequest("http://localhost/api/scans", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        host: "localhost",
        origin: "https://evil.example",
      },
      body: JSON.stringify({
        url: "https://example.com",
        hasAuthorization: true,
        acceptedTerms: true,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("POST /api/scans returns 413 for oversized body", async () => {
    const { POST } = await import("@/app/api/scans/route");
    const req = new NextRequest("http://localhost/api/scans", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": String(16 * 1024 + 1),
      },
      body: JSON.stringify({
        url: "https://example.com",
        hasAuthorization: true,
        acceptedTerms: true,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("GET /api/scans/[publicId] returns status", async () => {
    mockBuildScanView.mockResolvedValue({
      publicId: "scan_abc123def4",
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
      params: Promise.resolve({ publicId: "scan_abc123def4" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("running");
    expect(body.progress.processedPages).toBe(3);
    expect(mockBuildScanView).toHaveBeenCalledWith("scan_abc123def4");
  });

  it("GET /api/scans/[publicId] returns 400 for invalid id", async () => {
    const { GET } = await import("@/app/api/scans/[publicId]/route");
    const res = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ publicId: "invalid" }),
    });

    expect(res.status).toBe(400);
  });

  it("GET /api/scans/[publicId]/report returns report", async () => {
    mockBuildScanReport.mockResolvedValue({
      publicId: "scan_abc123def4",
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
      params: Promise.resolve({ publicId: "scan_abc123def4" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.publicId).toBe("scan_abc123def4");
    expect(body.status).toBe("completed");
    expect(mockBuildScanReport).toHaveBeenCalledWith("scan_abc123def4");
  });

  it("GET /api/scans/[publicId]/report returns 400 for invalid id", async () => {
    const { GET } = await import("@/app/api/scans/[publicId]/report/route");
    const res = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ publicId: "invalid" }),
    });

    expect(res.status).toBe(400);
  });
});
