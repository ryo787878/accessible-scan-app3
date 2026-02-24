import { describe, expect, it } from "vitest";
import { prioritizeUrls } from "@/lib/prioritize";

describe("prioritizeUrls", () => {
  it("keeps root and prioritizes business-critical pages", () => {
    const result = prioritizeUrls(
      "https://example.com/",
      [
        "https://example.com/blog",
        "https://example.com/contact",
        "https://example.com/about",
        "https://example.com/products/item-1",
      ],
      3
    );

    expect(result[0]).toBe("https://example.com/");
    expect(result).toContain("https://example.com/contact");
  });
});
