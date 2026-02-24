import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const RECOVERY_INTERVAL_MS = 30_000;
let lastRecoveryAt = 0;

const RECOVERY_MESSAGE = "スキャン処理が中断されました（サーバー再起動の可能性があります）";

export async function recoverStaleScans(): Promise<void> {
  const now = Date.now();
  if (now - lastRecoveryAt < RECOVERY_INTERVAL_MS) {
    return;
  }
  lastRecoveryAt = now;

  const staleBefore = new Date(now - env.scanStaleAfterMs);
  const staleScans = await db.scan.findMany({
    where: {
      status: "running",
      finishedAt: null,
      startedAt: { lt: staleBefore },
    },
    select: { id: true, publicId: true },
  });

  if (staleScans.length === 0) {
    return;
  }

  const finishedAt = new Date();

  for (const scan of staleScans) {
    await db.scanPage.updateMany({
      where: {
        scanId: scan.id,
        status: { in: ["queued", "running"] },
      },
      data: {
        status: "failed",
        errorCode: "unknown",
        errorMessage: RECOVERY_MESSAGE,
        finishedAt,
      },
    });

    await db.scan.update({
      where: { id: scan.id },
      data: {
        status: "failed",
        errorMessage: RECOVERY_MESSAGE,
        finishedAt,
      },
    });

    logger.warn("recovered stale scan", { publicId: scan.publicId });
  }
}
