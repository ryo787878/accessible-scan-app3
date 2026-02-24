import { describe, expect, it } from "vitest";
import { ensureUrlWithScheme, normalizeUrl } from "@/lib/url";

describe("url utilities", () => {
  it("adds https scheme when missing", () => {
    expect(ensureUrlWithScheme("example.com")).toBe("https://example.com");
  });

  it("normalizes tracking params and fragments", () => {
    const normalized = normalizeUrl(
      "https://example.com/about/?utm_source=x&fbclid=abc#section"
    );
    expect(normalized).toBe("https://example.com/about");
  });
});
