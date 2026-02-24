const TRACKING_PARAMS = ["gclid", "fbclid", "yclid"];

const NON_HTML_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".mp4",
  ".mov",
  ".zip",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
];

export function ensureUrlWithScheme(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function normalizeUrl(input: string): string {
  const url = new URL(input);
  url.hash = "";

  const keys = Array.from(url.searchParams.keys());
  for (const key of keys) {
    if (key.startsWith("utm_") || TRACKING_PARAMS.includes(key)) {
      url.searchParams.delete(key);
    }
  }

  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
}

export function isSameDomain(rootUrl: string, candidateUrl: string): boolean {
  const root = new URL(rootUrl);
  const candidate = new URL(candidateUrl);
  return root.hostname === candidate.hostname;
}

export function hasNonHtmlExtension(urlString: string): boolean {
  const pathname = new URL(urlString).pathname.toLowerCase();
  return NON_HTML_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

export function isSkippableHref(href: string): boolean {
  const lower = href.toLowerCase();
  return lower.startsWith("mailto:") || lower.startsWith("tel:") || lower.startsWith("javascript:");
}

export function normalizeAndFilterUrl(rootUrl: string, rawHref: string): string | null {
  if (!rawHref || isSkippableHref(rawHref)) return null;

  let resolved: URL;
  try {
    resolved = new URL(rawHref, rootUrl);
  } catch {
    return null;
  }

  if (resolved.hash) {
    resolved.hash = "";
  }

  const protocol = resolved.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") return null;

  const resolvedStr = normalizeUrl(resolved.toString());

  if (!isSameDomain(rootUrl, resolvedStr)) return null;
  if (hasNonHtmlExtension(resolvedStr)) return null;

  return resolvedStr;
}
