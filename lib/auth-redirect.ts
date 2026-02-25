import { getSiteUrl } from "@/lib/site-url";

export const sanitizeCallbackUrl = (callbackUrl: string | undefined): string => {
  if (!callbackUrl) return "/";

  // Allow only in-site absolute URLs or root-relative paths.
  if (callbackUrl.startsWith("/")) {
    if (callbackUrl.startsWith("//")) return "/";
    return callbackUrl;
  }

  try {
    const siteOrigin = getSiteUrl();
    const url = new URL(callbackUrl);
    if (url.origin !== siteOrigin) return "/";
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return "/";
  }
};
