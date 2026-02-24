const LOCAL_BASE_URL = "http://localhost:3000";

export const getSiteUrl = (): string => {
  const raw = process.env.APP_BASE_URL?.trim();
  if (!raw) return LOCAL_BASE_URL;

  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return LOCAL_BASE_URL;
  }
};
