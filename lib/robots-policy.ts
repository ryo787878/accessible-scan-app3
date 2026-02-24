import { safeFetchWithRedirectValidation } from "@/lib/validation";
import { logger } from "@/lib/logger";

const FETCH_TIMEOUT_MS = 10_000;

type RobotsGroup = {
  userAgents: string[];
  disallowRules: string[];
};

function parseRobotsDisallow(robotsTxt: string): string[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup = { userAgents: [], disallowRules: [] };
  let hasDirective = false;

  for (const rawLine of robotsTxt.split(/\r?\n/)) {
    const noComment = rawLine.split("#")[0]?.trim() ?? "";
    if (!noComment) continue;

    const sep = noComment.indexOf(":");
    if (sep < 0) continue;

    const key = noComment.slice(0, sep).trim().toLowerCase();
    const value = noComment.slice(sep + 1).trim();

    if (key === "user-agent") {
      if (current.userAgents.length > 0 && hasDirective) {
        groups.push(current);
        current = { userAgents: [], disallowRules: [] };
        hasDirective = false;
      }
      current.userAgents.push(value.toLowerCase());
      continue;
    }

    if (key === "disallow") {
      hasDirective = true;
      current.disallowRules.push(value);
      continue;
    }

    if (key === "allow" || key === "crawl-delay" || key === "sitemap") {
      hasDirective = true;
    }
  }

  if (current.userAgents.length > 0) {
    groups.push(current);
  }

  return groups
    .filter((group) => group.userAgents.includes("*"))
    .flatMap((group) => group.disallowRules)
    .map((rule) => rule.trim())
    .filter((rule) => rule.length > 0)
    .map((rule) => {
      const pref = rule.split("*")[0] ?? "";
      if (pref.length === 0) return "/";
      return pref.startsWith("/") ? pref : `/${pref}`;
    });
}

export async function getRobotsDisallowRules(rootUrl: string): Promise<string[]> {
  const root = new URL(rootUrl);
  const robotsUrl = `${root.origin}/robots.txt`;

  try {
    const res = await safeFetchWithRedirectValidation(robotsUrl, FETCH_TIMEOUT_MS);
    if (!res.ok) return [];
    const contentType = res.headers.get("content-type")?.toLowerCase() ?? "";
    if (contentType && !contentType.includes("text/plain")) return [];
    const text = await res.text();
    return parseRobotsDisallow(text);
  } catch (error) {
    logger.warn("robots fetch failed", { robotsUrl, error: String(error) });
    return [];
  }
}

export function isRobotsAllowed(url: string, disallowRules: string[]): boolean {
  if (disallowRules.length === 0) return true;
  const parsed = new URL(url);
  const pathAndQuery = `${parsed.pathname}${parsed.search}`;
  return !disallowRules.some((rule) => pathAndQuery.startsWith(rule));
}
