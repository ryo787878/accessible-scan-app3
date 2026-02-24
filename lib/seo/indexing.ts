export const indexableAllowPrefixes = ["/ja/", "/"] as const;

export const crawlDisallowPrefixes = ["/app/", "/api/", "/scan/", "/report/"] as const;

export const noIndexPrefixes = ["/scan/", "/report/"] as const;

export const shouldNoIndexPath = (path: string): boolean =>
  noIndexPrefixes.some((prefix) => path.startsWith(prefix));
