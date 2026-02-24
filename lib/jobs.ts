import { executeScan } from "@/lib/scanner";
import { logger } from "@/lib/logger";

const runningJobs = new Set<string>();

export function enqueueScanJob(publicId: string): void {
  if (runningJobs.has(publicId)) return;
  runningJobs.add(publicId);

  setTimeout(async () => {
    try {
      await executeScan(publicId);
    } catch (error) {
      logger.error("job failed", { publicId, error: String(error) });
    } finally {
      runningJobs.delete(publicId);
    }
  }, 0);
}
