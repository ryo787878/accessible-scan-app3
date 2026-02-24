import dns from "node:dns/promises";
import net from "node:net";
import { scanRequestSchema } from "@/lib/schemas";
import { env } from "@/lib/env";
import { ensureUrlWithScheme, normalizeUrl } from "@/lib/url";

const MAX_URL_LENGTH = 2048;
const MAX_REDIRECTS = 5;

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;

  if (parts[0] === 10) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 0) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;

  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::") return true;
  if (lower === "::1") return true;
  if (lower.startsWith("::ffff:")) {
    const mapped = lower.slice("::ffff:".length);
    if (net.isIP(mapped) === 4) {
      return isPrivateIPv4(mapped);
    }
  }
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
  return false;
}

export function isForbiddenHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost") return true;

  if (net.isIP(host) === 4) return isPrivateIPv4(host);
  if (net.isIP(host) === 6) return isPrivateIPv6(host);

  return false;
}

export async function assertSafeHostname(hostname: string): Promise<void> {
  if (isForbiddenHost(hostname)) {
    throw new Error("このURLは診断対象にできません");
  }

  try {
    const resolved = await dns.lookup(hostname, { all: true });
    for (const item of resolved) {
      if (item.family === 4 && isPrivateIPv4(item.address)) {
        throw new Error("このURLは診断対象にできません");
      }
      if (item.family === 6 && isPrivateIPv6(item.address)) {
        throw new Error("このURLは診断対象にできません");
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("診断対象にできません")) {
      throw error;
    }
    throw new Error("URLの確認に失敗しました");
  }
}

export async function validateInput(input: unknown): Promise<{ inputUrl: string; normalizedRootUrl: string; maxPages: number }> {
  const parsed = scanRequestSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "入力が不正です";
    throw new Error(message);
  }

  const rawUrl = ensureUrlWithScheme(parsed.data.url);
  if (rawUrl.length > MAX_URL_LENGTH) {
    throw new Error("URLが長すぎます");
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("URLの形式が正しくありません");
  }

  if (!["http:", "https:"].includes(url.protocol.toLowerCase())) {
    throw new Error("http:// または https:// のURLを指定してください");
  }

  await assertSafeHostname(url.hostname);

  return {
    inputUrl: rawUrl,
    normalizedRootUrl: normalizeUrl(rawUrl),
    maxPages: Math.min(env.scanMaxPagesLimit, Math.max(1, parsed.data.maxPages ?? env.scanMaxPagesDefault)),
  };
}

export async function safeFetchWithRedirectValidation(inputUrl: string, timeoutMs: number): Promise<Response> {
  let currentUrl = inputUrl;

  for (let i = 0; i <= MAX_REDIRECTS; i += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
      res = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    const isRedirect = res.status >= 300 && res.status < 400;
    if (!isRedirect) {
      return res;
    }

    const location = res.headers.get("location");
    if (!location) {
      return res;
    }

    const nextUrl = new URL(location, currentUrl).toString();
    const parsed = new URL(nextUrl);
    await assertSafeHostname(parsed.hostname);
    currentUrl = nextUrl;
  }

  throw new Error("リダイレクト回数が上限を超えました");
}
