/**
 * インメモリレート制限
 * IPあたり1分に1回の制限（POST /api/scans 用）
 */

const WINDOW_MS = 60 * 1000; // 1分

const ipTimestamps = new Map<string, number>();

/** レート制限を超過しているかチェック。超過時は残り秒数を返す */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const lastRequest = ipTimestamps.get(ip);

  if (lastRequest && now - lastRequest < WINDOW_MS) {
    const retryAfterSeconds = Math.ceil(
      (WINDOW_MS - (now - lastRequest)) / 1000
    );
    return { allowed: false, retryAfterSeconds };
  }

  ipTimestamps.set(ip, now);

  // 古いエントリを定期的にクリーンアップ（100件超えたら）
  if (ipTimestamps.size > 100) {
    for (const [key, ts] of ipTimestamps) {
      if (now - ts > WINDOW_MS * 5) {
        ipTimestamps.delete(key);
      }
    }
  }

  return { allowed: true };
}
