export const blogRoutes = ["/ja/blog/accessibility-check-guide"] as const;
export const comparisonRoutes = ["/ja/compare/accessibility-tools"] as const;
export const glossaryRoutes = ["/ja/glossary/wcag"] as const;

export const seoStaticRoutes = ["/", "/ja", "/terms", "/privacy"] as const;

const slugUnsafeChars = /[^\p{L}\p{N}\s-]/gu;
const slugSpaces = /\s+/g;
const slugHyphens = /-+/g;

export const normalizeSlug = (raw: string): string => {
  return raw
    .normalize("NFKC")
    .toLowerCase()
    .replace(slugUnsafeChars, "")
    .trim()
    .replace(slugSpaces, "-")
    .replace(slugHyphens, "-")
    .replace(/^-|-$/g, "");
};

export const canonicalPathname = (pathname: string): string => {
  if (!pathname || pathname === "/") return "/";

  const trimmed = pathname.replace(/\/+$/, "");
  const match = trimmed.match(/^\/(blog|compare|glossary)\/([^/]+)$/);
  if (!match) return trimmed;

  const [, section, slug] = match;
  return `/${section}/${normalizeSlug(slug)}`;
};
