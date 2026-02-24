export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    console.info(`[scan] ${message}`, meta ?? {});
  },
  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(`[scan] ${message}`, meta ?? {});
  },
  error(message: string, meta?: Record<string, unknown>) {
    console.error(`[scan] ${message}`, meta ?? {});
  },
};
