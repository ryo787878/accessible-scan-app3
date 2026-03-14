const LOCAL_BASE_URL = "http://localhost:3000";
const PRODUCTION_BASE_URL = "https://access-scan.com";

const toOrigin = (raw: string | undefined): string | null => {
  const value = raw?.trim();
  if (!value) return null;

  try {
    const withScheme = /^[a-z]+:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
};

export const getSiteUrl = (): string => {
  const configuredUrl =
    toOrigin(process.env.APP_BASE_URL) ??
    toOrigin(process.env.NEXT_PUBLIC_APP_BASE_URL) ??
    toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    toOrigin(process.env.VERCEL_URL);

  if (configuredUrl) return configuredUrl;
  if (process.env.NODE_ENV === "production") return PRODUCTION_BASE_URL;
  return LOCAL_BASE_URL;
};
