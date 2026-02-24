import { describe, expect, it } from "vitest";
import { isForbiddenHost, validateInput } from "@/lib/validation";

describe("validation", () => {
  it("rejects localhost and private IP", () => {
    expect(isForbiddenHost("localhost")).toBe(true);
    expect(isForbiddenHost("127.0.0.1")).toBe(true);
    expect(isForbiddenHost("10.0.0.1")).toBe(true);
  });

  it("accepts valid public input", async () => {
    const result = await validateInput({ url: "https://example.com", maxPages: 10 });
    expect(result.normalizedRootUrl).toBe("https://example.com/");
    expect(result.maxPages).toBe(10);
  });

  it("rejects unsupported scheme", async () => {
    await expect(validateInput({ url: "javascript:alert(1)", maxPages: 10 })).rejects.toThrow(
      "http:// または https:// のURLを指定してください"
    );
  });
});
