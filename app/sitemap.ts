import type { MetadataRoute } from "next";
import {
  blogRoutes,
  caseRoutes,
  comparisonRoutes,
  glossaryRoutes,
  industryRoutes,
  legalRoutes,
  seoStaticRoutes,
  serviceRoutes,
  trustRoutes,
} from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";

const fallbackLastModified = new Date("2026-03-10T00:00:00+09:00");

const pageLastModified: Partial<Record<string, string>> = {
  "/": "2026-03-10T00:00:00+09:00",
  "/ja": "2026-03-10T00:00:00+09:00",
  "/ja/accessibility-diagnosis": "2026-03-10T00:00:00+09:00",
  "/ja/blog/accessibility-check-guide": "2026-02-24T00:00:00+09:00",
  "/ja/compare/accessibility-tools": "2026-03-10T00:00:00+09:00",
  "/ja/glossary/wcag": "2026-03-10T00:00:00+09:00",
  "/ja/service/accessibility-audit": "2026-03-10T00:00:00+09:00",
  "/ja/report-sample": "2026-03-10T00:00:00+09:00",
  "/ja/legal/compliance-2026": "2026-03-10T00:00:00+09:00",
  "/ja/editorial-policy": "2026-03-10T00:00:00+09:00",
  "/ja/cases": "2026-03-10T00:00:00+09:00",
  "/ja/cases/ecommerce-platform": "2026-03-10T00:00:00+09:00",
  "/ja/cases/public-sector-portal": "2026-03-10T00:00:00+09:00",
  "/ja/cases/recruit-site": "2026-03-10T00:00:00+09:00",
  "/ja/industry/ecommerce": "2026-03-10T00:00:00+09:00",
  "/ja/industry/public-sector": "2026-03-10T00:00:00+09:00",
  "/ja/industry/recruit": "2026-03-10T00:00:00+09:00",
  "/terms": "2026-02-24T00:00:00+09:00",
  "/privacy": "2026-02-24T00:00:00+09:00",
};

const toEntry = (path: string, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) => ({
  url: absoluteUrl(path),
  lastModified: pageLastModified[path] ? new Date(pageLastModified[path] as string) : fallbackLastModified,
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...seoStaticRoutes.map((path) => toEntry(path, "weekly", path === "/" ? 1 : 0.8)),
    ...serviceRoutes.map((path) => toEntry(path, "weekly", 0.85)),
    ...legalRoutes.map((path) => toEntry(path, "monthly", 0.8)),
    ...trustRoutes.map((path) => toEntry(path, "monthly", 0.75)),
    ...caseRoutes.map((path) => toEntry(path, "monthly", path === "/ja/cases" ? 0.8 : 0.7)),
    ...industryRoutes.map((path) => toEntry(path, "monthly", 0.75)),
    ...comparisonRoutes.map((path) => toEntry(path, "weekly", 0.8)),
    ...blogRoutes.map((path) => toEntry(path, "monthly", 0.7)),
    ...glossaryRoutes.map((path) => toEntry(path, "monthly", 0.6)),
  ];
}
