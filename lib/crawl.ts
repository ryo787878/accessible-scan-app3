import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import { normalizeAndFilterUrl, normalizeUrl } from "@/lib/url";
import { safeFetchWithRedirectValidation } from "@/lib/validation";
import { getRobotsDisallowRules, isRobotsAllowed } from "@/lib/robots-policy";
import { logger } from "@/lib/logger";

const FETCH_TIMEOUT_MS = 15_000;
const MAX_DEPTH = 2;

function extractSitemapUrls(xml: string): string[] {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml) as {
    urlset?: { url?: { loc?: string } | Array<{ loc?: string }> };
    sitemapindex?: { sitemap?: { loc?: string } | Array<{ loc?: string }> };
  };

  if (parsed.urlset?.url) {
    const urls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
    return urls.map((entry) => entry.loc).filter((v): v is string => Boolean(v));
  }

  if (parsed.sitemapindex?.sitemap) {
    const maps = Array.isArray(parsed.sitemapindex.sitemap)
      ? parsed.sitemapindex.sitemap
      : [parsed.sitemapindex.sitemap];
    return maps.map((entry) => entry.loc).filter((v): v is string => Boolean(v));
  }

  return [];
}

async function tryCollectFromSitemap(rootUrl: string, maxCandidates: number, disallowRules: string[]): Promise<string[]> {
  const root = new URL(rootUrl);
  const sitemapUrl = `${root.origin}/sitemap.xml`;

  try {
    const res = await safeFetchWithRedirectValidation(sitemapUrl, FETCH_TIMEOUT_MS);
    if (!res.ok) return [];

    const xml = await res.text();
    const candidateRaw = extractSitemapUrls(xml);
    const collected: string[] = [];

    for (const raw of candidateRaw) {
      const normalized = normalizeAndFilterUrl(rootUrl, raw);
      if (!normalized) continue;
      if (!isRobotsAllowed(normalized, disallowRules)) continue;
      collected.push(normalized);
      if (collected.length >= maxCandidates) break;
    }

    return Array.from(new Set(collected));
  } catch (error) {
    logger.warn("sitemap parse failed", { rootUrl, error: String(error) });
    return [];
  }
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await safeFetchWithRedirectValidation(url, FETCH_TIMEOUT_MS);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html")) return null;

    return await res.text();
  } catch {
    return null;
  }
}

async function fallbackCrawl(rootUrl: string, maxCandidates: number, disallowRules: string[]): Promise<string[]> {
  const normalizedRoot = normalizeUrl(rootUrl);
  const isRootAllowed = isRobotsAllowed(normalizedRoot, disallowRules);
  const queue: Array<{ url: string; depth: number }> = isRootAllowed
    ? [{ url: normalizedRoot, depth: 0 }]
    : [];
  const visited = new Set<string>();
  const found = new Set<string>(isRootAllowed ? [normalizedRoot] : []);

  while (queue.length > 0 && found.size < maxCandidates) {
    const current = queue.shift();
    if (!current) break;
    if (visited.has(current.url)) continue;

    visited.add(current.url);

    const html = await fetchHtml(current.url);
    if (!html) continue;

    const $ = cheerio.load(html);
    const links = $("a[href]")
      .map((_, el) => $(el).attr("href") ?? "")
      .get();

    for (const link of links) {
      const normalized = normalizeAndFilterUrl(normalizedRoot, link);
      if (!normalized || found.has(normalized)) continue;
      if (!isRobotsAllowed(normalized, disallowRules)) continue;

      found.add(normalized);
      if (found.size >= maxCandidates) break;

      if (current.depth < MAX_DEPTH) {
        queue.push({ url: normalized, depth: current.depth + 1 });
      }
    }
  }

  return Array.from(found);
}

export async function collectCandidateUrls(rootUrl: string, maxPages: number): Promise<string[]> {
  const maxCandidates = Math.max(maxPages * 4, maxPages);
  const normalizedRoot = normalizeUrl(rootUrl);
  const disallowRules = await getRobotsDisallowRules(normalizedRoot);
  const fromSitemap = await tryCollectFromSitemap(normalizedRoot, maxCandidates, disallowRules);
  const rootAllowed = isRobotsAllowed(normalizedRoot, disallowRules);

  if (fromSitemap.length > 0) {
    return Array.from(new Set(rootAllowed ? [normalizedRoot, ...fromSitemap] : fromSitemap));
  }

  return fallbackCrawl(normalizedRoot, maxCandidates, disallowRules);
}
