import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site-url";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("getSiteUrl", () => {
  it("uses APP_BASE_URL when configured", () => {
    process.env.APP_BASE_URL = "https://example.com/path";
    process.env.NODE_ENV = "production";

    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("uses deployment host envs when APP_BASE_URL is missing", () => {
    delete process.env.APP_BASE_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "accessible-scan-app3.vercel.app";
    process.env.NODE_ENV = "production";

    expect(getSiteUrl()).toBe("https://accessible-scan-app3.vercel.app");
  });

  it("falls back to the production domain outside local development", () => {
    delete process.env.APP_BASE_URL;
    delete process.env.NEXT_PUBLIC_APP_BASE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;
    process.env.NODE_ENV = "production";

    expect(getSiteUrl()).toBe("https://access-scan.com");
  });

  it("keeps localhost fallback for local development", () => {
    delete process.env.APP_BASE_URL;
    delete process.env.NEXT_PUBLIC_APP_BASE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;
    process.env.NODE_ENV = "development";

    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
