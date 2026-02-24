import { normalizeUrl } from "@/lib/url";

const KEYWORD_WEIGHTS: Array<{ token: string; score: number }> = [
  { token: "/contact", score: 100 },
  { token: "/inquiry", score: 95 },
  { token: "/form", score: 90 },
  { token: "/about", score: 85 },
  { token: "/company", score: 82 },
  { token: "/service", score: 80 },
  { token: "/services", score: 80 },
  { token: "/product", score: 78 },
  { token: "/products", score: 78 },
  { token: "/menu", score: 75 },
  { token: "/reservation", score: 73 },
  { token: "/booking", score: 73 },
  { token: "/news", score: 70 },
  { token: "/blog", score: 70 },
];

function urlScore(rootUrl: string, candidate: string): number {
  const root = new URL(rootUrl);
  const url = new URL(candidate);
  const path = url.pathname.toLowerCase();

  let score = 0;

  if (url.toString() === root.toString()) {
    score += 1000;
  }

  for (const keyword of KEYWORD_WEIGHTS) {
    if (path.includes(keyword.token)) {
      score += keyword.score;
      break;
    }
  }

  const depth = path.split("/").filter(Boolean).length;
  score += Math.max(0, 40 - depth * 5);
  score += Math.max(0, 30 - path.length);

  return score;
}

export function prioritizeUrls(rootUrl: string, urls: string[], maxPages: number): string[] {
  const normalizedRoot = normalizeUrl(rootUrl);
  const unique = Array.from(new Set(urls.map((url) => normalizeUrl(url))));

  const sorted = unique
    .map((url) => ({ url, score: urlScore(normalizedRoot, url) }))
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url))
    .map((item) => item.url);

  if (!sorted.includes(normalizedRoot)) {
    sorted.unshift(normalizedRoot);
  }

  return sorted.slice(0, maxPages);
}
