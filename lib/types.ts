export type Impact = "critical" | "serious" | "moderate" | "minor" | "unknown";

export type PageStatus = "queued" | "pending" | "running" | "success" | "failed" | "skipped";

export type ScanStatus = "queued" | "pending" | "running" | "completed" | "failed";

export interface ViolationNode {
  html: string;
  target: string[];
  failureSummary: string;
}

export interface Violation {
  id: string;
  impact: Impact;
  description: string;
  help: string;
  helpUrl: string;
  tags?: string[];
  nodes: ViolationNode[];
}

export interface PageResult {
  url: string;
  status: PageStatus;
  httpStatus?: number | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  violations: Violation[];
}

export interface Scan {
  publicId: string;
  url: string;
  normalizedRootUrl?: string;
  maxPages: number;
  status: ScanStatus;
  progress?: {
    totalPages: number;
    processedPages: number;
    successPages: number;
    failedPages: number;
  };
  pages: PageResult[];
  createdAt: string;
  startedAt?: string | null;
  finishedAt?: string | null;
  errorMessage?: string | null;
}

export interface ReportSummary {
  inputUrl: string;
  executedAt: string | null;
  totalPages: number;
  successPages: number;
  failedPages: number;
  totalViolations: number;
  severityCounts: Record<Impact, number>;
}

export interface ScanReportResponse {
  publicId: string;
  status: ScanStatus;
  summary: ReportSummary;
  pages: PageResult[];
}
