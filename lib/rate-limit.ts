import { env } from "@/lib/env";

/**
 * インメモリレート制限
 * IPあたり一定時間内のリクエスト回数を制限（POST /api/scans 用）
 */
const ipTimestamps = new Map<string, number[]>();

/** レート制限を超過しているかチェック。超過時は残り秒数を返す */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const windowStart = now - env.rateLimitWindowMs;
  const requests = (ipTimestamps.get(ip) ?? []).filter((ts) => ts >= windowStart);

  if (requests.length >= env.rateLimitMax) {
    const oldestInWindow = requests[0];
    const retryAfterSeconds = Math.ceil((oldestInWindow + env.rateLimitWindowMs - now) / 1000);
    ipTimestamps.set(ip, requests);
    return { allowed: false, retryAfterSeconds };
  }

  requests.push(now);
  ipTimestamps.set(ip, requests);

  // 古いエントリを定期的にクリーンアップ（100件超えたら）
  if (ipTimestamps.size > 100) {
    for (const [key, timestamps] of ipTimestamps) {
      const alive = timestamps.filter((ts) => ts >= now - env.rateLimitWindowMs * 5);
      if (alive.length === 0) {
        ipTimestamps.delete(key);
      } else {
        ipTimestamps.set(key, alive);
      }
    }
  }

  return { allowed: true };
}
