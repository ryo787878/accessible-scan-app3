import { env } from "@/lib/env";

const LOG_LEVEL_PRIORITY = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
} as const;

function shouldLog(level: keyof typeof LOG_LEVEL_PRIORITY): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[env.logLevel];
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("info")) {
      console.info(`[scan] ${message}`, meta ?? {});
    }
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("warn")) {
      console.warn(`[scan] ${message}`, meta ?? {});
    }
  },
  error(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("error")) {
      console.error(`[scan] ${message}`, meta ?? {});
    }
  },
};
