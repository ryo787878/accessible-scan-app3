import { getSiteUrl } from "@/lib/site-url";

export const SITE_NAME = "Accessible Scan";
export const SITE_TITLE = "アクセシビリティ チェック・診断 | Webアクセシビリティ テスト対応（WCAG チェック）";
export const SITE_DESCRIPTION =
  "アクセシビリティ チェックとアクセシビリティ 診断を自動化。Webアクセシビリティ チェック、アクセシビリティ テスト、WCAG チェックを日本語レポートで可視化します。";

export const siteUrl = getSiteUrl();

export const absoluteUrl = (path: string): string => {
  const normalized = path === "/" ? "/" : path.replace(/\/+$/, "");
  return new URL(normalized, siteUrl).toString();
};

export const ogImageUrl = (type: "lp" | "blog" | "comparison", title: string): string => {
  const url = new URL("/api/og", siteUrl);
  url.searchParams.set("type", type);
  url.searchParams.set("title", title);
  return url.toString();
};
