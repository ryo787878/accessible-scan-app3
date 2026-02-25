const STANDARD_TAG_PATTERN = /^wcag(?:2a|2aa|2aaa|21a|21aa|22a|22aa|22aaa)$/i;
const BEST_PRACTICE_TAG = "best-practice";

export function extractStandardTags(tags?: string[]): string[] {
  if (!Array.isArray(tags)) return [];

  const selected = tags
    .map((tag) => tag.toLowerCase())
    .filter((tag) => STANDARD_TAG_PATTERN.test(tag) || tag === BEST_PRACTICE_TAG);

  return Array.from(new Set(selected));
}

export function formatStandardTag(tag: string): string {
  const normalized = tag.toLowerCase();
  if (normalized === BEST_PRACTICE_TAG) return "Best Practice";

  const matched = normalized.match(/^wcag(\d+)(a{1,3})$/);
  if (!matched) return tag;

  const [, version, level] = matched;
  if (version.length === 1) return `WCAG ${version}.0 ${level.toUpperCase()}`;
  if (version.length === 2) return `WCAG ${version[0]}.${version[1]} ${level.toUpperCase()}`;
  return tag;
}
