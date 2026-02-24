import type { MetadataRoute } from "next";
import { blogRoutes, comparisonRoutes, glossaryRoutes, seoStaticRoutes } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";

const now = new Date();

const toEntry = (path: string, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) => ({
  url: absoluteUrl(path),
  lastModified: now,
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...seoStaticRoutes.map((path) => toEntry(path, "weekly", path === "/" ? 1 : 0.8)),
    ...comparisonRoutes.map((path) => toEntry(path, "weekly", 0.8)),
    ...blogRoutes.map((path) => toEntry(path, "monthly", 0.7)),
    ...glossaryRoutes.map((path) => toEntry(path, "monthly", 0.6)),
  ];
}
