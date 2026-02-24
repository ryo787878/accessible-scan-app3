import type { MetadataRoute } from "next";
import { crawlDisallowPrefixes, indexableAllowPrefixes } from "@/lib/seo/indexing";
import { absoluteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [...indexableAllowPrefixes],
        disallow: [...crawlDisallowPrefixes],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
