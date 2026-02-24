import { executeScan } from "@/lib/scanner";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

const runningJobs = new Set<string>();
const queuedJobs: string[] = [];

function runNextJobs(): void {
  while (runningJobs.size < env.scanJobConcurrency && queuedJobs.length > 0) {
    const publicId = queuedJobs.shift();
    if (!publicId || runningJobs.has(publicId)) continue;

    runningJobs.add(publicId);
    setTimeout(async () => {
      try {
        await executeScan(publicId);
      } catch (error) {
        logger.error("job failed", { publicId, error: String(error) });
      } finally {
        runningJobs.delete(publicId);
        runNextJobs();
      }
    }, 0);
  }
}

export function enqueueScanJob(publicId: string): { accepted: boolean; reason?: string } {
  if (runningJobs.has(publicId) || queuedJobs.includes(publicId)) {
    return { accepted: true };
  }

  if (queuedJobs.length >= env.scanQueueMax) {
    return { accepted: false, reason: "queue_full" };
  }

  queuedJobs.push(publicId);
  runNextJobs();
  return { accepted: true };
}
