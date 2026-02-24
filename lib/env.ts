const toPositiveInt = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const toLogLevel = (value: string | undefined): "debug" | "info" | "warn" | "error" => {
  const normalized = value?.toLowerCase();
  if (normalized === "debug" || normalized === "info" || normalized === "warn" || normalized === "error") {
    return normalized;
  }
  return "info";
};

export const env = {
  scanMaxPagesDefault: toPositiveInt(process.env.SCAN_MAX_PAGES_DEFAULT, 10),
  scanMaxPagesLimit: toPositiveInt(process.env.SCAN_MAX_PAGES_LIMIT, 20),
  scanConcurrency: toPositiveInt(process.env.SCAN_CONCURRENCY, 2),
  scanPageTimeoutMs: toPositiveInt(process.env.SCAN_PAGE_TIMEOUT_MS, 30_000),
  rateLimitWindowMs: toPositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: toPositiveInt(process.env.RATE_LIMIT_MAX, 5),
  logLevel: toLogLevel(process.env.LOG_LEVEL),
} as const;
