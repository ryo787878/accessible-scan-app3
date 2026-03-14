export const blogRoutes = ["/ja/blog", "/ja/blog/accessibility-check-guide"] as const;
export const comparisonRoutes = ["/ja/compare", "/ja/compare/accessibility-tools"] as const;
export const glossaryRoutes = ["/ja/glossary", "/ja/glossary/wcag"] as const;
export const serviceRoutes = ["/ja/service", "/ja/service/accessibility-audit", "/ja/report-sample"] as const;
export const legalRoutes = ["/ja/legal", "/ja/legal/compliance"] as const;
export const trustRoutes = ["/ja/editorial-policy"] as const;
export const caseRoutes = [
  "/ja/cases",
  "/ja/cases/ecommerce-platform",
  "/ja/cases/public-sector-portal",
  "/ja/cases/recruit-site",
] as const;
export const industryRoutes = ["/ja/industry", "/ja/industry/ecommerce", "/ja/industry/public-sector", "/ja/industry/recruit"] as const;

export const seoStaticRoutes = ["/", "/ja", "/ja/accessibility-diagnosis"] as const;

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
