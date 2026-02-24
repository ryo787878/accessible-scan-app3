import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, ogImageUrl } from "@/lib/seo/site";

type OgType = "lp" | "blog" | "comparison";

type BuildMetadataArgs = {
  title: string;
  path: string;
  description?: string;
  ogType?: OgType;
  ogTitle?: string;
  article?: boolean;
  noIndex?: boolean;
};

const normalizePath = (path: string): string => {
  if (!path) return "/";
  if (path === "/") return path;
  return path.replace(/\/+$/, "");
};

export const buildPageMetadata = ({
  title,
  path,
  description = SITE_DESCRIPTION,
  ogType = "lp",
  ogTitle,
  article = false,
  noIndex = false,
}: BuildMetadataArgs): Metadata => {
  const canonicalPath = normalizePath(path);
  const imageTitle = ogTitle ?? title;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      ...(article ? { type: "article" as const } : { type: "website" as const }),
      images: [
        {
          url: ogImageUrl(ogType, imageTitle),
          width: 1200,
          height: 630,
          alt: imageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl(ogType, imageTitle)],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
};

export const canonicalUrl = (path: string): string => absoluteUrl(normalizePath(path));
